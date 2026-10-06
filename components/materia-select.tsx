"use client";

import { Label, Select } from "@/components/ui/form";
import { getMateria, MATERIAS } from "@/lib/edital";

/** Selects de matéria e tópico (opcional). */
export function MateriaSelect({
  materiaSlug,
  topicoId,
  onChange,
  disabled,
}: {
  materiaSlug: string;
  topicoId: string;
  onChange: (materiaSlug: string, topicoId: string) => void;
  disabled?: boolean;
}) {
  const materia = getMateria(materiaSlug);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="materia">Matéria</Label>
        <Select
          id="materia"
          value={materiaSlug}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value, "")}
        >
          <option value="">Escolha…</option>
          {MATERIAS.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.nome} ({m.concursos.join(" + ")})
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="topico">Tópico (opcional)</Label>
        <Select
          id="topico"
          value={topicoId}
          disabled={disabled || !materia}
          onChange={(e) => onChange(materiaSlug, e.target.value)}
        >
          <option value="">Geral</option>
          {materia?.topicos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.titulo}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
