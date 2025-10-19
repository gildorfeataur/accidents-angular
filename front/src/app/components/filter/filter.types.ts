export enum FilterFormFieldsEnum {
  Categories = 'categories',
  SeverityMin = 'severityMin',
  SeverityMax = 'severityMax',
  DateFrom = 'dateFrom',
  DateTo = 'dateTo',
}

export interface FilterFormProps {
  categories: string[];
  severityRange: [number, number];
  dateFrom: Date | null;
  dateTo: Date | null;
}
