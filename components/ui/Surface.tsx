import { ReactNode } from 'react';

const surfaceClass =
  'rounded-2xl border border-bp-border bg-bp-surface shadow-[0_8px_32px_rgba(0,0,0,0.35)]';

const controlClass =
  'w-full rounded-xl border border-bp-border bg-bp-bg px-3 py-2.5 text-sm text-bp-text outline-none transition placeholder:text-bp-muted focus:border-bp-primary focus:ring-2 focus:ring-bp-primary/25';

export function Surface({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${surfaceClass} ${className}`.trim()}>{children}</div>;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-bp-muted">{eyebrow}</p>
        )}
        <h1 className="mt-0.5 text-xl font-bold text-bp-text sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-bp-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  note,
  accent = 'slate',
  trend,
}: {
  label: string;
  value: ReactNode;
  note?: ReactNode;
  accent?: 'slate' | 'primary' | 'gold' | 'success' | 'warning' | 'danger';
  trend?: string;
}) {
  const accentClasses: Record<typeof accent, string> = {
    slate: 'border-bp-border bg-bp-surface-elevated',
    primary: 'border-bp-primary/30 bg-bp-primary/10',
    gold: 'border-bp-gold/30 bg-bp-gold/10',
    success: 'border-bp-success/30 bg-bp-success/10',
    warning: 'border-bp-warning/30 bg-bp-warning/10',
    danger: 'border-bp-danger/30 bg-bp-danger/10',
  };

  return (
    <Surface className={`p-4 ${accentClasses[accent]}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-bp-muted">{label}</p>
      <div className="mt-1.5 text-2xl font-bold text-bp-text">{value}</div>
      {trend && <p className="mt-1 text-xs font-medium text-bp-success">{trend}</p>}
      {note && <p className="mt-1 text-xs text-bp-muted">{note}</p>}
    </Surface>
  );
}

export function StatusPill({ status }: { status: string }) {
  const normalized = status.replace(/_/g, ' ').toLowerCase();
  const classes = getStatusTone(status);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${classes}`}
    >
      {normalized}
    </span>
  );
}

export function LiveBadge() {
  return (
    <span className="bp-live-badge inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bp-danger" />
      Live
    </span>
  );
}

export function ActionButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'gold' | 'outline';
}) {
  const variants: Record<typeof variant, string> = {
    primary: 'bg-bp-primary text-white hover:bg-bp-primary-hover',
    secondary: 'border border-bp-border bg-bp-surface-elevated text-bp-text hover:bg-bp-border/50',
    success: 'bg-bp-success text-white hover:brightness-110',
    danger: 'bg-bp-danger text-white hover:brightness-110',
    ghost: 'border border-bp-border bg-transparent text-bp-text hover:bg-bp-surface-elevated',
    gold: 'bg-bp-gold text-[#1a1500] hover:brightness-105',
    outline: 'border border-bp-success bg-transparent text-bp-success hover:bg-bp-success/10',
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-medium text-bp-text">{label}</span>
      {children}
      {hint && <span className="block text-xs text-bp-muted">{hint}</span>}
    </label>
  );
}

export function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClass} ${props.className ?? ''}`.trim()} />;
}

export function TextAreaField(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${controlClass} ${props.className ?? ''}`.trim()} />;
}

export function SelectField(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${controlClass} ${props.className ?? ''}`.trim()} />;
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <Surface className="p-8 text-center">
      <p className="text-sm font-semibold text-bp-text">{title}</p>
      {description && <p className="mt-1 text-sm text-bp-muted">{description}</p>}
    </Surface>
  );
}

export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            active === tab.id ? 'bp-tab-active' : 'bp-tab-inactive'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function getStatusTone(status: string): string {
  const normalized = status.replace(/_/g, ' ').toLowerCase();

  if (normalized.includes('approved') || normalized.includes('open') || normalized.includes('active')) {
    return 'border-bp-success/40 bg-bp-success/15 text-emerald-300';
  }

  if (normalized.includes('pending') || normalized.includes('review')) {
    return 'border-bp-warning/40 bg-bp-warning/15 text-amber-300';
  }

  if (normalized.includes('reject') || normalized.includes('inactive') || normalized.includes('ended')) {
    return 'border-bp-danger/40 bg-bp-danger/15 text-red-300';
  }

  if (normalized.includes('progress') || normalized.includes('running') || normalized.includes('live')) {
    return 'bp-live-badge';
  }

  return 'border-bp-border bg-bp-surface-elevated text-bp-muted';
}
