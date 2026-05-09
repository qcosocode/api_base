// Query genérica para GET /mediciones
export interface GetAllMedicionesQuery {
  page?: string;
  limit?: string;
  sensor_id?: string;
  equipo_id?: string;
  from?: string; // ISO string
  to?: string;   // ISO string
}

// GET /mediciones/sensor/:sensorId/rango
export interface GetBySensorAndRangeQuery {

  /** ISO 8601 (UTC) ej: 2025-12-15T00:00:00.000Z  |  o DD/MM/YYYY ej: 15/12/2025 */
  from: string;
  /** ISO 8601 (UTC) ej: 2025-12-16T23:59:59.999Z  |  o DD/MM/YYYY ej: 16/12/2025 */
  to: string;

}

// GET /mediciones/sensor/:sensorId/window
export interface GetBySensorAndWindowQuery {
  hours?: string;
  minutes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  from?: string;
  to?: string;
}
