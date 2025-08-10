import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";

import Card from "@/components/Card";
import { Stat } from "@/components/Stat";
import { Input, Currency, Select } from "@/components/Inputs";
import Illo from "@/components/Illo";

import {
  tokens, fmt, pct,
  levelFromXP, progressToNext,
  monthKeyNow, isoDate,
  emptyDebt, emptyAsset, emptyMicro
} from "@/lib/utils";

import { recomendarEstrategia, strategyText } from "@/lib/diagnostico";
import { PERFIS_SITUACAO, PERFIS_COMPORTAMENTO, perfilFromData, personalizedTips } from "@/lib/personalizacao";
import { computeStreak, getAchievements, generateQuests } from "@/lib/gamificacao";

import { supabase } from "@/lib/supabase";
import { loadState } from "@/lib/userState";

const Charts = dynamic(() => import("@/components/ChartsClient"), { ssr: false });

const BRAND = "Quita";

export default function App(){
  const [tab, setTab] = useState("home");

  const [xp, setXP] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastCheckin, setLastCheckin] = useState(null);

  const [session, setSession] = useState(null);

  const [perfil, setPerfil] = useState({ nome:"", preferencia:"custo", periodicidade:"mensal" });
  const [fin, setFin] = useState({
    renda:"", despFixas:"", despVars:"", caixa:"",
    dividas:[emptyDebt()], ativos:[emptyAsset()], micro:[emptyMicro()]
  });

  const [repl, setRepl] = useState({ monthKey: monthKeyNow(), used: 0, queued:false });

  const diag = useMemo(()=> recomendarEstrategia(fin), [fin]);
  const prof = useMemo(()=> perfilFromData(diag, fin, perfil.preferencia), [diag, fin, perfil.preferencia]);

  const totalAtivos  = useMemo(()=> fin.ativos.reduce((s,a)=> s + (+a.valor||0), 0), [fin.ativos]);
  const saldoDevedor = useMemo(()=> fin.dividas.reduce((s,d)=> s + (+d.saldo||0), 0), [fin.dividas]);
  const parcelaTotal = useMemo(()=> fin.dividas.reduce((s,d)=> s + (+d.parcelaMensal||+d.parcela||0), 0), [fin.dividas]);
  const patrimonio   = useMemo(()=> totalAtivos - saldoDevedor + (+fin.caixa||0), [totalAtivos, saldoDevedor, fin.caixa]);

  useEffect(()=>{
    const cur = monthKeyNow();
    if (repl.monthKey !== cur) setRepl({ monthKey: cur, used: 0, queued:false });
  },[repl.monthKey]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=> setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e,s)=> setSession(s));
    return ()=> sub.subscription?.unsubscribe?.();
  },[]);

  useEffect(()=>{
    const uid = session?.user?.id;
    if (!uid) return;
    loadState(uid).then(s=>{
      if (s?.fin)    setFin(s.fin);
      if (s?.perfil) setPerfil(p=> ({...p, ...s.perfil}));
    });
  },[session?.user?.id]);

  const nivel = levelFromXP(xp);
  const pnext = progressToNext(xp);

  function award(pointsXP, coinsAmt){ setXP(x=> x + pointsXP); setCoins(c=> c + coinsAmt); }
  function dailyCheckin(){
    const today = isoDate();
    const nextStreak = computeStreak(lastCheckin, today, streak);
    if (today !== lastCheckin){
      setStreak(nextStreak);
      setLastCheckin(today);
      const bonus = 5 + Math.min(nextStreak, 7);
      award(5, bonus);
    }
  }

  const achievements = useMemo(()=> getAchievements(xp, streak, diag), [xp, streak, diag]);
  const quests       = useMemo(()=> generateQuests(diag, prof), [diag, prof]);

  function heroDesc(){
    if (diag.metodo === "renegociar") return "Porquinho Quita ao telefone, expressão determinada, negociando taxas";
    if (diag.metodo === "avalanche")  return "Porquinho Quita com escudo, encarando montanha de juros altos";
    return "Porquinho Quita empurrando bola de neve, quitando pequenas dívidas";
  }

  useEffect(()=>{
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const t = url.searchParams.get("tab");
    if (t) setTab(t);
  },[]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 p-3">
          <div className="text-xl font-bold tracking-tight">
            {BRAND}<span className="ml-2 badge text-xs">evolução constante</span>
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs sm:text-sm">
            <a href="/login" className="btn text-xs">{session? "Minha conta" : "Entrar"}</a>
            <div className="hidden items-center gap-2 sm:flex"><span>Moedas</span><span className="badge">{coins}</span></div>
            <div className="hidden items-center gap-2 sm:flex"><span>Streak</span><span className="badge">{streak}🔥</span></div>
            <div className="hidden sm:flex items-center gap-2">
              <span>Nível {nivel}</span>
              <div className="h-2 w-32 overflow-hidden rounded bg-white/20">
                <div className="h-full" style={{width: `${pnext*100}%`, background: tokens.primary}}/>
              </div>
            </div>
          </div>
        </div>
        <nav className="mx-auto grid max-w-6xl grid-cols-2 gap-2 p-2 sm:grid-cols-6">
          {[
            {id:"home", t:"Início"},
            {id:"diagnostico", t:"Diagnóstico"},
            {id:"tarefas", t:"Tarefas"},
            {id:"recompensas", t:"Recompensas"},
            {id:"patrimonio", t:"Patrimônio"},
            {id:"coach", t:"Coach IA"},
          ].map(b=>(
            <button key={b.id} onClick={()=>setTab(b.id)}
              className={`rounded-xl px-3 py-2 text-sm ${tab===b.id?"text-white":"opacity-85"} bg-white/10`}>
              {b.t}
            </button>
          ))}
        </nav>
      </header>

      {tab==="home" && (
        <main className="mx-auto max-w-6xl p-4">
          <section className="relative overflow-hidden rounded-3xl p-6 card">
            <div className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <h1 className="text-2xl font-semibold">Saia das dívidas com método e motivação</h1>
                <p className="mt-2 text-sm text-white/80">Diagnóstico, plano e tarefas gamificadas.</p>
                <div className="mt-4 flex gap-2">
                  <a href="/onboarding" className="btn btn-primary text-sm">Começar diagnóstico</a>
                  <button onClick={dailyCheckin} className="btn text-sm">Check-in diário</button>
                </div>
              </div>
              <Illo desc={heroDesc()} />
            </div>
          </section>

          <Charts fin={fin} diag={diag} parcelaTotal={parcelaTotal} saldoDevedor={saldoDevedor} />
        </main>
      )}

      {tab==="diagnostico" && (
        <main className="mx-auto max-w-6xl p-4">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card title="Perfil e situação macro" className="md:col-span-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Nome" value={perfil.nome} onChange={v=>setPerfil({...perfil, nome:v})} />
                <Select label="Preferência de método" value={perfil.preferencia}
                        onChange={v=>setPerfil({...perfil, preferencia:v})}
                        options={[
                          {v:"custo", l:"Minimizar custo (Avalanche)"},
                          {v:"comportamental", l:"Motivação (Snowball)"}
                        ]} />
                <Currency label="Renda mensal"      value={fin.renda}     onChange={v=>setFin({...fin, renda:v})} />
                <Currency label="Despesas fixas"    value={fin.despFixas} onChange={v=>setFin({...fin, despFixas:v})} />
                <Currency label="Despesas variáveis" value={fin.despVars} onChange={v=>setFin({...fin, despVars:v})} />
                <Currency label="Caixa atual"       value={fin.caixa}     onChange={v=>setFin({...fin, caixa:v})} />
              </div>

              <h3 className="mt-6 text-base font-semibold">Estratégias detalhadas</h3>
              <pre className="whitespace-pre-wrap text-xs text-white/80">{strategyText(diag, fin)}</pre>
            </Card>

            <Card title="Resumo e personalização">
              <div className="text-sm text-white/80">
                DTI {pct(diag.dti)} · Meses emergência {diag.mesesEmerg?.toFixed(1)}
              </div>
              <div className="mt-2 text-xs">
                Situação: <b>{prof.situacao}</b> · Comportamento: <b>{prof.comportamento}</b>
              </div>
              <ul className="mt-2 list-disc pl-5 text-xs text-white/80">
                {personalizedTips(prof).map((t,i)=> <li key={i}>{t}</li>)}
              </ul>
            </Card>
          </section>
        </main>
      )}

      {tab==="tarefas" && (
        <main className="mx-auto max-w-6xl p-4">
          <div className="mb-2 flex items-center justify-between">
            <Illo desc="Porquinho Quita motivando: 'uma tarefa por vez'"/>
            <button onClick={dailyCheckin} className="btn text-xs">Check-in diário</button>
          </div>
          <Card title="Missões da Semana">
            <ul className="space-y-2 text-sm">
              {quests.map(q=>(
                <li key={q.id} className="card-2 flex items-center justify-between p-3">
                  <span>{q.nome}</span>
                  <span className="text-xs">+{q.xp} XP · +{q.coins} moedas</span>
                </li>
              ))}
            </ul>
          </Card>
        </main>
      )}

      {tab==="recompensas" && (
        <main className="mx-auto max-w-6xl p-4">
          <Card title="Conquistas">
            <ul className="space-y-2 text-sm">
              {achievements.map(a=>(
                <li key={a.id} className="card-2 flex items-center justify-between p-3" style={{opacity:a.cond?1:.6}}>
                  <div className="font-medium">{a.nome}</div>
                  <span className="badge text-xs">{a.cond ? "Disponível" : "Em progresso"}</span>
                </li>
              ))}
            </ul>
          </Card>
        </main>
      )}

      {tab==="patrimonio" && (
        <main className="mx-auto max-w-6xl p-4">
          <Card title="Visão geral">
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <Stat label="Ativos" value={fmt(totalAtivos)} />
              <Stat label="Dívidas" value={fmt(saldoDevedor)} />
              <Stat label="Patrimônio líquido" value={fmt(patrimonio)} />
              <Stat label="Meses emergência" value={diag.mesesEmerg?.toFixed(1)} />
            </div>
          </Card>
        </main>
      )}

      {tab==="coach" && (
        <main className="mx-auto max-w-6xl p-4">
          <Card title="Coach IA (placeholder)">
            <p className="text-sm text-white/80">Integração com API GPT após estabilizar o produto.</p>
            <Illo desc="Porquinho Quita como coach, com apito e prancheta"/>
          </Card>
        </main>
      )}
    </div>
  );
}
