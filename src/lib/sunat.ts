/**
 * Contract and utilities for the peruapi.com padrón lookup.
 * Shape is normalized so the UI never cares which document type came in.
 */

export type DocKind = "ruc" | "dni";

export type Estado = "ACTIVO" | "BAJA" | "SUSPENDIDO" | "DESCONOCIDO";
export type Condicion = "HABIDO" | "NO HABIDO" | "PENDIENTE" | "DESCONOCIDO";

export type Sucursal = {
  codigo?: string;
  direccion: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
};

export type ContribuyenteRecord = {
  kind: DocKind;
  doc: string;
  razonSocial: string;
  nombreComercial?: string;
  tipoContribuyente?: string;
  estado: Estado;
  condicion: Condicion;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  ubigeo?: string;
  fechaInscripcion?: string;
  fechaActualizacion?: string;
  actividadEconomica?: string;
  buenContribuyente?: boolean;
  agenteRetencion?: boolean;
  agentePercepcion?: boolean;
  sucursales: Sucursal[];
  consultadoEn: string;
};

export function cleanDoc(input: string): string {
  return input.replace(/\D+/g, "");
}

export function detectKind(doc: string): DocKind | null {
  const d = cleanDoc(doc);
  if (d.length === 11) return "ruc";
  if (d.length === 8) return "dni";
  return null;
}

/** Validates the RUC checksum. Algorithm is the official SUNAT module-11 mod. */
export function isValidRuc(ruc: string): boolean {
  const d = cleanDoc(ruc);
  if (d.length !== 11) return false;
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((acc, w, i) => acc + w * Number(d[i]), 0);
  const remainder = sum % 11;
  const check = (11 - remainder) % 10;
  return check === Number(d[10]);
}

export function isValidDni(dni: string): boolean {
  const d = cleanDoc(dni);
  return d.length === 8 && /^\d{8}$/.test(d);
}

/** User-facing labels with Peruvian formal tone. */
export const LABELS = {
  ruc: "RUC",
  dni: "DNI",
  estado: "Estado",
  condicion: "Condición",
  razonSocial: "Razón social",
  nombres: "Nombres y apellidos",
  direccion: "Domicilio fiscal",
  ubigeo: "Ubigeo",
  distrito: "Distrito",
  provincia: "Provincia",
  departamento: "Departamento",
  actividadEconomica: "Actividad económica",
  fechaInscripcion: "Inscripción",
  tipoContribuyente: "Tipo de contribuyente",
  sucursales: "Establecimientos anexos",
} as const;

/** Normalizes whatever peruapi returns into ContribuyenteRecord. */
export function normalize(
  kind: DocKind,
  doc: string,
  raw: Record<string, unknown>,
): ContribuyenteRecord {
  const get = (...keys: string[]): string | undefined => {
    for (const k of keys) {
      const v = raw[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return undefined;
  };
  const estado = (get("estado") ?? "DESCONOCIDO").toUpperCase() as Estado;
  const condicion = (get("condicion") ?? "DESCONOCIDO").toUpperCase() as Condicion;

  const nombreCompleto =
    get("razon_social", "razonSocial", "nombre_o_razon_social") ??
    [
      get("nombres"),
      get("apellido_paterno", "apellidoPaterno"),
      get("apellido_materno", "apellidoMaterno"),
    ]
      .filter(Boolean)
      .join(" ");

  const rawSucursales = Array.isArray(raw.sucursales) ? raw.sucursales : [];
  const sucursales: Sucursal[] = rawSucursales.flatMap((s: unknown): Sucursal[] => {
    if (typeof s !== "object" || s === null) return [];
    const row = s as Record<string, unknown>;
    const direccion =
      typeof row.direccion === "string"
        ? row.direccion
        : typeof row.direccion_completa === "string"
          ? row.direccion_completa
          : "";
    if (!direccion) return [];
    const item: Sucursal = { direccion };
    if (typeof row.codigo === "string") item.codigo = row.codigo;
    if (typeof row.distrito === "string") item.distrito = row.distrito;
    if (typeof row.provincia === "string") item.provincia = row.provincia;
    if (typeof row.departamento === "string")
      item.departamento = row.departamento;
    return [item];
  });

  const asBool = (k: string): boolean | undefined =>
    typeof raw[k] === "boolean" ? (raw[k] as boolean) : undefined;

  return {
    kind,
    doc: cleanDoc(doc),
    razonSocial: nombreCompleto,
    nombreComercial: get("nombre_comercial", "nombreComercial"),
    tipoContribuyente: get("tipo", "tipo_contribuyente"),
    estado,
    condicion,
    direccion: get("direccion", "direccion_completa", "domicilio_fiscal"),
    distrito: get("distrito"),
    provincia: get("provincia"),
    departamento: get("departamento"),
    ubigeo: get("ubigeo"),
    fechaInscripcion: get("fecha_inscripcion", "fechaInscripcion"),
    fechaActualizacion: get("fecha_actualizacion", "fechaActualizacion"),
    actividadEconomica: get("actividad_economica", "actividadEconomica"),
    buenContribuyente: asBool("buen_contribuyente"),
    agenteRetencion: asBool("agente_de_retencion"),
    agentePercepcion: asBool("agente_de_percepcion"),
    sucursales,
    consultadoEn: new Date().toISOString(),
  };
}
