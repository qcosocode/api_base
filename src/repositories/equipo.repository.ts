import { Repository } from "typeorm";
import { AppDataSource } from "../data-source/data-source";
import { EquipoEntity } from "../entities/equipo.entity";
import { EquipoRepositoryFilters, IEquipoRepository } from "../interfaces/repositories/equipo.repository.interface";

export class EquipoRepository implements IEquipoRepository {
  private readonly ormRepository: Repository<EquipoEntity>;
  constructor() { this.ormRepository = AppDataSource.getRepository(EquipoEntity); }

  async findPaged(page: number, limit: number, filters: EquipoRepositoryFilters): Promise<{ data: EquipoEntity[]; total: number }> {
    const qb = this.ormRepository.createQueryBuilder("e");
    if (filters.equipoID) qb.andWhere("e.equipoId = :equipoId", { equipoId: filters.equipoID });
    if (filters.nombre) qb.andWhere("LOWER(e.nombre) LIKE :nombre", { nombre: `%${filters.nombre.toLowerCase()}%` });
    if (filters.modelo) qb.andWhere("LOWER(e.modelo) LIKE :modelo", { modelo: `%${filters.modelo.toLowerCase()}%` });
    if (filters.puntoMonitoreoId) qb.andWhere("e.puntoMonitoreoId = :puntoMonitoreoId", { puntoMonitoreoId: filters.puntoMonitoreoId });
    if (typeof filters.isActive === "boolean") qb.andWhere("e.isActive = :isActive", { isActive: filters.isActive });
    const [data, total] = await qb.orderBy("e.createdAt", "DESC").skip((page - 1) * limit).take(limit).getManyAndCount();
    return { data, total };
  }
  findById(equipoId: string): Promise<EquipoEntity | null> { return this.ormRepository.findOne({ where: { equipoId } }); }
  create(entity: EquipoEntity): Promise<EquipoEntity> { return this.ormRepository.save(entity); }
  update(entity: EquipoEntity): Promise<EquipoEntity> { return this.ormRepository.save(entity); }
  async delete(equipoId: string): Promise<boolean> {
    const result = await this.ormRepository.delete({ equipoId });
    return (result.affected ?? 0) > 0;
  }
}
