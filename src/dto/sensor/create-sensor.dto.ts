export interface CreateSensorDTO {
  nombre: string;
  codigoPCB: string;
  tipo: string;
  modelo: string;
  unidad: string;
  is_on?: boolean;
  equipoId: string;
}
