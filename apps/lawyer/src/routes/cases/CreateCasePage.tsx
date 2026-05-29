import { useCreateCase, useLookupClient } from '@repo/hooks';
import type { ClientLookupResponse } from '@repo/shared';
import { CaseCategory } from '@repo/shared';
import { ApiError } from '@repo/api-client';
import { Avatar, Button, Input, Reveal, Textarea, toast } from '@repo/ui';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CASE_CATEGORY_LABELS } from './utils/cases.utils';

const CATEGORIES = Object.values(CaseCategory);

export function CreateCasePage() {
  const navigate = useNavigate();
  const lookup = useLookupClient();
  const createCase = useCreateCase();

  const [email, setEmail] = useState('');
  const [client, setClient] = useState<ClientLookupResponse | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CaseCategory>(CaseCategory.OTHER);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    lookup.mutate(email.trim(), {
      onSuccess: (data) => setClient(data),
      onError: (err) => {
        const message =
          err instanceof ApiError && err.statusCode === 404
            ? 'No client is registered with that email. Ask them to sign up first.'
            : 'Could not look up that client. Check the email and try again.';
        toast.error(message);
      },
    });
  }

  function handleClearClient() {
    setClient(null);
    setEmail('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!client) {
      toast.error('Look up a client first.');
      return;
    }
    if (!title.trim()) {
      toast.error('Please give the case a title.');
      return;
    }

    createCase.mutate(
      {
        clientUserId: client.id,
        title: title.trim(),
        description: description.trim() || undefined,
        caseCategory: category,
      },
      {
        onSuccess: (created) => {
          toast.success('Case opened — client notified');
          navigate(`/cases/${created.id}`);
        },
        onError: () => toast.error('Could not open this case. Please try again.'),
      },
    );
  }

  return (
    <Reveal>
      <button
        onClick={() => navigate('/cases')}
        className="inline-flex items-center gap-1.5 text-[13px] text-gray-600 hover:text-navy font-sans mb-4"
      >
        <ArrowLeft size={14} /> Back to cases
      </button>

      <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 max-w-2xl">
        <h1 className="font-heading text-[22px] font-semibold text-navy mb-1">
          Open a case for a client
        </h1>
        <p className="text-[13px] text-gray-600 font-sans mb-5">
          The client must already have an OkilChai account. You’ll be set as the assigned lawyer
          straight away and the client will be notified.
        </p>

        <section className="mb-5">
          <h2 className="font-heading text-[14px] font-semibold text-navy mb-2">1. Find the client</h2>
          {client ? (
            <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 bg-cream/40">
              <Avatar
                initials={`${client.firstName[0] ?? ''}${client.lastName[0] ?? ''}`}
                src={client.avatarUrl}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-heading text-[14px] font-semibold text-navy truncate">
                  {client.firstName} {client.lastName}
                </p>
                <p className="text-[12px] text-gray-500 font-sans truncate">{client.email}</p>
              </div>
              <button
                type="button"
                onClick={handleClearClient}
                className="p-1.5 text-gray-400 hover:text-red-500"
                aria-label="Change client"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleLookup} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="flex-1"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={lookup.isPending}
                loadingText="Searching…"
              >
                <Search size={14} /> Find
              </Button>
            </form>
          )}
        </section>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="font-heading text-[14px] font-semibold text-navy mb-0">2. Case details</h2>

          <div>
            <label className="block text-[13px] font-semibold text-navy mb-1.5 font-sans" htmlFor="case-title">
              Case title
            </label>
            <Input
              id="case-title"
              value={title}
              maxLength={200}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Land boundary dispute in Mirpur"
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
              placeholder="Key facts, what the client is hoping to achieve, deadlines…"
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
            <Button
              type="submit"
              variant="primary"
              isLoading={createCase.isPending}
              loadingText="Opening…"
              disabled={!client}
            >
              Open case
            </Button>
          </div>
        </form>
      </div>
    </Reveal>
  );
}
