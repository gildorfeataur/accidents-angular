export interface FilterFormProps {
  categories: string[];
  severityRange: [number, number];
  dateFrom: Date | null;
  dateTo: Date | null;
}
