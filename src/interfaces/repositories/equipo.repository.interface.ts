import { EquipoEntity } from "../../entities/equipo.entity";

export interface EquipoRepositoryFilters {
  equipoID?: string;
  nombre?: string;
  modelo?: string;
  puntoMonitoreoId?: string;
  isActive?: boolean;
}

export interface IEquipoRepository {
  findPaged(page: number, limit: number, filters: EquipoRepositoryFilters): Promise<{ data: EquipoEntity[]; total: number }>;
  findById(equipoId: string): Promise<EquipoEntity | null>;
  create(entity: EquipoEntity): Promise<EquipoEntity>;
  update(entity: EquipoEntity): Promise<EquipoEntity>;
  delete(equipoId: string): Promise<boolean>;
}
