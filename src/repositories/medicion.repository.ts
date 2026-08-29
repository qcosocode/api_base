
// src/repository/medicion.repository.ts

import { Repository } from "typeorm";
import { AppDataSource } from "../data-source/data-source";
import { BaseRepository } from "./base.repository";
import { Medicion } from "../entities/medicion";
import { Between } from "typeorm";
import { GetAllMedicionesQuery, PaginatedResponse, GetBySensorAndRangeQuery, GetBySensorAndWindowQuery } from "../interfaces/medicion.interface";

export class MedicionRepository extends BaseRepository<Medicion> {

  constructor() {
    super(AppDataSource.getRepository(Medicion));
  }
   
  

  private parsePageLimit(query: { page?: string; limit?: string }) {
    const page = Math.max(parseInt(query.page || "1", 10), 1);
    const limit = Math.max(parseInt(query.limit || "50", 10), 1);
    return { page, limit };
  }




   async findAllPaginated(query : GetAllMedicionesQuery): Promise<PaginatedResponse<Medicion>>  {

      {
    const { page, limit } = this.parsePageLimit(query);

    console.log(page);
    console.log( limit);

    const qb = this.ormRepository
      .createQueryBuilder("m")
      .leftJoinAndSelect("m.sensor", "s")
      .leftJoinAndSelect("s.equipo", "e");

    if (query.sensor_id) {
      qb.andWhere("s.sensor_id = :sensorId", {
        sensorId: query.sensor_id,
      });
    }

    if (query.equipo_id) {
      qb.andWhere("e.equipoID = :equipoId", {
        equipoId: query.equipo_id,
      });
    }

    if (query.from) {
      qb.andWhere("m.time >= :from", {
        from: new Date(query.from),
      });
    }

    if (query.to) {
      qb.andWhere("m.time <= :to", {
        to: new Date(query.to),
      });
    }

    qb.orderBy("m.time", "DESC")
      .skip((page - 1) * limit)
      .take(limit);
  
     console.log(qb.getSql());
     console.log(qb.getParameters());

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit) || 1;
    console.log(total);
    return {
      data,
      total,
      page,
      limit,
      totalPages,
      from: query.from,
      to: query.to,
    };
  }
   }

  // ---------------------------------------------------------------------------
  // GET /mediciones/ultima  (una última por cada sensor)
  // ---------------------------------------------------------------------------
  async findLastPerSensor(): Promise<Medicion[]> {
    // Subquery: max(time) por sensor
    const subquery = this.ormRepository
      .createQueryBuilder("m2")
      .select("MAX(m2.time)", "max_time")
      .addSelect("m2.sensor_id", "sensor_id")
      .groupBy("m2.sensor_id");

    const qb = this.ormRepository
      .createQueryBuilder("m")
      .innerJoin(
        "(" + subquery.getQuery() + ")",
        "sub",
        "sub.sensor_id = m.sensor_id AND sub.max_time = m.time"
      )
      .leftJoinAndSelect("m.sensor", "s")
      .leftJoinAndSelect("s.equipo", "e")
      .orderBy("m.sensor_id", "ASC");

    // Si necesitás params del subquery:
    qb.setParameters(subquery.getParameters());

    return qb.getMany();
  }


   // ---------------------------------------------------------------------------
  // GET /mediciones/sensor/:sensorId
  // ---------------------------------------------------------------------------
  async findBySensorPaginated(
    sensorId: string,
    query: GetAllMedicionesQuery
  ): Promise<PaginatedResponse<Medicion>> {
    const { page, limit } = this.parsePageLimit(query);

    const qb = this.ormRepository
      .createQueryBuilder("m")
      .innerJoinAndSelect("m.sensor", "s")
      .leftJoinAndSelect("s.equipo", "e")
      .where("s.sensor_id = :sensorId", { sensorId });

    if (query.from) {
      qb.andWhere("m.time >= :from", {
        from: new Date(query.from),
      });
    }

    if (query.to) {
      qb.andWhere("m.time <= :to", {
        to: new Date(query.to),
      });
    }

    qb.orderBy("m.time", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      from: query.from,
      to: query.to,
    };
  }

    // ---------------------------------------------------------------------------
  // GET /mediciones/sensor/:sensorId/ultima
  // ---------------------------------------------------------------------------
  async findLastBySensor(sensorId: string): Promise<Medicion | null> {
    return this.ormRepository
      .createQueryBuilder("m")
      .innerJoinAndSelect("m.sensor", "s")
      .leftJoinAndSelect("s.equipo", "e")
      .where("s.sensor_id = :sensorId", { sensorId })
      .orderBy("m.time", "DESC")
      .getOne();
  }

  // ---------------------------------------------------------------------------
  // GET /mediciones/sensor/:sensorId/rango
  // ---------------------------------------------------------------------------
  async findBySensorAndRange(
    sensorId: string,
    query: GetBySensorAndRangeQuery
  ): Promise<Medicion[]> {
    const from = new Date(query.from);
    const to = new Date(query.to);

    return this.ormRepository
      .createQueryBuilder("m")
      .innerJoinAndSelect("m.sensor", "s")
      .leftJoinAndSelect("s.equipo", "e")
      .where("s.sensor_id = :sensorId", { sensorId })
      .andWhere("m.time BETWEEN :from AND :to", { from, to })
      .orderBy("m.time", "ASC")
      .getMany();
  }

  // ---------------------------------------------------------------------------
  // GET /mediciones/sensor/:sensorId/window
  // ---------------------------------------------------------------------------
  async findBySensorAndWindow(
    sensorId: string,
    query: GetBySensorAndWindowQuery
  ): Promise<Medicion[]> {
    const now = new Date();
    const hours = parseInt(query.hours || "0", 10);
    let minutes = parseInt(query.minutes || "0", 10);
    console.log(query);
    console.log(query.hours);
    if (!hours && !minutes) minutes = 10;

    const from = new Date(now.getTime() - (hours * 60 + minutes) * 60 * 1000);

    return this.ormRepository
      .createQueryBuilder("m")
      .innerJoinAndSelect("m.sensor", "s")
      .leftJoinAndSelect("s.equipo", "e")
      .where("s.sensor_id = :sensorId", { sensorId })
      .andWhere("m.time BETWEEN :from AND :to", { from, to: now })
      .orderBy("m.time", "ASC")
      .getMany();
  }

  // ---------------------------------------------------------------------------
  // GET /mediciones/equipo/:equipoId/ultima
  // ---------------------------------------------------------------------------
  async findLastByEquipo(equipoId: string): Promise<Medicion | null> {
    return this.ormRepository
      .createQueryBuilder("m")
      .innerJoinAndSelect("m.sensor", "s")
      .innerJoinAndSelect("s.equipo", "e")
      .where("e.equipoID = :equipoId", { equipoId })
      .orderBy("m.time", "DESC")
      .getOne();
  }



  /**
   * Obtiene todas las mediciones de un sensor por su sensor_id
   */
  async findBySensorId(sensorId: string): Promise<Medicion[]> {
    return this.ormRepository.find({
      where: { sensor: { sensorId: sensorId } },
      order: { time: "DESC" },
    });
  }

  /**
   * Obtiene la última medición registrada para un sensor
   */
  async findLastBySensorId(sensorId: string): Promise<Medicion | null> {
    return this.ormRepository.findOne({
      where: { sensor: { sensorId: sensorId } },
      order: { time: "DESC" },
    });
  }

  /**
   * Obtiene mediciones dentro de un rango de tiempo (TimescaleDB optimizado)
   */
  async findInRange(sensorId: string, from: Date, to: Date): Promise<Medicion[]> {
    return this.ormRepository.find({
      where: {
        sensor: { sensorId: sensorId },
        time: Between(from, to),
      },
      order: { time: "ASC" },
    });
  }

  /**
   * Inserta muchas mediciones a la vez (Timescale ideal)
   * Usa insert() porque es más rápido que save para grandes volúmenes
   */
  async createMany(data: Partial<Medicion>[]): Promise<void> {
    await this.ormRepository.insert(data);
  }
}



