import { useState } from "react";
import Info from "../../components/Info";
import { Input, NumberInput, Currency, Select } from "../../components/Inputs";
import { TIPS, METHOD_INFO, BEHAVIOR_INFO } from "../../lib/tips";
import { supabase } from "../../lib/supabase";
import { saveState } from "../../lib/userState";

const toNum = s => +String(s||"").replace(/\./g,"").replace(",",".") || 0;

export default function Onboarding(){
  const [step, setStep] = useState(1);
  const [renda, setRenda] = useState("");
  const [fixas, setFixas] = useState("");
  const [variaveis, setVariaveis] = useState("");
  const [caixa, setCaixa] = useState("");
  const [dividas, setDividas] = useState([{ credor:"", saldo:"", parcela:"", taxaAA:"", atrasada:false }]);
  const [prefer, setPrefer] = useState("custo"); // custo | comportamental
  const [beh, setBeh] = useState("neutro"); // ansioso, disciplinado, ...
  const [reserva, setReserva] = useState("1m"); // 0.5m | 1m | 3m

  const addDiv = ()=> setDividas(v=> [...v, { credor:"", saldo:"", parcela:"", taxaAA:"", atrasada:false }]);
  const rmDiv = (i)=> setDividas(v=> v.filter((_,idx)=> idx!==i));

  const rendaN = +renda || 0, fixasN = +fixas || 0, varsN = +variaveis || 0;
  const gastos = fixasN + varsN;
  const parcelasTot = dividas.reduce((s,d)=> s + (+d.parcela||0), 0);
  const dti = rendaN ? parcelasTot / rendaN : 0;

  let metodo = "snowball";
  const taxas = dividas.map(d=> +d.taxaAA||0);
  const spread = taxas.length? Math.max(...taxas) - Math.min(...taxas) : 0;
  const taxaMedia = taxas.length? taxas.reduce((a,b)=>a+b,0)/taxas.length : 0;
  if (dti > 0.5 || taxaMedia > 300) metodo = "renegociar";
  else if (spread >= 20) metodo = "avalanche";

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-semibold">Onboarding</h1>
      <p className="text-sm text-white/80">3 passos para montar seu plano.</p>

      {step===1 && (
        <section className="mt-4 space-y-3">
          <label className="text-sm text-white/80">Renda mensal líquida <Info tip={TIPS.renda}/></label>
          <Currency value={renda} onChange={setRenda}/>
          <label className="text-sm text-white/80">Despesas fixas <Info tip={TIPS.fixas}/></label>
          <Currency value={fixas} onChange={setFixas}/>
          <label className="text-sm text-white/80">Despesas variáveis <Info tip={TIPS.variaveis}/></label>
          <Currency value={variaveis} onChange={setVariaveis}/>
          <label className="text-sm text-white/80">Caixa hoje <Info tip={TIPS.caixa}/></label>
          <Currency value={caixa} onChange={setCaixa}/>
        </section>
      )}

      {step===2 && (
        <section className="mt-4 space-y-3">
          <div className="text-sm text-white/80">Dívidas <Info tip={TIPS.qtdDividas}/></div>
          {dividas.map((d,i)=>(
            <div key={i} className="grid grid-cols-1 gap-2 rounded-xl p-3 bg-[var(--s2)] sm:grid-cols-5">
              <Input placeholder="Credor" value={d.credor} onChange={v=>{ const cp=[...dividas]; cp[i].credor=v; setDividas(cp); }} />
              <NumberInput placeholder="Taxa a.a. %" value={d.taxaAA} onChange={v=>{ const cp=[...dividas]; cp[i].taxaAA=v; setDividas(cp); }} />
              <Currency placeholder="Saldo" value={d.saldo} onChange={v=>{ const cp=[...dividas]; cp[i].saldo=v; setDividas(cp); }} />
              <Currency placeholder="Parcela mensal" value={d.parcela} onChange={v=>{ const cp=[...dividas]; cp[i].parcela=v; setDividas(cp); }} />
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={d.atrasada} onChange={e=>{ const cp=[...dividas]; cp[i].atrasada=e.target.checked; setDividas(cp); }}/> Atrasada</label>
              <button onClick={()=>rmDiv(i)} className="btn text-xs">Remover</button>
            </div>
          ))}
          <button onClick={addDiv} className="btn text-sm">+ Adicionar dívida</button>
        </section>
      )}

      {step===3 && (
        <section className="mt-4 space-y-3">
          <label className="text-sm text-white/80">Reserva alvo <Info tip={TIPS.reserva}/></label>
          <select className="mt-1 w-full rounded-xl p-2 bg-[var(--s2)]" value={reserva} onChange={e=>setReserva(e.target.value)}>
            <option value="0.5m">0,5 mês</option><option value="1m">1 mês</option><option value="3m">3 meses</option>
          </select>

          <label className="text-sm text-white/80">Preferência de método <Info tip={TIPS.metodo}/></label>
          <select className="mt-1 w-full rounded-xl p-2 bg-[var(--s2)]" value={prefer} onChange={e=>setPrefer(e.target.value)}>
            <option value="custo">Avalanche (menor custo)</option>
            <option value="comportamental">Snowball (motivação)</option>
          </select>
          <p className="text-xs text-white/60 mt-1">{METHOD_INFO[metodo] || ""}</p>

          <label className="text-sm text-white/80 mt-3">Como você se descreve <Info tip={TIPS.comportamento}/></label>
          <select className="mt-1 w-full rounded-xl p-2 bg-[var(--s2)]" value={beh} onChange={e=>setBeh(e.target.value)}>
            <option value="ansioso">Ansioso</option>
            <option value="disciplinado">Disciplinado</option>
            <option value="impulsivo">Impulsivo</option>
            <option value="renda-variavel">Renda variável</option>
            <option value="neutro">Neutro</option>
          </select>
          <p className="text-xs text-white/60 mt-1">{BEHAVIOR_INFO[beh] || ""}</p>

          <hr className="my-3 border-white/10"/>
          <div className="text-sm">Prévia do diagnóstico:</div>
          <div className="text-xs text-white/80">DTI aproximado: {(dti*100 || 0).toFixed(1)}%</div>
          <div className="text-xs text-white/80">Método sugerido: {metodo}</div>
        </section>
      )}

      <div className="mt-4 flex justify-between">
        <button disabled={step===1} onClick={()=>setStep(s=>s-1)} className="btn text-sm">Voltar</button>
        {step<3 ? (
          <button onClick={()=>setStep(s=>s+1)} className="btn btn-primary text-sm">Avançar</button>
        ) : (
          <button
  onClick={()=>{
    const fin = {
      renda: toNum(renda),
      despFixas: toNum(fixas),
      despVars: toNum(variaveis),
      caixa: toNum(caixa),
      dividas: dividas.map(d=>({
        credor: d.credor,
        saldo: toNum(d.saldo),
        parcela: toNum(d.parcela),
        taxaAA: toNum(d.taxaAA),
        atrasada: !!d.atrasada
      })),
      ativos: [],
      micro: []
    };
    const perfil = { preferencia: prefer }; // "custo" | "comportamental"
    localStorage.setItem("quita_fin", JSON.stringify(fin));
    localStorage.setItem("quita_perfil", JSON.stringify(perfil));
    window.location.href = "/?tab=diagnostico";
  }}
  className="btn btn-primary text-sm"
>
 <button
  onClick={async ()=>{
    const toNum = s => +String(s||"").replace(/\./g,"").replace(",",".") || 0;

    const fin = {
      renda: toNum(renda),
      despFixas: toNum(fixas),
      despVars: toNum(variaveis),
      caixa: toNum(caixa),
      dividas: dividas.map(d=>({
        credor: d.credor,
        saldo: toNum(d.saldo),
        parcela: toNum(d.parcela),
        taxaAA: toNum(d.taxaAA),
        atrasada: !!d.atrasada
      })),
      ativos: [],
      micro: []
    };
    const perfil = { preferencia: prefer };

    // sempre salva local
    localStorage.setItem("quita_fin", JSON.stringify(fin));
    localStorage.setItem("quita_perfil", JSON.stringify(perfil));

    // se logado, salva no Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) await saveState(user.id, fin, perfil);
    } catch (e) {
      console.error("save supabase", e);
    }

    // abre já na aba Diagnóstico
    window.location.href = "/?tab=diagnostico";
  }}
  className="btn btn-primary text-sm"
>
  Concluir
</button>


        )}
      </div>
    </main>
  );
}
