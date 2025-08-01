export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: IMeta;
  metadata?: {
    timestamp: string;
    path?: string;
  };
}

export interface IMeta {
  itemCount: number;
  totalItems?: number;
  itemsPerPage: number;
  totalPages?: number;
  currentPage: number;
}
