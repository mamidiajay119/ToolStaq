import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'List Your AI Tool on toolstaq',
  description: 'Submit your AI tool or software product to the toolstaq directory index.',
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
