import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Send, Sparkles, X } from 'lucide-react';
import SkillTag from '../components/SkillTag';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { getRoadmap, submitProgress } from '../services/api';

export default function Checkin() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    weekNumber: '',
    skillsLearned: [],
    hoursSpent: '',
    selfRating: 0,
    blockers: '',
  });

  useEffect(() => {
    fetchRoadmap();
  }, [studentId]);

  const fetchRoadmap = async () => {
    try {
      const { data } = await getRoadmap(studentId);
      setRoadmap(data);
      // Default to first incomplete week
      const firstIncomplete = data.weeks?.find(w => !w.completed);
      if (firstIncomplete) {
        setForm(prev => ({ ...prev, weekNumber: firstIncomplete.weekNumber }));
      }
    } catch (error) {
      addToast('Failed to load roadmap.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !form.skillsLearned.includes(trimmed)) {
      setForm(prev => ({ ...prev, skillsLearned: [...prev.skillsLearned, trimmed] }));
    }
  };

  const removeSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skillsLearned: prev.skillsLearned.filter(s => s !== skill),
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
      setSkillInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.weekNumber || form.selfRating === 0) {
      addToast('Please select a week and provide a self rating.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await submitProgress({
        studentId,
        weekNumber: parseInt(form.weekNumber),
        skillsLearned: form.skillsLearned,
        hoursSpent: parseFloat(form.hoursSpent) || 0,
        selfRating: form.selfRating,
        blockers: form.blockers,
      });
      setFeedbackData(data.feedback);
      addToast('Progress saved successfully! 🎉', 'success');
    } catch (error) {
      addToast(error.response?.data?.error || 'Failed to save progress.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your roadmap..." />;

  // Feedback view
  if (feedbackData) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">AI Feedback</h2>
              <p className="text-slate-600">Here's what Placivio thinks about your progress</p>
            </div>

            {feedbackData.updatedScore != null && (
              <div className="text-center mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200/60">
                <p className="text-sm text-slate-500 mb-1">Updated Placement Score</p>
                <p className="text-4xl font-bold gradient-text">{feedbackData.updatedScore}</p>
              </div>
            )}

            <div className="space-y-4">
              {feedbackData.feedback && (
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200/60">
                  <p className="text-sm text-slate-500 mb-1.5 font-medium">Overall Feedback</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{feedbackData.feedback}</p>
                </div>
              )}
              {feedbackData.whatWentWell && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-sm text-emerald-700 mb-1.5 font-medium">✅ What Went Well</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{feedbackData.whatWentWell}</p>
                </div>
              )}
              {feedbackData.improvements && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <p className="text-sm text-amber-700 mb-1.5 font-medium">💡 To Improve</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{feedbackData.improvements}</p>
                </div>
              )}
              {feedbackData.nextWeekTip && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                  <p className="text-sm text-indigo-700 mb-1.5 font-medium">🎯 Next Week Tip</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{feedbackData.nextWeekTip}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(`/dashboard/${studentId}`)}
              className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
            >
              Back to Dashboard
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/dashboard/${studentId}`)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Weekly Check-in</h1>
          <p className="text-slate-600">Tell us how your week went — our AI will give you personalized feedback.</p>
        </div>

        <div className="relative">
          {submitting && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
              <LoadingSpinner message="AI is generating personalized feedback..." />
            </div>
          )}
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 animate-fade-in">
          {/* Week selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Which week did you complete?</label>
            <select
              value={form.weekNumber}
              onChange={(e) => setForm(prev => ({ ...prev, weekNumber: e.target.value }))}
              className="select-field"
              required
            >
              <option value="">Select a week</option>
              {roadmap?.weeks?.map(w => (
                <option key={w.weekNumber} value={w.weekNumber}>
                  Week {w.weekNumber}: {w.topic} {w.completed ? '✓' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Skills learned */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Skills learned this week</label>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter"
              className="input-field"
            />
            {form.skillsLearned.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.skillsLearned.map(s => (
                  <SkillTag key={s} skill={s} variant="green" onRemove={removeSkill} />
                ))}
              </div>
            )}
            {/* Show current week's skills as suggestions */}
            {form.weekNumber && (
              <div className="mt-3">
                <p className="text-xs text-slate-600 mb-2">This week's skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {roadmap?.weeks?.find(w => w.weekNumber === parseInt(form.weekNumber))?.skills?.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      disabled={form.skillsLearned.includes(s)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        form.skillsLearned.includes(s)
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700 cursor-default'
                          : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {form.skillsLearned.includes(s) ? '✓ ' : '+ '}{s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hours spent */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Hours spent studying</label>
            <input
              type="number"
              value={form.hoursSpent}
              onChange={(e) => setForm(prev => ({ ...prev, hoursSpent: e.target.value }))}
              placeholder="e.g., 10"
              min="0"
              className="input-field"
            />
          </div>

          {/* Self rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">How well did you do? (1-5)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, selfRating: rating }))}
                  className="star"
                >
                  <Star
                    className={`w-8 h-8 transition-all ${
                      rating <= form.selfRating ? 'star-filled fill-yellow-400' : 'star-empty'
                    }`}
                  />
                </button>
              ))}
              {form.selfRating > 0 && (
                <span className="text-sm text-slate-500 ml-2">{form.selfRating}/5</span>
              )}
            </div>
          </div>

          {/* Blockers */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Any blockers?</label>
            <textarea
              value={form.blockers}
              onChange={(e) => setForm(prev => ({ ...prev, blockers: e.target.value }))}
              placeholder="e.g., Struggled with dynamic programming concepts..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full text-lg flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Submit & Get AI Feedback
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}
