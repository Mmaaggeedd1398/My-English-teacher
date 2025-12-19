
import React, { useState } from 'react';
import Layout from './components/Layout';
import LiveTutor from './components/LiveTutor';
import { View, UserStats, Exam } from './types';
import { LESSONS, EXAMS, Icons } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [showTutor, setShowTutor] = useState(false);
  const [activeExamForTutor, setActiveExamForTutor] = useState<Exam | null>(null);
  
  const [userStats] = useState<UserStats>({
    streak: 5,
    xp: 1250,
    level: 4,
    completedLessons: ['1'],
    examReadiness: 72
  });

  const startExamSimulation = (exam: Exam) => {
    setActiveExamForTutor(exam);
    setShowTutor(true);
  };

  const renderDashboard = () => (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Premium Hero Banner */}
      <section className="relative overflow-hidden rounded-[40px] bg-white border border-slate-100 p-12 md:p-20 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.12)]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-black uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            خطة التعلم الذكية
          </div>
          <h2 className="text-[42px] font-black tracking-[-1.5px] text-slate-900 leading-[1.1] mb-6">
            مستقبلك في <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">عصر الذكاء</span>
          </h2>
          <p className="text-[17px] font-medium text-slate-500 leading-relaxed mb-12 opacity-90 max-w-lg">
            أهلاً بك يا أحمد. مستواك في اختبار IELTS تحسن بنسبة 15% منذ الأسبوع الماضي. هل تود البدء في محاكاة اختبار التحدث؟
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => { setActiveExamForTutor(null); setShowTutor(true); }}
              className="cta-button px-14 py-5 text-lg shadow-2xl shadow-indigo-200"
            >
              ابدأ المحادثة الحية
            </button>
            <button 
              onClick={() => setActiveView('exams')}
              className="px-10 py-5 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold rounded-[18px] transition-all border border-slate-200/50"
            >
              الاختبارات الدولية
            </button>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-1/2 h-full opacity-5 pointer-events-none scale-150 rotate-[15deg]">
           <svg viewBox="0 0 200 200" className="w-full h-full fill-indigo-600">
             <path d="M45,-78.1C58.3,-71.4,69.1,-59,76.5,-45C83.9,-31.1,87.9,-15.5,86.4,-0.8C85,13.8,78.2,27.7,69.5,40.1C60.8,52.4,50.3,63.4,37.5,70.8C24.8,78.2,9.8,82,-5,81.1C-19.8,80.2,-34.5,74.7,-47.4,66.1C-60.3,57.5,-71.4,45.8,-77.9,32.2C-84.4,18.7,-86.3,3.2,-83.4,-11.5C-80.5,-26.2,-72.7,-40.1,-61.7,-49.9C-50.7,-59.7,-36.5,-65.4,-22.8,-72C-9,-78.6,4.3,-86,18.7,-85.7C33.1,-85.3,45,-78.1Z" transform="translate(100 100)" />
           </svg>
        </div>
      </section>

      {/* Stats Board */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="glass-card p-10 border-none group hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 text-2xl shadow-sm">🔥</div>
            <div className="text-[11px] font-black text-orange-400 uppercase tracking-widest">تواصل يومي</div>
          </div>
          <div className="text-4xl font-black text-slate-900 mb-1">{userStats.streak}</div>
          <p className="text-xs font-bold text-slate-400 uppercase">Streak Days</p>
        </div>

        <div className="glass-card p-10 border-none group hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl shadow-sm">🎯</div>
            <div className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">جاهزية الاختبار</div>
          </div>
          <div className="text-4xl font-black text-slate-900 mb-2">%{userStats.examReadiness}</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${userStats.examReadiness}%` }}></div>
          </div>
        </div>

        <div className="glass-card p-10 border-none lg:col-span-2 group hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 text-2xl shadow-sm">👑</div>
            <div className="text-[11px] font-black text-blue-400 uppercase tracking-widest">المستوى والخبرة</div>
          </div>
          <div className="flex items-end gap-6">
            <div>
              <div className="text-4xl font-black text-slate-900 mb-1">{userStats.level}</div>
              <p className="text-xs font-bold text-slate-400 uppercase">Current Level</p>
            </div>
            <div className="flex-1 pb-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
                <span>{userStats.xp} XP</span>
                <span>Next: Level {userStats.level + 1}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Exams Section */}
      <section>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-[28px] font-black text-slate-900 mb-2">أحدث محاكيات الاختبارات الدولية</h3>
            <p className="text-slate-500 font-medium">نظام محاكاة متكامل لشهادات الـ IELTS و TOEFL العالمية</p>
          </div>
          <button onClick={() => setActiveView('exams')} className="text-indigo-600 font-black text-[14px] hover:translate-x-[-4px] transition-transform flex items-center gap-2">عرض الكل <span>←</span></button>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {EXAMS.map((exam) => (
            <div key={exam.id} className="group glass-card border-none overflow-hidden hover:shadow-2xl transition-all duration-700 flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={exam.image} alt={exam.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">محاكاة رسمية 2024</span>
                </div>
                <div className="absolute top-6 left-6 bg-white/95 px-5 py-2 rounded-2xl text-[12px] font-black text-indigo-600 shadow-xl">
                  {exam.type}
                </div>
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <h4 className="font-black text-xl text-slate-900 mb-4">{exam.name}</h4>
                <p className="text-slate-500 text-[14px] leading-relaxed mb-10 flex-1">{exam.description}</p>
                <button 
                  onClick={() => startExamSimulation(exam)}
                  className="w-full py-4 bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-800 font-black rounded-2xl transition-all duration-300 shadow-sm"
                >
                  بدء الاختبار التجريبي
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderExams = () => (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="max-w-3xl">
        <h2 className="text-[40px] font-black tracking-[-1.5px] text-slate-900 mb-4">أكاديمية الاختبارات الدولية</h2>
        <p className="text-[18px] text-slate-500 leading-relaxed font-medium">
          هنا يمكنك العثور على محاكاة دقيقة وشاملة لأشهر الاختبارات المعترف بها عالمياً. جميع الاختبارات مزودة بتقنية الذكاء الاصطناعي لتقييم أدائك فورياً.
        </p>
      </div>

      <div className="space-y-12">
        {EXAMS.map((exam) => (
          <div key={exam.id} className="glass-card border-none p-10 md:p-14 group hover:shadow-2xl transition-all duration-500">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3 aspect-[4/3] rounded-[30px] overflow-hidden shadow-2xl relative">
                <img src={exam.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-6 left-6 bg-indigo-600 text-white px-6 py-2 rounded-2xl font-black text-sm">
                  {exam.type}
                </div>
              </div>
              <div className="lg:w-2/3 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-black text-slate-900">{exam.name}</h3>
                  <div className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 px-4 py-1.5 rounded-full text-xs">
                    <Icons.Star />
                    أعلى تقييم
                  </div>
                </div>
                <p className="text-slate-500 text-[16px] leading-relaxed mb-10 opacity-80">{exam.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  {exam.modules.map((mod) => (
                    <div key={mod.id} className="bg-slate-50 p-6 rounded-[24px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                      <div className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-2">{mod.name.split(' ')[0]}</div>
                      <div className="text-[16px] font-bold text-slate-900 mb-1">{mod.name}</div>
                      <div className="text-[12px] text-slate-400 font-medium">{mod.duration}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex gap-4">
                  <button onClick={() => startExamSimulation(exam)} className="cta-button flex-1 py-5 shadow-2xl shadow-indigo-100">ابدأ المحاكاة الكاملة</button>
                  <button className="px-10 py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all">ممارسة المهارات</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return renderDashboard();
      case 'exams': return renderExams();
      case 'lessons': return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="max-w-3xl">
            <h2 className="text-[40px] font-black text-slate-900 mb-4">الدروس الذكية</h2>
            <p className="text-[18px] text-slate-500 font-medium">محتوى تعليمي متطور يعتمد على أسلوب "التعلم المصغر" لنتائج أسرع وأفضل.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {LESSONS.map((lesson) => (
              <div key={lesson.id} className="group glass-card border-none overflow-hidden hover:shadow-2xl transition-all duration-700">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img src={lesson.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-5 left-5 bg-white/95 px-4 py-1.5 rounded-full text-[11px] font-bold text-indigo-600">
                    {lesson.level}
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{lesson.title}</h4>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">{lesson.description}</p>
                  <button className="w-full py-4 cta-button shadow-lg shadow-indigo-50">بدء التعلم</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'tutor': return (
        <div className="flex flex-col items-center justify-center py-24 space-y-12 animate-in zoom-in-95 duration-500">
          <div className="w-48 h-48 bg-indigo-50 rounded-[4rem] flex items-center justify-center text-indigo-600 shadow-inner relative">
             <div className="absolute inset-0 bg-indigo-100 animate-ping rounded-[4rem] opacity-20"></div>
             <div className="scale-[4] relative z-10"><Icons.Mic /></div>
          </div>
          <div className="text-center max-w-lg">
            <h2 className="text-4xl font-black text-slate-900 mb-6">المعلمة Lexa</h2>
            <p className="text-[17px] font-medium text-slate-500 mb-12 leading-relaxed px-6">
              استمتع بمحادثة حرة أو تدريب متخصص على مهارات الاستماع والتحدث في جميع المستويات.
            </p>
            <button 
              onClick={() => { setActiveExamForTutor(null); setShowTutor(true); }}
              className="cta-button px-20 py-6 text-xl shadow-2xl shadow-indigo-200"
            >
              ابدأ الآن
            </button>
          </div>
        </div>
      );
      case 'profile': return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="glass-card border-none p-12 flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-100 overflow-hidden shadow-2xl ring-8 ring-white">
               <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-right">
              <h2 className="text-3xl font-black text-slate-900 mb-2">أحمد محمود</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
                <span className="text-indigo-600 font-bold bg-indigo-50 px-5 py-1.5 rounded-full text-xs">مستوى {userStats.level}</span>
                <span className="text-blue-600 font-bold bg-blue-50 px-5 py-1.5 rounded-full text-xs">خطة IELTS بريميوم</span>
              </div>
            </div>
            <button className="mr-auto p-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><Icons.Settings /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="glass-card border-none p-10 flex flex-col items-center">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">أعلى سلسلة</div>
                <p className="text-5xl font-black text-orange-500">12</p>
                <div className="mt-4 text-[13px] font-bold text-slate-600">يوم متواصل</div>
             </div>
             <div className="glass-card border-none p-10 flex flex-col items-center">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">وقت التعلم</div>
                <p className="text-5xl font-black text-blue-500">24</p>
                <div className="mt-4 text-[13px] font-bold text-slate-600">ساعة إجمالية</div>
             </div>
             <div className="glass-card border-none p-10 flex flex-col items-center">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">دروس مكتملة</div>
                <p className="text-5xl font-black text-indigo-500">{userStats.completedLessons.length}</p>
                <div className="mt-4 text-[13px] font-bold text-slate-600">دروس ذكية</div>
             </div>
          </div>
        </div>
      );
      default: return renderDashboard();
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {renderContent()}
      {showTutor && (
        <LiveTutor 
          onClose={() => { setShowTutor(false); setActiveExamForTutor(null); }} 
          activeExam={activeExamForTutor}
        />
      )}
    </Layout>
  );
};

export default App;
