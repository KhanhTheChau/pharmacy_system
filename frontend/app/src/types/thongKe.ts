export interface RevenueItem {
  label: string;                                                                                                          
  total: number
  invoices: number; 
}

export type Mode = 'year' | 'month' | 'week';
export type ChartType = 'line' | 'bar' | 'area';
export type DisplayType = 'revenue' | 'invoices' | 'both';
