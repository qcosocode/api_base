export interface CreateEquipoDTO {
  nombre: string;
  modelo?: string;
  descripcion?: string;
  isActive?: boolean;
  puntoMonitoreoId?: string | null;
}
