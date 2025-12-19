
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { decode, encode, decodeAudioData } from '../services/audioUtils';
import { Icons } from '../constants';
import { Exam } from '../types';

const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-09-2025';

interface LiveTutorProps {
  onClose: () => void;
  activeExam?: Exam | null;
}

const LiveTutor: React.FC<LiveTutorProps> = ({ onClose, activeExam }) => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
  const [transcription, setTranscription] = useState<{ role: 'AI' | 'ME', text: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState<number[]>(new Array(12).fill(2));
  
  const [inputSampleRate] = useState(16000);
  const [outputSampleRate] = useState(24000);
  const [channels] = useState(1);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const handleMessage = useCallback(async (message: LiveServerMessage) => {
    if (message.serverContent?.outputTranscription) {
      const text = message.serverContent.outputTranscription.text;
      setTranscription(prev => [...prev.slice(-10), { role: 'AI', text }]);
    } else if (message.serverContent?.inputTranscription) {
      const text = message.serverContent.inputTranscription.text;
      setTranscription(prev => [...prev.slice(-10), { role: 'ME', text }]);
    }

    const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
    if (base64EncodedAudioString && outputAudioContextRef.current) {
      const ctx = outputAudioContextRef.current;
      nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
      
      try {
        const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), ctx, outputSampleRate, channels);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += audioBuffer.duration;
        sourcesRef.current.add(source);
      } catch (e) { console.error(e); }
    }

    if (message.serverContent?.interrupted) {
      sourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
      sourcesRef.current.clear();
      nextStartTimeRef.current = 0;
    }
  }, [outputSampleRate, channels]);

  const startSession = async () => {
    setConnectionStatus('connecting');
    setError(null);
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: inputSampleRate });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: outputSampleRate });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = activeExam 
        ? `You are a professional examiner for the ${activeExam.type} exam. 
           Conduct the Speaking section strictly. Be formal but fair. 
           Start with Part 1 (Introduction), move to Part 2 (Long turn), then Part 3 (Discussion). 
           Do not provide feedback until the end. At the end, give a simulated band score.`
        : `You are Lexa, a warm and extremely patient English tutor. 
           Your primary message to students is: "Don't worry about making mistakes, every word you speak is a step towards fluency. I'm here to listen and support you with all love and patience."`;

      const sessionPromise = ai.live.connect({
        model: MODEL_NAME,
        callbacks: {
          onopen: () => {
            setConnectionStatus('active');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const sum = inputData.reduce((a, b) => a + Math.abs(b), 0);
              setVolume(prev => [...prev.slice(1), Math.max(2, Math.min(32, (sum / inputData.length) * 350))]);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob: Blob = { data: encode(new Uint8Array(int16.buffer)), mimeType: `audio/pcm;rate=${inputSampleRate}` };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: handleMessage,
          onerror: () => { setError("Connection Error"); setConnectionStatus('error'); },
          onclose: () => setConnectionStatus('idle'),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction,
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setError("Please grant microphone permissions.");
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    };
  }, []);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connecting':
        return {
          label: 'Establishing Secure Link...',
          subLabel: 'Optimizing AI connection',
          color: 'text-amber-600',
          dot: 'bg-amber-500',
          pulse: true,
          bg: 'bg-amber-50'
        };
      case 'active':
        return {
          label: activeExam ? `${activeExam.type} Simulation Live` : 'Lexa is Listening',
          subLabel: 'Voice connection active',
          color: 'text-green-600',
          dot: 'bg-green-500',
          pulse: true,
          bg: 'bg-green-50'
        };
      case 'error':
        return {
          label: 'Connection Interrupted',
          subLabel: 'Check your microphone or network',
          color: 'text-red-600',
          dot: 'bg-red-500',
          pulse: false,
          bg: 'bg-red-50'
        };
      default:
        return {
          label: 'System Ready',
          subLabel: 'Waiting to start session',
          color: 'text-slate-400',
          dot: 'bg-slate-300',
          pulse: false,
          bg: 'bg-slate-50'
        };
    }
  };

  const status = getStatusConfig();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-indigo-950/40 backdrop-blur-3xl p-4 animate-in fade-in duration-500">
      <div className="bg-white/95 w-full max-w-2xl rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col h-[85vh] border border-white overflow-hidden relative">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <div className="flex items-center gap-5">
            <div className={`relative w-16 h-16 rounded-[22px] bg-indigo-600 flex items-center justify-center text-white shadow-xl transition-all duration-500 ${status.pulse ? 'scale-110 ring-8 ring-indigo-50' : ''}`}>
              <Icons.Mic />
              {status.pulse && (
                <>
                  <div className="absolute -inset-2 rounded-[24px] border-2 border-indigo-400 animate-ping opacity-20"></div>
                  <div className="absolute -inset-4 rounded-[26px] border border-indigo-200 animate-ping opacity-10" style={{ animationDelay: '0.5s' }}></div>
                </>
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {activeExam ? `${activeExam.type} Examiner` : 'Lexa Advisor'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2.5 h-2.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`} />
                <div className="flex flex-col">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">
                    {status.subLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar">
          {connectionStatus === 'idle' || connectionStatus === 'error' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-[32px] shadow-2xl flex items-center justify-center text-indigo-500 animate-float relative z-10">
                  <div className="scale-125"><Icons.Mic /></div>
                </div>
                <div className="absolute inset-0 bg-indigo-100 rounded-[32px] blur-2xl opacity-50 scale-125"></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900">Ready to start?</h3>
                <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
                  {activeExam 
                    ? `You are about to start a formal ${activeExam.type} simulation. The examiner will evaluate your performance according to international standards.` 
                    : "Don't worry about making mistakes, every word you speak is a step towards fluency. I'm here to listen and support you with all love and patience."}
                </p>
              </div>
              {error && <div className="text-red-500 text-[11px] font-black bg-red-50 px-6 py-3 rounded-2xl border border-red-100 animate-in shake-in duration-300">{error}</div>}
              <button 
                onClick={startSession} 
                className="cta-button w-full py-5 text-lg shadow-2xl shadow-indigo-100"
              >
                {activeExam ? 'Begin Exam Now' : 'Start My Session'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {transcription.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20">
                  <div className="px-8 py-3 bg-white/80 rounded-full text-slate-400 font-bold italic shadow-sm border border-slate-100 animate-pulse flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
                    {activeExam ? 'Examiner is waiting for you...' : 'Lexa is waiting for your voice...'}
                  </div>
                </div>
              ) : (
                transcription.map((t, i) => (
                  <div key={i} className={`flex flex-col ${t.role === 'AI' ? 'items-start' : 'items-end'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`p-6 rounded-[28px] max-w-[88%] text-[15px] leading-relaxed shadow-sm transition-all ${
                      t.role === 'AI' 
                        ? 'bg-white border border-slate-100 text-slate-800 rounded-bl-none' 
                        : 'bg-indigo-600 text-white rounded-br-none shadow-indigo-100'
                    }`}>
                      <span className="text-[9px] font-black uppercase tracking-[2px] opacity-40 block mb-2">
                        {t.role === 'AI' ? (activeExam ? `${activeExam.type} Examiner` : 'Lexa') : 'You'}
                      </span>
                      {t.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {connectionStatus === 'active' && (
          <div className="p-10 bg-white border-t border-slate-100 flex flex-col items-center gap-8">
            <div className="flex items-end justify-center gap-2 h-20 w-full max-w-xs">
              {volume.map((v, i) => (
                <div 
                  key={i} 
                  className={`w-2.5 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-full transition-all duration-75 shadow-inner ${v > 15 ? 'animate-pulse' : ''}`} 
                  style={{ height: `${Math.max(6, v * 5)}px`, opacity: Math.max(0.15, v / 20) }} 
                />
              ))}
            </div>
            <div className="flex items-center gap-6">
               <div className="px-6 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                 Live Audio Stream
               </div>
               <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-black text-[11px] uppercase tracking-widest transition-colors">End Session</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTutor;
