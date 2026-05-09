import { Sensor } from "../entities/sensor";
import { GetSensorsInput, PaginatedResponse, SensorCreateDTO, SensorQueryDTO, SensorResponseDTO, SensorUpdateDTO } from "../interfaces/sensor.interface.interface";
import { SensorRepository } from "../repository/sensor.repository";




export class SensorService {

    // private  _repo : SensorRepository  no es necesario 
    // colocando el modificador de acceso en el constructor ya se crea y asigna la variable repo
   constructor( private repo : SensorRepository) {
   }

   async getAll(query: GetSensorsInput): Promise<PaginatedResponse<SensorResponseDTO>> {

    // const page = this.parsePage(query.page);
    // const limit = this.parseLimit(query.limit);

       const page =  query.page;
       const limit = query.limit;

    

    const { data, total } = await this.repo.findPaginated(query);
    

    return {
      data: data.map(this.toSensorResponseDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createSensor(dto: SensorCreateDTO): Promise<SensorResponseDTO> {
    
    if (await this.repo.existsByCodigoPCB(dto.codigoPCB)) {
      throw new Error(`Ya existe un sensor con codigoPCB=${dto.codigoPCB}`);
    }

    const sensor = new Sensor();
    sensor.nombre = dto.nombre;
    sensor.codigoPCB = dto.codigoPCB;
    sensor.tipo = dto.tipo;
    sensor.modelo = dto.modelo;
    sensor.unidad = dto.unidad;
    sensor.is_on = dto.is_on ?? true;

    // asociar equipo (sin usar EquipoRepository, mantenemos simple)
    (sensor as any).equipo = { equipoId: dto.equipoId } as any;

    const saved = await this.repo.createSensor(sensor);

    // si tu relación no viene cargada por save(), recargamos:
    const reloaded = await this.repo.findBySensorId(saved.sensorId);
    if (!reloaded) throw new Error("Error inesperado: sensor creado pero no encontrado");

    return this.toSensorResponseDTO(reloaded);
  }

  async getSensorById(sensorId: string): Promise<SensorResponseDTO> {
    const sensor = await this.repo.findBySensorId(sensorId);
    if (!sensor) throw new Error(`Sensor no encontrado: ${sensorId}`);
    return this.toSensorResponseDTO(sensor);
  }

  async updateSensor(sensorId: string, dto: SensorUpdateDTO): Promise<SensorResponseDTO> {
    // patch hacia entity (y si cambia equipo, lo seteamos)
    const patch: Partial<Sensor> = {};

    if (dto.nombre !== undefined) patch.nombre = dto.nombre;
    if (dto.codigoPCB !== undefined) patch.codigoPCB = dto.codigoPCB;
    if (dto.tipo !== undefined) patch.tipo = dto.tipo;
    if (dto.modelo !== undefined) patch.modelo = dto.modelo;
    if (dto.unidad !== undefined) patch.unidad = dto.unidad;
    if (dto.is_on !== undefined) patch.is_on = dto.is_on;

    if (dto.equipoId !== undefined) {
      (patch as any).equipo = { equipoId: dto.equipoId } as any;
    }

    const updated = await this.repo.updateSensor(sensorId, patch);
    if (!updated) throw new Error(`Sensor no encontrado: ${sensorId}`);

    const reloaded = await this.repo.findBySensorId(sensorId);
    if (!reloaded) throw new Error("Error inesperado: sensor actualizado pero no encontrado");

    return this.toSensorResponseDTO(reloaded);
  }

  async deleteSensor(sensorId: string): Promise<void> {
    const ok = await this.repo.deleteById(sensorId);
    if (!ok) throw new Error(`Sensor no encontrado: ${sensorId}`);
  }

  // helpers
  private parsePage(page?: string): number {
    const n = Number(page ?? "1");
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.floor(n);
  }

  private parseLimit(limit?: string): number {
    const n = Number(limit ?? "10");
    if (!Number.isFinite(n) || n < 1) return 10;
    return Math.min(Math.floor(n), 100);
  }

  private toSensorResponseDTO(entity: Sensor): SensorResponseDTO {
  return {
    sensorId: entity.sensorId,
    nombre: entity.nombre,
    codigoPCB: entity.codigoPCB,
    tipo: entity.tipo,
    modelo: entity.modelo,
    unidad: entity.unidad,
    is_on: entity.is_on,
    equipoId: (entity as any)?.equipo?.equipoId ?? (entity as any)?.equipo?.id ?? "", // depende tu entity Equipo
  };

  }


}