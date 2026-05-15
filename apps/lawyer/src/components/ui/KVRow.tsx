interface KVRowProps {
  readonly label: string;
  readonly value: React.ReactNode;
  readonly last?: boolean;
}

export function KVRow({ label, value, last }: KVRowProps) {
  return (
    <div
      className={`flex justify-between items-center py-2.5 font-sans text-[13px] ${last ? '' : 'border-b border-gray-100'}`}
    >
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-800 font-medium text-right">{value}</span>
    </div>
  );
}
