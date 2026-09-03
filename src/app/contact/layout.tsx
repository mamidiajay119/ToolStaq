import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Support',
  description: 'Get in touch with the toolstaq team for inquiries, feedback, or support.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
