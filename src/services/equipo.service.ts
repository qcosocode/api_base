import { Equipo } from "../entities/equipo";
import { IEquipoFilters } from "../interfaces/equipo.interface";
import EquipoFilters, { EquipoRepository } from "../repository/equipo.repository";

export class EquipoService {
  constructor(private readonly equipoRepository: EquipoRepository) {}

  async getAll(params: { page: number; limit: number; filters: IEquipoFilters }) {
    const { page, limit, filters } = params;

    const { data, total } = await this.equipoRepository.findPaged(page, limit, filters);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters,
    };
  }

  async getById(equipoId: string) {
    const equipo = await this.equipoRepository.findById(equipoId);
    if (!equipo) throw new Error("EQUIPO_NOT_FOUND");
    return equipo;
  }

  async create(payload: Partial<Equipo>) {
    // validaciones mínimas
   // if (!payload.equipoId) throw new Error("equipoID_REQUIRED");
    if (!payload.nombre) throw new Error("nombre_REQUIRED");

    

    // set defaults si no vienen
    if (typeof payload.isActive !== "boolean") payload.isActive = true;

    return this.equipoRepository.createEquipo(payload);
  }

  async update(equipoId: string, payload: Partial<Equipo>) {
    // evitar cambiar el id
    if (payload.equipoId && String(payload.equipoId) !== equipoId) {
      throw new Error("equipoID_CANNOT_CHANGE");
    }

    return this.equipoRepository.updateEquipo(equipoId, payload);
  }


 async assignPuntoMonitoreo(equipoId: string, puntoMonitoreoId: string | null) {
    // Acá podrías validar formato UUID si querés (zod, regex, etc.)
    return this.equipoRepository.assignPuntoMonitoreo(equipoId, puntoMonitoreoId);
  }



  async delete(equipoId: string) {
    const ok = await this.equipoRepository.deleteEquipo(equipoId);
    if (!ok) throw new Error("EQUIPO_NOT_FOUND");
    return ok;
  }
}
