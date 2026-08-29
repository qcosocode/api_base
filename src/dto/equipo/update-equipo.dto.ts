export interface UpdateEquipoDTO {
  nombre?: string;
  modelo?: string;
  descripcion?: string;
  isActive?: boolean;
  puntoMonitoreoId?: string | null;
}
