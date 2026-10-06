"use client";

import { useActionState, useState } from "react";
import { salvarMeta } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";

export function MetaForm({ metaHoras }: { metaHoras: number }) {
  const [editando, setEditando] = useState(false);
  const [estado, action, pendente] = useActionState(async (prev: { erro?: string }, form: FormData) => {
    const r = await salvarMeta(prev, form);
    if (!r.erro) setEditando(false);
    return r;
  }, {});

  if (!editando) {
    return (
      <button
        type="button"
        onClick={() => setEditando(true)}
        className="text-xs text-muted-foreground underline-offset-2 hover:underline"
      >
        Alterar meta semanal
      </button>
    );
  }
  return (
    <form action={action} className="space-y-1">
      <div className="flex items-center gap-2">
        <Input
          name="horas"
          type="number"
          min={1}
          max={100}
          step={0.5}
          defaultValue={metaHoras}
          className="h-8 w-20"
          aria-label="Horas por semana"
        />
        <span className="text-xs text-muted-foreground">h/semana</span>
        <Button size="sm" disabled={pendente}>Salvar</Button>
      </div>
      {estado.erro && <p className="text-xs text-destructive">{estado.erro}</p>}
    </form>
  );
}
