import React, { useState, useRef, useEffect } from "react";
import type { FormData } from "./page";

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
}

export default function Seccion1({ formData, updateFormData, nextStep }: Props) {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const motivos = [
    "Emitir recibos por honorarios",
    "Iniciar un negocio propio",
    "Constituir una empresa (Persona Jurídica)",
    "Alquilar mis bienes",
    "Pagar impuestos por venta de acciones, inmuebles u otros"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 8); // Solo numérico, máximo 8 caracteres
    updateFormData({ dni: value });
    if (error) setError("");
  };

  const handleContinue = () => {
    if (formData.dni.length !== 8) {
      setError("El DNI debe contener exactamente 8 dígitos.");
      return;
    }
    if (!formData.motivoInscripcion) {
      setError("Por favor, seleccione el motivo de inscripción.");
      return;
    }

    // Validación simulada en duro
    if (formData.dni === "12345678") {
      setError("El DNI ingresado ya se encuentra registrado en el sistema.");
      return;
    }

    nextStep();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Columna Izquierda: Ilustración/Placeholder */}
      <div className="flex justify-center items-center p-2">
        <div className="w-56 h-56 bg-blue-50 rounded-full flex flex-col items-center justify-center p-6 border-4 border-blue-100 shadow-inner">
          <svg className="w-24 h-24 text-[#0071BC] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
          </svg>
          <span className="text-[#0071BC] font-medium text-center text-xs">Registro Inteligente de Contribuyentes</span>
        </div>
      </div>

      {/* Columna Derecha: Formulario */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Valida tu Identidad</h2>
        <p className="text-gray-500 mb-5 text-sm">Ingresa tus datos principales para iniciar el proceso de alta en la plataforma.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-r-lg text-sm font-medium flex items-center shadow-sm">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="dni" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Documento Nacional de Identidad (DNI)
            </label>
            <input
              id="dni"
              type="text"
              value={formData.dni || ''}
              onChange={handleDniChange}
              placeholder="Ej: 71234567"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0071BC] focus:border-[#0071BC] outline-none transition-all shadow-sm text-lg tracking-wide placeholder-slate-400 text-slate-900 bg-white"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              ¿Para qué te inscribes?
            </label>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-sm cursor-pointer bg-white flex items-center justify-between"
            >
              <span className={formData.motivoInscripcion ? "text-slate-900 font-medium" : "text-gray-500"}>
                {formData.motivoInscripcion || "Selecciona una opción"}
              </span>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <ul className="divide-y divide-gray-100">
                  {motivos.map((motivo, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        updateFormData({ motivoInscripcion: motivo });
                        setIsOpen(false);
                      }}
                      className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                        formData.motivoInscripcion === motivo
                          ? "bg-blue-50 text-[#0071BC] font-bold"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                      }`}
                    >
                      {motivo}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={handleContinue}
            className="w-full mt-2 bg-[#0071BC] hover:bg-[#005a96] text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2"
          >
            CONTINUAR
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
