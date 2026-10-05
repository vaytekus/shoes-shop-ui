import client from './client';
import type { Category } from '@/types';

export const getCategories = () => 
  client.get<Category[]>('/api/categories')