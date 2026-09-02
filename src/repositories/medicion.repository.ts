import { Repository, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../data-source/data-source";
import { MedicionEntity } from "../entities/medicion.entity";
import { IMedicionRepository, MedicionRepositoryPageOptions } from "../interfaces/repositories/medicion.repository.interface";

export class MedicionRepository implements IMedicionRepository {
  private readonly ormRepository: Repository<MedicionEntity>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(MedicionEntity);
  }

  async findPaged(options: MedicionRepositoryPageOptions): Promise<{ data: MedicionEntity[]; total: number }> {
    const qb = this.baseQuery();
    if (options.sensorId) qb.andWhere("s.sensorId = :sensorId", { sensorId: options.sensorId });
    if (options.equipoId) qb.andWhere("e.equipoId = :equipoId", { equipoId: options.equipoId });
    this.applyTimeFilters(qb, options.from, options.to);
    const [data, total] = await qb.orderBy("m.time", "DESC").skip(options.offset).take(options.limit).getManyAndCount();
    return { data, total };
  }

  async findPagedBySensorId(
    sensorId: string,
    options: Omit<MedicionRepositoryPageOptions, "sensorId" | "equipoId">
  ): Promise<{ data: MedicionEntity[]; total: number }> {
    return this.findPaged({ ...options, sensorId });
  }

  async findLastPerSensor(): Promise<MedicionEntity[]> {
    const subquery = this.ormRepository.createQueryBuilder("m2")
      .select("MAX(m2.time)", "max_time").addSelect("m2.sensor_id", "sensor_id").groupBy("m2.sensor_id");
    return this.baseQuery().innerJoin(
      `(${subquery.getQuery()})`, "latest", "latest.sensor_id = m.sensor_id AND latest.max_time = m.time"
    ).setParameters(subquery.getParameters()).orderBy("m.sensor_id", "ASC").getMany();
  }

  findLastBySensorId(sensorId: string): Promise<MedicionEntity | null> {
    return this.baseQuery().where("s.sensorId = :sensorId", { sensorId }).orderBy("m.time", "DESC").getOne();
  }

  findBySensorIdAndRange(sensorId: string, from: Date, to: Date): Promise<MedicionEntity[]> {
    return this.rangeQuery(sensorId, from, to).getMany();
  }

  findBySensorIdAndWindow(sensorId: string, from: Date, to: Date): Promise<MedicionEntity[]> {
    return this.rangeQuery(sensorId, from, to).getMany();
  }

  findLastByEquipoId(equipoId: string): Promise<MedicionEntity | null> {
    return this.baseQuery().where("e.equipoId = :equipoId", { equipoId }).orderBy("m.time", "DESC").getOne();
  }

  async createMany(entities: MedicionEntity[]): Promise<void> {
    await this.ormRepository.insert(entities);
  }

  private baseQuery(): SelectQueryBuilder<MedicionEntity> {
    return this.ormRepository.createQueryBuilder("m")
      .innerJoinAndSelect("m.sensor", "s")
      .leftJoinAndSelect("s.equipo", "e");
  }

  private rangeQuery(sensorId: string, from: Date, to: Date): SelectQueryBuilder<MedicionEntity> {
    return this.baseQuery().where("s.sensorId = :sensorId", { sensorId })
      .andWhere("m.time BETWEEN :from AND :to", { from, to }).orderBy("m.time", "ASC");
  }

  private applyTimeFilters(qb: SelectQueryBuilder<MedicionEntity>, from?: Date, to?: Date): void {
    if (from) qb.andWhere("m.time >= :from", { from });
    if (to) qb.andWhere("m.time <= :to", { to });
  }
}
