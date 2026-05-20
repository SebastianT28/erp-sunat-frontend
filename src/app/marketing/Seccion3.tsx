import React, { useState, useRef, useEffect } from "react";
import type { FormData } from "./page";

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Seccion3({ formData, updateFormData, nextStep, prevStep }: Props) {
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendCode = () => {
    if (formData.telefono && formData.correo) {
      setCodigoEnviado(true);
      // Foco automático en el primer input después de un breve delay para que renderice
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newValue = value.replace(/\D/g, "").slice(-1); // Solo un dígito
    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);

    // Auto focus next
    if (newValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Manejar el pegado de código
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      // Mover foco al final
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const otpString = otp.join("");
  const isValidOtp = otpString.length === 6;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Verificación de Contacto</h2>
        <p className="text-gray-500 text-sm">Validaremos tus datos de contacto mediante un código de seguridad seguro.</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Teléfono Móvil
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm font-medium">+51</span>
              </div>
              <input
                type="tel"
                value={formData.telefono || ''}
                onChange={(e) => updateFormData({ telefono: e.target.value.replace(/\D/g, "").slice(0, 9) })}
                placeholder="999 888 777"
                className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0071BC] outline-none transition-all ${codigoEnviado ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-slate-900 placeholder-slate-400'}`}
                disabled={codigoEnviado}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                id="correo"
                name="correo"
                autoComplete="email"
                value={formData.correo || ''}
                onChange={(e) => updateFormData({ correo: e.target.value })}
                placeholder="correo@ejemplo.com"
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0071BC] outline-none transition-all ${codigoEnviado ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-slate-900 placeholder-slate-400'}`}
                disabled={codigoEnviado}
              />
            </div>
          </div>
        </div>

        {codigoEnviado && (
          <div className="bg-blue-50/50 p-8 rounded-2xl border-2 border-blue-100 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center mx-auto mb-4 text-[#0071BC]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ingresa el código de 6 dígitos</h3>
            <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto">
              Hemos enviado un mensaje de texto a <span className="font-semibold text-gray-800">+51 {formData.telefono}</span> y un correo a <span className="font-semibold text-gray-800">{formData.correo}</span>.
            </p>

            <div className="flex justify-center gap-2 sm:gap-3 mb-8" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-16 sm:w-14 sm:h-16 text-center text-2xl font-extrabold text-slate-900 bg-white border-2 border-gray-200 rounded-xl focus:border-[#0071BC] focus:ring-4 focus:ring-[#0071BC]/20 outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={!isValidOtp}
              className="w-full max-w-sm mx-auto flex justify-center items-center gap-2 px-8 py-4 bg-[#0071BC] hover:bg-[#005a96] text-white font-bold rounded-xl disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:hover:translate-y-0 disabled:shadow-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              VALIDAR Y CONTINUAR
            </button>

            <button
              onClick={() => {
                setOtp(["", "", "", "", "", ""]);
                setCodigoEnviado(false);
              }}
              className="mt-6 text-sm text-[#0071BC] font-semibold hover:text-[#005a96] underline transition-colors"
            >
              ¿No recibiste el código? Reenviar
            </button>
          </div>
        )}

        <div className="flex justify-between items-center w-full mt-6 pt-6 border-t border-gray-100 flex-col-reverse sm:flex-row gap-4 sm:gap-0">
          <button
            onClick={prevStep}
            className="w-full sm:w-auto px-8 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            ANTERIOR
          </button>
          
          {!codigoEnviado && (
            <button
              onClick={handleSendCode}
              disabled={!formData.telefono || !formData.correo || formData.telefono.length < 9}
              className="w-full sm:w-auto px-8 py-3 bg-[#0071BC] hover:bg-[#005a96] text-white font-bold rounded-xl disabled:bg-[#0071BC]/50 transition-all duration-200 shadow-md hover:shadow-lg active:transform active:scale-95 flex items-center justify-center"
            >
              ENVIAR CÓDIGO
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
