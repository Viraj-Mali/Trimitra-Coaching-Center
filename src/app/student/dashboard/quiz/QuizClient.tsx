'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Zap, CheckCircle, XCircle, Timer, Star, ChevronRight, RefreshCw } from 'lucide-react';
import StreakFlame from '@/components/StreakFlame';

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  explanation?: string;
}

interface QuizResult {
  questionId: string;
  isCorrect: boolean;
  correctIndex: number;
}

interface QuizState {
  questions: Question[];
  answers: Record<string, number>;
  currentIndex: number;
  timeLeft: number;
  submitted: boolean;
  results: QuizResult[];
  xpEarned: number;
  correctCount: number;
  newStreak: number;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const QUIZ_MINUTES = 15;

export default function QuizPageClient({ alreadyDone, track }: { alreadyDone: boolean; track: string }) {
  const [phase, setPhase] = useState<'start' | 'quiz' | 'result'>(alreadyDone ? 'result' : 'start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_MINUTES * 60);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [newStreak, setNewStreak] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/student/quiz?track=${track}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.slice(0, 10));
        setPhase('quiz');
        setTimeLeft(QUIZ_MINUTES * 60);
        setAnswers({});
        setCurrentIndex(0);
      } else {
        toast.error('Could not load quiz questions. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    if (phase !== 'quiz' || submitted) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, submitted]);

  const handleAnswer = (questionId: string, idx: number) => {
    if (submitted) return;
    setAnswers(a => ({ ...a, [questionId]: idx }));
  };

  const handleSubmit = async () => {
    if (submitted || questions.length === 0) return;
    setSubmitted(true);

    const answerPayload = questions.map(q => ({
      questionId: q.id,
      selectedIdx: answers[q.id] ?? -1,
    }));

    try {
      const res = await fetch('/api/student/quiz-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerPayload }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data.results);
        setXpEarned(data.xpEarned);
        setCorrectCount(data.correctCount);
        setNewStreak(data.newStreak);
        setPhase('result');
        toast.success(`Quiz complete! +${data.xpEarned} XP earned!`);
      } else {
        toast.error(data.error || 'Failed to submit quiz.');
        setPhase('result');
      }
    } catch {
      toast.error('Failed to submit. Showing local results.');
      setPhase('result');
    }
  };

  const formatTime = (secs: number) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  // Start screen
  if (phase === 'start') {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-amber/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-amber/30">
            <Zap size={36} className="text-brand-amber" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Daily Quiz</h1>
          <p className="text-slate-400">10 questions · {QUIZ_MINUTES} minutes · Maintain your streak!</p>
        </div>

        <div className="glass-card border border-brand-amber/20 p-8 text-center">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Questions', value: '10', icon: '❓' },
              { label: 'Time Limit', value: `${QUIZ_MINUTES} min`, icon: '⏱️' },
              { label: 'XP Reward', value: '50–150', icon: '⭐' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-4 mb-6 text-left text-sm text-slate-300">
            <p className="font-semibold text-brand-green mb-1">🔥 Streak Rules:</p>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Complete the quiz once per day to maintain your streak</li>
              <li>• Each correct answer earns +10 XP</li>
              <li>• Completing the quiz earns +50 XP bonus</li>
              <li>• Consecutive day streak earns +25 bonus XP</li>
            </ul>
          </div>

          <button
            onClick={fetchQuestions}
            disabled={loading}
            className="btn-primary w-full justify-center text-base"
            id="startQuiz"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Start Today&apos;s Quiz <Zap size={18} /></>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Already done screen
  if (alreadyDone && phase === 'result' && results.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        <div className="glass-card border border-brand-green/30 p-10">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete for Today!</h2>
          <p className="text-slate-400 mb-4">Come back tomorrow to continue your streak.</p>
          <div className="flex justify-center">
            <StreakFlame count={newStreak} size="lg" />
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  if (phase === 'result') {
    const pct = Math.round((correctCount / 10) * 100);
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="glass-card border border-brand-green/30 p-8 text-center">
          <div className="text-5xl mb-4">{pct >= 70 ? '🎉' : pct >= 40 ? '💪' : '📚'}</div>
          <h2 className="text-3xl font-black text-white mb-2">{correctCount}/10 Correct</h2>
          <p className="text-slate-400 mb-4">{pct}% score</p>

          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-black text-brand-amber">+{xpEarned}</div>
              <div className="text-xs text-slate-400">XP Earned</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <StreakFlame count={newStreak} size="sm" showLabel={true} />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${pct >= 70 ? 'bg-brand-green' : pct >= 40 ? 'bg-brand-amber' : 'bg-red-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question review */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-bold">Question Review</h3>
            {questions.map((q, i) => {
              const result = results.find(r => r.questionId === q.id);
              const isCorrect = result?.isCorrect;
              const options = [q.optionA, q.optionB, q.optionC, q.optionD];
              return (
                <div key={q.id} className={`glass-card p-4 border ${isCorrect ? 'border-brand-green/30' : 'border-red-500/30'}`}>
                  <div className="flex items-start gap-3 mb-2">
                    {isCorrect ? <CheckCircle size={16} className="text-brand-green shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />}
                    <p className="text-white text-sm font-medium">{q.question}</p>
                  </div>
                  {!isCorrect && result && (
                    <p className="text-brand-green text-xs ml-7">
                      Correct: {OPTION_LABELS[result.correctIndex]}. {options[result.correctIndex]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Quiz screen
  if (phase === 'quiz' && currentQ) {
    const options = [currentQ.optionA, currentQ.optionB, currentQ.optionC, currentQ.optionD];
    const selectedAnswer = answers[currentQ.id];
    const timerWarning = timeLeft < 120;

    return (
      <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
        {/* Progress bar */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300 font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className={`flex items-center gap-2 text-sm font-bold ${timerWarning ? 'text-red-400' : 'text-brand-amber'}`}>
              <Timer size={16} />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full">
            <div
              className="h-full bg-gradient-green rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="glass-card border border-white/20 p-6">
          <p className="text-white font-semibold text-lg leading-relaxed mb-6">{currentQ.question}</p>
          <div className="space-y-3">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(currentQ.id, idx)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border font-medium text-sm transition-all duration-200 flex items-center gap-3 ${
                  selectedAnswer === idx
                    ? 'bg-brand-green/20 border-brand-green text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  selectedAnswer === idx ? 'bg-brand-green text-white' : 'bg-white/10 text-slate-400'
                }`}>
                  {OPTION_LABELS[idx]}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="btn-ghost disabled:opacity-30"
          >
            ← Previous
          </button>
          <span className="text-slate-400 text-xs">{answeredCount}/{questions.length} answered</span>
          {currentIndex < questions.length - 1 ? (
            <button onClick={() => setCurrentIndex(i => i + 1)} className="btn-secondary text-sm py-2 px-5">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="btn-primary text-sm py-2 px-5 disabled:opacity-70"
              id="submitQuiz"
            >
              Submit Quiz ✓
            </button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex flex-wrap gap-2 justify-center">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                i === currentIndex ? 'bg-brand-green text-white' :
                answers[q.id] !== undefined ? 'bg-brand-green/30 text-brand-green border border-brand-green/50' :
                'bg-white/10 text-slate-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
