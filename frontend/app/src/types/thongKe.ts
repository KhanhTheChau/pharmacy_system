export interface RevenueItem {
  label: string;                                                                                                          
  total: number
  invoices: number; 
}

export type Mode = 'year' | 'month' | 'week';
export type ChartType = 'line' | 'bar' | 'area';
export type DisplayType = 'revenue' | 'invoices' | 'both';

export type EntityCount = {
  drugs: number;
  manufacturers: number;
  categories: number;
  suppliers: number;
  customers: number;
  invoices: number;
  invoiceDetails: number;
};

export type TopSellingDrug = {
  tenThuoc: string;
  soLuong: number;
  tongTien: number;
};

export type TopSellingParams = {
  month?: number;
  year?: number;
};

export type SoonExpiredDrug = {
  tenThuoc: string;
  hanSuDung: string;
  soLuongTon: number;
};
