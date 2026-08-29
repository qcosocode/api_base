import { CreateEquipoDTO } from "../dto/equipo/create-equipo.dto";
import { EquipoFiltersDTO } from "../dto/equipo/equipo.dto";
import { EquipoQueryDTO } from "../dto/equipo/equipo-query.dto";
import { UpdateEquipoDTO } from "../dto/equipo/update-equipo.dto";
import { ValidationError } from "../errors/app.error";
import { parseLimit, parsePage } from "../http/query.parser";

export class EquipoValidator {
  static validateCreate(body: CreateEquipoDTO): CreateEquipoDTO {
    if (!body || typeof body.nombre !== "string" || !body.nombre.trim()) {
      throw new ValidationError("NOMBRE_REQUIRED");
    }
    this.validateBoolean(body.isActive, "isActive");
    return body;
  }

  static validateUpdate(body: UpdateEquipoDTO): UpdateEquipoDTO {
    if (!body || Object.keys(body).length === 0) throw new ValidationError("Body vacío: no hay campos para actualizar");
    if (body.nombre !== undefined && (typeof body.nombre !== "string" || !body.nombre.trim())) {
      throw new ValidationError("NOMBRE_REQUIRED");
    }
    this.validateBoolean(body.isActive, "isActive");
    return body;
  }

  static validateQuery(query: EquipoQueryDTO): { page: number; limit: number; filters: EquipoFiltersDTO } {
    let isActive: boolean | undefined;
    if (query.is_active !== undefined) {
      if (query.is_active !== "true" && query.is_active !== "false") {
        throw new ValidationError("is_active debe ser 'true' o 'false'");
      }
      isActive = query.is_active === "true";
    }
    return {
      page: parsePage(query.page, 1),
      limit: parseLimit(query.limit, 50, 200),
      filters: {
        equipoID: query.equipoID,
        nombre: query.nombre,
        modelo: query.modelo,
        puntoMonitoreoId: query.punto_monitoreo_id,
        isActive,
      },
    };
  }

  private static validateBoolean(value: unknown, field: string): void {
    if (value !== undefined && typeof value !== "boolean") {
      throw new ValidationError(`${field} debe ser boolean`);
    }
  }
}
