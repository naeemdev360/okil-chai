import { Label } from '@okil-chai/ui';

interface FieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly children: React.ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="font-sans text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
