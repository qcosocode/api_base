// src/services/puntoMonitoreo.service.ts

import {
  PaginatedResponse,
  PuntoMonitoreoCreateDTO,
  PuntoMonitoreoQueryDTO,
  PuntoMonitoreoResponseDTO,
  PuntoMonitoreoUpdateDTO,
} from "../interfaces/punto-monitoreo.interface";
import { PuntoMonitoreoRepository } from "../repository/punto-monitoreo.respository";
import { PuntoMonitoreo } from "../entities/punto-monitoreo";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function toResponseDTO(p: PuntoMonitoreo): PuntoMonitoreoResponseDTO {
  return {
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion ?? null,
    categoria: p.categoria,
    institucionId: p.institucionId,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export class PuntoMonitoreoService {
  constructor(private readonly repo: PuntoMonitoreoRepository) {}

  async getAll(query: PuntoMonitoreoQueryDTO): Promise<PaginatedResponse<PuntoMonitoreoResponseDTO>> {
    const { data, total, page, limit } = await this.repo.findPaginated(query);
    return {
      data: data.map(toResponseDTO),
      total,
      page,
      limit,
    };
  }

  async getById(puntoMonitoreoId: string): Promise<PuntoMonitoreoResponseDTO> {
    const entity = await this.repo.findById(puntoMonitoreoId);
    if (!entity) throw new NotFoundError(`PuntoMonitoreo no existe: ${puntoMonitoreoId}`);
    return toResponseDTO(entity);
  }

  async create(dto: PuntoMonitoreoCreateDTO): Promise<PuntoMonitoreoResponseDTO> {
    if (!dto.nombre || dto.nombre.trim().length === 0) {
      throw new ValidationError("nombre es obligatorio");
    }
    if (!dto.institucionId) {
      throw new ValidationError("institucionId es obligatorio");
    }

    const created = await this.repo.createOne({
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion?.trim() || undefined,
      categoria:dto.categoria?.trim(),
      institucionId: dto.institucionId,
    });

    return toResponseDTO(created);
  }

  async update(puntoMonitoreoId: string, dto: PuntoMonitoreoUpdateDTO): Promise<PuntoMonitoreoResponseDTO> {
    const patch: Partial<PuntoMonitoreo> = {};

    if (dto.nombre !== undefined) {
      const n = dto.nombre.trim();
      if (n.length === 0) throw new ValidationError("nombre no puede ser vacío");
      patch.nombre = n;
    }

    if (dto.descripcion !== undefined) {
        patch.descripcion =
        dto.descripcion === undefined || dto.descripcion === null
        ? undefined
        : dto.descripcion.trim();
    }

    const updated = await this.repo.updateById(puntoMonitoreoId, patch);
    if (!updated) throw new NotFoundError(`PuntoMonitoreo no existe: ${puntoMonitoreoId}`);

    return toResponseDTO(updated);
  }

  async remove(puntoMonitoreoId: string): Promise<void> {
    const ok = await this.repo.deleteById(puntoMonitoreoId);
    if (!ok) throw new NotFoundError(`PuntoMonitoreo no existe: ${puntoMonitoreoId}`);
  }
}
