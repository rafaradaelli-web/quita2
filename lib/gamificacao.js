import { levelFromXP } from "./utils";

export function computeStreak(lastISO, nowISO, current){
  if(!lastISO) return 1;
  const last = new Date(lastISO); const now = new Date(nowISO);
  const diffDays = Math.floor((now - last)/(1000*60*60*24));
  if (diffDays === 0) return current;
  if (diffDays === 1) return current + 1;
  return 1;
}

export function getAchievements(xp, streak, diag){
  return [
    { id:"lvl2", nome:"Nível 2", cond: xp >= 100 },
    { id:"lvl5", nome:"Nível 5", cond: levelFromXP(xp) >= 5 },
    { id:"streak3", nome:"Streak 3 dias", cond: streak >= 3 },
    { id:"streak7", nome:"Streak 7 dias", cond: streak >= 7 },
    { id:"dti30", nome:"DTI abaixo de 30%", cond: diag.dti < 0.30 },
    { id:"reserva1", nome:"Reserva ≥ 1 mês", cond: diag.mesesEmerg >= 1 },
    { id:"primeira", nome:"Primeira etapa concluída", cond: xp >= 10 },
  ];
}

export function generateQuests(diag, perfil){
  const base = [];
  base.push({ id:"q1", nome:"Registrar 100% das dívidas", xp:20, coins:20 });
  if (diag.metodo === "avalanche") base.push({ id:"q2", nome:"Aplicar extra na dívida de maior taxa", xp:30, coins:30 });
  if (diag.metodo === "snowball") base.push({ id:"q3", nome:"Quitar a menor dívida", xp:40, coins:40 });
  if (diag.metodo === "renegociar") base.push({ id:"q4", nome:"Abrir 1 negociação com credor", xp:35, coins:35 });
  if (perfil.comportamento === "ansioso") base.push({ id:"q5", nome:"Concluir 3 tarefas curtas hoje", xp:25, coins:20 });
  if (perfil.comportamento === "renda-variavel") base.push({ id:"q6", nome:"Criar envelope de reserva variável", xp:20, coins:20 });
  base.push({ id:"q7", nome:"Check-in diário 3 dias seguidos", xp:30, coins:30 });
  return base;
}
