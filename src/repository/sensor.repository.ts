// src/repository/sensor.repository.ts

import { AppDataSource } from "../data-source/data-source";
import { BaseRepository } from "./base.repository";
import { Sensor } from "../entities/sensor";
import { GetSensorsInput, SensorQueryDTO } from "../interfaces/sensor.interface.interface";

type FindPaginatedResult = { data: Sensor[]; total: number };

export class SensorRepository extends BaseRepository<Sensor> {
  constructor() {
    super(AppDataSource.getRepository(Sensor));
  }

  async findPaginated(query: GetSensorsInput): Promise<FindPaginatedResult> {
    
    const qb = this.ormRepository
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.equipo", "e")
      .orderBy("s.sensorId", "ASC")
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    if (query.equipoId) {
      // OJO: esto depende del nombre de PK de Equipo (equipoId o id)
      qb.andWhere("e.equipoId = :equipoId OR e.id = :equipoId", { equipoId: query.equipoId });
    }

    if (query.tipo) {
      qb.andWhere("s.tipo = :tipo", { tipo: query.tipo });
    }

    if (typeof query.activo === "string") {
      // activo => mapea a is_on
      const isOn = query.activo === "true";
      qb.andWhere("s.is_on = :isOn", { isOn });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async findBySensorId(sensorId: string): Promise<Sensor | null> {
    return this.ormRepository.findOne({
      where: { sensorId },
      relations: { equipo: true },
    });
  }

  async existsBySensorId(sensorId: string): Promise<boolean> {
    const count = await this.ormRepository.count({ where: { sensorId } });
    return count > 0;
  }

  async existsByCodigoPCB(codigoPCB: string): Promise<boolean> {
    const count = await this.ormRepository.count({ where: { codigoPCB } });
    return count > 0;
  }

  async createSensor(entity: Sensor): Promise<Sensor> {
    return this.ormRepository.save(entity);
  }

  async updateSensor(sensorId: string, patch: Partial<Sensor>): Promise<Sensor | null> {
    const existing = await this.findBySensorId(sensorId);
    if (!existing) return null;

    Object.assign(existing, patch);
    return this.ormRepository.save(existing);
  }

  async deleteById(sensorId: string): Promise<boolean> {
    const res = await this.ormRepository.delete({ sensorId });
    return (res.affected ?? 0) > 0;
  }
}
