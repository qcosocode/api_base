import { CreateEquipoDTO } from "../dto/equipo/create-equipo.dto";
import { EquipoDTO } from "../dto/equipo/equipo.dto";
import { UpdateEquipoDTO } from "../dto/equipo/update-equipo.dto";
import { EquipoEntity } from "../entities/equipo.entity";

export class EquipoMapper {
  static toDTO(entity: EquipoEntity): EquipoDTO {
    return {
      equipoId: entity.equipoId,
      nombre: entity.nombre,
      modelo: entity.modelo,
      descripcion: entity.descripcion,
      isActive: entity.isActive,
      puntoMonitoreoId: entity.puntoMonitoreoId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toEntityForCreate(dto: CreateEquipoDTO): EquipoEntity {
    const entity = new EquipoEntity();
    entity.nombre = dto.nombre;
    entity.modelo = dto.modelo;
    entity.descripcion = dto.descripcion;
    entity.isActive = dto.isActive ?? true;
    entity.puntoMonitoreoId = dto.puntoMonitoreoId ?? null;
    return entity;
  }

  static applyUpdate(entity: EquipoEntity, dto: UpdateEquipoDTO): EquipoEntity {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre;
    if (dto.modelo !== undefined) entity.modelo = dto.modelo;
    if (dto.descripcion !== undefined) entity.descripcion = dto.descripcion;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    if (dto.puntoMonitoreoId !== undefined) entity.puntoMonitoreoId = dto.puntoMonitoreoId;
    return entity;
  }
}
