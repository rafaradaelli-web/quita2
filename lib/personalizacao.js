export const PERFIS_SITUACAO = ["critico","apertado","emProgresso","equilibrado"];
export const PERFIS_COMPORTAMENTO = ["ansioso","disciplinado","impulsivo","renda-variavel","neutro"];

export function perfilFromData(diag, fin, preferencia){
  let situacao = "equilibrado";
  if (diag.dti > 0.6 || diag.mesesEmerg < 0.5) situacao = "critico";
  else if (diag.dti > 0.4 || diag.mesesEmerg < 1) situacao = "apertado";
  else if (diag.dti > 0.25 || diag.mesesEmerg < 3) situacao = "emProgresso";

  let comportamento = "neutro";
  if (preferencia === "custo") comportamento = "disciplinado";
  if (preferencia === "comportamental") comportamento = "impulsivo";

  const gastos = diag.gastos || 0;
  const ocas = fin.micro.filter(m=>m.recorrencia==="ocasional").reduce((s,m)=>s+(+m.valor||0),0);
  if (gastos>0 && ocas > (gastos*0.2)) comportamento = "renda-variavel";

  return { situacao, comportamento };
}

export function personalizedTips({situacao, comportamento}){
  const tips = [];
  if (situacao === "critico") tips.push("Priorize mínimos + renegociação. Pause supérfluos por 30 dias. Mini-reserva de 1 mês.");
  if (situacao === "apertado") tips.push("Foque em reduzir DTI 3 p.p./mês e elevar reserva a 1–3 meses.");
  if (situacao === "emProgresso") tips.push("Mantenha consistência. Reaplique parcelas quitadas e aumente reserva.");
  if (situacao === "equilibrado") tips.push("Otimize custo total e acelere quitação final.");
  if (comportamento === "ansioso") tips.push("Tarefas curtas e vitórias rápidas. Snowball recomendado.");
  if (comportamento === "disciplinado") tips.push("Avalanche para minimizar juros. Revisões mensais de ordem.");
  if (comportamento === "impulsivo") tips.push("Bloqueios de gasto e metas visuais. Recompensas frequentes.");
  if (comportamento === "renda-variavel") tips.push("Metas elásticas. Parcela extra somente em meses de alta.");
  if (comportamento === "neutro") tips.push("Plano padrão e rotina semanal.");
  return tips;
}
