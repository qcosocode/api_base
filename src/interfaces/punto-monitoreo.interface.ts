// src/dto/punto-monitoreo.dto.ts

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** GET /puntos-monitoreo?page&limit&institucionId&search */
export interface PuntoMonitoreoQueryDTO {
  page?: string;       // "1"
  limit?: string;      // "10"
  institucionId?: string;
  search?: string;     // busca por nombre/descripcion
}

/** POST /puntos-monitoreo */
export interface PuntoMonitoreoCreateDTO {
  nombre: string;
  descripcion?: string;
  categoria?: string;
  institucionId: string;
}
  
 

/** PATCH /puntos-monitoreo/:puntoMonitoreoId */
export interface PuntoMonitoreoUpdateDTO {
  nombre?: string;
  descripcion?: string | null; // null => limpiar descripcion
  categoria?:string 
}

/** DTO de salida (API) */
export interface PuntoMonitoreoResponseDTO {
  id: string;
  nombre: string;
  descripcion?: string | null;
  categoria?:string;
  institucionId: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
