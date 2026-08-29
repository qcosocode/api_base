import { CreateSensorDTO } from "../dto/sensor/create-sensor.dto";
import { PaginatedSensorDTO, SensorDTO } from "../dto/sensor/sensor.dto";
import { UpdateSensorDTO } from "../dto/sensor/update-sensor.dto";
import { ConflictError, NotFoundError } from "../errors/app.error";
import { IEquipoRepository } from "../interfaces/repositories/equipo.repository.interface";
import { ISensorRepository, SensorRepositoryQuery } from "../interfaces/repositories/sensor.repository.interface";
import { SensorMapper } from "../mappers/sensor.mapper";

export class SensorService {
  constructor(
    private readonly sensorRepository: ISensorRepository,
    private readonly equipoRepository: IEquipoRepository
  ) {}

  async getAll(query: SensorRepositoryQuery, nestedEquipoId?: string): Promise<PaginatedSensorDTO> {
    if (nestedEquipoId) await this.requireEquipo(nestedEquipoId);
    const { data, total } = await this.sensorRepository.findPaginated(query);
    return { data: data.map(SensorMapper.toDTO), total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
  }

  async createSensor(dto: CreateSensorDTO): Promise<SensorDTO> {
    const equipo = await this.requireEquipo(dto.equipoId);
    if (await this.sensorRepository.existsByCodigoPCB(dto.codigoPCB)) {
      throw new ConflictError(`Ya existe un sensor con codigoPCB=${dto.codigoPCB}`);
    }
    return SensorMapper.toDTO(await this.sensorRepository.create(SensorMapper.toEntityForCreate(dto, equipo)));
  }

  async getSensorById(sensorId: string, equipoId?: string): Promise<SensorDTO> {
    const sensor = equipoId
      ? await this.sensorRepository.findByIdAndEquipoId(sensorId, equipoId)
      : await this.sensorRepository.findById(sensorId);
    if (!sensor) throw new NotFoundError(`Sensor no encontrado: ${sensorId}`);
    return SensorMapper.toDTO(sensor);
  }

  async updateSensor(sensorId: string, dto: UpdateSensorDTO, equipoId?: string): Promise<SensorDTO> {
    const entity = equipoId
      ? await this.sensorRepository.findByIdAndEquipoId(sensorId, equipoId)
      : await this.sensorRepository.findById(sensorId);
    if (!entity) throw new NotFoundError(`Sensor no encontrado: ${sensorId}`);

    const targetEquipoId = equipoId ?? dto.equipoId;
    const targetEquipo = targetEquipoId ? await this.requireEquipo(targetEquipoId) : undefined;
    return SensorMapper.toDTO(await this.sensorRepository.update(SensorMapper.applyUpdate(entity, dto, targetEquipo)));
  }

  async deleteSensor(sensorId: string, equipoId?: string): Promise<void> {
    if (equipoId) {
      const entity = await this.sensorRepository.findByIdAndEquipoId(sensorId, equipoId);
      if (!entity) throw new NotFoundError(`Sensor no encontrado: ${sensorId}`);
    }
    if (!await this.sensorRepository.delete(sensorId)) throw new NotFoundError(`Sensor no encontrado: ${sensorId}`);
  }

  private async requireEquipo(equipoId: string) {
    const equipo = await this.equipoRepository.findById(equipoId);
    if (!equipo) throw new NotFoundError("EQUIPO_NOT_FOUND");
    return equipo;
  }
}
