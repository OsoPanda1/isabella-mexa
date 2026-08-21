import {
  Component,
  lazy,
  Suspense,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
  useEffect,
  useMemo,
} from "react";

import { CrownProvider, useCrown } from "./context/CrownContext";
import { Header } from "./components/Header";
import { GlobalFooter } from "./components/Footer/GlobalFooter";
import { ShortcutToast } from "./components/Shortcuts/ShortcutToast";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts";

/*
 * ============================================================================
 * ISABELLA VILLASEÑOR AI — APPLICATION SHELL
 * ============================================================================
 * Principios:
 * - El App Shell sólo orquesta: no contiene lógica de dominio.
 * - Cada vista pesada se carga bajo demanda.
 * - Toda vista tiene estado de carga y frontera de error.
 * - La telemetría sólo usa metadata permitida; nunca contenido de conversación.
 * - Fondos y diseño viven en index.css: App.tsx no mezcla estilos inline.
 * ============================================================================
 */

type ActiveView =
  | "terminal"
  | "presence"
  | "traceability"
  | "image_studio"
  | "voice_studio"
  | "architecture"
  | "synapse"
  | "telemetry"
  | "presentation"
  | "hub"
  | "codex"
  | "cattleya_finance"
  | "quantum_mesh";

type ViewDefinition = {
  id: ActiveView;
  label: string;
  description: string;
  component: ComponentType;
};

/*
 * Lazy imports:
 * Cada módulo complejo deja de pesar sobre el primer render.
 * Para mantener esta convención, cada archivo de vista debe exportar default.
 */
const IsabellaTerminal = lazyNamed(
  () => import("./components/Terminal/IsabellaTerminal"),
  "IsabellaTerminal"
);

const IsabellaPresenceView = lazyNamed(
  () => import("./components/Presence/IsabellaPresenceView"),
  "IsabellaPresenceView"
);

const TraceabilityDashboard = lazyNamed(
  () => import("./components/Traceability/TraceabilityDashboard"),
  "TraceabilityDashboard"
);

const ImageStudioView = lazyNamed(
  () => import("./components/Studio/ImageStudioView"),
  "ImageStudioView"
);

const VoiceStudioView = lazyNamed(
  () => import("./components/Studio/VoiceStudioView"),
  "VoiceStudioView"
);

const Cockpit = lazyNamed(
  () => import("./components/Dashboard/Cockpit"),
  "Cockpit"
);

const SynapticFlowDiagram = lazyNamed(
  () => import("./components/Dashboard/SynapticFlowDiagram"),
  "SynapticFlowDiagram"
);

const PresentationView = lazyNamed(
  () => import("./components/Presentation/PresentationView"),
  "PresentationView"
);

const IsabellaHubView = lazyNamed(
  () => import("./components/Hub/IsabellaHubView"),
  "IsabellaHubView"
);

const CodexView = lazyNamed(
  () => import("./components/Codex/CodexView"),
  "CodexView"
);

const CattleyaFinanceView = lazyNamed(
  () => import("./components/Dashboard/CattleyaFinanceView"),
  "CattleyaFinanceView"
);

const QuantumMeshDashboard = lazy(
  () => import("./components/Quantum/QuantumMeshDashboard")
);

/*
 * Los modales no bloquean el primer bundle.
 * Se importan al abrirse, no antes.
 */
const IsabellaWelcomeModal = lazyNamed(
  () => import("./components/Welcome/IsabellaWelcomeModal"),
  "IsabellaWelcomeModal"
);

const IsabellaCinematicTrailer = lazyNamed(
  () => import("./components/Welcome/IsabellaCinematicTrailer"),
  "IsabellaCinematicTrailer"
);

const KeyboardShortcutsModal = lazyNamed(
  () => import("./components/Shortcuts/KeyboardShortcutsModal"),
  "KeyboardShortcutsModal"
);

const SecurityGovernanceModal = lazyNamed(
  () => import("./components/Security/SecurityGovernanceModal"),
  "SecurityGovernanceModal"
);

/*
 * Adaptador para módulos sin export default.
 *
 * Ejemplo si Cockpit tuviera:
 * export const Cockpit = () => ...
 *
 * Sustituye el import por:
 * const Cockpit = lazyNamed(
 *   () => import("./components/Dashboard/Cockpit"),
 *   "Cockpit"
 * );
 */
function lazyNamed<T extends Record<string, ComponentType>>(
  importer: () => Promise<T>,
  exportName: keyof T
) {
  return lazy(async () => {
    const module = await importer();
    return { default: module[exportName] };
  });
}

/*
 * ============================================================================
 * ERROR BOUNDARY
 * ============================================================================
 * Una vista no puede derribar toda Isabella.
 * Si un dashboard o módulo externo falla, la shell permanece navegable.
 */

type ViewErrorBoundaryProps = {
  viewLabel: string;
  children: ReactNode;
};

type ViewErrorBoundaryState = {
  hasError: boolean;
};

class ViewErrorBoundary extends Component<
  ViewErrorBoundaryProps,
  ViewErrorBoundaryState
> {
  public state: ViewErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ViewErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    window.dispatchEvent(
      new CustomEvent("isabella:view-error", {
        detail: {
          view: this.props.viewLabel,
          message: error.message,
          componentStack: info.componentStack,
        },
      })
    );
  }

  public componentDidUpdate(previousProps: ViewErrorBoundaryProps) {
    if (
      previousProps.viewLabel !== this.props.viewLabel &&
      this.state.hasError
    ) {
      this.setState({ hasError: false });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <section
          className="empty-state"
          role="alert"
          aria-labelledby="view-error-title"
        >
          <div className="max-w-md">
            <p className="identity-mark">Continuidad operativa</p>

            <h1 id="view-error-title" className="title-section mt-3">
              Este módulo no pudo inicializarse
            </h1>

            <p className="text-muted mt-2 text-sm leading-6">
              La arquitectura principal permanece disponible. Puedes intentar
              cargar de nuevo este espacio sin perder la navegación.
            </p>

            <button
              type="button"
              className="btn btn-secondary mt-5"
              onClick={this.handleRetry}
            >
              Reintentar módulo
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

/*
 * ============================================================================
 * LOADING STATE
 * ============================================================================
 */

function ViewLoadingState({ label }: { label: string }) {
  return (
    <section
      className="surface overflow-hidden"
      aria-busy="true"
      aria-live="polite"
      aria-label={`Cargando ${label}`}
    >
      <div className="panel-header">
        <div className="min-w-0 space-y-3">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-7 w-64 max-w-full" />
        </div>

        <div className="skeleton h-8 w-20 rounded-full" />
      </div>

      <div className="space-y-4 p-5">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-[88%]" />
        <div className="skeleton h-4 w-[67%]" />

        <div className="grid gap-4 pt-4 sm:grid-cols-3">
          <div className="skeleton h-28" />
          <div className="skeleton h-28" />
          <div className="skeleton h-28" />
        </div>
      </div>
    </section>
  );
}

/*
 * ============================================================================
 * UNIFIED VIEW REGISTRY
 * ============================================================================
 * Este registro es la única fuente de verdad entre estado y composición.
 * Ya no hay una cascada de 13 ifs en JSX.
 */

const VIEW_REGISTRY: Record<ActiveView, ViewDefinition> = {
  terminal: {
    id: "terminal",
    label: "Conversación con Isabella",
    description: "Espacio de inteligencia contextual y asistencia soberana.",
    component: IsabellaTerminal,
  },

  presence: {
    id: "presence",
    label: "Presencia Isabella",
    description: "Interfaz de presencia, identidad y vínculo contextual.",
    component: IsabellaPresenceView,
  },

  traceability: {
    id: "traceability",
    label: "Trazabilidad",
    description: "Evidencia, auditoría y continuidad de decisiones.",
    component: TraceabilityDashboard,
  },

  image_studio: {
    id: "image_studio",
    label: "Estudio de imagen",
    description: "Producción visual con control creativo y trazabilidad.",
    component: ImageStudioView,
  },

  voice_studio: {
    id: "voice_studio",
    label: "Estudio de voz",
    description: "Síntesis, dirección y producción vocal.",
    component: VoiceStudioView,
  },

  architecture: {
    id: "architecture",
    label: "Arquitectura CROWN",
    description: "Operación, capacidad y salud del sistema cognitivo.",
    component: Cockpit,
  },

  synapse: {
    id: "synapse",
    label: "Flujo sináptico",
    description: "Relación entre contexto, razonamiento y ejecución.",
    component: SynapticFlowDiagram,
  },

  telemetry: {
    id: "telemetry",
    label: "Telemetría",
    description: "Indicadores operativos de la infraestructura cognitiva.",
    component: Cockpit,
  },

  presentation: {
    id: "presentation",
    label: "Presentación",
    description: "Narrativa institucional de Isabella Villaseñor AI.",
    component: PresentationView,
  },

  hub: {
    id: "hub",
    label: "Hub Isabella",
    description: "Acceso central a capacidades, espacios y flujos activos.",
    component: IsabellaHubView,
  },

  codex: {
    id: "codex",
    label: "Codex",
    description: "Marco documental, principios y conocimiento operativo.",
    component: CodexView,
  },

  cattleya_finance: {
    id: "cattleya_finance",
    label: "Cattleya Finance",
    description: "Visibilidad financiera, sostenibilidad y operación.",
    component: CattleyaFinanceView,
  },

  quantum_mesh: {
    id: "quantum_mesh",
    label: "Quantum Mesh",
    description: "Estado de red, continuidad y coordinación distribuida.",
    component: QuantumMeshDashboard,
  },
};

/*
 * ============================================================================
 * ADVERTISING-SAFE TELEMETRY
 * ============================================================================
 * No se transmite:
 * - prompt, respuesta, memoria, archivo, imagen o audio
 * - identificadores personales
 * - emoción, salud, ingresos o información de perfil sensible
 *
 * Sí se transmite:
 * - vista activa y tipo de superficie
 * - datos técnicos estrictamente necesarios para campañas autorizadas
 */

function trackSafePageView(activeView: ActiveView) {
  if (typeof window === "undefined") return;

  const ads = window.isabellaAds;

  if (ads?.consent === "granted") {
    ads.track("PageView", {
      view: activeView,
      navigation: "application-state",
    });

    return;
  }

  /*
   * Compatibilidad temporal:
   * Si mantienes otro sistema de telemetría institucional, con consentimiento
   * propio, conéctalo aquí. No envíes datos de chat.
   */
  if (typeof window.idlen === "function") {
    try {
      window.idlen("track", "PageView", {
        view: activeView,
        navigation: "application-state",
      });
    } catch {
      /* La experiencia principal no depende de un proveedor publicitario. */
    }
  }
}

/*
 * ============================================================================
 * MAIN CONTENT
 * ============================================================================
 */

function MainContent() {
  useGlobalShortcuts();

  const {
    state,
    isWelcomeOpen,
    closeWelcomeModal,
    isTrailerOpen,
    closeTrailer,
    isShortcutsOpen,
    closeShortcutsModal,
    lastShortcutTriggered,
    clearShortcutFeedback,
  } = useCrown();

  const activeView = state.activeView as ActiveView;

  const view = useMemo(
    () => VIEW_REGISTRY[activeView] ?? VIEW_REGISTRY.terminal,
    [activeView]
  );

  const ActiveViewComponent = view.component;

  useEffect(() => {
    document.title = `${view.label} — Isabella Villaseñor AI`;

    trackSafePageView(view.id);

    window.dispatchEvent(
      new CustomEvent("isabella:view-changed", {
        detail: {
          id: view.id,
          label: view.label,
        },
      })
    );
  }, [view.id, view.label]);

  return (
    <>
      <main
        id="main-content"
        className="app-main"
        tabIndex={-1}
        aria-labelledby="view-title"
      >
        <div className="page-container">
          <header className="mb-6">
            <p className="identity-mark">Isabella Villaseñor AI</p>

            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 id="view-title" className="title-page">
                  {view.label}
                </h1>

                <p className="text-muted mt-2 max-w-2xl text-sm leading-6">
                  {view.description}
                </p>
              </div>

              <span className="badge badge-success">
                <span className="status-dot" aria-hidden="true" />
                Sistema disponible
              </span>
            </div>

            <div className="divider-platinum mt-6" />
          </header>

          <ViewErrorBoundary viewLabel={view.label}>
            <Suspense fallback={<ViewLoadingState label={view.label} />}>
              {view.id === "synapse" ? (
                <div className="space-y-6">
                  <ActiveViewComponent />
                  <Suspense fallback={<ViewLoadingState label="Cockpit" />}>
                    <Cockpit />
                  </Suspense>
                </div>
              ) : (
                <ActiveViewComponent />
              )}
            </Suspense>
          </ViewErrorBoundary>
        </div>
      </main>

      <Suspense fallback={null}>
        {isTrailerOpen ? (
          <IsabellaCinematicTrailer
            isOpen={isTrailerOpen}
            onClose={closeTrailer}
          />
        ) : null}

        {isWelcomeOpen ? (
          <IsabellaWelcomeModal
            isOpen={isWelcomeOpen}
            onClose={closeWelcomeModal}
          />
        ) : null}

        {isShortcutsOpen ? (
          <KeyboardShortcutsModal
            isOpen={isShortcutsOpen}
            onClose={closeShortcutsModal}
          />
        ) : null}

        <SecurityGovernanceModal />
      </Suspense>

      <ShortcutToast
        message={lastShortcutTriggered}
        onDismiss={clearShortcutFeedback}
      />
    </>
  );
}

/*
 * ============================================================================
 * APP ROOT
 * ============================================================================
 */

export default function App() {
  return (
    <CrownProvider>
      <div className="app-shell flex min-h-dvh flex-col">
        <Header />

        <div className="flex min-h-0 flex-1 flex-col">
          <MainContent />
        </div>

        <GlobalFooter />
      </div>
    </CrownProvider>
  );
}
