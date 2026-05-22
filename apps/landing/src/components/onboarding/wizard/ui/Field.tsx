import { Label } from '@repo/ui';

interface FieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
  readonly children: React.ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="font-sans text-xs text-error">{error}</p>
      ) : hint ? (
        <p className="font-sans text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}
