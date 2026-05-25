import { X } from 'lucide-react';

export default function SkillTag({ skill, variant = 'blue', onRemove }) {
  const variantClass = {
    green: 'skill-tag-green',
    red: 'skill-tag-red',
    blue: 'skill-tag-blue',
    purple: 'skill-tag-purple',
  }[variant] || 'skill-tag-blue';

  return (
    <span className={`${variantClass} group`}>
      {skill}
      {onRemove && (
        <button
          onClick={() => onRemove(skill)}
          className="opacity-60 hover:opacity-100 transition-opacity"
          aria-label={`Remove ${skill}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
}
