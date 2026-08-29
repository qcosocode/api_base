import { CreateSensorDTO } from "../dto/sensor/create-sensor.dto";
import { SensorQueryDTO } from "../dto/sensor/sensor-query.dto";
import { UpdateSensorDTO } from "../dto/sensor/update-sensor.dto";
import { ValidationError } from "../errors/app.error";
import { parseBool, parseLimit, parsePage } from "../http/query.parser";
import { SensorRepositoryQuery } from "../interfaces/repositories/sensor.repository.interface";

export class SensorValidator {
  static validateCreate(body: Partial<CreateSensorDTO>, routeEquipoId?: string): CreateSensorDTO {
    const required = ["nombre", "codigoPCB", "tipo", "modelo", "unidad"] as const;
    for (const field of required) {
      if (typeof body?.[field] !== "string" || !body[field]?.trim()) {
        throw new ValidationError(`Falta campo requerido: ${field}`);
      }
    }
    const equipoId = routeEquipoId ?? body.equipoId;
    if (!equipoId) throw new ValidationError("Falta campo requerido: equipoId");
    if (body.is_on !== undefined && typeof body.is_on !== "boolean") {
      throw new ValidationError("is_on debe ser boolean");
    }
    return { ...body, equipoId } as CreateSensorDTO;
  }

  static validateUpdate(body: UpdateSensorDTO): UpdateSensorDTO {
    const fields: (keyof UpdateSensorDTO)[] = ["nombre", "codigoPCB", "tipo", "modelo", "unidad", "is_on", "equipoId"];
    if (!body || !fields.some(field => body[field] !== undefined)) {
      throw new ValidationError("Body vacío: no hay campos para actualizar");
    }
    if (body.is_on !== undefined && typeof body.is_on !== "boolean") {
      throw new ValidationError("is_on debe ser boolean");
    }
    return body;
  }

  static validateQuery(query: SensorQueryDTO, routeEquipoId?: string): SensorRepositoryQuery {
    if (query.activo !== undefined && query.activo !== "true" && query.activo !== "false") {
      throw new ValidationError("activo debe ser 'true' o 'false'");
    }
    return {
      page: parsePage(query.page, 1),
      limit: parseLimit(query.limit, 50, 200),
      equipoId: routeEquipoId ?? query.equipoId,
      tipo: query.tipo,
      activo: parseBool(query.activo),
    };
  }
}
