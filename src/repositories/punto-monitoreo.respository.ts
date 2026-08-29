// src/repositories/puntoMonitoreo.repository.ts

import { Repository } from "typeorm";
import { PuntoMonitoreo } from "../entities/punto-monitoreo";
import { PuntoMonitoreoQueryDTO } from "../interfaces/punto-monitoreo.interface";
import { AppDataSource } from "../data-source/data-source";

export interface PuntoMonitoreoFindPaginatedResult {
  data: PuntoMonitoreo[];
  total: number;
  page: number;
  limit: number;
}

export class PuntoMonitoreoRepository {

     private readonly ormRepo: Repository<PuntoMonitoreo>;
  constructor(){
    this.ormRepo = AppDataSource.getRepository(PuntoMonitoreo);
  }
     
      
   // private readonly ormRepo: Repository<PuntoMonitoreo>) {}

  async findPaginated(query: PuntoMonitoreoQueryDTO): Promise<PuntoMonitoreoFindPaginatedResult> {
    const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "20", 10) || 20));
    const skip = (page - 1) * limit;

    const qb = this.ormRepo.createQueryBuilder("p");

    if (query.institucionId) {
      qb.andWhere("p.institucionId = :institucionId", { institucionId: query.institucionId });
    }

    if (query.search && query.search.trim().length > 0) {
      const s = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere("(LOWER(p.nombre) LIKE :s OR LOWER(p.descripcion) LIKE :s)", { s });
    }

    qb.orderBy("p.createdAt", "DESC").skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findById(id: string): Promise<PuntoMonitoreo | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async createOne(data: Partial<PuntoMonitoreo>): Promise<PuntoMonitoreo> {
    const entity = this.ormRepo.create(data);
    return this.ormRepo.save(entity);
  }

  async updateById(id: string, patch: Partial<PuntoMonitoreo>): Promise<PuntoMonitoreo | null> {
    // preload = trae entidad existente + aplica patch + retorna undefined si no existe
    const preloaded = await this.ormRepo.preload({ id, ...patch });
    if (!preloaded) return null;
    return this.ormRepo.save(preloaded);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.ormRepo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
