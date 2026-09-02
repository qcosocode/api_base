import { MedicionQueryDTO, ValidatedMedicionQueryDTO } from "../dto/medicion/medicion-query.dto";
import { MedicionRangeQueryDTO, ValidatedMedicionRangeQueryDTO } from "../dto/medicion/medicion-range-query.dto";
import { MedicionWindowQueryDTO, ValidatedMedicionWindowQueryDTO } from "../dto/medicion/medicion-window-query.dto";
import { ValidationError } from "../errors/app.error";

export class MedicionValidator {
  static validateQuery(query: MedicionQueryDTO): ValidatedMedicionQueryDTO {
    const from = this.optionalDate(query.from, "from");
    const to = this.optionalDate(query.to, "to");
    this.validateRangeOrder(from, to);
    return {
      page: this.positiveInteger(query.page, "page", 1),
      limit: Math.min(this.positiveInteger(query.limit, "limit", 50), 200),
      from,
      to,
      sensorId: query.sensor_id,
      equipoId: query.equipo_id,
    };
  }

  static validateRange(query: MedicionRangeQueryDTO): ValidatedMedicionRangeQueryDTO {
    if (!query.from) throw new ValidationError("from es requerido");
    if (!query.to) throw new ValidationError("to es requerido");
    const from = this.date(query.from, "from");
    const to = this.date(query.to, "to");
    this.validateRangeOrder(from, to);
    return { from, to };
  }

  static validateWindow(query: MedicionWindowQueryDTO): ValidatedMedicionWindowQueryDTO {
    const hours = this.nonNegativeInteger(query.hours, "hours");
    const minutes = this.nonNegativeInteger(query.minutes, "minutes");
    if (hours === 0 && minutes === 0) {
      throw new ValidationError("hours o minutes debe ser mayor a 0");
    }
    return { hours, minutes };
  }

  private static positiveInteger(value: string | undefined, field: string, defaultValue: number): number {
    if (value === undefined) return defaultValue;
    const number = Number(value);
    if (!Number.isInteger(number) || number <= 0) throw new ValidationError(`${field} debe ser un entero mayor a 0`);
    return number;
  }

  private static nonNegativeInteger(value: string | undefined, field: string): number {
    if (value === undefined) return 0;
    const number = Number(value);
    if (!Number.isInteger(number) || number < 0) throw new ValidationError(`${field} debe ser un entero mayor o igual a 0`);
    return number;
  }

  private static optionalDate(value: string | undefined, field: string): Date | undefined {
    return value === undefined ? undefined : this.date(value, field);
  }

  private static date(value: string, field: string): Date {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new ValidationError(`${field} debe ser una fecha válida`);
    return date;
  }

  private static validateRangeOrder(from?: Date, to?: Date): void {
    if (from && to && from.getTime() > to.getTime()) throw new ValidationError("from debe ser anterior o igual a to");
  }
}
