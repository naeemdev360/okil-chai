import { useState } from 'react';
import type { AvailabilitySlot, Booking, BookingStatus, Document, Earnings, MessageThread, MockData, Review } from '../types/lawyer.types';

const INITIAL_BOOKINGS: Booking[] = [
  { id: 1, day: 'today', initials: 'RM', client: 'Rachel Martinez', email: 'rachel.m@gmail.com', phone: '+1 (617) 555-0188', type: 'video', topic: 'Criminal defense — pre-trial consultation', requestedFor: 'Today, 2:00 PM', timeShort: '2:00', ampm: 'PM', duration: '60 min', fee: 180, status: 'confirmed', area: 'Criminal Defense', memberSince: 'Mar 2024', pastBookings: 3, pastWithYou: 2, location: 'Boston, MA', brief: 'Hi James — I was charged with a misdemeanor last week and the arraignment is on Friday. I need help understanding my options before then.', attachments: [{ name: 'Citation_2026-04-22.pdf', size: '142 KB' }] },
  { id: 2, day: 'today', initials: 'DK', client: 'David Kim', email: 'dkim@kimco.io', phone: '+1 (617) 555-0292', type: 'phone', topic: 'Contract review follow-up', requestedFor: 'Today, 4:30 PM', timeShort: '4:30', ampm: 'PM', duration: '45 min', fee: 135, status: 'confirmed', area: 'Business Law', memberSince: 'Jan 2024', pastBookings: 8, pastWithYou: 8, location: 'Cambridge, MA', brief: 'Follow-up on the vendor agreement we reviewed last month. The other side sent revisions.' },
  { id: 3, day: 'today', initials: 'YT', client: 'Yvonne Tran', email: 'yvonne.t@protonmail.com', phone: '+1 (617) 555-0341', type: 'in-person', topic: 'Family law — initial consultation', requestedFor: 'Today, 6:00 PM', timeShort: '6:00', ampm: 'PM', duration: '90 min', fee: 270, status: 'confirmed', area: 'Family Law', memberSince: 'Apr 2026', pastBookings: 0, pastWithYou: 0, location: 'Brookline, MA', brief: 'Considering filing for divorce. Need to understand process, custody implications, and timeline. We have two kids (ages 7 and 11).' },
  { id: 4, day: 'tomorrow', initials: 'MP', client: 'Marcus Pham', email: 'marcus.p@email.com', phone: '+1 (617) 555-0419', type: 'video', topic: 'Immigration — green card case review', requestedFor: 'Tomorrow, 10:00 AM', timeShort: '10:00', ampm: 'AM', duration: '60 min', fee: 180, status: 'pending', priority: 'urgent', area: 'Immigration', memberSince: 'Apr 2026', pastBookings: 1, pastWithYou: 0, location: 'Somerville, MA', submitted: '12 minutes ago', brief: 'Hi — I received an RFE from USCIS yesterday on my I-485 application. The deadline to respond is 30 days. I urgently need to understand my options and what documents to gather.', attachments: [{ name: 'USCIS_RFE_Notice.pdf', size: '1.4 MB' }, { name: 'I-485_Filing_Receipt.pdf', size: '88 KB' }] },
  { id: 5, day: 'tomorrow', initials: 'LS', client: 'Linda Stewart', email: 'linda.stewart@gmail.com', phone: '+1 (617) 555-0182', type: 'video', topic: 'Divorce — financial settlement', requestedFor: 'Tomorrow, 2:00 PM', timeShort: '2:00', ampm: 'PM', duration: '60 min', fee: 220, status: 'pending', area: 'Family Law', memberSince: 'Mar 2026', pastBookings: 2, pastWithYou: 1, location: 'Newton, MA', submitted: '1 hour ago', brief: 'Need to discuss the proposed financial settlement my ex submitted. I have questions about the retirement account split and the house valuation.' },
  { id: 6, day: 'wed', initials: 'TR', client: 'Theo Rodriguez', email: 'theo.r@email.com', phone: '+1 (617) 555-0411', type: 'in-person', topic: 'DUI defense — first offense', requestedFor: 'Wed, May 1 · 11:00 AM', timeShort: '11:00', ampm: 'AM', duration: '60 min', fee: 180, status: 'pending', area: 'Criminal Defense', memberSince: 'Apr 2026', pastBookings: 0, pastWithYou: 0, location: 'Boston, MA', submitted: '3 hours ago', brief: 'I was pulled over Saturday night and blew a 0.09. Court date is in 3 weeks. First-time offender, no priors.' },
  { id: 7, day: 'past', initials: 'AB', client: 'Aisha Bennett', email: 'aisha@bennettco.com', phone: '+1 (617) 555-0922', type: 'video', topic: 'Criminal defense consultation', requestedFor: 'Apr 22, 3:00 PM', timeShort: '3:00', ampm: 'PM', duration: '60 min', fee: 180, status: 'completed', area: 'Criminal Defense', memberSince: 'Feb 2024', pastBookings: 4, pastWithYou: 4, location: 'Boston, MA', brief: 'Completed.' },
  { id: 8, day: 'past', initials: 'NV', client: 'Nikhil Verma', email: 'nikhil@vermalegal.com', phone: '+1 (617) 555-0667', type: 'phone', topic: 'Contract dispute', requestedFor: 'Apr 18, 11:00 AM', timeShort: '11:00', ampm: 'AM', duration: '60 min', fee: 180, status: 'declined', area: 'Business Law', memberSince: 'Apr 2026', pastBookings: 0, pastWithYou: 0, location: 'Boston, MA', brief: 'Declined — conflict of interest.', declinedAt: 'Apr 17', declineReason: 'Conflict of interest with existing client.' },
];

const EARNINGS: Earnings = {
  thisMonth: 8420,
  lastMonth: 6280,
  pending: 1620,
  lifetime: 47800,
  payoutDate: 'Apr 30',
};

const REVIEWS: readonly Review[] = [
  { name: 'Rachel M.', initials: 'RM', rating: 5, area: 'Criminal Defense', date: '3 days ago', text: 'Incredibly clear and patient. James took time to walk me through every option without rushing or talking down to me. I felt informed and in control.', reply: 'Thank you Rachel — wishing you the best with what comes next.' },
  { name: 'David K.', initials: 'DK', rating: 5, area: 'Business Law', date: '1 week ago', text: 'Worth every penny. The contract James negotiated saved my company from a six-figure mistake. Direct, no-nonsense, knows his stuff.' },
  { name: 'Anonymous', initials: 'A', rating: 5, area: 'Family Law', date: '2 weeks ago', text: 'I dreaded calling a lawyer. James made one of the hardest weeks of my life feel manageable. Compassionate and competent.' },
  { name: 'Marcus P.', initials: 'MP', rating: 4, area: 'Immigration', date: '3 weeks ago', text: 'Knowledgeable and gave me a clear path forward. Took an extra day to respond which is the only reason this is not a 5.', reply: 'Thanks for the honest feedback Marcus — I had a trial that week. Working on hiring a paralegal to improve response times.' },
];

const THREADS: MessageThread[] = [
  { id: 't1', initials: 'RM', name: 'Rachel Martinez', online: true, unread: 2, lastTime: '2m', area: 'Criminal Defense', preview: 'Can we go over the witness statements before...', caseRef: 'CASE-2026-0421', caseTitle: 'Pre-trial defense — misdemeanor charge', caseStatus: 'Active', nextConsult: 'Today · 2:00 PM', memberSince: 'Mar 2024', files: [{ name: 'Citation_2026-04-22.pdf', size: '142 KB' }, { name: 'Witness_statement_draft.docx', size: '24 KB' }], messages: [
    { from: 'them', text: 'Hi James — I wanted to follow up on what we discussed Tuesday.', time: 'Yesterday, 4:12 PM' },
    { from: 'them', text: 'I gathered the documents you asked for and uploaded them to our shared folder.', time: 'Yesterday, 4:13 PM' },
    { from: 'me', text: "Got them, thanks Rachel. Reviewing tonight — I'll send notes by tomorrow morning.", time: 'Yesterday, 6:48 PM' },
    { from: 'them', text: "Perfect. One quick question — should I respond to the prosecutor's email or wait?", time: 'Today, 9:02 AM' },
    { from: 'me', text: "Wait. Don't respond to anything from their office without me. Forward it instead.", time: 'Today, 9:14 AM' },
    { from: 'them', text: 'Will do. Can we go over the witness statements before our 2pm?', time: 'Today, 9:16 AM' },
  ] },
  { id: 't2', initials: 'DK', name: 'David Kim', online: false, unread: 1, lastTime: '1h', area: 'Business Law', preview: 'The other side sent revisions — see attached', caseRef: 'CASE-2024-1108', caseTitle: 'Vendor master agreement — Acme Co.', caseStatus: 'In review', nextConsult: 'Today · 4:30 PM', memberSince: 'Jan 2024', files: [{ name: 'MSA_v3_redline.docx', size: '186 KB' }, { name: 'MSA_v2_signed.pdf', size: '420 KB' }], messages: [
    { from: 'them', text: 'The other side sent revisions — see attached.', time: 'Today, 11:42 AM' },
  ] },
  { id: 't3', initials: 'YT', name: 'Yvonne Tran', online: true, unread: 0, lastTime: '3h', area: 'Family Law', preview: 'Thank you so much for fitting me in today.', caseRef: 'CASE-2026-0426', caseTitle: 'Initial consultation — divorce', caseStatus: 'New', nextConsult: 'Today · 6:00 PM', memberSince: 'Apr 2026', files: [], messages: [
    { from: 'them', text: 'Thank you so much for fitting me in today.', time: 'Today, 8:14 AM' },
    { from: 'me', text: 'Of course. Looking forward to meeting you at 6.', time: 'Today, 8:30 AM' },
  ] },
  { id: 't4', initials: 'MP', name: 'Marcus Pham', online: false, unread: 4, lastTime: '12m', area: 'Immigration', preview: "I uploaded the RFE — it's pretty dense...", caseRef: 'CASE-2026-0428', caseTitle: 'I-485 RFE response', caseStatus: 'Urgent', nextConsult: 'Tomorrow · 10:00 AM', memberSince: 'Apr 2026', files: [{ name: 'USCIS_RFE_Notice.pdf', size: '1.4 MB' }], messages: [
    { from: 'them', text: 'Hi James — I just sent the booking request. Hoping you can take this on.', time: 'Today, 10:48 AM' },
    { from: 'them', text: "I uploaded the RFE — it's pretty dense and I'm honestly panicking a little.", time: 'Today, 10:52 AM' },
    { from: 'them', text: 'The deadline is May 24, so just under 4 weeks.', time: 'Today, 10:54 AM' },
    { from: 'them', text: 'Let me know if you need anything else from me before tomorrow.', time: 'Today, 11:01 AM' },
  ] },
  { id: 't5', initials: 'LS', name: 'Linda Stewart', online: false, unread: 0, lastTime: '1d', area: 'Family Law', preview: "Thanks — I'll send the new docs over tonight.", caseRef: 'CASE-2026-0312', caseTitle: 'Divorce settlement review', caseStatus: 'Active', nextConsult: 'Tomorrow · 2:00 PM', memberSince: 'Mar 2026', files: [], messages: [
    { from: 'me', text: 'Linda — can you send the latest version of the proposed settlement before our call?', time: 'Yesterday, 5:00 PM' },
    { from: 'them', text: "Thanks — I'll send the new docs over tonight.", time: 'Yesterday, 8:14 PM' },
  ] },
];

const DOCUMENTS: readonly Document[] = [
  { name: 'Motion_to_dismiss_draft.docx', case: 'CASE-2026-0421 · R. Martinez', modified: 'Today, 11:42 AM', size: '184 KB', ext: 'docx', shared: 'Rachel M.' },
  { name: 'MSA_v3_redline.docx', case: 'CASE-2024-1108 · D. Kim', modified: 'Today, 9:18 AM', size: '186 KB', ext: 'docx', shared: 'David K.' },
  { name: 'USCIS_RFE_Notice.pdf', case: 'CASE-2026-0428 · M. Pham', modified: 'Today, 10:52 AM', size: '1.4 MB', ext: 'pdf', shared: 'Marcus P.' },
  { name: 'Citation_2026-04-22.pdf', case: 'CASE-2026-0421 · R. Martinez', modified: 'Yesterday', size: '142 KB', ext: 'pdf' },
  { name: 'Witness_statement_draft.docx', case: 'CASE-2026-0421 · R. Martinez', modified: '2 days ago', size: '24 KB', ext: 'docx' },
  { name: 'Settlement_proposal_v2.pdf', case: 'CASE-2026-0312 · L. Stewart', modified: '3 days ago', size: '612 KB', ext: 'pdf', shared: 'Linda S.' },
  { name: 'Custody_evaluation_notes.docx', case: 'CASE-2026-0312 · L. Stewart', modified: '5 days ago', size: '78 KB', ext: 'docx' },
  { name: 'Evidence_photos_traffic_stop.zip', case: 'CASE-2026-0421 · R. Martinez', modified: 'Apr 22', size: '8.2 MB', ext: 'zip' },
  { name: 'MA_Bar_Certificate.pdf', case: 'My credentials', modified: 'Feb 12, 2026', size: '420 KB', ext: 'pdf' },
];

const AVAILABILITY: readonly AvailabilitySlot[] = [
  { day: 'Mon', start: 9,  end: 11, type: 'available' },
  { day: 'Mon', start: 14, end: 15, type: 'booked', client: 'R. Martinez', topic: 'Pre-trial consult' },
  { day: 'Mon', start: 16, end: 17, type: 'booked', client: 'D. Kim', topic: 'Contract review' },
  { day: 'Mon', start: 18, end: 18, type: 'available' },
  { day: 'Tue', start: 9,  end: 12, type: 'available' },
  { day: 'Tue', start: 13, end: 14, type: 'pending', client: 'M. Pham' },
  { day: 'Tue', start: 14, end: 15, type: 'booked', client: 'L. Stewart', topic: 'Divorce settlement' },
  { day: 'Tue', start: 15, end: 17, type: 'available' },
  { day: 'Wed', start: 9,  end: 10, type: 'blocked' },
  { day: 'Wed', start: 11, end: 12, type: 'pending', client: 'T. Rodriguez' },
  { day: 'Wed', start: 14, end: 17, type: 'available' },
  { day: 'Thu', start: 9,  end: 18, type: 'available' },
  { day: 'Fri', start: 9,  end: 13, type: 'available' },
  { day: 'Fri', start: 14, end: 16, type: 'blocked' },
  { day: 'Sat', start: 10, end: 12, type: 'available' },
];

export function useMockData(): MockData {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  const act = (id: number, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return {
    bookings,
    act,
    earnings: EARNINGS,
    reviews: REVIEWS,
    threads: THREADS,
    documents: DOCUMENTS,
    availability: AVAILABILITY,
  };
}
