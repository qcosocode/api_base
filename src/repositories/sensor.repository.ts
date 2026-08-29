import { Repository } from "typeorm";
import { AppDataSource } from "../data-source/data-source";
import { SensorEntity } from "../entities/sensor.entity";
import { ISensorRepository, SensorRepositoryQuery } from "../interfaces/repositories/sensor.repository.interface";

export class SensorRepository implements ISensorRepository {
  private readonly ormRepository: Repository<SensorEntity>;
  constructor() { this.ormRepository = AppDataSource.getRepository(SensorEntity); }

  async findPaginated(query: SensorRepositoryQuery): Promise<{ data: SensorEntity[]; total: number }> {
    const qb = this.ormRepository.createQueryBuilder("s").leftJoinAndSelect("s.equipo", "e")
      .orderBy("s.sensorId", "ASC").skip((query.page - 1) * query.limit).take(query.limit);
    if (query.equipoId) qb.andWhere("e.equipoId = :equipoId", { equipoId: query.equipoId });
    if (query.tipo) qb.andWhere("s.tipo = :tipo", { tipo: query.tipo });
    if (typeof query.activo === "boolean") qb.andWhere("s.is_on = :isOn", { isOn: query.activo });
    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }
  findById(sensorId: string): Promise<SensorEntity | null> {
    return this.ormRepository.findOne({ where: { sensorId }, relations: { equipo: true } });
  }
  findByEquipoId(equipoId: string): Promise<SensorEntity[]> {
    return this.ormRepository.createQueryBuilder("s").leftJoinAndSelect("s.equipo", "e").where("e.equipoId = :equipoId", { equipoId }).getMany();
  }
  findByIdAndEquipoId(sensorId: string, equipoId: string): Promise<SensorEntity | null> {
    return this.ormRepository.createQueryBuilder("s").leftJoinAndSelect("s.equipo", "e").where("s.sensorId = :sensorId", { sensorId }).andWhere("e.equipoId = :equipoId", { equipoId }).getOne();
  }
  async existsByCodigoPCB(codigoPCB: string): Promise<boolean> { return (await this.ormRepository.count({ where: { codigoPCB } })) > 0; }
  create(sensor: SensorEntity): Promise<SensorEntity> { return this.ormRepository.save(sensor); }
  update(sensor: SensorEntity): Promise<SensorEntity> { return this.ormRepository.save(sensor); }
  async delete(sensorId: string): Promise<boolean> {
    const result = await this.ormRepository.delete({ sensorId });
    return (result.affected ?? 0) > 0;
  }
}
