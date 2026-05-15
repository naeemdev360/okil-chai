import { Folder } from 'lucide-react';

interface FolderItem {
  readonly key: string;
  readonly label: string;
  readonly count: number;
}

const FOLDERS: readonly FolderItem[] = [
  { key: 'all',         label: 'All files',           count: 24 },
  { key: 'active',      label: 'Active cases',         count: 12 },
  { key: 'contracts',   label: 'Contracts',            count: 6  },
  { key: 'evidence',    label: 'Evidence & exhibits',  count: 4  },
  { key: 'credentials', label: 'My credentials',       count: 2  },
];

interface FolderNavProps {
  readonly activeKey: string;
  readonly onSelect: (key: string) => void;
}

export function FolderNav({ activeKey, onSelect }: FolderNavProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-2">
      {FOLDERS.map(f => {
        const active = activeKey === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onSelect(f.key)}
            className={[
              'flex items-center justify-between w-full px-3 py-2.5 rounded-md mb-0.5 font-sans text-[13px] transition-all border-l-[3px]',
              active ? 'bg-cream text-navy font-semibold border-l-gold' : 'text-gray-600 font-medium hover:bg-gray-50 border-l-transparent',
            ].join(' ')}
          >
            <span className="inline-flex items-center gap-2">
              <Folder size={14} className={active ? 'text-gold' : 'text-gray-400'} strokeWidth={1.5} />
              {f.label}
            </span>
            <span className="font-sans text-[11px] text-gray-400 font-medium">{f.count}</span>
          </button>
        );
      })}

      {/* Storage indicator */}
      <div className="border-t border-gray-100 mt-2 pt-3 px-3 pb-1">
        <div className="font-sans text-[11px] text-gray-400 font-semibold tracking-[0.06em] uppercase mb-2">Storage</div>
        <div className="font-sans text-[12px] text-gray-800 mb-1.5">
          <strong className="text-navy">3.2 GB</strong> of 10 GB used
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-[32%] h-full bg-gold" />
        </div>
      </div>
    </div>
  );
}
