export const OfficeLocation = {
  RIGA: 'Riga',
  TALLINN: 'Tallinn',
  VILNIUS: 'Vilnius',
} as const;

export type OfficeLocation =
  (typeof OfficeLocation)[keyof typeof OfficeLocation];
