import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login(){
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=> setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e,s)=> setSession(s));
    return ()=> sub.subscription?.unsubscribe?.();
  },[]);

  async function signUp(){ await supabase.auth.signUp({ email, password: pwd }); }
  async function signIn(){ await supabase.auth.signInWithPassword({ email, password: pwd }); }
  async function signOut(){ await supabase.auth.signOut(); }

  return (
    <main style={{padding:20}}>
      <h1>Conta</h1>
      {session ? (
        <>
          <p>Logado: {session.user.email}</p>
          <button onClick={signOut}>Sair</button>
        </>
      ) : (
        <>
          <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
          <input placeholder="senha" type="password" value={pwd} onChange={e=>setPwd(e.target.value)}/>
          <div style={{display:"flex", gap:8, marginTop:8}}>
            <button onClick={signIn}>Entrar</button>
            <button onClick={signUp}>Criar conta</button>
          </div>
        </>
      )}
      <p style={{marginTop:10}}><a href="/">Voltar</a></p>
    </main>
  );
}
