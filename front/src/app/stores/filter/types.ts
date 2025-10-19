export interface FilterStoreProps {
  categories: string[] | null;
  severityRange: [number, number];
  dataRange: [Date | null, Date | null];
}
