import { supabase } from "./supabase";

export async function loadState(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_state")
    .select("fin, perfil")
    .eq("user_id", userId)
    .single();
  if (error && error.code !== "PGRST116") console.error(error);
  return data || null;
}

export async function saveState(userId, fin, perfil) {
  if (!userId) return;
  const { error } = await supabase
    .from("user_state")
    .upsert({ user_id: userId, fin, perfil, updated_at: new Date().toISOString() });
  if (error) throw error;
}
