import { MedicionDTO, PaginatedMedicionDTO } from "../dto/medicion/medicion.dto";
import { ValidatedMedicionQueryDTO } from "../dto/medicion/medicion-query.dto";
import { ValidatedMedicionRangeQueryDTO } from "../dto/medicion/medicion-range-query.dto";
import { ValidatedMedicionWindowQueryDTO } from "../dto/medicion/medicion-window-query.dto";
import { NotFoundError } from "../errors/app.error";
import { IMedicionRepository } from "../interfaces/repositories/medicion.repository.interface";
import { ISensorRepository } from "../interfaces/repositories/sensor.repository.interface";
import { MedicionMapper } from "../mappers/medicion.mapper";
import { MedicionEntity } from "../entities/medicion.entity";

export class MedicionService {
  constructor(
    private readonly medicionRepository: IMedicionRepository,
    private readonly sensorRepository: ISensorRepository
  ) {}

  async getAll(query: ValidatedMedicionQueryDTO): Promise<PaginatedMedicionDTO> {
    const result = await this.medicionRepository.findPaged({
      offset: (query.page - 1) * query.limit,
      limit: query.limit,
      from: query.from,
      to: query.to,
      sensorId: query.sensorId,
      equipoId: query.equipoId,
    });
    return this.toPage(result, query);
  }

  async getLastPerSensor(): Promise<MedicionDTO[]> {
    return MedicionMapper.toDTOs(await this.medicionRepository.findLastPerSensor());
  }

  async getBySensor(sensorId: string, query: ValidatedMedicionQueryDTO): Promise<PaginatedMedicionDTO> {
    const result = await this.medicionRepository.findPagedBySensorId(sensorId, {
      offset: (query.page - 1) * query.limit,
      limit: query.limit,
      from: query.from,
      to: query.to,
    });
    return this.toPage(result, query);
  }

  async getLastBySensor(sensorId: string): Promise<MedicionDTO | null> {
    const entity = await this.medicionRepository.findLastBySensorId(sensorId);
    return entity ? MedicionMapper.toDTO(entity) : null;
  }

  async getByEquipoSensor(equipoId: string, sensorId: string, query: ValidatedMedicionQueryDTO): Promise<PaginatedMedicionDTO> {
    await this.ensureSensorBelongsToEquipo(equipoId, sensorId);
    return this.getBySensor(sensorId, query);
  }

  async getLast(equipoId: string, sensorId: string): Promise<MedicionDTO> {
    await this.ensureSensorBelongsToEquipo(equipoId, sensorId);
    const entity = await this.medicionRepository.findLastBySensorId(sensorId);
    if (!entity) throw new NotFoundError("MEDICION_NOT_FOUND");
    return MedicionMapper.toDTO(entity);
  }

  async getByRange(equipoId: string, sensorId: string, query: ValidatedMedicionRangeQueryDTO): Promise<MedicionDTO[]> {
    await this.ensureSensorBelongsToEquipo(equipoId, sensorId);
    return MedicionMapper.toDTOs(await this.medicionRepository.findBySensorIdAndRange(sensorId, query.from, query.to));
  }

  async getByWindow(equipoId: string, sensorId: string, query: ValidatedMedicionWindowQueryDTO): Promise<MedicionDTO[]> {
    await this.ensureSensorBelongsToEquipo(equipoId, sensorId);
    const to = new Date();
    const duration = query.hours * 60 * 60 * 1000 + query.minutes * 60 * 1000;
    const from = new Date(to.getTime() - duration);
    return MedicionMapper.toDTOs(await this.medicionRepository.findBySensorIdAndWindow(sensorId, from, to));
  }

  async getBySensorAndRange(sensorId: string, query: ValidatedMedicionRangeQueryDTO): Promise<MedicionDTO[]> {
    return MedicionMapper.toDTOs(await this.medicionRepository.findBySensorIdAndRange(sensorId, query.from, query.to));
  }

  async getBySensorAndWindow(sensorId: string, query: ValidatedMedicionWindowQueryDTO): Promise<MedicionDTO[]> {
    const to = new Date();
    const from = new Date(to.getTime() - query.hours * 60 * 60 * 1000 - query.minutes * 60 * 1000);
    return MedicionMapper.toDTOs(await this.medicionRepository.findBySensorIdAndWindow(sensorId, from, to));
  }

  async getLastByEquipo(equipoId: string): Promise<MedicionDTO | null> {
    const entity = await this.medicionRepository.findLastByEquipoId(equipoId);
    return entity ? MedicionMapper.toDTO(entity) : null;
  }

  private async ensureSensorBelongsToEquipo(equipoId: string, sensorId: string): Promise<void> {
    if (!await this.sensorRepository.findByIdAndEquipoId(sensorId, equipoId)) {
      throw new NotFoundError("SENSOR_NOT_FOUND");
    }
  }

  private toPage(
    result: { data: MedicionEntity[]; total: number },
    query: ValidatedMedicionQueryDTO
  ): PaginatedMedicionDTO {
    return {
      data: MedicionMapper.toDTOs(result.data),
      total: result.total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(result.total / query.limit),
      from: query.from,
      to: query.to,
    };
  }
}
