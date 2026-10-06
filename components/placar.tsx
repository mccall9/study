export function Placar({ certas, erradas, brancos }: { certas: number; erradas: number; brancos: number }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="rounded-lg bg-status-questoes/15 p-3">
        <p className="text-2xl font-bold tabular-nums">{certas}</p>
        <p className="text-xs text-muted-foreground">certas</p>
      </div>
      <div className="rounded-lg bg-destructive/10 p-3">
        <p className="text-2xl font-bold tabular-nums">{erradas}</p>
        <p className="text-xs text-muted-foreground">erradas</p>
      </div>
      <div className="rounded-lg bg-muted p-3">
        <p className="text-2xl font-bold tabular-nums">{brancos}</p>
        <p className="text-xs text-muted-foreground">em branco</p>
      </div>
    </div>
  );
}
