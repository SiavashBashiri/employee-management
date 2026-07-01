export const TagType = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
} as const;

export type TagType = (typeof TagType)[keyof typeof TagType];
