import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Estudos PRF + INSS", template: "%s · Estudos" },
  description: "Organização de estudos para os concursos da PRF e do INSS.",
  icons: { apple: "/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Estudos", statusBarStyle: "default" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#14161f" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Aplica o tamanho de letra salvo antes de pintar a página (evita o texto "pular"). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var f=localStorage.getItem("estudos:fonte");if(f)document.documentElement.style.fontSize=f+"%"}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
