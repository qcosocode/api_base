export interface MedicionQueryDTO {
  page?: string;
  limit?: string;
  from?: string;
  to?: string;
  sensor_id?: string;
  equipo_id?: string;
}

export interface ValidatedMedicionQueryDTO {
  page: number;
  limit: number;
  from?: Date;
  to?: Date;
  sensorId?: string;
  equipoId?: string;
}
