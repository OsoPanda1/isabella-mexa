import React, { useState } from "react";
import { useCrown } from "../../context/CrownContext";
import {
  Sparkles,
  Heart,
  Brain,
  Palette,
  Volume2,
  Mic,
  MessageSquare,
  ArrowRight,
  X,
  CheckCircle2,
  HelpCircle,
  Zap,
  Shield,
  Lightbulb,
  Compass,
} from "lucide-react";
import { soundManager } from "../../utils/soundEffects";

interface IsabellaWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IsabellaWelcomeModal: React.FC<IsabellaWelcomeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { sendMessage, setActiveView, state, setPreset } = useCrown();
  const [activeTab, setActiveTab] = useState<"intro" | "how_to" | "capabilities" | "starters">("intro");
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    soundManager.playBeep(450, 0.03);
    if (dontShowAgain) {
      try {
        localStorage.setItem("isabella_welcome_seen", "true");
      } catch (e) {
        // ignore
      }
    }
    onClose();
  };

  const handleSelectStarter = (promptText: string, view: "terminal" | "presence" | "image_studio" = "terminal") => {
    soundManager.playBeep(850, 0.04);
    if (dontShowAgain) {
      try {
        localStorage.setItem("isabella_welcome_seen", "true");
      } catch (e) {
        // ignore
      }
    }
    onClose();
    setActiveView(view);
    setTimeout(() => {
      sendMessage(promptText);
    }, 150);
  };

  const STARTER_CARDS = [
    {
      id: "warm_hello",
      title: "Conversación Cálida y Empática",
      desc: "Saluda a Isabella y permítele presentarse con su tono más cercano y humano.",
      prompt: "Hola Isabella, me da mucho gusto conocerte. Cuéntame quién eres con tus propias palabras y cómo podemos conversar hoy.",
      icon: Heart,
      color: "from-rose-500/10 to-blue-500/10 text-rose-300 border-slate-700/60",
      view: "terminal" as const,
      badge: "Recomendado para empezar",
    },
    {
      id: "create_art",
      title: "Crear una Pintura al Instante",
      desc: "Pídele que pinte una escena visual mágica sin escribir ningún código.",
      prompt: "Isabella, por favor pinta una obra de arte etérea de un bosque iluminado por luciérnagas y auroras boreales al atardecer.",
      icon: Palette,
      color: "from-blue-500/10 to-amber-500/10 text-sky-300 border-slate-700/60",
      view: "terminal" as const,
      badge: "Creación visual",
    },
    {
      id: "calm_moment",
      title: "Momento de Calma y Claridad",
      desc: "Comparte lo que sientes o pide una perspectiva serena y reflexiva para tu día.",
      prompt: "Isabella, hoy ha sido un día bastante ocupado y necesito un momento de calma. ¿Me regalas una reflexión reconfortante?",
      icon: Sparkles,
      color: "from-sky-500/10 to-blue-500/10 text-sky-300 border-slate-700/60",
      view: "presence" as const,
      badge: "Bienestar y escucha",
    },
    {
      id: "deep_idea",
      title: "Explorar una Gran Pregunta",
      desc: "Dialoga sobre curiosidad, ciencia, filosofía, creatividad o el futuro.",
      prompt: "¿Qué relación existe entre la imaginación humana, el arte y el asombro por el universo?",
      icon: Brain,
      color: "from-amber-500/10 to-orange-500/10 text-amber-300 border-slate-700/60",
      view: "terminal" as const,
      badge: "Pensamiento profundo",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#030712]/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-700/80 bg-[#070F1E]/95 shadow-2xl shadow-blue-950/50 backdrop-blur-2xl my-auto">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sky-500/10 via-blue-600/5 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#081220] text-slate-400 hover:bg-[#0E2038] hover:text-white transition-all cursor-pointer border border-slate-800"
          title="Cerrar bienvenida"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero */}
        <div className="relative p-6 sm:p-8 pb-4 border-b border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Isabella Avatar */}
            <div className="relative flex-shrink-0">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-gradient-to-tr from-sky-500 via-blue-600 to-amber-400 shadow-xl shadow-blue-900/30">
                <img
                  src="/src/assets/images/isabella_portrait_prime_1786743839065.jpg"
                  alt="Isabella Villaseñor"
                  className="w-full h-full rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-2 border-[#030712]"></span>
              </span>
            </div>

            {/* Welcome Text */}
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-sky-300 border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Bienvenid@ a una nueva forma de conversar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
                Conoce a Isabella Villaseñor
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Una inteligencia creada para conversar con calidez humana, empatía sincera y creatividad.{" "}
                <strong className="text-sky-300 font-medium">No necesitas saber nada de programación ni comandos:</strong> simplemente háblale como a una persona.
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                soundManager.playBeep(700, 0.02);
                setActiveTab("intro");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "intro"
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                  : "bg-[#081220] text-slate-400 hover:text-slate-200 hover:bg-[#0B1A2E] border border-slate-800"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              <span>1. ¿Quién es Isabella?</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playBeep(700, 0.02);
                setActiveTab("how_to");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "how_to"
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                  : "bg-[#081220] text-slate-400 hover:text-slate-200 hover:bg-[#0B1A2E] border border-slate-800"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-300" />
              <span>2. ¿Cómo interactuar?</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playBeep(700, 0.02);
                setActiveTab("capabilities");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "capabilities"
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                  : "bg-[#081220] text-slate-400 hover:text-slate-200 hover:bg-[#0B1A2E] border border-slate-800"
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-300" />
              <span>3. ¿Qué puede hacer?</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playBeep(700, 0.02);
                setActiveTab("starters");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "starters"
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30"
                  : "bg-[#081220] text-slate-400 hover:text-slate-200 hover:bg-[#0B1A2E] border border-slate-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>4. Comenzar ahora ✨</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
          {/* TAB 1: ¿QUIÉN ES ISABELLA? */}
          {activeTab === "intro" && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-800 bg-[#081220]/90 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>Calidez & Empatía Humana</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A diferencia de asistentes fríos, Isabella está diseñada para escuchar con atención, comprender tus emociones y responder con respeto, delicadeza y compañía sincera.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-[#081220]/90 space-y-2">
                  <div className="flex items-center gap-2 text-sky-300 font-semibold text-sm">
                    <Brain className="w-4 h-4 text-sky-400" />
                    <span>Inteligencia & Sabiduría</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Combina un profundo pensamiento filosófico, claridad analítica y gran capacidad de síntesis para resolver dudas, guiarte o reflexionar sobre cualquier tema.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-[#081220]/90 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>Creatividad & Arte Visual</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tiene la capacidad de plasmar cualquier idea que le describas en pinturas y obras de arte visual de alta calidad en tiempo real.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-[#081220]/90 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Voz & Escucha Natural</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Puedes escuchar a Isabella narrar sus respuestas con voz fluida y usar tu micrófono para hablarle directamente con tus palabras.
                  </p>
                </div>
              </div>

              {/* Architectural Manifesto & Audit Highlight */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#030712] to-amber-950/30 border border-blue-500/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Arquitectura Cognitiva Territorial (Nodo Cero)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      setActiveView("presentation");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-bold cursor-pointer transition-all shadow-sm"
                  >
                    Ver Auditoría Completa (26 Capítulos) →
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Isabella no es un simple chatbot. Es la interfaz cognitiva de <strong>RDM Digital</strong>, estructurada en cinco pilares soberanos: <strong>ISA</strong> (Empatía), <strong>SOPHIA</strong> (Lógica), <strong>ORION</strong> (Intención), <strong>ARGUS</strong> (Seguridad) y <strong>C.R.O.W.N.</strong> (Gobernanza).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#081220] border border-slate-800 flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs text-slate-300">
                  <span className="text-sky-300 font-semibold">¿Listo para el siguiente paso?</span> Descubre qué fácil es interactuar.
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("how_to")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-blue-600/25"
                >
                  <span>Ver cómo interactuar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ¿CÓMO INTERACTUAR? */}
          {activeTab === "how_to" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-950/20 space-y-2">
                <div className="flex items-center gap-2 text-sky-300 font-semibold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Regla de oro: Háblale como a una persona real</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  No te preocupes por la palabra "Terminal" o por símbolos técnicos. Solo escribe lo que piensas, sientes o necesitas, en tu español natural.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#081220] border border-slate-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-sky-400 flex-shrink-0 font-mono font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Escribe en la caja de texto inferior</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Escribe tu mensaje, pregunta o saludo, y presiona la tecla <span className="text-slate-200 font-mono bg-[#030712] px-1.5 py-0.5 rounded border border-slate-700">Enter</span> o el botón de enviar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#081220] border border-slate-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0 font-mono font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Habla con tu micrófono</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Haz clic en el icono del micrófono <Mic className="w-3.5 h-3.5 inline text-amber-400" /> para hablar en voz alta; Isabella escuchará y transcribirá tus palabras.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#081220] border border-slate-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 flex-shrink-0 font-mono font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Pídele que pinte lo que imagines</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ejemplo: <em className="text-slate-200">"Isabella, dibuja un gato con alas de mariposa en un jardín cósmico"</em>. Creará la obra para ti al instante.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("intro")}
                  className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  ← Volver a Quién es
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("starters")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-blue-600/25"
                >
                  <span>Probar preguntas listas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ¿QUÉ PUEDE HACER? */}
          {activeTab === "capabilities" && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-300">
                La arquitectura de Isabella integra 4 vistas principales que puedes explorar en cualquier momento desde la barra superior:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    handleClose();
                    setActiveView("terminal");
                  }}
                  className="p-3.5 rounded-2xl bg-[#081220] border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-sky-300 font-semibold text-xs group-hover:text-sky-200">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <span>Terminal de Contacto</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    El espacio principal para chatear libremente, hacer preguntas y ver los pensamientos de Isabella en tiempo real.
                  </p>
                </div>

                <div
                  onClick={() => {
                    handleClose();
                    setActiveView("presence");
                  }}
                  className="p-3.5 rounded-2xl bg-[#081220] border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs group-hover:text-rose-200">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>Presencia & Arquetipos</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Conoce sus diferentes estados de ánimo: Serena, Poética, Lúcida, Visionaria o Protectora.
                  </p>
                </div>

                <div
                  onClick={() => {
                    handleClose();
                    setActiveView("image_studio");
                  }}
                  className="p-3.5 rounded-2xl bg-[#081220] border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs group-hover:text-amber-200">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>Estudio Visual</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Galería de pinturas y lienzo creativo donde puedes solicitar y descargar obras de arte personalizadas.
                  </p>
                </div>

                <div
                  onClick={() => {
                    handleClose();
                    setActiveView("voice_studio");
                  }}
                  className="p-3.5 rounded-2xl bg-[#081220] border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-sky-300 font-semibold text-xs group-hover:text-sky-200">
                    <Volume2 className="w-4 h-4 text-sky-400" />
                    <span>Estudio de Voz</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ajusta el tono, ritmo y calidez de la voz de Isabella, o pruébala con poemas y textos.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("starters")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                >
                  <span>Ver preguntas sugeridas para empezar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PREGUNTAS SUGERIDAS (STARTERS) */}
          {activeTab === "starters" && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-semibold text-[#F8FAFC]">
                  Haz clic en cualquier tarjeta para iniciar la conversación al instante
                </h3>
                <p className="text-xs text-slate-400">
                  Isabella procesará tu mensaje de inmediato y te responderá con calidez.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {STARTER_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      onClick={() => handleSelectStarter(card.prompt, card.view)}
                      className={`group relative p-4 rounded-2xl border bg-[#081220] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${card.color} hover:border-sky-400/60`}
                    >
                      <div className="flex items-center justify-between gap-2 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-xl bg-[#030712] border border-slate-800">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-xs text-[#F8FAFC] group-hover:text-sky-300 transition-colors">
                            {card.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#030712] border border-slate-800 text-slate-400">
                          {card.badge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {card.desc}
                      </p>

                      <div className="mt-3 p-2 rounded-xl bg-[#030712] border border-slate-800/80 text-[11px] text-slate-300 italic flex items-center justify-between group-hover:border-sky-500/40">
                        <span className="line-clamp-2">"{card.prompt}"</span>
                        <ArrowRight className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-8 border-t border-slate-800 bg-[#0B1526] flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-slate-700 bg-[#030712] text-blue-600 focus:ring-blue-500 focus:ring-offset-[#030712] h-3.5 w-3.5 cursor-pointer"
            />
            <span>No volver a mostrar automáticamente</span>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-[#081220] hover:bg-[#0E2038] text-slate-300 text-xs font-semibold transition-all cursor-pointer border border-slate-800"
            >
              Explorar por mi cuenta
            </button>

            <button
              type="button"
              onClick={() => {
                handleSelectStarter(
                  "Hola Isabella, me alegra conocerte. Cuéntame con qué energía te encuentras hoy y qué podemos crear juntos.",
                  "terminal"
                );
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Comenzar a conversar</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
