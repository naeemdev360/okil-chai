import { useCreateCase } from '@repo/hooks';
import { CaseCategory } from '@repo/shared';
import { Button, Input, Reveal, RevealGroup, Textarea, toast } from '@repo/ui';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CASE_CATEGORY_LABELS } from './utils/cases.utils';

const CATEGORIES = Object.values(CaseCategory);

export function CreateCasePage() {
  const navigate = useNavigate();
  const { mutate: createCase, isPending } = useCreateCase();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CaseCategory>(CaseCategory.OTHER);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please give your case a title.');
      return;
    }

    createCase(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        caseCategory: category,
      },
      {
        onSuccess: (created) => {
          toast.success('Case opened');
          navigate(`/cases/${created.id}`);
        },
        onError: () => toast.error('Could not open this case. Please try again.'),
      },
    );
  }

  return (
    <RevealGroup>
      <button
        onClick={() => navigate('/cases')}
        className="inline-flex items-center gap-1.5 text-[13px] text-gray-600 hover:text-navy font-sans mb-4"
      >
        <ArrowLeft size={14} /> Back to cases
      </button>
 <Reveal>

      <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 max-w-2xl">
        <h1 className="font-heading text-[22px] font-semibold text-navy mb-1">
          Open a new case
        </h1>
        <p className="text-[13px] text-gray-600 font-sans mb-5">
          Describe your matter. You can invite a lawyer and upload documents from the case page next.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-navy mb-1.5 font-sans" htmlFor="case-title">
              Case title
            </label>
            <Input
              id="case-title"
              value={title}
              maxLength={200}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tenancy dispute with landlord"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-navy mb-1.5 font-sans" htmlFor="case-category">
              Category
            </label>
            <select
              id="case-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CaseCategory)}
              className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-navy font-sans text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CASE_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-navy mb-1.5 font-sans" htmlFor="case-description">
              Background (optional)
            </label>
            <Textarea
              id="case-description"
              value={description}
              maxLength={5000}
              rows={6}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief background, key facts, what you're hoping to achieve…"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/cases')}
              className="border border-gray-200"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isPending} loadingText="Opening…">
              Open case
            </Button>
          </div>
        </form>
      </div>
    </Reveal>
    </RevealGroup>
   
  );
}
