




// import { Repository } from "typeorm";
// import { AppDataSource } from "../data-source/data-source";
// import { MiEntidad } from "../entities/mi-entidad";
// import { MiEntidadQueryDTO } from "../interfaces/mi-entidad";

// export interface FindPaginatedResult<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
// }

// export class MiEntidadRepository {
//   private readonly ormRepo: Repository<MiEntidad>;

//   constructor() {
//     this.ormRepo = AppDataSource.getRepository(MiEntidad);
//   }

//   async findPaginated(
//     query: MiEntidadQueryDTO
//   ): Promise<FindPaginatedResult<MiEntidad>> {
//     const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
//     const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? "20", 10) || 20));
//     const skip = (page - 1) * limit;

//     const qb = this.ormRepo.createQueryBuilder("e");

//     // filtros dinámicos
//     if (query.search && query.search.trim()) {
//       const s = `%${query.search.trim().toLowerCase()}%`;

//       qb.andWhere(
//         `(LOWER(e.nombre) LIKE :s)`,
//         { s }
//       );
//     }

//     qb.orderBy("e.createdAt", "DESC").skip(skip).take(limit);

//     const [data, total] = await qb.getManyAndCount();

//     return { data, total, page, limit };
//   }

//   async findById(id: string): Promise<MiEntidad | null> {
//     return this.ormRepo.findOne({
//       where: { id },
//     });
//   }

//   async createOne(data: Partial<MiEntidad>): Promise<MiEntidad> {
//     const entity = this.ormRepo.create(data);
//     return this.ormRepo.save(entity);
//   }

//   async updateById(
//     id: string,
//     patch: Partial<MiEntidad>
//   ): Promise<MiEntidad | null> {
//     const preloaded = await this.ormRepo.preload({
//       id,
//       ...patch,
//     });

//     if (!preloaded) return null;

//     return this.ormRepo.save(preloaded);
//   }

//   async deleteById(id: string): Promise<boolean> {
//     const result = await this.ormRepo.delete({ id });
//     return (result.affected ?? 0) > 0;
//   }
// }