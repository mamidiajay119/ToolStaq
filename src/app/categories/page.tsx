import type { Metadata } from 'next';
import { getAllCategories, getCategoryCounts } from '@/lib/tools';
import CategoriesClient from './CategoriesClient';

export const metadata: Metadata = {
  title: 'Find the Right AI Tool for Any Use Case',
  description: 'Browse all categories of AI tools, from AI writing and coding to video generation and marketing.',
};

export default async function CategoriesIndexPage() {
  const categories = getAllCategories();
  const counts = await getCategoryCounts();

  return <CategoriesClient categories={categories} counts={counts} />;
}
