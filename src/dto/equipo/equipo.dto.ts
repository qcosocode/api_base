export interface EquipoDTO {
  equipoId: string;
  nombre: string;
  modelo?: string;
  descripcion?: string;
  isActive: boolean;
  puntoMonitoreoId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedEquipoDTO {
  data: EquipoDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: EquipoFiltersDTO;
}

export interface EquipoFiltersDTO {
  equipoID?: string;
  nombre?: string;
  modelo?: string;
  puntoMonitoreoId?: string;
  isActive?: boolean;
}
