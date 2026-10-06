import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Estudos PRF + INSS", template: "%s · Estudos" },
  description: "Organização de estudos para os concursos da PRF e do INSS.",
  icons: { apple: "/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Estudos", statusBarStyle: "default" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#fbfcfd" };

// Antes de pintar a página: tamanho de letra e tema salvos (evita o texto "pular" e a tela piscar).
const PREFERENCIAS = `try{var d=document.documentElement,f=localStorage.getItem("estudos:fonte");if(f)d.style.fontSize=f+"%";var t=localStorage.getItem("estudos:tema")||"claro";var e=t==="escuro"||(t==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches);d.dataset.tema=e?"escuro":"claro";var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=e?"#1a1b1f":"#fbfcfd"}catch(x){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-tema="claro" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCIAS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
