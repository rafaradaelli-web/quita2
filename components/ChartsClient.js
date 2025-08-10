// components/ChartsClient.js
import React from "react";
import Card from "./Card";
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid, XAxis, YAxis,
  Tooltip as RTooltip, BarChart, Bar
} from "recharts";

export default function Charts({ fin, diag, parcelaTotal, saldoDevedor }) {
  const gastosPie = React.useMemo(()=>{
    const ess = fin.micro.filter(m=>m.essencialidade==="essencial").reduce((s,m)=> s+(+m.valor||0), 0);
    const imp = fin.micro.filter(m=>m.essencialidade==="importante").reduce((s,m)=> s+(+m.valor||0), 0);
    const sup = fin.micro.filter(m=>m.essencialidade==="superfluo").reduce((s,m)=> s+(+m.valor||0), 0);
    return [
      { name: "Fixas", value: +fin.despFixas||0 },
      { name: "Variáveis", value: +fin.despVars||0 },
      { name: "Essenciais", value: ess },
      { name: "Importantes", value: imp },
      { name: "Supérfluos", value: sup }
    ];
  },[fin]);

  const projDivida = React.useMemo(()=>{
    const meses = 12; const arr=[]; let saldo = saldoDevedor;
    const extra = Math.max(0, Math.min((+diag.margem||0)*0.5, (+diag.margem||0)));
    for(let i=0;i<=meses;i++){ arr.push({ m:`M${i}`, saldo: Math.max(saldo,0) }); saldo = saldo - ((+parcelaTotal||0) + extra); }
    return arr;
  },[saldoDevedor, parcelaTotal, diag.margem]);

  const barraResumo = React.useMemo(()=>[
    { nome:"Renda", v: +fin.renda||0 },
    { nome:"Gastos", v: +diag.gastos||0 },
    { nome:"Parcelas", v: +parcelaTotal||0 },
    { nome:"Margem", v: +diag.margem||0 }
  ],[fin.renda, diag.gastos, parcelaTotal, diag.margem]);

  return (
    <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card title="Composição de gastos">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={gastosPie} dataKey="value" nameKey="name" outerRadius={80} label>
                {gastosPie.map((_, i)=> <Cell key={i} fill={["#8c3cf7","#b084ff","#5a1bd6","#d2beff","#6f2ce0"][i % 5]}/>)}
              </Pie>
              <RTooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Projeção da dívida">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projDivida}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.1)"/>
              <XAxis dataKey="m" stroke="rgba(255,255,255,.6)"/>
              <YAxis stroke="rgba(255,255,255,.6)"/>
              <RTooltip/>
              <Area type="monotone" dataKey="saldo" stroke="#8c3cf7" fill="#8c3cf7" fillOpacity={0.2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Resumo mensal">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barraResumo}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.1)"/>
              <XAxis dataKey="nome" stroke="rgba(255,255,255,.6)"/>
              <YAxis stroke="rgba(255,255,255,.6)"/>
              <RTooltip/>
              <Bar dataKey="v" fill="#8c3cf7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  );
}
