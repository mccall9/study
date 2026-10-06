"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente do Supabase no navegador. Usado só para enviar arquivos direto ao Storage
 * (a Vercel limita o corpo das requisições ao servidor a 4,5 MB). A sessão vem dos cookies.
 */
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
