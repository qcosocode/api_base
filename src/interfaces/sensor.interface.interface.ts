
/*  */
// definir ISensor 
// definir SensorCreateDTO 
// definir SensorResponseDTO 

export interface SensorQueryDTO {
  page?: string;      // "1", "2", etc.
  limit?: string;     // "10", "20", etc.

  equipoId?: string;  // filtro opcional
  tipo?: string;      // filtro opcional
  activo?: string;    // "true" | "false" (opcional)
}


// DTO de salida (lo que devolvés al cliente)
export interface SensorResponseDTO {
  sensorId: string;
  nombre: string;
  codigoPCB:string;
  tipo: string;
  modelo:string;
  unidad:string;
  is_on: boolean;
  equipoId: string;
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

export interface ISensor{   // crear a partir de entity
  
}

export interface SensorCreateDTO {
 
  nombre: string;
  codigoPCB: string;
  tipo: string;
  modelo: string;
  unidad: string;
  is_on?: boolean;     // opcional, default true
  equipoId: string;    // requerido para asociar
}

export interface SensorUpdateDTO {
  nombre?: string;
  codigoPCB?: string;
  tipo?: string;
  modelo?: string;
  unidad?: string;
  is_on?: boolean;
  equipoId?: string;   // si permitís “mover” sensor de equipo (opcional)
}






export interface GetSensorsInput {
  page: number;
  limit: number;
  equipoId?: string;
  tipo?: string; 
  activo?: boolean ;
}