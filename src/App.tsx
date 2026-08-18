import React from "react";
import { CrownProvider, useCrown } from "./context/CrownContext";
import { Header } from "./components/Header";
import { GlobalFooter } from "./components/Footer/GlobalFooter";
import { IsabellaTerminal } from "./components/Terminal/IsabellaTerminal";
import { IsabellaPresenceView } from "./components/Presence/IsabellaPresenceView";
import { ImageStudioView } from "./components/Studio/ImageStudioView";
import { VoiceStudioView } from "./components/Studio/VoiceStudioView";
import { Cockpit } from "./components/Dashboard/Cockpit";
import { SynapticFlowDiagram } from "./components/Dashboard/SynapticFlowDiagram";
import { PresentationView } from "./components/Presentation/PresentationView";
import { IsabellaHubView } from "./components/Hub/IsabellaHubView";
import { TraceabilityDashboard } from "./components/Traceability/TraceabilityDashboard";
import { CodexView } from "./components/Codex/CodexView";
import { CattleyaFinanceView } from "./components/Dashboard/CattleyaFinanceView";
import { IsabellaWelcomeModal } from "./components/Welcome/IsabellaWelcomeModal";
import { IsabellaCinematicTrailer } from "./components/Welcome/IsabellaCinematicTrailer";
import { KeyboardShortcutsModal } from "./components/Shortcuts/KeyboardShortcutsModal";
import { SecurityGovernanceModal } from "./components/Security/SecurityGovernanceModal";
import { ShortcutToast } from "./components/Shortcuts/ShortcutToast";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts";

const MainContent: React.FC = () => {
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
  const { activeView } = state;

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {activeView === "terminal" && <IsabellaTerminal />}
        {activeView === "presence" && <IsabellaPresenceView />}
        {activeView === "traceability" && <TraceabilityDashboard />}
        {activeView === "image_studio" && <ImageStudioView />}
        {activeView === "voice_studio" && <VoiceStudioView />}
        {activeView === "architecture" && <Cockpit />}
        {activeView === "synapse" && (
          <div className="space-y-6">
            <SynapticFlowDiagram />
            <Cockpit />
          </div>
        )}
        {activeView === "telemetry" && <Cockpit />}
        {activeView === "presentation" && <PresentationView />}
        {activeView === "hub" && <IsabellaHubView />}
        {activeView === "codex" && <CodexView />}
        {activeView === "cattleya_finance" && <CattleyaFinanceView />}
      </main>

      {/* 16-Second AAA Cinematic Intro Trailer (Auto-opens on link entry) */}
      <IsabellaCinematicTrailer
        isOpen={isTrailerOpen}
        onClose={closeTrailer}
      />

      {/* Zero-Trust Security & Governance Telemetry Modal */}
      <SecurityGovernanceModal />

      {/* Elegant Welcoming & Onboarding Guide for Everyone */}
      <IsabellaWelcomeModal
        isOpen={isWelcomeOpen}
        onClose={closeWelcomeModal}
      />

      {/* Power User Global Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={closeShortcutsModal}
      />

      {/* Subtle Toast Feedback for Hotkeys */}
      <ShortcutToast
        message={lastShortcutTriggered}
        onDismiss={clearShortcutFeedback}
      />
    </>
  );
};

export default function App() {
  return (
    <CrownProvider>
      <div className="min-h-screen bg-[#030712] text-[#F8FAFC] flex flex-col selection:bg-blue-600 selection:text-white relative font-sans">
        {/* Subtle Enterprise Precision Grid & Ambient Lighting (Petrol, Electric Blue, Gold) */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.14]"
          style={{
            backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.25) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />
        {/* Petroleum Blue Depth Ambient */}
        <div className="fixed top-0 left-1/4 w-[36rem] h-[36rem] bg-[#0B2545]/30 rounded-full blur-[120px] pointer-events-none" />
        {/* Electric Neural Blue Focus Ambient */}
        <div className="fixed top-1/3 right-1/4 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        {/* Subtle Warm Champagne Gold Aura */}
        <div className="fixed bottom-10 left-1/3 w-[26rem] h-[26rem] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

        <Header />
        <MainContent />
        <GlobalFooter />
      </div>
    </CrownProvider>
  );
}

