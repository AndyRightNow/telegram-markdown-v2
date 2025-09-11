export type UnsupportedTagsStrategy = 'escape' | 'remove' | 'keep';

export type TextType = 'text' | 'code' | 'link';

export interface Definition {
  title: string | null;
  url: string;
}

export type DefinitionsRecord = Record<string, Definition>;
