import { supabase } from "./supabase.js";

export async function getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error("Erro ao obter sessão:", error);
        return null;
    }

    return data.session;
}

export async function loginWithGoogle() {
    const redirectTo = window.location.origin + window.location.pathname;

    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo
        }
    });

    if (error) {
        console.error("Erro no login Google:", error);
        alert("Erro ao entrar com Google: " + error.message);
    }
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Erro ao sair:", error);
        alert("Erro ao sair: " + error.message);
        return;
    }

    window.location.reload();
}

export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
    });
}