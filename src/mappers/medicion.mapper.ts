import { MedicionDTO } from "../dto/medicion/medicion.dto";
import { MedicionEntity } from "../entities/medicion.entity";

export class MedicionMapper {
  static toDTO(entity: MedicionEntity): MedicionDTO {
    return { sensor_id: entity.sensor_id, time: entity.time, valor: entity.valor };
  }

  static toDTOs(entities: MedicionEntity[]): MedicionDTO[] {
    return entities.map(MedicionMapper.toDTO);
  }
}
