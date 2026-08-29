import { CreateEquipoDTO } from "../dto/equipo/create-equipo.dto";
import { EquipoFiltersDTO, EquipoDTO, PaginatedEquipoDTO } from "../dto/equipo/equipo.dto";
import { UpdateEquipoDTO } from "../dto/equipo/update-equipo.dto";
import { NotFoundError } from "../errors/app.error";
import { IEquipoRepository } from "../interfaces/repositories/equipo.repository.interface";
import { EquipoMapper } from "../mappers/equipo.mapper";

export class EquipoService {
  constructor(private readonly equipoRepository: IEquipoRepository) {}
  async getAll(params: { page: number; limit: number; filters: EquipoFiltersDTO }): Promise<PaginatedEquipoDTO> {
    const { page, limit, filters } = params;
    const { data, total } = await this.equipoRepository.findPaged(page, limit, filters);
    return { data: data.map(EquipoMapper.toDTO), total, page, limit, totalPages: Math.ceil(total / limit), filters };
  }
  async getById(equipoId: string): Promise<EquipoDTO> {
    const entity = await this.equipoRepository.findById(equipoId);
    if (!entity) throw new NotFoundError("EQUIPO_NOT_FOUND");
    return EquipoMapper.toDTO(entity);
  }
  async create(dto: CreateEquipoDTO): Promise<EquipoDTO> {
    return EquipoMapper.toDTO(await this.equipoRepository.create(EquipoMapper.toEntityForCreate(dto)));
  }
  async update(equipoId: string, dto: UpdateEquipoDTO): Promise<EquipoDTO> {
    const entity = await this.equipoRepository.findById(equipoId);
    if (!entity) throw new NotFoundError("EQUIPO_NOT_FOUND");
    return EquipoMapper.toDTO(await this.equipoRepository.update(EquipoMapper.applyUpdate(entity, dto)));
  }
  assignPuntoMonitoreo(equipoId: string, puntoMonitoreoId: string | null): Promise<EquipoDTO> {
    return this.update(equipoId, { puntoMonitoreoId });
  }
  async delete(equipoId: string): Promise<void> {
    if (!await this.equipoRepository.delete(equipoId)) throw new NotFoundError("EQUIPO_NOT_FOUND");
  }
}
