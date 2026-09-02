export interface MedicionRangeQueryDTO {
  from?: string;
  to?: string;
}

export interface ValidatedMedicionRangeQueryDTO {
  from: Date;
  to: Date;
}
