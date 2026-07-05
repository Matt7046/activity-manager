/** Compatibile con la firma usata dai form che migravano da MUI Select. */
export type SelectChangeEvent = {
  target: {
    value: string;
    name?: string;
  };
};
