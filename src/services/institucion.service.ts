// src/services/institucion.service.ts

import { InstitucionRepository } from "../repositories/institucion.repository";
import {
  CreateInstitucionDTO,
  InstitucionQueryDTO,
  UpdateInstitucionDTO,
} from "../interfaces/institucion.interface";
import { Institucion } from "../entities/institucion";

export class InstitucionService {
  constructor(private readonly institucionRepository: InstitucionRepository) {}

  async getAll(query: InstitucionQueryDTO) {
    return this.institucionRepository.findPaginated(query);
  }

  async getById(id: string): Promise<Institucion> {
    if (!id) {
      throw new Error("INSTITUCION_ID_REQUIRED");
    }

    const institucion = await this.institucionRepository.findById(id);

    if (!institucion) {
      throw new Error("INSTITUCION_NOT_FOUND");
    }

    return institucion;
  }

  async create(input: CreateInstitucionDTO): Promise<Institucion> {
    if (!input.nombre || input.nombre.trim().length === 0) {
      throw new Error("NOMBRE_REQUIRED");
    }

    return this.institucionRepository.createOne({
      nombre: input.nombre.trim(),
      direccion: input.direccion?.trim() || undefined,
      telefono: input.telefono?.trim() || undefined,
    });
  }

  async update(id: string, input: UpdateInstitucionDTO): Promise<Institucion> {
    if (!id) {
      throw new Error("INSTITUCION_ID_REQUIRED");
    }

    if (
      input.nombre !== undefined &&
      input.nombre.trim().length === 0
    ) {
      throw new Error("NOMBRE_EMPTY");
    }

    const updated = await this.institucionRepository.updateById(id, {
      ...(input.nombre !== undefined ? { nombre: input.nombre.trim() } : {}),
      ...(input.direccion !== undefined ? { direccion: input.direccion.trim() } : {}),
      ...(input.telefono !== undefined ? { telefono: input.telefono.trim() } : {}),
    });

    if (!updated) {
      throw new Error("INSTITUCION_NOT_FOUND");
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error("INSTITUCION_ID_REQUIRED");
    }

    const deleted = await this.institucionRepository.deleteById(id);

    if (!deleted) {
      throw new Error("INSTITUCION_NOT_FOUND");
    }
  }
}