

export interface IEquipoFilters  {
  equipoID?: string;
  nombre?: string;
  modelo?: string;
  puntoMonitoreoId?: string;
  isActive?: boolean;
}

export interface CreateEquipoDTO {
  nombre: string;
  modelo?: string;
  descripcion?: string;
  isActive?: boolean;
  puntoMonitoreoId?: string | null;
}

// export interface CreateEquipoDTO {
//   equipoId: string;
//   nombre: string;
//   modelo?: string;
//   descripcion?: string;
//   isActive?: boolean;
//   puntoMonitoreoId?: string | null;
// }

export interface UpdateEquipoDTO {
  nombre?: string;
  modelo?: string;
  descripcion?: string;
  isActive?: boolean;
  puntoMonitoreoId?: string | null;
}

export interface EquipoResponseDTO {
  equipoId: string;
  nombre: string;
  modelo?: string;
  descripcion?: string;
  isActive: boolean;
  puntoMonitoreoId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipoResponseDTO {
  equipoId: string;
  nombre: string;
  modelo?: string;
  descripcion?: string;
  isActive: boolean;
  puntoMonitoreoId: string | null;

  puntoMonitoreo?: {
    id: string;
    nombre: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface EquipoQueryDTO {
  page?: string;
  limit?: string;
  isActive?: string;
  puntoMonitoreoId?: string;
  search?: string;
}