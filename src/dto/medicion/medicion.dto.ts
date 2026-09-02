export interface MedicionDTO {
  sensor_id: string;
  time: Date;
  valor: number;
}

export interface PaginatedMedicionDTO {
  data: MedicionDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  from?: Date;
  to?: Date;
}
