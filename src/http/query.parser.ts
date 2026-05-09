// src/http/query.parsers.ts

/* Métodos comunes  */

/*

Confusión entre “validación de transporte” vs “validación de dominio”

req.query.page es un problema de transporte (HTTP trae strings).

límites máximos/mínimos pueden ser política de API (también transporte).

reglas de negocio (por ejemplo “sensorId debe existir”) es dominio.

*/

export function parsePage(value: unknown, def = 1): number {
  // const fallbackValue = value ?? def;
  // const stringValue = String(fallbackValue);
  // const n = parseInt(stringValue, 10);
  const n = parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n) || n <= 0) return def;
  return n;
}

export function parseLimit(value: unknown, def = 50, max = 200): number {
  const n = parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n) || n <= 0) return def;
  return Math.min(n, max);
}

export function parseBool(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  const s = String(value).trim().toLowerCase();
  if (s === "true") return true;
  if (s === "false") return false;
  return undefined;
}

export function parsePageLimit(query: any, defPage = 1, defLimit = 50, maxLimit = 200) {
  return {
    page: parsePage(query?.page, defPage),
    limit: parseLimit(query?.limit, defLimit, maxLimit),
  };
}
