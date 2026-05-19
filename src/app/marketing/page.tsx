"use client";

import { useState } from "react";
import Seccion1 from "./Seccion1";
import Seccion2 from "./Seccion2";
import Seccion3 from "./Seccion3";
import Seccion4 from "./Seccion4";

export interface FormData {
  dni: string;
  motivoInscripcion: string;
  actividadEconomica: string;
  profesion: string;
  inicioActividades: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccionFisica: string;
  condicionDomicilio: string;
  regimenTributario: string;
  telefono: string;
  correo: string;
  nombres: string;
  apellidos: string;
  username: string;
  claveSol: string;
}

const initialFormData: FormData = {
  dni: "",
  motivoInscripcion: "",
  actividadEconomica: "",
  profesion: "",
  inicioActividades: "",
  departamento: "",
  provincia: "",
  distrito: "",
  direccionFisica: "",
  condicionDomicilio: "",
  regimenTributario: "",
  telefono: "",
  correo: "",
  nombres: "", // Datos simulados devueltos de "RENIEC" / Backend
  apellidos: "", // Datos simulados devueltos de "RENIEC" / Backend
  username: "",
  claveSol: "",
};

export default function MarketingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const manejarSalir = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-4">
      <header className="bg-white p-4 border-b">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <img src="/logo-sunat.png" alt="Logo SUNAT" className="h-12 w-auto" />
          <button onClick={manejarSalir} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all border border-transparent hover:border-red-100 group text-[14px] font-medium text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
            <span>Salir</span>
          </button>
        </div>
      </header>

      <div className="bg-[#0071BC] h-14 w-full shadow-md flex items-center px-8 mb-4"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-[#0071BC] text-xl font-bold mb-3">Formulario de Inscripción al RUC</h1>
        {/* Stepper Horizontal Dinámico */}
        <div className="mb-4">
          <div className="flex items-center justify-between relative">
            {/* Riel contenedor ajustado al centro de los círculos */}
            <div className="absolute left-5 right-5 top-5 transform -translate-y-1/2 h-1 bg-gray-200 z-0 rounded-full">
              {/* Línea activa progresiva */}
              <div
                className="absolute left-0 top-0 h-full bg-[#0071BC] rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>

            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= item
                    ? "bg-[#0071BC] text-white shadow-lg ring-4 ring-blue-100 scale-110"
                    : "bg-white text-gray-400 border-2 border-gray-200"
                    }`}
                >
                  {step > item ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    item
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-semibold tracking-wide transition-colors duration-300 ${step >= item ? "text-[#0071BC]" : "text-gray-400"
                    }`}
                >
                  {item === 1 && "Identidad"}
                  {item === 2 && "Mi Negocio"}
                  {item === 3 && "Verificación"}
                  {item === 4 && "Credenciales"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contenedor central blanco con sombra suave */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-5 sm:p-6 transition-all duration-300">
          {step === 1 && (
            <Seccion1
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
            />
          )}
          {step === 2 && (
            <Seccion2
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 3 && (
            <Seccion3
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 4 && (
            <Seccion4
              formData={formData}
              updateFormData={updateFormData}
              prevStep={prevStep}
            />
          )}
        </div>
      </div>
    </div>
  );
}
