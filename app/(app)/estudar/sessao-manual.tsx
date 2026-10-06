"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { salvarSessao } from "@/app/actions";
import { MateriaSelect } from "@/components/materia-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/form";

function hojeLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function SessaoManual() {
  const [aberto, setAberto] = useState(false);
  const [materiaSlug, setMateriaSlug] = useState("");
  const [topicoId, setTopicoId] = useState("");
  const [data, setData] = useState(hojeLocal);
  const [minutos, setMinutos] = useState("60");
  const [anotacao, setAnotacao] = useState("");
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [salvando, startSalvar] = useTransition();

  if (!aberto) {
    return (
      <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setAberto(true)}>
        <Plus /> Lançar sessão sem cronômetro
      </Button>
    );
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    startSalvar(async () => {
      const r = await salvarSessao({
        materiaSlug,
        topicoId: topicoId || null,
        // meio-dia local evita que a sessão "pule" de dia por causa do fuso
        inicio: new Date(`${data}T12:00:00`).toISOString(),
        duracaoSeg: Number(minutos) * 60,
        anotacao,
      });
      if (r.erro) return setMensagem({ tipo: "erro", texto: r.erro });
      setMensagem({ tipo: "ok", texto: "Sessão lançada." });
      setAnotacao("");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lançar sessão</CardTitle>
        <CardDescription>Para quando estudou longe do celular ou esqueceu o cronômetro.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={salvar} className="space-y-3">
          <MateriaSelect
            materiaSlug={materiaSlug}
            topicoId={topicoId}
            onChange={(m, t) => {
              setMateriaSlug(m);
              setTopicoId(t);
            }}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="data">Dia</Label>
              <Input id="data" type="date" value={data} max={hojeLocal()} onChange={(e) => setData(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="minutos">Minutos</Label>
              <Input id="minutos" type="number" min={1} max={1440} value={minutos} onChange={(e) => setMinutos(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="anotacao-manual">Anotação (opcional)</Label>
            <Textarea id="anotacao-manual" value={anotacao} onChange={(e) => setAnotacao(e.target.value)} />
          </div>
          {mensagem && (
            <p className={`text-sm ${mensagem.tipo === "ok" ? "text-status-questoes" : "text-destructive"}`}>
              {mensagem.texto}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={() => setAberto(false)}>
              Fechar
            </Button>
            <Button type="submit" disabled={salvando || !materiaSlug}>
              {salvando ? "Salvando…" : "Lançar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
