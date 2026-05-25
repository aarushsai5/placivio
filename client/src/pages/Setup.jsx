import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, X, Check } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import SkillTag from '../components/SkillTag';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createStudent, generateRoadmap } from '../services/api';

const BRANCHES = ['CSE', 'CSBS', 'IT', 'ECE', 'ME', 'CE', 'Other'];
const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const SUGGESTED_SKILLS = [
  'Python', 'React', 'Node.js', 'Java', 'DSA', 'SQL', 'MongoDB',
  'AWS', 'Docker', 'Git', 'C++', 'Machine Learning', 'HTML/CSS',
  'JavaScript', 'TypeScript', 'Express.js', 'Spring Boot',
  'System Design', 'Data Analysis', 'Communication',
];
const COMPANY_TYPES = ['Product Based', 'Service Based', 'Startup', 'Any'];
const TIMELINES = ['3 months', '6 months', '1 year'];

const stepLabels = ['Profile', 'Skills', 'Goals', 'Review'];

export default function Setup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    college: '',
    branch: '',
    semester: '',
    cgpa: '',
    skills: [],
    targetCompanyType: [],
    targetCompanies: '',
    timeline: '6 months',
  });

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      updateForm('skills', [...form.skills, trimmed]);
    }
  };

  const removeSkill = (skill) => {
    updateForm('skills', form.skills.filter(s => s !== skill));
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
      setSkillInput('');
    }
  };

  const toggleCompanyType = (type) => {
    if (type === 'Any') {
      if (form.targetCompanyType.includes('Any')) {
        updateForm('targetCompanyType', []);
      } else {
        updateForm('targetCompanyType', [...COMPANY_TYPES]);
      }
      return;
    }
    const types = form.targetCompanyType.includes(type)
      ? form.targetCompanyType.filter(t => t !== type && t !== 'Any')
      : [...form.targetCompanyType.filter(t => t !== 'Any'), type];
    updateForm('targetCompanyType', types);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return form.college && form.branch && form.semester && form.cgpa;
      case 2: return form.skills.length > 0;
      case 3: return form.targetCompanyType.length > 0 && form.timeline;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const studentId = user?.id || user?._id;
      const studentData = {
        studentId,
        ...form,
        cgpa: parseFloat(form.cgpa),
        targetCompanies: form.targetCompanies
          .split(',')
          .map(c => c.trim())
          .filter(Boolean),
      };

      await createStudent(studentData);
      await generateRoadmap(studentId);
      localStorage.setItem('placivio_studentId', studentId);
      addToast('Your personalized roadmap is ready! 🎉', 'success');
      navigate(`/dashboard/${studentId}`);
    } catch (error) {
      console.error('Setup error:', error);
      addToast(error.response?.data?.error || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="AI is analyzing your profile and building your roadmap..." />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {step === 1 && 'Tell us about yourself'}
            {step === 2 && 'What do you know?'}
            {step === 3 && 'Where do you want to go?'}
            {step === 4 && 'Review & Launch 🚀'}
          </h1>
          <p className="text-slate-600">
            {step === 1 && 'We need a few details to personalize your roadmap'}
            {step === 2 && 'Add your current skills — we\'ll find the gaps'}
            {step === 3 && 'Set your targets and timeline'}
            {step === 4 && 'Everything looks good? Let\'s generate your plan!'}
          </p>
        </div>

        <ProgressBar currentStep={step} totalSteps={4} labels={stepLabels} />

        <div className="glass-card p-8 animate-fade-in">
          {/* STEP 1: Profile */}
          {step === 1 && (
            <div className="space-y-5">
              {user?.name && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-55 bg-indigo-50 border border-indigo-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">{user.name[0]}</div>
                  <div><p className="text-sm font-semibold text-slate-800">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">College Name</label>
                <input
                  type="text"
                  value={form.college}
                  onChange={(e) => updateForm('college', e.target.value)}
                  placeholder="e.g., IIT Delhi, VIT Vellore"
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Branch</label>
                  <select
                    value={form.branch}
                    onChange={(e) => updateForm('branch', e.target.value)}
                    className="select-field"
                  >
                    <option value="">Select branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Semester</label>
                  <select
                    value={form.semester}
                    onChange={(e) => updateForm('semester', e.target.value)}
                    className="select-field"
                  >
                    <option value="">Select semester</option>
                    {SEMESTERS.map(s => <option key={s} value={s}>{s} Semester</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">CGPA</label>
                <input
                  type="number"
                  value={form.cgpa}
                  onChange={(e) => updateForm('cgpa', e.target.value)}
                  placeholder="e.g., 8.5"
                  min="0"
                  max="10"
                  step="0.1"
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Skills */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Skills</label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillInputKeyDown}
                  placeholder="Type a skill and press Enter"
                  className="input-field"
                />
              </div>

              {form.skills.length > 0 && (
                <div>
                  <p className="text-xs text-slate-650 mb-2">Added skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map(skill => (
                      <SkillTag key={skill} skill={skill} variant="blue" onRemove={removeSkill} />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-600 mb-3">Suggested skills — click to add:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SKILLS.map(skill => {
                    const isAdded = form.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => !isAdded && addSkill(skill)}
                        disabled={isAdded}
                        className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-200 ${
                          isAdded
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 cursor-default'
                            : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50'
                        }`}
                      >
                        {isAdded ? <Check className="w-3 h-3 inline mr-1" /> : '+'} {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Goals */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Target Company Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {COMPANY_TYPES.map(type => {
                    const isSelected = form.targetCompanyType.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleCompanyType(type)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-305 text-indigo-700'
                            : 'border-slate-200 text-slate-550 hover:border-indigo-300'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 inline mr-1.5" />}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dream Companies</label>
                <input
                  type="text"
                  value={form.targetCompanies}
                  onChange={(e) => updateForm('targetCompanies', e.target.value)}
                  placeholder="e.g., Google, Microsoft, Flipkart"
                  className="input-field"
                />
                <p className="text-xs text-slate-500 mt-1.5">Separate with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Placement Timeline</label>
                <div className="flex gap-3">
                  {TIMELINES.map(t => (
                    <button
                      key={t}
                      onClick={() => updateForm('timeline', t)}
                      className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        form.timeline === t
                          ? 'bg-indigo-50 border-indigo-305 text-indigo-700'
                          : 'border-slate-200 text-slate-550 hover:border-indigo-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              {[
                { label: 'Name', value: user?.name || '', step: 1 },
                { label: 'College', value: form.college, step: 1 },
                { label: 'Branch', value: form.branch, step: 1 },
                { label: 'Semester', value: `${form.semester} Semester`, step: 1 },
                { label: 'CGPA', value: form.cgpa, step: 1 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-800 font-medium">{item.value}</span>
                    <button onClick={() => setStep(item.step)} className="text-xs text-indigo-600 hover:text-purple-600 font-semibold transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              ))}

              <div className="py-2 border-b border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Skills</span>
                  <button onClick={() => setStep(2)} className="text-xs text-indigo-600 hover:text-purple-600 font-semibold transition-colors">
                    Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.skills.map(s => <SkillTag key={s} skill={s} variant="blue" />)}
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-sm text-slate-600">Company Type</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-800 font-medium">{form.targetCompanyType.join(', ')}</span>
                  <button onClick={() => setStep(3)} className="text-xs text-indigo-600 hover:text-purple-600 font-semibold transition-colors">Edit</button>
                </div>
              </div>

              {form.targetCompanies && (
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Dream Companies</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-800 font-medium">{form.targetCompanies}</span>
                    <button onClick={() => setStep(3)} className="text-xs text-indigo-600 hover:text-purple-600 font-semibold transition-colors">Edit</button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-sm text-slate-600">Timeline</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-800 font-medium">{form.timeline}</span>
                  <button onClick={() => setStep(3)} className="text-xs text-indigo-600 hover:text-purple-600 font-semibold transition-colors">Edit</button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="btn-primary w-full text-lg flex items-center justify-center gap-2 mt-6"
              >
                <Sparkles className="w-5 h-5" />
                Generate My Roadmap
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setStep(s => Math.min(4, s + 1))}
                disabled={!canProceed()}
                className="btn-primary text-sm flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
