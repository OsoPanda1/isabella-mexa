import React from "react";
import { Shield, Key, Lock, FileText, CheckCircle2, AlertTriangle, Cpu } from "lucide-react";

const PROFILES = [
  {
    id: "LATAMV-KEM-1",
    name: "Establecimiento de Claves (KEM)",
    algorithm: "ML-KEM-768 + X25519 (Híbrido)",
    status: "active",
    type: "standard",
    details: "Transcript binding activado. Resiliencia contra algoritmos de Shor. Protección de túneles de telemetría y estado de red.",
    usage: "100% (Modo Estándar CROWN)"
  },
  {
    id: "LATAMV-SIG-1",
    name: "Firma Digital Principal (SIG)",
    algorithm: "ML-DSA-87",
    status: "active",
    type: "standard",
    details: "Firmas deterministas y rápidas. Anclaje principal para el Ledger BookPI y las transacciones de validación de LITLE 32 Gates.",
    usage: "100% (Verificación de Integridad)"
  },
  {
    id: "LATAMV-SIG-LONG-1",
    name: "Preservación Largo Plazo (SIG-LONG)",
    algorithm: "SLH-DSA-128s",
    status: "active",
    type: "standard",
    details: "Hash-based signatures. Utilizado para documentos canónicos y actas de gobernanza que requieren décadas de inmutabilidad comprobable.",
    usage: "Archivos Inmutables & Códice"
  },
  {
    id: "LATAMV-SIG-EXP-1",
    name: "Firmas Compactas (SIG-EXP)",
    algorithm: "FN-DSA-512 (Falcon)",
    status: "experimental",
    type: "experimental",
    details: "Draft FIPS 206. Uso restringido para la malla CITEMESH IoT donde el ancho de banda es hiper-restringido.",
    usage: "Edge Nodes & IoT (CITEMESH)"
  },
  {
    id: "LATAMV-KEM-BACKUP-1",
    name: "Respaldo Code-Based (KEM-BAK)",
    algorithm: "HQC-128 / BIKE-128",
    status: "standby",
    type: "backup",
    details: "Diversidad criptográfica de respaldo. Evaluado offline mediante LITLE Gates para eventual failover si KEM colapsa.",
    usage: "Standby & Air-Gapped"
  }
];

export const CryptographyTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#030712] border border-slate-800 p-6 rounded-xl flex items-start gap-4">
          <div className="p-3 bg-emerald-900/30 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">CRYSTALS-LATAMV</h4>
            <p className="text-xs text-slate-400 mt-1">Perfil criptográfico poscuántico activo y validado.</p>
          </div>
        </div>
        <div className="bg-[#030712] border border-slate-800 p-6 rounded-xl flex items-start gap-4">
          <div className="p-3 bg-indigo-900/30 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">LITLE 32 Gates</h4>
            <p className="text-xs text-slate-400 mt-1">Validación lógica inyectando entropía estructural.</p>
          </div>
        </div>
        <div className="bg-[#030712] border border-slate-800 p-6 rounded-xl flex items-start gap-4">
          <div className="p-3 bg-amber-900/30 text-amber-400 rounded-lg border border-amber-500/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">KEM Híbrido</h4>
            <p className="text-xs text-slate-400 mt-1">X25519 co-ejecutado con ML-KEM para redundancia clásica.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-light text-slate-100 flex items-center gap-2 border-b border-slate-800/60 pb-3">
          <FileText className="w-4 h-4 text-slate-400" />
          Subperfiles Operacionales (TAMV-RFC-0007)
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PROFILES.map((p) => (
            <div key={p.id} className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {p.type === 'standard' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {p.type === 'experimental' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {p.type === 'backup' && <Shield className="w-4 h-4 text-slate-400" />}
                  <h4 className="font-mono text-sm text-slate-200 font-bold">{p.id}</h4>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-widest ${
                  p.status === 'active' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 
                  p.status === 'experimental' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' :
                  'bg-slate-800 text-slate-400 border-slate-600'
                }`}>
                  {p.status}
                </span>
              </div>
              <h5 className="text-xs font-bold text-indigo-300 mb-2">{p.name}</h5>
              <div className="text-[10px] font-mono text-slate-400 mb-3 bg-[#030712] p-2 rounded border border-slate-800/50">
                Algoritmo: <span className="text-slate-300">{p.algorithm}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {p.details}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800/50 pt-3">
                <span className="text-slate-500">Despliegue:</span>
                <span className="text-slate-300">{p.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
