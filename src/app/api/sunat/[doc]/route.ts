import { NextResponse } from "next/server";
import {
  cleanDoc,
  detectKind,
  isValidDni,
  isValidRuc,
  normalize,
  type ContribuyenteRecord,
} from "@/lib/sunat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/sunat/[doc]
 *
 * Proxies peruapi.com with the server-side X-API-KEY so the key never reaches
 * the browser. Accepts either an 11-digit RUC or 8-digit DNI. Responds with
 * a normalized {@link ContribuyenteRecord}.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ doc: string }> },
): Promise<NextResponse<ContribuyenteRecord | { error: string }>> {
  const { doc: raw } = await ctx.params;
  const doc = cleanDoc(raw);
  const kind = detectKind(doc);

  if (!kind) {
    return NextResponse.json(
      { error: "Ingrese un RUC de 11 dígitos o un DNI de 8 dígitos." },
      { status: 400 },
    );
  }

  if (kind === "ruc" && !isValidRuc(doc)) {
    return NextResponse.json(
      { error: "El RUC ingresado no pasa la verificación módulo-11 de SUNAT." },
      { status: 400 },
    );
  }

  if (kind === "dni" && !isValidDni(doc)) {
    return NextResponse.json(
      { error: "El DNI debe tener exactamente 8 dígitos." },
      { status: 400 },
    );
  }

  const key = process.env.PERUAPI_KEY;
  const base = process.env.PERUAPI_BASE_URL ?? "https://peruapi.com/api/v1";

  if (!key) {
    return NextResponse.json(
      {
        error:
          "Falta configurar PERUAPI_KEY en el entorno del servidor (.env.local).",
      },
      { status: 500 },
    );
  }

  try {
    const upstream = await fetch(`${base}/${kind}/${doc}`, {
      headers: {
        "X-API-KEY": key,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(6_000),
    });

    if (upstream.status === 404) {
      return NextResponse.json(
        {
          error:
            kind === "ruc"
              ? "SUNAT no registra este RUC."
              : "RENIEC no encuentra este DNI.",
        },
        { status: 404 },
      );
    }

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: `peruapi respondió con ${upstream.status}. Intente nuevamente en unos segundos.`,
        },
        { status: 502 },
      );
    }

    const json = (await upstream.json()) as Record<string, unknown>;
    const normalized = normalize(kind, doc, json);
    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    const isTimeout = err instanceof DOMException && err.name === "TimeoutError";
    return NextResponse.json(
      {
        error: isTimeout
          ? "SUNAT demoró más de 6 segundos en responder."
          : "No se pudo contactar a peruapi.com. Verifique su conexión.",
      },
      { status: 503 },
    );
  }
}
