export interface FilterStoreProps {
  category: string[] | null;
  severityRange: [number, number];
  dataRange: [Date | null, Date | null];
}
