import { ArrowLeft, Upload } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EnviarArquivo } from "@/components/enviar-arquivo";
import { ListaArquivos } from "@/components/lista-arquivos";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getArquivos, getUsuario } from "@/lib/data";
import { getMateria, MATERIAS } from "@/lib/edital";

export const metadata: Metadata = { title: "Arquivos" };

export default async function ArquivosPage({ searchParams }: { searchParams: Promise<{ materia?: string; topico?: string }> }) {
  const p = await searchParams;
  const materia = getMateria(p.materia ?? "");
  const topico = materia?.topicos.find((t) => t.id === p.topico);
  const [arquivos, usuario] = await Promise.all([getArquivos(), getUsuario()]);
  const meuId = usuario?.id ?? "";
  const topicos = Object.fromEntries(MATERIAS.flatMap((m) => m.topicos.map((t) => [t.id, t.titulo])));
  const meus = arquivos.filter((a) => a.user_id === meuId);
  const daFamilia = arquivos.filter((a) => a.user_id !== meuId);

  return (
    <>
      <Link
        href={topico ? `/topico/${topico.id}` : "/materiais"}
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {topico ? topico.titulo : "Materiais"}
      </Link>
      <PageHeader title="Arquivos" description="Apostilas, PDFs e fotos de anotações, guardados na sua conta." />

      <div className="space-y-4">
        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <Upload className="size-4 text-primary" />
            <CardTitle>Enviar arquivo</CardTitle>
          </CardHeader>
          <CardContent>
            <EnviarArquivo materiaInicial={materia?.slug ?? ""} topicoInicial={topico?.id ?? ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meus arquivos</CardTitle>
            <CardDescription>O ícone de pessoas compartilha o arquivo com a família.</CardDescription>
          </CardHeader>
          <CardContent>
            <ListaArquivos arquivos={meus} meuId={meuId} topicos={topicos} vazio="Você ainda não enviou nenhum arquivo." />
          </CardContent>
        </Card>

        {daFamilia.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Compartilhados pela família</CardTitle>
            </CardHeader>
            <CardContent>
              <ListaArquivos arquivos={daFamilia} meuId={meuId} topicos={topicos} />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
