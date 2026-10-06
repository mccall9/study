"use client";

import { BookOpenCheck, Library, History, LayoutDashboard, ListChecks, Timer } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Painel", icon: LayoutDashboard },
  { href: "/edital", label: "Edital", icon: BookOpenCheck },
  { href: "/estudar", label: "Estudar", icon: Timer },
  { href: "/questoes", label: "Questões", icon: ListChecks },
  { href: "/materiais", label: "Materiais", icon: Library },
  { href: "/historico", label: "Histórico", icon: History },
];

// No celular cabem 5: o Histórico fica na barra lateral e no link da página Estudar.
const LINKS_CELULAR = LINKS.filter((l) => l.href !== "/historico");

function ativo(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  // Lei seca e página do tópico fazem parte de Materiais.
  if (href === "/materiais") return ["/materiais", "/lei", "/topico", "/arquivos"].some((p) => pathname.startsWith(p));
  return pathname.startsWith(href);
}

/** Barra lateral no desktop. */
export function SideNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            ativo(pathname, href)
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

/** Barra inferior no celular. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="nav-inferior fixed inset-x-0 bottom-0 z-20 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {LINKS_CELULAR.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              ativo(pathname, href) ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
