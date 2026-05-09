

export interface InstitucionQueryDTO {
  page?: string;
  limit?: string;
  search?: string;
}

export interface CreateInstitucionDTO {
  nombre: string;
  direccion?: string;
  telefono?: string;
}

export interface UpdateInstitucionDTO {
  nombre?: string;
  direccion?: string;
  telefono?: string;
}