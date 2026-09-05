import type { Metadata } from 'next';
import { getAllCategories, getCategoryCounts } from '@/lib/tools';
import CategoriesClient from './CategoriesClient';
import { getAbsoluteUrl } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Find the Right AI Tool for Any Use Case — All Categories',
  description: 'Browse all categories of AI tools, from AI writing and coding to video generation and marketing.',
  alternates: {
    canonical: getAbsoluteUrl('/categories'),
  },
  openGraph: {
    title: 'Browse AI Tool Categories — toolstaq',
    description: 'Explore top categories of AI software, models, and platforms.',
    url: getAbsoluteUrl('/categories'),
  },
};

export default async function CategoriesIndexPage() {
  const categories = getAllCategories();
  const counts = await getCategoryCounts();

  return <CategoriesClient categories={categories} counts={counts} />;
}

