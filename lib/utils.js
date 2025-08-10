export const tokens = {
  bg: "#0f0317",
  surface: "#1b0725",
  surface2: "#250a31",
  primary: "#8c3cf7",
  primaryAlt: "#b084ff",
  primaryDark: "#5a1bd6",
  primarySoft: "#d2beff",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,.78)",
  radius: "1.25rem",
};
export const CHART_COLORS = ["#8c3cf7", "#b084ff", "#5a1bd6", "#d2beff", "#6f2ce0"];
export const fmt = (n) => n?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "-";
export const pct = (n) => `${(n * 100).toFixed(1)}%`;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const levelFromXP = (xp) => Math.floor(xp / 100) + 1;
export const progressToNext = (xp) => (xp % 100) / 100;
export const monthKeyNow = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; };
export const isoDate = (d=new Date())=> d.toISOString().slice(0,10);

export const emptyDebt = () => ({ id: typeof crypto!=='undefined'? crypto.randomUUID(): String(Math.random()), nome: "", saldo: "", taxaAA: "", parcelaMensal: "", vencimento: "", detalhesAberto:false, credor:"", tipo:"", atrasada:false, observacao:"" });
export const emptyAsset = () => ({ id: typeof crypto!=='undefined'? crypto.randomUUID(): String(Math.random()), tipo: "", valor: "", liquido: true });
export const emptyMicro = () => ({ id: typeof crypto!=='undefined'? crypto.randomUUID(): String(Math.random()), categoria:"", valor:"", essencialidade:"essencial", recorrencia:"mensal", observacao:"" });
