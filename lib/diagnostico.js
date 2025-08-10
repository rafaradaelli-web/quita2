export function recomendarEstrategia(fin){
  const renda = +fin.renda || 0;
  const gastosBase = (+fin.despFixas||0) + (+fin.despVars||0);
  const gastosMicro = fin.micro.reduce((s,m)=> s + (+m.valor||0), 0);
  const gastos = gastosBase + gastosMicro;
  const margem = Math.max(renda - gastos, 0);
  const parcelas = fin.dividas.reduce((s,d)=> s + (+d.parcelaMensal||0), 0);
  const dti = renda ? parcelas / renda : 0;
  const taxas = fin.dividas.map(d=> +d.taxaAA||0);
  const maior = taxas.length? Math.max(...taxas):0;
  const menor = taxas.length? Math.min(...taxas):0;
  const spread = taxas.length? maior - menor:0;
  const taxaMedia = taxas.length? taxas.reduce((a,b)=>a+b,0)/taxas.length:0;
  const caixa = +fin.caixa || 0;
  const mesesEmerg = gastos? caixa / gastos : 0;
  let metodo = spread >= 20 ? "avalanche" : "snowball";
  if (dti > 0.5 || taxaMedia > 300) metodo = "renegociar";
  const foco = mesesEmerg < 1 ? "montar-emergencia" : "amortizar";
  return { dti, margem, gastos, metodo, taxaMedia, spread, mesesEmerg, foco, gastosBase, gastosMicro };
}

export function strategyText(diag, fin){
  const linhas = [];
  if (diag.mesesEmerg < 1){
    linhas.push("1) Monte um mini-fundo de emergência até 1 mês de gastos. Direcione 10%–20% da margem até atingir o alvo. Mantenha em conta de alto rendimento com liquidez diária.");
  } else if (diag.mesesEmerg < 3){
    linhas.push("1) Continue reforçando a reserva até 3 meses de gastos. Use gatilhos automáticos de transferência pós-salário.");
  } else {
    linhas.push("1) Reserva suficiente no curto prazo. Preserve liquidez e evite resgates para consumo.");
  }
  if (diag.metodo === "renegociar"){
    linhas.push("2) Priorize renegociação/consolidação. Portabilidade de dívida, acordo à vista com desconto. Nunca atrase mínimos.");
  } else if (diag.metodo === "avalanche"){
    linhas.push("2) Avalanche: ordene por taxa a.a. e aplique a parcela extra na dívida de maior juros.");
  } else {
    linhas.push("2) Snowball: quite a menor dívida para ganho rápido e role a parcela para a próxima.");
  }
  if (diag.gastosMicro > 0){
    linhas.push("3) Revise micro. Corte 10% de supérfluos por 30 dias. Congele assinaturas pouco usadas.");
  } else {
    linhas.push("3) Estruture 50/30/20 adaptado até zerar dívidas. Registre microgastos.");
  }
  linhas.push("4) Metas mensais: DTI -3 p.p., reserva +0,25 mês. Check-in periódico.");
  linhas.push("5) Se margem baixa, buscar +R$ 200/mês de renda extra temporária.");
  return linhas.join("\n");
}
