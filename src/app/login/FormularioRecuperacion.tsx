import React, { useState, useRef } from "react";
import Image from "next/image";
import { API_BASE_URL } from "../../config/api";

interface Props {
  onBack: () => void;
}

//Comentario de prueba para Scrum-8

export default function FormularioRecuperacion({ onBack }: Props) {
  const [paso, setPaso] = useState<"selector" | "usuario" | "password_email" | "password_otp" | "password_new">("selector");
  const [correo, setCorreo] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleRecuperarUsuario = async () => {
    setError("");
    setSuccessMsg("");
    if (!correo.trim()) {
      setError("Por favor, ingrese un correo válido.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/recuperar-usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correo.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al recuperar usuario");

      setSuccessMsg(data.mensaje);
      setCorreo("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSolicitarRestablecimiento = async () => {
    setError("");
    setSuccessMsg("");
    if (!correo.trim()) {
      setError("Por favor, ingrese un correo válido.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/solicitar-restablecimiento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correo.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al solicitar restablecimiento");

      setSuccessMsg(data.mensaje);
      setPaso("password_otp");
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCambiarPassword = async () => {
    setError("");
    setSuccessMsg("");
    const codigo = otp.join("");
    if (codigo.length < 6) {
      setError("Ingrese el código completo de 6 dígitos.");
      return;
    }
    if (nuevaPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!nuevaPassword.trim()) {
      setError("La contraseña no puede estar vacía.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/cambiar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: correo.trim(),
          codigo_otp: codigo,
          nueva_password: nuevaPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cambiar contraseña");

      setSuccessMsg(data.mensaje);
      setPaso("selector");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newValue = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);
    if (newValue && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col animate-in fade-in duration-300">
      <div className="h-14 bg-[#0063AE]"></div>
      <div className="bg-white px-6 py-3">
        <Image src="/logo-sunat.png" alt="SUNAT Logo" width={140} height={40} className="object-contain" priority />
      </div>

      <div className="flex flex-1 items-center justify-center py-10">
        <div className="bg-white border border-gray-300 w-[520px] shadow-md mx-auto">
          <div className="bg-[#0063AE] text-white text-center py-4 font-extrabold text-lg">
            Recuperación de Acceso
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm font-semibold text-center">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm font-semibold text-center">
                {successMsg}
              </div>
            )}

            {paso === "selector" && (
              <div className="flex flex-col gap-4">
                <p className="text-gray-600 text-center mb-4 text-sm">Seleccione qué información desea recuperar o restablecer:</p>
                <button
                  onClick={() => { setPaso("usuario"); setError(""); setSuccessMsg(""); }}
                  className="w-full py-3 border-2 border-[#0063AE] text-[#0063AE] font-extrabold hover:bg-blue-50 transition-colors"
                >
                  Recuperar Nombre de Usuario
                </button>
                <button
                  onClick={() => { setPaso("password_email"); setError(""); setSuccessMsg(""); }}
                  className="w-full py-3 border-2 border-[#0063AE] text-[#0063AE] font-extrabold hover:bg-blue-50 transition-colors"
                >
                  Restablecer Contraseña
                </button>
              </div>
            )}

            {paso === "usuario" && (
              <div className="flex flex-col gap-5">
                <p className="text-gray-600 text-sm">Ingrese su correo electrónico registrado. Le enviaremos su nombre de usuario.</p>
                <input
                  type="email"
                  placeholder="CORREO ELECTRÓNICO"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="border border-gray-300 px-4 py-3 text-black placeholder-black/40 focus:outline-none focus:border-[#0063AE]"
                />
                <button
                  onClick={handleRecuperarUsuario}
                  disabled={isSubmitting}
                  className="w-full bg-[#0063AE] text-white px-5 py-3 shadow font-extrabold disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? "ENVIANDO..." : "ENVIAR USUARIO"}
                </button>
                <button
                  onClick={() => { setPaso("selector"); setError(""); setSuccessMsg(""); }}
                  className="text-sm text-[#0063AE] font-bold hover:underline mt-2"
                >
                  Regresar a opciones
                </button>
              </div>
            )}

            {paso === "password_email" && (
              <div className="flex flex-col gap-5">
                <p className="text-gray-600 text-sm">Ingrese su correo electrónico para recibir un código de seguridad de 6 dígitos.</p>
                <input
                  type="email"
                  placeholder="CORREO ELECTRÓNICO"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="border border-gray-300 px-4 py-3 text-black placeholder-black/40 focus:outline-none focus:border-[#0063AE]"
                />
                <button
                  onClick={handleSolicitarRestablecimiento}
                  disabled={isSubmitting}
                  className="w-full bg-[#0063AE] text-white px-5 py-3 shadow font-extrabold disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? "ENVIANDO..." : "SOLICITAR CÓDIGO"}
                </button>
                <button
                  onClick={() => { setPaso("selector"); setError(""); setSuccessMsg(""); }}
                  className="text-sm text-[#0063AE] font-bold hover:underline mt-2"
                >
                  Regresar a opciones
                </button>
              </div>
            )}

            {paso === "password_otp" && (
              <div className="flex flex-col gap-5 text-center">
                <p className="text-gray-600 text-sm">Hemos enviado un código a <strong>{correo}</strong></p>
                <div className="flex justify-center gap-2 my-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => { inputRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-12 text-center text-xl font-extrabold text-slate-900 border-2 border-gray-300 focus:border-[#0063AE] outline-none"
                    />
                  ))}
                </div>
                <button
                  onClick={() => setPaso("password_new")}
                  disabled={otp.join("").length < 6}
                  className="w-full bg-[#0063AE] text-white px-5 py-3 shadow font-extrabold disabled:opacity-50 mt-2"
                >
                  CONTINUAR
                </button>
                <button
                  onClick={() => setPaso("password_email")}
                  className="text-sm text-[#0063AE] font-bold hover:underline mt-2"
                >
                  Cambiar correo
                </button>
              </div>
            )}

            {paso === "password_new" && (
              <div className="flex flex-col gap-5">
                <p className="text-gray-600 text-sm">Ingrese su nueva contraseña.</p>
                <input
                  type="password"
                  placeholder="NUEVA CONTRASEÑA"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  className="border border-gray-300 px-4 py-3 text-black placeholder-black/40 focus:outline-none focus:border-[#0063AE]"
                />
                <input
                  type="password"
                  placeholder="CONFIRMAR CONTRASEÑA"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 px-4 py-3 text-black placeholder-black/40 focus:outline-none focus:border-[#0063AE]"
                />
                <button
                  onClick={handleCambiarPassword}
                  disabled={isSubmitting}
                  className="w-full bg-[#0063AE] text-white px-5 py-3 shadow font-extrabold disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? "GUARDANDO..." : "CAMBIAR CONTRASEÑA"}
                </button>
                <button
                  onClick={() => setPaso("password_otp")}
                  className="text-sm text-[#0063AE] font-bold hover:underline mt-2"
                >
                  Regresar al código
                </button>
              </div>
            )}

            <div className="mt-8 border-t border-gray-200 pt-6 text-center">
              <button
                onClick={onBack}
                className="text-sm text-gray-500 font-extrabold hover:text-gray-800 transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Regresar al Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
