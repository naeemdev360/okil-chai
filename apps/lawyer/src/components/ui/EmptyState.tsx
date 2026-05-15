interface EmptyStateProps {
  readonly message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="py-10 text-center font-sans text-[13px] text-gray-400">{message}</div>
  );
}
