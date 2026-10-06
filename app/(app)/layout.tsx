import { GraduationCap, LogOut } from "lucide-react";
import { sair } from "@/app/actions";
import { BottomNav, SideNav } from "@/components/nav";
import { TamanhoLetra } from "@/components/tamanho-letra";
import { BotaoTema } from "@/components/tema";
import { Button } from "@/components/ui/button";
import { getUsuario } from "@/lib/data";
import { MODO_DEMO } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const usuario = await getUsuario();
  return (
    <div className="layout-app min-h-dvh md:grid md:grid-cols-[220px_1fr]">
      <aside className="nav-lateral sticky top-0 hidden h-dvh flex-col gap-6 border-r bg-card p-4 md:flex">
        <div className="flex items-center gap-2 px-2 pt-1 font-semibold">
          <GraduationCap className="size-5 text-primary" />
          Estudos
        </div>
        <SideNav />
        <div className="mt-auto space-y-2 px-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Tamanho da letra</span>
            <TamanhoLetra />
          </div>
          <div className="flex items-center justify-between">
            <span>Tema</span>
            <BotaoTema />
          </div>
          <p className="truncate">{usuario?.email}</p>
          <form action={sair}>
            <Button variant="ghost" size="sm" className="-ml-3">
              <LogOut /> Sair
            </Button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
          <div className="flex items-center gap-2 font-semibold">
            <GraduationCap className="size-5 text-primary" />
            Estudos
          </div>
          <div className="flex items-center gap-1">
            <BotaoTema />
            <TamanhoLetra />
            <form action={sair}>
              <Button variant="ghost" size="icon" aria-label="Sair">
                <LogOut />
              </Button>
            </form>
          </div>
        </header>
        {MODO_DEMO && (
          <div className="border-b bg-accent px-4 py-2 text-center text-xs text-accent-foreground">
            Modo demonstração: dados de exemplo, nada é salvo. Configure o Supabase para usar de verdade.
          </div>
        )}
        <main className="mx-auto w-full max-w-5xl px-4 pt-5 pb-28 md:px-8 md:pt-8 md:pb-12">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
