import { CreateSensorDTO } from "../dto/sensor/create-sensor.dto";
import { SensorDTO } from "../dto/sensor/sensor.dto";
import { UpdateSensorDTO } from "../dto/sensor/update-sensor.dto";
import { EquipoEntity } from "../entities/equipo.entity";
import { SensorEntity } from "../entities/sensor.entity";

export class SensorMapper {
  static toDTO(entity: SensorEntity): SensorDTO {
    return {
      sensorId: entity.sensorId,
      nombre: entity.nombre,
      codigoPCB: entity.codigoPCB,
      tipo: entity.tipo,
      modelo: entity.modelo,
      unidad: entity.unidad,
      is_on: entity.is_on,
      equipoId: entity.equipo?.equipoId ?? "",
    };
  }

  static toEntityForCreate(dto: CreateSensorDTO, equipo: EquipoEntity): SensorEntity {
    const entity = new SensorEntity();
    entity.nombre = dto.nombre;
    entity.codigoPCB = dto.codigoPCB;
    entity.tipo = dto.tipo;
    entity.modelo = dto.modelo;
    entity.unidad = dto.unidad;
    entity.is_on = dto.is_on ?? true;
    entity.equipo = equipo;
    return entity;
  }

  static applyUpdate(entity: SensorEntity, dto: UpdateSensorDTO, equipo?: EquipoEntity): SensorEntity {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre;
    if (dto.codigoPCB !== undefined) entity.codigoPCB = dto.codigoPCB;
    if (dto.tipo !== undefined) entity.tipo = dto.tipo;
    if (dto.modelo !== undefined) entity.modelo = dto.modelo;
    if (dto.unidad !== undefined) entity.unidad = dto.unidad;
    if (dto.is_on !== undefined) entity.is_on = dto.is_on;
    if (equipo) entity.equipo = equipo;
    return entity;
  }
}
