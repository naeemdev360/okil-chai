import type { Transaction } from '../../types/lawyer.types';

export const TRANSACTIONS: readonly Transaction[] = [
  { id: 1, date: 'Apr 28', client: 'Rachel M.', topic: 'Criminal defense consult',   gross: 180, fee: 27,    net: 153,    status: 'completed' },
  { id: 2, date: 'Apr 28', client: 'David K.',  topic: 'Contract review',             gross: 135, fee: 20.25, net: 114.75, status: 'completed' },
  { id: 3, date: 'Apr 27', client: 'Yvonne T.', topic: 'Family law — initial',        gross: 270, fee: 40.5,  net: 229.5,  status: 'pending'   },
  { id: 4, date: 'Apr 26', client: 'Marcus P.', topic: 'Immigration review',          gross: 180, fee: 27,    net: 153,    status: 'completed' },
  { id: 5, date: 'Apr 25', client: 'Linda S.',  topic: 'Divorce consultation',        gross: 220, fee: 33,    net: 187,    status: 'completed' },
  { id: 6, date: 'Apr 24', client: 'Theo R.',   topic: 'DUI defense',                 gross: 180, fee: 27,    net: 153,    status: 'completed' },
];

export const TIME_FILTERS = ['Last 30 days', '3 months', 'Year'] as const;
