import React, { useState, useRef, useEffect } from "react";
import type { FormData } from "./page";

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Seccion2({ formData, updateFormData, nextStep, prevStep }: Props) {
  const [searchTerm, setSearchTerm] = useState(formData.actividadEconomica);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [depSearch, setDepSearch] = useState(formData.departamento);
  const [showDep, setShowDep] = useState(false);
  const depRef = useRef<HTMLDivElement>(null);

  const [provSearch, setProvSearch] = useState(formData.provincia);
  const [showProv, setShowProv] = useState(false);
  const provRef = useRef<HTMLDivElement>(null);

  const [distSearch, setDistSearch] = useState(formData.distrito);
  const [showDist, setShowDist] = useState(false);
  const distRef = useRef<HTMLDivElement>(null);

  const [ventasMensuales, setVentasMensuales] = useState("");
  const [emiteFacturas, setEmiteFacturas] = useState("");

  const showAsistente = formData.motivoInscripcion === "Iniciar un negocio propio" || formData.motivoInscripcion === "Constituir una empresa (Persona Jurídica)";

  // Ubigeo mock data
  const departamentos = [
    "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", 
    "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto", 
    "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"
  ];
  
  const getProvincias = (dep: string) => {
    if (dep === "Lima") return ["Lima", "Cañete", "Huaral"];
    if (dep === "Arequipa") return ["Arequipa", "Camaná", "Caylloma"];
    if (dep === "Tacna") return ["Tacna", "Jorge Basadre"];
    if (dep) return [`Provincia 1 de ${dep}`, `Provincia 2 de ${dep}`];
    return [];
  };

  const getDistritos = (prov: string) => {
    if (prov === "Lima") return ["Miraflores", "San Borja", "Los Olivos", "Santiago de Surco"];
    if (prov === "Arequipa") return ["Arequipa (Cercado)", "Yanahuara", "Cayma", "Bustamante y Rivero"];
    if (prov === "Tacna") return ["Tacna (Cercado)", "Pocollay", "Alto de la Alianza"];
    if (prov) return [`Distrito 1 de ${prov}`, `Distrito 2 de ${prov}`];
    return [];
  };

  const filteredDeps = departamentos.filter(d => d.toLowerCase().includes(depSearch.toLowerCase()));
  const filteredProvs = getProvincias(formData.departamento).filter(p => p.toLowerCase().includes(provSearch.toLowerCase()));
  const filteredDists = getDistritos(formData.provincia).filter(d => d.toLowerCase().includes(distSearch.toLowerCase()));

  // Actividades simuladas
  const activities = [
    "Profesor Particular (CIIU 8549)",
    "Comercio al por menor en tiendas no especializadas (CIIU 4711)",
    "Actividades de restaurantes y de servicio móvil de comidas (CIIU 5610)",
    "Actividades de consultoría de gestión empresarial (CIIU 7020)",
    "Desarrollo de sistemas informáticos (CIIU 6201)",
    "Transporte de carga por carretera (CIIU 4923)",
  ];

  const filteredActivities = activities.filter(a =>
    a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectActivity = (activity: string) => {
    setSearchTerm(activity);
    updateFormData({ actividadEconomica: activity });
    setShowDropdown(false);
  };

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowDropdown(false);
      if (depRef.current && !depRef.current.contains(event.target as Node)) setShowDep(false);
      if (provRef.current && !provRef.current.contains(event.target as Node)) setShowProv(false);
      if (distRef.current && !distRef.current.contains(event.target as Node)) setShowDist(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRecomendacion = () => {
    if (!ventasMensuales || !emiteFacturas) return null;
    const v = Number(ventasMensuales);
    
    if (v > 708333) return { tipo: "RG" };
    if (v > 43750 && v <= 708333 || (emiteFacturas === "SI" && v > 43750)) return { tipo: "RMT" };
    if (v <= 8000 && emiteFacturas === "NO") return { tipo: "NRUS" };
    return { tipo: "RER" };
  };

  const rec = getRecomendacion();

  // Autoselección si cambia la recomendación
  useEffect(() => {
    if (rec?.tipo && formData.regimenTributario !== rec.tipo) {
      updateFormData({ regimenTributario: rec.tipo });
    }
  }, [ventasMensuales, emiteFacturas]);

  const isFormValid = formData.actividadEconomica && formData.inicioActividades &&
    formData.departamento && formData.provincia &&
    formData.distrito && formData.direccionFisica && formData.condicionDomicilio &&
    (!showAsistente || formData.regimenTributario);



  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Detalles de Mi Negocio</h2>
        <p className="text-gray-500 text-sm">Proporciona la información principal de tu actividad económica y ubicación fiscal.</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buscador de Actividad Económica */}
          <div className="relative md:col-span-2" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Actividad Económica Principal
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                  if (formData.actividadEconomica !== e.target.value) {
                    updateFormData({ actividadEconomica: "" }); // Reset if typing
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Ej. Profesor, Restaurante..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0071BC] focus:border-[#0071BC] outline-none transition-all shadow-sm placeholder-slate-400 text-slate-900"
              />
            </div>

            {showDropdown && searchTerm.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                <ul className="py-1">
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((act, idx) => (
                      <li
                        key={idx}
                        onClick={() => selectActivity(act)}
                        className="px-4 py-3 hover:bg-slate-100 cursor-pointer text-sm text-gray-700 transition-colors border-b border-gray-50 last:border-0"
                      >
                        {act}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-sm text-gray-500 italic">No se encontraron resultados para "{searchTerm}"</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Fecha de Inicio */}
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Fecha de Inicio de Actividades
            </label>
            <input
              type="date"
              value={formData.inicioActividades || ''}
              onChange={(e) => updateFormData({ inicioActividades: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0071BC] focus:border-[#0071BC] outline-none transition-all shadow-sm text-slate-900 bg-white"
            />
          </div>
        </div>

        {/* Bloque Domicilio Fiscal */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#0071BC]"></div>
          <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#0071BC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Domicilio Fiscal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div className="relative" ref={depRef}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Departamento</label>
              <input
                type="text"
                value={depSearch || ''}
                onChange={(e) => {
                  setDepSearch(e.target.value);
                  setShowDep(true);
                  if (formData.departamento !== e.target.value) {
                    updateFormData({ departamento: "", provincia: "", distrito: "" });
                    setProvSearch("");
                    setDistSearch("");
                  }
                }}
                onFocus={() => setShowDep(true)}
                placeholder="Buscar departamento..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071BC] outline-none text-sm bg-white shadow-sm text-slate-900 placeholder-slate-400"
              />
              {showDep && depSearch.length >= 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  <ul className="py-1">
                    {filteredDeps.length > 0 ? filteredDeps.map((dep, idx) => (
                      <li key={idx} onClick={() => { setDepSearch(dep); updateFormData({ departamento: dep, provincia: "", distrito: "" }); setProvSearch(""); setDistSearch(""); setShowDep(false); }} className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm text-slate-900 border-b border-gray-50 last:border-0">{dep}</li>
                    )) : <li className="px-4 py-2 text-sm text-gray-500 italic">Sin resultados</li>}
                  </ul>
                </div>
              )}
            </div>
            <div className="relative" ref={provRef}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Provincia</label>
              <input
                type="text"
                value={provSearch || ''}
                disabled={!formData.departamento}
                onChange={(e) => {
                  setProvSearch(e.target.value);
                  setShowProv(true);
                  if (formData.provincia !== e.target.value) {
                    updateFormData({ provincia: "", distrito: "" });
                    setDistSearch("");
                  }
                }}
                onFocus={() => setShowProv(true)}
                placeholder="Buscar provincia..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071BC] outline-none text-sm bg-white shadow-sm text-slate-900 placeholder-slate-400 disabled:bg-gray-100 disabled:text-gray-500"
              />
              {showProv && !(!formData.departamento) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  <ul className="py-1">
                    {filteredProvs.length > 0 ? filteredProvs.map((prov, idx) => (
                      <li key={idx} onClick={() => { setProvSearch(prov); updateFormData({ provincia: prov, distrito: "" }); setDistSearch(""); setShowProv(false); }} className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm text-slate-900 border-b border-gray-50 last:border-0">{prov}</li>
                    )) : <li className="px-4 py-2 text-sm text-gray-500 italic">Sin resultados</li>}
                  </ul>
                </div>
              )}
            </div>
            <div className="relative" ref={distRef}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Distrito</label>
              <input
                type="text"
                value={distSearch || ''}
                disabled={!formData.provincia}
                onChange={(e) => {
                  setDistSearch(e.target.value);
                  setShowDist(true);
                  if (formData.distrito !== e.target.value) updateFormData({ distrito: "" });
                }}
                onFocus={() => setShowDist(true)}
                placeholder="Buscar distrito..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071BC] outline-none text-sm bg-white shadow-sm text-slate-900 placeholder-slate-400 disabled:bg-gray-100 disabled:text-gray-500"
              />
              {showDist && !(!formData.provincia) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  <ul className="py-1">
                    {filteredDists.length > 0 ? filteredDists.map((dist, idx) => (
                      <li key={idx} onClick={() => { setDistSearch(dist); updateFormData({ distrito: dist }); setShowDist(false); }} className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm text-slate-900 border-b border-gray-50 last:border-0">{dist}</li>
                    )) : <li className="px-4 py-2 text-sm text-gray-500 italic">Sin resultados</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Dirección Física Exacta</label>
            <input
              type="text"
              value={formData.direccionFisica || ''}
              onChange={(e) => updateFormData({ direccionFisica: e.target.value })}
              placeholder="Ej: Av. Los Libertadores 123, Of 402"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071BC] focus:border-[#0071BC] outline-none text-sm shadow-sm transition-all placeholder-slate-400 text-slate-900 bg-white"
            />
          </div>

          <div className="mt-5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Condición del Domicilio Fiscal</label>
            <div className="relative">
              <select
                value={formData.condicionDomicilio || ""}
                onChange={(e) => updateFormData({ condicionDomicilio: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071BC] outline-none text-sm shadow-sm transition-all bg-white appearance-none text-slate-900 cursor-pointer"
              >
                <option value="" disabled className="text-gray-500">Seleccionar</option>
                <option value="PROPIO" className="text-slate-900">PROPIO</option>
                <option value="ALQUILADO" className="text-slate-900">ALQUILADO</option>
                <option value="CEDIDO" className="text-slate-900">CEDIDO</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Asistente de Selección de Régimen Tributario */}
        {showAsistente && (
          <div className="bg-[#0071BC] p-6 rounded-2xl shadow-lg relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Asistente de Régimen Tributario
            </h3>
            <p className="text-sm text-blue-100 mb-6">Te ayudaremos a elegir el régimen tributario ideal según tus proyecciones.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-1.5">
                  ¿Cuánto estimas vender o facturar mensualmente?
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-medium">S/</span>
                  <input
                    type="number"
                    value={ventasMensuales}
                    onChange={(e) => setVentasMensuales(e.target.value)}
                    placeholder="Ej: 4500"
                    className="w-full pl-10 pr-4 py-3 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-300 outline-none transition-all shadow-inner bg-white text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-1.5">
                  ¿Emitirás facturas a empresas o personas jurídicas?
                </label>
                <div className="relative">
                  <select
                    value={emiteFacturas}
                    onChange={(e) => setEmiteFacturas(e.target.value)}
                    className="w-full px-4 py-3 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-300 outline-none transition-all shadow-inner bg-white appearance-none cursor-pointer text-slate-900"
                  >
                    <option value="" disabled className="text-gray-500">Seleccionar</option>
                    <option value="SI">Sí, emitiré facturas</option>
                    <option value="NO">No, solo boletas de venta</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Selector de Regímenes (4 Tarjetas Fijas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {[
                { id: "NRUS", titulo: "Nuevo RUS (NRUS)", desc: "Hasta S/ 8,000 al mes, solo boletas." },
                { id: "RER", titulo: "Régimen Especial (RER)", desc: "Hasta S/ 43,750 al mes, permite facturas." },
                { id: "RMT", titulo: "Régimen MYPE Tributario", desc: "Hasta S/ 708,333 al mes, todo comprobante." },
                { id: "RG", titulo: "Régimen General (RG)", desc: "Sin límites, libros contables completos." }
              ].map((regimen) => {
                const isSelected = formData.regimenTributario === regimen.id;
                const isRecommended = rec?.tipo === regimen.id;
                
                return (
                  <div 
                    key={regimen.id}
                    onClick={() => updateFormData({ regimenTributario: regimen.id })}
                    className={`relative bg-white rounded-xl p-4 cursor-pointer transition-all shadow-sm flex flex-col justify-start min-h-[110px] ${isSelected ? 'border-2 border-blue-600 shadow-md ring-1 ring-blue-600/20' : 'border border-gray-200 hover:border-blue-400'}`}
                  >
                    {isRecommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Recomendado
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>
                      <h4 className={`font-bold text-sm leading-tight ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{regimen.titulo}</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug pl-6">{regimen.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Controles de Navegación */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-100 gap-4">
          <button
            onClick={prevStep}
            className="w-full sm:w-auto px-8 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            ANTERIOR
          </button>
          <button
            onClick={nextStep}
            disabled={!isFormValid}
            className="w-full sm:w-auto px-8 py-3 bg-[#0071BC] hover:bg-[#005a96] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-[#0071BC]/50 disabled:shadow-none disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            CONTINUAR
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
