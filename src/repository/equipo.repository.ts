import { Repository } from "typeorm";
import { AppDataSource } from "../data-source/data-source";
import { Equipo } from "../entities/equipo";
import { IEquipoFilters } from "../interfaces/equipo.interface";


 /* Cual es la diferencia entre un interface y un type */
type EquipoFilters = {
  equipoID?: string;
  nombre?: string;
  modelo?: string;
  puntoMonitoreoId?: string;
  isActive?: boolean;
};
export default EquipoFilters;

export class EquipoRepository {
  private readonly ormRepository: Repository<Equipo>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Equipo);
  }

  async findPaged(
    page: number,
    limit: number,
    filters: IEquipoFilters
  ): Promise<{ data: Equipo[]; total: number }> {
    const qb = this.ormRepository.createQueryBuilder("e");

    // filtros opcionales
    if (filters.equipoID) {
      qb.andWhere("e.equipoID = :equipoID", { equipoID: filters.equipoID });
    }

    if (filters.nombre) {
      qb.andWhere("LOWER(e.nombre) LIKE :nombre", {
        nombre: `%${filters.nombre.toLowerCase()}%`,
      });
    }

    if (filters.modelo) {
      qb.andWhere("LOWER(e.modelo) LIKE :modelo", {
        modelo: `%${filters.modelo.toLowerCase()}%`,
      });
    }

    if (filters.puntoMonitoreoId) {
      qb.andWhere("e.puntoMonitoreoId = :puntoMonitoreoId", {
        puntoMonitoreoId: filters.puntoMonitoreoId,
      });
    }

    if (typeof filters.isActive === "boolean") {
      qb.andWhere("e.isActive = :isActive", { isActive: filters.isActive });
    }

    const skip = (page - 1) * limit;

    const [data, total] = await qb
      .orderBy("e.createdAt", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findById(equipoId: string): Promise<Equipo | null> {
    return this.ormRepository.findOne({
      where: { equipoId: equipoId as any },
    });
  }

  async createEquipo(payload: Partial<Equipo>): Promise<Equipo> {
    const entity = this.ormRepository.create(payload);
    return this.ormRepository.save(entity);
  }

  async updateEquipo(equipoId: string, payload: Partial<Equipo>): Promise<Equipo> {
    await this.ormRepository.update({ equipoId: equipoId as any }, payload);

    const updated = await this.findById(equipoId);
    if (!updated) throw new Error("EQUIPO_NOT_FOUND");
    return updated;
  }

  async deleteEquipo(equipoId: string): Promise<boolean> {
    const result = await this.ormRepository.delete({ equipoId: equipoId as any });
    return (result.affected ?? 0) > 0;
  }

 async assignPuntoMonitoreo(
    equipoId: string,
    puntoMonitoreoId: string | null
  ): Promise<Equipo> {
    await this.ormRepository.update(
      { equipoId: equipoId as any },
      { puntoMonitoreoId: puntoMonitoreoId ?? null }
    );

    const updated = await this.findById(equipoId);
    if (!updated) throw new Error("EQUIPO_NOT_FOUND");
    return updated;
  }


}
