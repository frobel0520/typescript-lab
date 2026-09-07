export const STORAGE_KEY = 'typescript-lab:v1';
export type ProgressState = {
  drafts: Record<string, string>;
  completed: string[];
  selected: string;
  language: string;
};
export function parseProgress(
  raw: string | null,
  ids: readonly string[],
): ProgressState {
  const empty = {
    drafts: {},
    completed: [],
    selected: ids[0] || '',
    language: 'C#',
  };
  try {
    const value: unknown = JSON.parse(raw || 'null');
    if (!value || typeof value !== 'object') return empty;
    const v = value as Record<string, unknown>;
    const drafts: Record<string, string> = {};
    if (v.drafts && typeof v.drafts === 'object')
      for (const [key, text] of Object.entries(v.drafts))
        if (
          (ids.includes(key) || key === 'playground') &&
          typeof text === 'string' &&
          text.length <= 100000
        )
          drafts[key] = text;
    return {
      drafts,
      completed: Array.isArray(v.completed)
        ? [
            ...new Set(
              v.completed.filter(
                (x): x is string => typeof x === 'string' && ids.includes(x),
              ),
            ),
          ]
        : [],
      selected:
        typeof v.selected === 'string' &&
        (ids.includes(v.selected) || v.selected === 'playground')
          ? v.selected
          : empty.selected,
      language: ['C++', 'C#', 'Python'].includes(String(v.language))
        ? String(v.language)
        : 'C#',
    };
  } catch {
    return empty;
  }
}
