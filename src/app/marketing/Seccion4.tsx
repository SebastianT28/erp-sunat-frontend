import React, { useState } from "react";
import type { FormData } from "./page";
import Link from "next/link";

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  prevStep: () => void;
}

export default function Seccion4({ formData, updateFormData, prevStep }: Props) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedRuc, setGeneratedRuc] = useState("");

  const handleSubmit = async () => {
    if (formData.claveSol !== confirmPassword) {
      alert("Las contraseñas no coinciden. Por favor, verifique.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/api/marketing/inscripcion/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      const data = await response.json();
      
      // Procesar respuesta real del backend
      setGeneratedRuc(data.contribuyente?.ruc);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al procesar el registro. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10 px-4 animate-in zoom-in duration-500">
        <div className="w-28 h-28 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-green-50">
          <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">¡Registro Exitoso!</h2>
        <p className="text-gray-500 mb-10 text-lg">Tu cuenta ha sido creada y validada correctamente.</p>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 inline-block p-8 rounded-2xl border border-blue-100 mb-10 shadow-sm relative overflow-hidden text-left w-full max-w-md mx-auto">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24 text-[#0071BC]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-[#0071BC] uppercase tracking-widest mb-2">Tu Número de RUC asignado</p>
            <p className="text-4xl font-black text-[#0071BC] tracking-wider mb-4 font-mono">{generatedRuc}</p>
            <div className="h-px bg-blue-200 w-full mb-4"></div>
            <p className="text-sm text-[#0071BC] font-medium"><strong>Usuario:</strong> {formData.username}</p>
            <p className="text-sm text-[#0071BC] font-medium mt-1">Guarda estos datos, los necesitarás para ingresar.</p>
          </div>
        </div>

        <div>
          <Link
            href="/dashboard"
            className="inline-flex justify-center items-center gap-2 px-10 py-4 bg-[#0071BC] hover:bg-[#005a96] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
          >
            COMENZAR A OPERAR
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Crea tu acceso al portal</h2>
        <p className="text-gray-500 text-sm">Crea tu usuario y Clave SOL para poder ingresar a la plataforma virtualmente.</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 ml-1">Datos de Identidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nombres Completos
              </label>
              <input
                type="text"
                value={formData.nombres || ''}
                onChange={(e) => updateFormData({ nombres: e.target.value })}
                placeholder="Juan Carlos"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0071BC] focus:border-[#0071BC] outline-none transition-all shadow-sm text-slate-900 placeholder-slate-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Apellidos Completos
              </label>
              <input
                type="text"
                value={formData.apellidos || ''}
                onChange={(e) => updateFormData({ apellidos: e.target.value })}
                placeholder="Pérez Gómez"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0071BC] focus:border-[#0071BC] outline-none transition-all shadow-sm text-slate-900 placeholder-slate-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={formData.username || ''}
                onChange={(e) => updateFormData({ username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                placeholder="Ej. jcarlos.perez"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0071BC] focus:border-[#0071BC] outline-none transition-all shadow-sm text-slate-900 placeholder-slate-400 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1.5 ml-1">Solo letras minúsculas, sin espacios.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Contraseña (Clave SOL)
              </label>
              <input
                type="password"
                value={formData.claveSol || ''}
                onChange={(e) => updateFormData({ claveSol: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0071BC] focus:border-[#0071BC] outline-none transition-all shadow-sm text-slate-900 placeholder-slate-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all shadow-sm text-slate-900 placeholder-slate-400 bg-white ${confirmPassword && formData.claveSol !== confirmPassword
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-[#0071BC] focus:border-[#0071BC]'
                  }`}
              />
            </div>
          </div>
        </div>

        {/* Controles de Navegación */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-10 pt-6 border-t border-gray-100 gap-4">
          <button
            onClick={prevStep}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
          >
            ANTERIOR
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.username || !formData.claveSol || !confirmPassword || formData.claveSol !== confirmPassword}
            className="w-full sm:w-auto px-10 py-3 bg-[#0071BC] hover:bg-[#005a96] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-[#0071BC]/50 disabled:shadow-none disabled:cursor-not-allowed flex justify-center items-center gap-3 relative overflow-hidden"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                PROCESANDO...
              </>
            ) : (
              <>
                FINALIZAR REGISTRO
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
