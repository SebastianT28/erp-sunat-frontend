"use client"
import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/config/api';
import { usePathname } from 'next/navigation';

// --- Tipos de Datos ---
type MessageType = 'text' | 'quick_actions' | 'ticket_status';
type ChatState = 'idle' | 'awaiting_ticket_creation' | 'awaiting_ticket_search' | 'awaiting_anon_username' | 'awaiting_anon_email' | 'awaiting_anon_desc';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  type: MessageType;
  text?: string;
  options?: string[];
  ticketData?: {
    id: string;
    status: 'resuelto' | 'en_proceso' | 'pendiente';
    description: string;
  };
}

// --- SVGs Mapeados ---
const Icons = {
  Bot: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
  ),
  Ticket: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
  )
};

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  sender: 'bot',
  type: 'text',
  text: '¡Hola! Soy Suny Bot, tu Asistente Virtual Inteligente del ERP SUNAT. ¿En qué te puedo ayudar hoy?'
};

export default function HelpDeskWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatState, setChatState] = useState<ChatState>('idle');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anonUsername, setAnonUsername] = useState("");
  const [anonEmail, setAnonEmail] = useState("");
  const pathname = usePathname();

  // Estados Dinámicos (Base de Conocimiento)
  const [dbQuickActions, setDbQuickActions] = useState<string[]>([]);
  const [dbFaqs, setDbFaqs] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar estado y cargar BD
  useEffect(() => {
    // Cargar FAQs
    fetch(`${API_BASE_URL}/api/helpdesk/faqs/active`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setDbFaqs(data))
      .catch(console.error);

    // Cargar Quick Actions y configurar vista inicial
    fetch(`${API_BASE_URL}/api/helpdesk/quick-actions/active`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const actions = data.length > 0 ? data.map((a: any) => a.label) : ["Registrar Problema", "Consultar Estado de Ticket", "Preguntas Frecuentes", "Contactar Asesor"];
        setDbQuickActions(actions);
        
        const cookies = document.cookie.split(';');
        const hasToken = cookies.some(c => c.trim().startsWith('auth_token='));
        setIsLoggedIn(hasToken);

        if (hasToken) {
          setMessages([
            INITIAL_MESSAGE,
            { id: 'init-2', sender: 'bot', type: 'quick_actions', options: actions }
          ]);
        } else {
          setMessages([
            {
              id: 'init-anon-1',
              sender: 'bot',
              type: 'text',
              text: '¡Hola! Soy Suny Bot. Por favor, **inicie sesión** para poder mostrarte todas las opciones o poder ayudarte de forma personalizada.'
            },
            {
              id: 'init-anon-2',
              sender: 'bot',
              type: 'quick_actions',
              options: ["Ir a Iniciar Sesión", "Tengo problemas al iniciar sesión"]
            }
          ]);
        }
      })
      .catch(console.error);
  }, [pathname]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addMessage = (msg: Omit<Message, 'id'>) => {
    const newMsg = { ...msg, id: Date.now().toString() + Math.random() };
    setMessages(prev => [...prev, newMsg]);
  };

  const simulateTyping = async (callback: () => void, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    addMessage({ sender: 'user', type: 'text', text: userText });
    setInputText("");

    // Manejo de estados de conversación
    if (chatState === 'awaiting_anon_username') {
      setAnonUsername(userText);
      simulateTyping(() => {
        addMessage({ sender: 'bot', type: 'text', text: "Perfecto. Ahora, por favor ingresa un **correo electrónico** al cual podamos contactarte:" });
        setChatState('awaiting_anon_email');
      });
      return;
    }

    if (chatState === 'awaiting_anon_email') {
      setAnonEmail(userText);
      simulateTyping(() => {
        addMessage({ sender: 'bot', type: 'text', text: "Gracias. Finalmente, **describe brevemente el problema** que estás experimentando:" });
        setChatState('awaiting_anon_desc');
      });
      return;
    }

    if (chatState === 'awaiting_ticket_creation' || chatState === 'awaiting_anon_desc') {
      simulateTyping(async () => {
        try {
          const cookies = document.cookie.split(';');
          const tokenCookie = cookies.find(c => c.trim().startsWith('auth_token='));
          const token = tokenCookie ? tokenCookie.split('=')[1] : null;

          let res;
          if (token) {
            // Obtener datos del usuario de localStorage
            const userStr = localStorage.getItem("user");
            let userData = null;
            if (userStr) {
              try { userData = JSON.parse(userStr); } catch (e) { }
            }

            // Usuario logueado
            res = await fetch(`${API_BASE_URL}/api/helpdesk/tickets/auth`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                descripcion: userText,
                idUsuario: userData?.idUsuario || null,
                usernameAfectado: userData?.nombreUsuario || 'Desconocido',
                correoContacto: userData?.correo || 'Desconocido'
              })
            });
          } else {
            // Usuario no logueado (público) - Usamos los estados guardados
            res = await fetch(`${API_BASE_URL}/api/helpdesk/tickets/public`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                usernameAfectado: anonUsername,
                correoContacto: anonEmail,
                descripcion: userText
              })
            });
          }

          if (res.ok) {
            const data = await res.json();
            addMessage({
              sender: 'bot',
              type: 'text',
              text: `He registrado tu solicitud en el área de **${data.areaAsignada.replace('_', ' ')}**. Tu número de ticket es **${data.numeroTicket}**. Un agente revisará tu caso pronto.`
            });
          } else {
            throw new Error("Error del servidor");
          }
        } catch (error) {
          addMessage({ sender: 'bot', type: 'text', text: "Lo siento, hubo un error al registrar el ticket. Inténtalo más tarde." });
        }

        setChatState('idle');
        setTimeout(() => addMessage({ sender: 'bot', type: 'quick_actions', options: ["Volver al menú principal"] }), 500);
      }, 1500);
      return;
    }

    if (chatState === 'awaiting_ticket_search') {
      simulateTyping(async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/helpdesk/tickets/status/${userText.toUpperCase().trim()}`);

          if (res.ok) {
            const data = await res.json();
            addMessage({
              sender: 'bot',
              type: 'ticket_status',
              ticketData: {
                id: data.numeroTicket,
                status: data.estado.toLowerCase() as any,
                description: data.descripcion
              }
            });
          } else {
            addMessage({ sender: 'bot', type: 'text', text: `No pude encontrar ningún ticket con el código **${userText}**. Por favor, verifica el número e intenta nuevamente.` });
          }
        } catch (error) {
          addMessage({ sender: 'bot', type: 'text', text: "Hubo un error al consultar el sistema." });
        }

        setChatState('idle');
        setTimeout(() => addMessage({ sender: 'bot', type: 'quick_actions', options: ["Volver al menú principal"] }), 500);
      }, 1500);
      return;
    }

    // Respuesta genérica por defecto
    simulateTyping(() => {
      addMessage({ sender: 'bot', type: 'text', text: "No entendí muy bien tu solicitud. Por favor, selecciona una de las siguientes opciones:" });
      addMessage({ sender: 'bot', type: 'quick_actions', options: dbQuickActions.length > 0 ? dbQuickActions : ["Registrar Problema", "Consultar Estado de Ticket"] });
    });
  };

  const handleQuickAction = (action: string) => {
    addMessage({ sender: 'user', type: 'text', text: action });

    // 1. Verificar si la acción es una FAQ de la Base de Datos
    const foundFaq = dbFaqs.find(f => f.pregunta === action);
    if (foundFaq) {
      simulateTyping(() => {
        addMessage({ sender: 'bot', type: 'text', text: foundFaq.respuesta });
        setTimeout(() => addMessage({ sender: 'bot', type: 'quick_actions', options: ["Volver al menú principal"] }), 500);
      });
      return;
    }

    // 2. Procesar flujos principales
    switch (action) {
      case "Registrar Problema":
        simulateTyping(() => {
          addMessage({ sender: 'bot', type: 'text', text: "Lamento que tengas problemas. Por favor, describe brevemente el error que estás experimentando:" });
          setChatState('awaiting_ticket_creation');
        });
        break;

      case "Consultar Estado de Ticket":
        simulateTyping(() => {
          addMessage({ sender: 'bot', type: 'text', text: "Por favor, ingresa tu número de ticket (Ejemplo: TK-1045):" });
          setChatState('awaiting_ticket_search');
        });
        break;

      case "Preguntas Frecuentes":
        simulateTyping(() => {
          addMessage({ sender: 'bot', type: 'text', text: "Aquí tienes algunas preguntas comunes:" });
          const faqOptions = dbFaqs.map(f => f.pregunta);
          faqOptions.push("Volver al menú principal");
          addMessage({
            sender: 'bot', type: 'quick_actions', options: faqOptions
          });
        });
        break;

      case "Ir a Iniciar Sesión":
        setIsOpen(false);
        window.location.href = "/login";
        break;

      case "Tengo problemas al iniciar sesión":
        simulateTyping(() => {
          addMessage({ sender: 'bot', type: 'text', text: "¿Qué tipo de problema tienes al acceder?" });
          addMessage({
            sender: 'bot', type: 'quick_actions', options: [
              "¿Olvidaste tu usuario o contraseña?",
              "Otro problema de acceso",
              "Volver atrás"
            ]
          });
        });
        break;

      case "¿Olvidaste tu usuario o contraseña?":
        simulateTyping(() => {
          addMessage({ sender: 'bot', type: 'text', text: "Ve a la pantalla de login y presiona **¿Olvidaste tu usuario o contraseña?**. Allí solo te pediremos tu RUC/DNI o correo para enviarte un enlace de recuperación." });
          setTimeout(() => addMessage({ sender: 'bot', type: 'quick_actions', options: ["Ir a Iniciar Sesión", "Volver atrás"] }), 500);
        });
        break;

      case "Otro problema de acceso":
        simulateTyping(() => {
          addMessage({ sender: 'bot', type: 'text', text: "Entiendo. Vamos a registrar un ticket. Por favor, **ingresa tu número de RUC o nombre de usuario** para identificarte (NO ingreses tu contraseña):" });
          setChatState('awaiting_anon_username');
        });
        break;

      case "Volver atrás":
        simulateTyping(() => {
          addMessage({ sender: 'bot', type: 'quick_actions', options: ["Ir a Iniciar Sesión", "Tengo problemas al iniciar sesión"] });
        });
        break;

      case "Volver al menú principal":
        setChatState('idle');
        simulateTyping(() => {
          addMessage({ sender: 'bot', type: 'text', text: "¿En qué más te puedo ayudar?" });
          const defaultActions = dbQuickActions.length > 0 ? dbQuickActions : ["Registrar Problema", "Consultar Estado de Ticket"];
          addMessage({ sender: 'bot', type: 'quick_actions', options: isLoggedIn ? defaultActions : ["Ir a Iniciar Sesión", "Tengo problemas al iniciar sesión"] });
        });
        break;

      default:
        simulateTyping(() => {
          addMessage({ sender: 'bot', type: 'text', text: "Estamos transfiriendo tu solicitud a un asesor. Por favor espera..." });
        });
        break;
    }
  };

  // --- Render Functions ---
  const renderMessage = (msg: Message) => {
    if (msg.type === 'quick_actions') {
      return (
        <div className="flex flex-wrap gap-2 mt-2" key={msg.id}>
          {msg.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleQuickAction(opt)}
              className="text-[13px] bg-white border border-[#4481eb] text-[#4481eb] px-3 py-1.5 rounded-full hover:bg-[#4481eb] hover:text-white transition-all shadow-sm font-semibold"
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }

    if (msg.type === 'ticket_status' && msg.ticketData) {
      const { id, status, description } = msg.ticketData;
      let statusColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
      let statusText = "EN PROCESO";

      if (status === 'resuelto') {
        statusColor = "bg-green-100 text-green-800 border-green-200";
        statusText = "RESUELTO";
      } else if (status === 'pendiente') {
        statusColor = "bg-red-100 text-red-800 border-red-200";
        statusText = "PENDIENTE";
      }

      return (
        <div key={msg.id} className="flex justify-start my-2 w-full">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-[85%]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <Icons.Ticket /> {id}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${statusColor}`}>
                {statusText}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">{description}</p>
            <button className="w-full text-center text-xs font-bold text-[#4481eb] bg-blue-50 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
              Ver Detalles del Ticket
            </button>
          </div>
        </div>
      );
    }

    const isUser = msg.sender === 'user';

    // Procesar negritas simples (ej. **texto**)
    const formatText = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="font-extrabold">{part.slice(2, -2)}</strong>
          : part
      );
    };

    return (
      <div key={msg.id} className={`flex w-full my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0063AE] to-[#004d8a] flex-shrink-0 flex items-center justify-center text-white shadow-sm mr-2 mt-1">
            <Icons.Bot />
          </div>
        )}
        <div className={`max-w-[75%] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${isUser
          ? 'bg-gradient-to-r from-[#04508e] to-[#0063AE] text-white rounded-2xl rounded-br-sm'
          : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm'
          }`}>
          {formatText(msg.text || '')}
        </div>
      </div>
    );
  };

  if (pathname === "/") return null;

  return (
    <>
      {/* Botón Flotante (Trigger) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-[#FF4081] to-[#e7306c] text-white rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 hover:scale-110 transition-transform duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Abrir asistente de ayuda"
      >
        <Icons.Bot />
        {/* Indicador animado */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
      </button>

      {/* Ventana de Chat (Glassmorphism) */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[360px] h-[550px] max-h-[85vh] max-w-[calc(100vw-32px)] flex flex-col bg-white/85 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden transition-all duration-400 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8 pointer-events-none'
          }`}
      >
        {/* Header */}
        <div className="h-16 bg-gradient-to-r from-[#0063AE] to-[#4481eb] flex items-center justify-between px-4 text-white shadow-md relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Icons.Bot />
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] leading-tight">Suny Bot</h3>
              <p className="text-[11px] text-blue-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
                En línea
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors relative z-10"
          >
            <Icons.Close />
          </button>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50">
          {messages.map(msg => renderMessage(msg))}

          {isTyping && (
            <div className="flex w-full my-3 justify-start items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0063AE] to-[#004d8a] flex-shrink-0 flex items-center justify-center text-white shadow-sm mt-1">
                <Icons.Bot />
              </div>
              <div className="bg-white px-4 py-3 border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Barra de Input */}
        <div className="p-3 bg-white border-t border-gray-100">
          <form
            onSubmit={handleSendText}
            className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:border-[#4481eb] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-inner"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 py-1"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${inputText.trim() && !isTyping
                ? 'bg-gradient-to-r from-[#FF4081] to-[#e7306c] text-white shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              <Icons.Send />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
