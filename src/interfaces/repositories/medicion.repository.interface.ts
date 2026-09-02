import { MedicionEntity } from "../../entities/medicion.entity";

export interface MedicionRepositoryPageOptions {
  offset: number;
  limit: number;
  from?: Date;
  to?: Date;
  sensorId?: string;
  equipoId?: string;
}

export interface IMedicionRepository {
  findPaged(options: MedicionRepositoryPageOptions): Promise<{ data: MedicionEntity[]; total: number }>;
  findPagedBySensorId(sensorId: string, options: Omit<MedicionRepositoryPageOptions, "sensorId" | "equipoId">): Promise<{ data: MedicionEntity[]; total: number }>;
  findLastPerSensor(): Promise<MedicionEntity[]>;
  findLastBySensorId(sensorId: string): Promise<MedicionEntity | null>;
  findBySensorIdAndRange(sensorId: string, from: Date, to: Date): Promise<MedicionEntity[]>;
  findBySensorIdAndWindow(sensorId: string, from: Date, to: Date): Promise<MedicionEntity[]>;
  findLastByEquipoId(equipoId: string): Promise<MedicionEntity | null>;
  createMany(entities: MedicionEntity[]): Promise<void>;
}
