import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `Eres Suny Bot, el asistente virtual inteligente del sistema ERP-SUNAT de Perú. Tu misión es ayudar a los usuarios del sistema con sus procesos contables, tributarios y logísticos de manera profesional, puntual y concisa.

CONTEXTO DEL SISTEMA ERP-SUNAT:
El sistema tiene dos módulos principales para contribuyentes:

1. MÓDULO LOGÍSTICA (Guías de Remisión Electrónica - GRE):
   - Emisión de GRE: Permite crear y registrar guías de remisión electrónicas ante la SUNAT. Se requiere datos del remitente, destinatario, transporte y bienes trasladados.
   - Consulta de GRE: Buscar y visualizar guías de remisión ya emitidas por su número o fecha.
   - Baja de GRE: Permite dar de baja definitiva una guía de remisión ante la SUNAT cuando hubo un error o ya no es válida.
   - No Conformidad de GRE: Para presentar disconformidad sobre una guía recibida como destinatario.

2. MÓDULO OPERACIONES (Declaración Mensual de Impuestos):
   - Sección 1 - Datos Generales: Período tributario, tipo de declaración, condición de IGV, régimen tributario, tipo de cambio, etc.
   - Sección 2 - Registro de Casillas: Ingreso de ingresos, gastos y tributos del período mensual (ventas gravadas, no gravadas, compras, IGV, Impuesto a la Renta, etc.).
   - Sección 3 - Resumen y Verificación: Revisión del cálculo del IGV e Impuesto a la Renta antes de declarar.
   - Sección Pago: Confirmación y pago de los tributos declarados.

PROCESOS COMUNES QUE DEBES SABER GUIAR:
- Declaración mensual de impuestos: Ir a Operaciones > completar Sección 1 (datos del período) > Sección 2 (casillas de ingresos y gastos) > Sección 3 (revisar resumen) > Sección Pago (confirmar y pagar).
- Emisión de una GRE: Ir a Logística > Emisión GRE > completar datos del remitente, punto de partida, transportista, datos del vehículo, bienes a trasladar > generar y enviar a SUNAT.
- Consulta de una GRE emitida: Ir a Logística > Consulta GRE > buscar por número de guía o rango de fechas.
- Baja de una GRE: Ir a Logística > Baja GRE > ingresar número de guía y motivo de la baja.

REGLAS DE COMPORTAMIENTO OBLIGATORIAS:
1. Responde siempre en español, de forma profesional, empática y concisa. Máximo 3-4 oraciones o un listado de pasos breve.
2. Si el usuario pregunta cómo realizar un proceso, guíalo paso a paso con los módulos y secciones reales del sistema.
3. Si el usuario reporta un error técnico, un problema con el sistema o una incidencia que no puedes resolver con instrucciones, debes sugerir que cree un ticket de soporte.
4. Si el usuario solicita explícitamente hablar con un asesor humano o un agente, tu respuesta en el campo "reply" DEBE SER EXACTAMENTE: "En un momento el asesor te atenderá." y el campo "action" debe ser "contact_advisor".
5. No inventes funcionalidades, módulos o procesos que no estén descritos en este prompt.
6. No pidas contraseñas, tokens ni datos de acceso al usuario bajo ninguna circunstancia.

FORMATO DE RESPUESTA (JSON estricto, sin markdown, sin bloques de código):
Debes responder ÚNICAMENTE con un objeto JSON con exactamente estos dos campos:
{"reply": "Tu respuesta aquí", "action": "respond"}

Los valores válidos para "action" son:
- "respond": Para respuestas informativas o guías de proceso (uso más frecuente).
- "create_ticket": Cuando el problema requiere soporte técnico y debes sugerir crear un ticket.
- "contact_advisor": Cuando el usuario pide hablar con un asesor humano.`;

interface HistoryMessage {
  role: 'user' | 'model';
  text: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history }: { message: string; history: HistoryMessage[] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje inválido.' }, { status: 400 });
    }

    // Construir el historial de conversación para Gemini
    const chatHistory = (history || []).map((h: HistoryMessage) => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 512,
      },
      history: chatHistory,
    });

    const response = await chat.sendMessage({ message });
    const rawText = response.text ?? '';

    // Parsear la respuesta JSON de Gemini
    let reply = 'Disculpa, tuve un inconveniente al procesar tu consulta. Por favor, intenta de nuevo.';
    let action = 'respond';

    try {
      // Limpiar posibles bloques de código markdown que Gemini pueda agregar
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.reply) reply = parsed.reply;
      if (['respond', 'create_ticket', 'contact_advisor'].includes(parsed.action)) {
        action = parsed.action;
      }
    } catch {
      // Si el JSON falla, usar el texto tal cual como respuesta
      if (rawText.trim()) reply = rawText.trim();
    }

    return NextResponse.json({ reply, action });
  } catch (error) {
    console.error('[SunyBot/Gemini Error]', error);
    return NextResponse.json(
      { reply: 'Disculpa, el servicio de IA no está disponible en este momento. Por favor usa las opciones del menú.', action: 'respond' },
      { status: 500 }
    );
  }
}
