import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Estudos PRF + INSS",
    short_name: "Estudos",
    description: "Organização de estudos para os concursos da PRF e do INSS.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfcfd",
    theme_color: "#3346b8",
    lang: "pt-BR",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
