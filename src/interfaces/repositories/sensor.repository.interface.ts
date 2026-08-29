import { SensorEntity } from "../../entities/sensor.entity";

export interface SensorRepositoryQuery {
  page: number;
  limit: number;
  equipoId?: string;
  tipo?: string;
  activo?: boolean;
}

export interface ISensorRepository {
  findPaginated(query: SensorRepositoryQuery): Promise<{ data: SensorEntity[]; total: number }>;
  findById(sensorId: string): Promise<SensorEntity | null>;
  findByEquipoId(equipoId: string): Promise<SensorEntity[]>;
  findByIdAndEquipoId(sensorId: string, equipoId: string): Promise<SensorEntity | null>;
  existsByCodigoPCB(codigoPCB: string): Promise<boolean>;
  create(sensor: SensorEntity): Promise<SensorEntity>;
  update(sensor: SensorEntity): Promise<SensorEntity>;
  delete(sensorId: string): Promise<boolean>;
}
