import { useState } from 'react';
import { Folder, Upload } from 'lucide-react';
import { Reveal, RevealGroup } from '@repo/ui';
import { PageHeader } from '../../components/ui/PageHeader';
import { FolderNav } from '../../components/features/documents/FolderNav';
import { DocumentRow } from '../../components/features/documents/DocumentRow';
import type { MockData } from '../../types/lawyer.types';

interface DocumentsPageProps {
  readonly data: MockData;
}

export function DocumentsPage({ data }: DocumentsPageProps) {
  const [activeFolder, setActiveFolder] = useState('all');

  return (
    <RevealGroup className="flex flex-col gap-4">
      <Reveal>
        <PageHeader
          title="Documents"
          subtitle="Case files, contracts, and evidence — all encrypted"
          actions={
            <>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-navy font-medium hover:bg-gray-50 transition-colors">
                <Folder size={14} strokeWidth={1.5} /> New folder
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy text-white rounded-md font-sans text-[13px] font-medium hover:bg-navy-mid transition-colors">
                <Upload size={14} strokeWidth={1.5} /> Upload
              </button>
            </>
          }
        />
      </Reveal>

      <Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] gap-4 items-start">
        <FolderNav activeKey={activeFolder} onSelect={setActiveFolder} />

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 font-sans text-[11px] text-gray-400 font-semibold tracking-[0.06em] uppercase">
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-3 py-3 text-left">Case</th>
                  <th className="px-3 py-3 text-left">Modified</th>
                  <th className="px-3 py-3 text-left">Size</th>
                  <th className="px-5 py-3 text-right" />
                </tr>
              </thead>
              <tbody>
                {data.documents.map((f, i) => (
                  <DocumentRow key={f.name} document={f} divider={i > 0} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </Reveal>
    </RevealGroup>
  );
}
