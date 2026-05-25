import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Briefcase, DollarSign, Calendar, Tag, Users, FileText, ArrowRight, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { postDrive } from '../../services/api';

const BRANCHES = ['CSE', 'CSBS', 'IT', 'ECE', 'ME', 'CE', 'Other'];

export default function PostDrive() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    companyName: '', jobRole: '', packageLPA: '', driveDate: '', registrationDeadline: '',
    requiredSkills: [], cgpaCutoff: '', branchesAllowed: [], seatsAvailable: '',
    driveType: 'oncampus', description: '',
  });

  const addSkill = (skillText = skillInput) => {
    const parts = skillText.split(/[,,;]/).map(s => s.trim()).filter(Boolean);
    const newSkills = [...form.requiredSkills];
    let updated = false;
    parts.forEach(p => {
      if (!newSkills.includes(p)) {
        newSkills.push(p);
        updated = true;
      }
    });
    if (updated) {
      setForm({ ...form, requiredSkills: newSkills });
    }
    setSkillInput('');
  };

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    if (value.endsWith(',')) {
      const skill = value.slice(0, -1).trim();
      if (skill) {
        addSkill(skill);
      }
      setSkillInput('');
    } else {
      setSkillInput(value);
    }
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const toggleBranch = (b) => {
    setForm({
      ...form,
      branchesAllowed: form.branchesAllowed.includes(b)
        ? form.branchesAllowed.filter(x => x !== b)
        : [...form.branchesAllowed, b],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postDrive({ ...form, packageLPA: Number(form.packageLPA), cgpaCutoff: Number(form.cgpaCutoff), seatsAvailable: Number(form.seatsAvailable) });
      addToast('Drive posted! Students have been notified. 🎉', 'success');
      navigate('/tpo/dashboard');
    } catch (error) {
      addToast(error.response?.data?.error || 'Failed to post drive.', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-mesh">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/10">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Post New Drive</h1>
            <p className="text-sm text-slate-500">Students will be auto-notified with their match %</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5 border border-emerald-500/10">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Company Name *</label>
              <input type="text" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="e.g. TCS" className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Job Role *</label>
              <input type="text" value={form.jobRole} onChange={e => setForm({ ...form, jobRole: e.target.value })} placeholder="e.g. Software Engineer" className="input-field" required />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Package (LPA) *</label>
              <input type="number" step="0.5" value={form.packageLPA} onChange={e => setForm({ ...form, packageLPA: e.target.value })} placeholder="6" className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Drive Date *</label>
              <input type="date" value={form.driveDate} onChange={e => setForm({ ...form, driveDate: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Reg. Deadline *</label>
              <input type="date" value={form.registrationDeadline} onChange={e => setForm({ ...form, registrationDeadline: e.target.value })} className="input-field" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Required Skills</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={skillInput} onChange={handleSkillInputChange}
                onKeyDown={handleSkillInputKeyDown}
                placeholder="Type a skill and press Enter" className="input-field flex-1" />
              <button type="button" onClick={() => addSkill()} className="btn-secondary px-4">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.requiredSkills.map(s => (
                <span key={s} className="skill-tag skill-tag-green flex items-center gap-1">
                  {s} <button type="button" onClick={() => setForm({ ...form, requiredSkills: form.requiredSkills.filter(x => x !== s) })}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">CGPA Cutoff</label>
              <input type="number" step="0.1" min="0" max="10" value={form.cgpaCutoff} onChange={e => setForm({ ...form, cgpaCutoff: e.target.value })} placeholder="6.0" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Seats Available</label>
              <input type="number" value={form.seatsAvailable} onChange={e => setForm({ ...form, seatsAvailable: e.target.value })} placeholder="10" className="input-field" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Branches Allowed</label>
            <div className="flex flex-wrap gap-2">
              {BRANCHES.map(b => (
                <button key={b} type="button" onClick={() => toggleBranch(b)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${form.branchesAllowed.includes(b) ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                  {b}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">Leave empty to allow all branches</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Drive Type</label>
            <div className="flex gap-3">
              {['oncampus', 'offcampus'].map(t => (
                <button key={t} type="button" onClick={() => setForm({ ...form, driveType: t })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${form.driveType === t ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                  {t === 'oncampus' ? '🏫 On-Campus' : '🌐 Off-Campus'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Job description, responsibilities, etc." rows={3} className="input-field resize-none" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
            {loading ? 'Posting...' : <>Post Drive & Notify Students <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
