"use client";

import { useActionState } from "react";
import { entrar } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";

export function LoginForm() {
  const [estado, action, pendente] = useActionState(entrar, {});
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="senha">Senha</Label>
        <Input id="senha" name="senha" type="password" autoComplete="current-password" required />
      </div>
      {estado.erro && <p className="text-sm text-destructive">{estado.erro}</p>}
      <Button type="submit" className="w-full" size="lg" disabled={pendente}>
        {pendente ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
