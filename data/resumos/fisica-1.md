Cinemática descreve o movimento (posição, velocidade, aceleração) sem perguntar a causa. Na PRF o tema aparece em situações de trânsito (frenagem, distância percorrida) e no lançamento oblíquo de projéteis, que exige olhar a velocidade e a aceleração como **vetores**.

## O essencial

**Unidades.** Para passar de km/h para m/s, divida por 3,6 (72 km/h = 20 m/s); de m/s para km/h, multiplique por 3,6.

**Movimento uniforme (MU)**: velocidade constante, aceleração nula.
- `s = s₀ + v·t`

**Movimento uniformemente variado (MUV)**: aceleração constante.
- `v = v₀ + a·t`
- `s = s₀ + v₀·t + a·t²/2`
- Torricelli (sem tempo): `v² = v₀² + 2·a·Δs`
- Velocidade média no MUV: `(v₀ + v)/2`

**Queda livre e lançamento vertical**: MUV com `a = g` (use g = 10 m/s²), sem resistência do ar. A massa não interfere.

**Lançamento oblíquo**: decomponha a velocidade inicial `v₀` (ângulo θ com a horizontal).
- Horizontal (MU): `vx = v₀·cos θ`, constante o tempo todo.
- Vertical (MUV): `vy = v₀·sen θ − g·t`.
- Tempo de subida: `t = v₀·sen θ / g`; voltando ao mesmo nível, o tempo total é o dobro.
- Altura máxima: `H = (v₀·sen θ)² / (2g)`.
- Alcance: `A = v₀²·sen 2θ / g`. É máximo em 45°, e ângulos complementares (30° e 60°) dão o mesmo alcance.

**Visão vetorial**

| Grandeza | No ponto mais alto | Ao longo do voo |
|---|---|---|
| Velocidade vertical | zero | muda (sobe, zera, desce) |
| Velocidade horizontal | `v₀·cos θ` | constante |
| Velocidade vetorial | igual à horizontal, **não nula** | sempre tangente à trajetória |
| Aceleração | `g`, vertical para baixo | constante em módulo, direção e sentido |

## Exemplo resolvido

Um projétil sai do solo a 20 m/s, a 30° da horizontal (g = 10 m/s², sen 30° = 0,5, cos 30° ≈ 0,866).
- `vx = 20 · 0,866 ≈ 17,3 m/s` e `vy₀ = 20 · 0,5 = 10 m/s`.
- Subida: `t = 10/10 = 1 s`; tempo total = 2 s.
- Altura máxima: `H = 10² / (2·10) = 5 m`.
- Alcance: `A = vx · t = 17,3 · 2 ≈ 34,6 m` (pela fórmula: `20² · sen 60° / 10 ≈ 34,6 m`).
- No topo, a velocidade é 17,3 m/s na horizontal, e a aceleração continua 10 m/s² para baixo.

**Frenagem.** Carro a 72 km/h (20 m/s) freia com desaceleração de 5 m/s². Por Torricelli: `0 = 20² − 2·5·d`, logo `d = 40 m`. Tempo: `0 = 20 − 5·t`, logo `t = 4 s`. Velocidade dobrada quadruplica a distância de frenagem, porque `d` depende de `v²`.

## Pegadinhas do Cebraspe

- "No ponto mais alto a velocidade é nula": errado; só a componente vertical zera.
- "No ponto mais alto a aceleração é nula": errado; ela é sempre `g` (sem ar).
- "A aceleração do projétil muda de sentido na descida": errado; aponta para baixo do início ao fim.
- "Corpo mais pesado cai mais rápido": errado no vácuo; a massa não entra nas equações.
- Velocidade média = média aritmética das velocidades só vale no MUV.
- Esquecer de converter km/h em m/s antes de usar as fórmulas.

## Como caiu na prova

Na PRF 2021, sobre um projétil lançado obliquamente sem resistência do ar, a banca afirmou que a aceleração vetorial é constante durante todo o movimento: Certo (é a gravidade). Em seguida, afirmou que no ponto de altura máxima a velocidade vetorial é nula: Errado, pois a componente horizontal se mantém.
