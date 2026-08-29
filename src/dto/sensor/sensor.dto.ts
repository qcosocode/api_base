export interface SensorDTO {
  sensorId: string;
  nombre: string;
  codigoPCB: string;
  tipo: string;
  modelo: string;
  unidad: string;
  is_on: boolean;
  equipoId: string;
}

export interface PaginatedSensorDTO {
  data: SensorDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
