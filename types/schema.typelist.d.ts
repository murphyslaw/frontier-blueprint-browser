export interface Typelist {
  [key: string]: {
    description: string;
    includedTypeIDs: number[];
  };
}
