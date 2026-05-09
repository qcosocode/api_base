// src/repositories/institucion.repository.ts

import { Repository } from "typeorm";
import { Institucion } from "../entities/institucion";
import { InstitucionQueryDTO } from "../interfaces/institucion.interface";
import { AppDataSource } from "../data-source/data-source";

export interface InstitucionFindPaginatedResult {
  data: Institucion[];
  total: number;
  page: number;
  limit: number;
}

export class InstitucionRepository {
  private readonly ormRepo: Repository<Institucion>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Institucion);
  }

  async findPaginated(
    query: InstitucionQueryDTO
  ): Promise<InstitucionFindPaginatedResult> {
    
    /** Esto no tiene que estar aca PASAR AL CONTROLLER */
    const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);   
    const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "20", 10) || 20));
    const skip = (page - 1) * limit;
   

      /** Esto no tiene que estar aca  */
    const qb = this.ormRepo.createQueryBuilder("i");

    if (query.search && query.search.trim().length > 0) {
      const s = `%${query.search.trim().toLowerCase()}%`;

      qb.andWhere(
        `(LOWER(i.nombre) LIKE :s OR LOWER(i.direccion) LIKE :s OR LOWER(i.telefono) LIKE :s)`,
        { s }
      );
    }

    qb.orderBy("i.createdAt", "DESC").skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<Institucion | null> {
    return this.ormRepo.findOne({
      where: { id },
    });
  }

  async createOne(data: Partial<Institucion>): Promise<Institucion> {
    const entity = this.ormRepo.create(data);
    return this.ormRepo.save(entity);
  }

  async updateById(
    id: string,
    patch: Partial<Institucion>
  ): Promise<Institucion | null> {
    const preloaded = await this.ormRepo.preload({
      id,
      ...patch,
    });

    if (!preloaded) return null;

    return this.ormRepo.save(preloaded);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.ormRepo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}