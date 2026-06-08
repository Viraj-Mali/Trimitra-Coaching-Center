import type { Dictionary } from './types';

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('./en.json').then((m) => m.default as Dictionary),
  mr: () => import('./mr.json').then((m) => m.default as Dictionary),
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries.en;
  return loader();
}
