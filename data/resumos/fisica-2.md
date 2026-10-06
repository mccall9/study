No movimento circular, o corpo percorre uma circunferência ou um arco dela. Mesmo com velocidade de módulo constante, a **direção** da velocidade muda o tempo todo, e por isso existe aceleração apontando para o centro. Na PRF, o tema aparece em curvas de rodovia (atrito, derrapagem, velocidade máxima), rodas, polias e engrenagens.

## O essencial

### Grandezas
| Grandeza | Fórmula | Unidade |
|---|---|---|
| Período (tempo de uma volta) | `T` | s |
| Frequência (voltas por segundo) | `f = 1/T` | Hz (rpm ÷ 60 = Hz) |
| Velocidade angular | `ω = Δθ/Δt = 2π/T = 2π·f` | rad/s |
| Velocidade linear (tangencial) | `v = ω·R` | m/s |
| Aceleração centrípeta | `ac = v²/R = ω²·R` | m/s² |
| Força resultante centrípeta | `Fc = m·v²/R` | N |

- A velocidade linear é sempre **tangente** à trajetória. A aceleração centrípeta e a força centrípeta apontam para o **centro**.
- **MCU** (movimento circular uniforme): `v` constante em módulo, aceleração tangencial nula, aceleração centrípeta não nula.
- **MCUV**: a velocidade muda de módulo; há aceleração tangencial `at` além da centrípeta, e a aceleração total vale `√(ac² + at²)`.
- A "força centrífuga" só aparece para quem está dentro do carro (referencial acelerado). Para um observador parado, o carro tende a seguir pela **tangente** quando falta força centrípeta.

### Transmissão de movimento
- **Polias ligadas por correia** ou **engrenagens em contato**: mesma velocidade linear. `ω₁·R₁ = ω₂·R₂`, ou `f₁·R₁ = f₂·R₂`. A menor gira mais rápido.
- **Polias no mesmo eixo**: mesma velocidade angular e mesma frequência.

### Curvas na rodovia
- **Curva plana**: quem fornece a força centrípeta é o **atrito** entre pneus e pista. Sem derrapar: `μ·m·g ≥ m·v²/R`, logo `vmáx = √(μ·g·R)`. A massa se cancela.
- **Curva inclinada (compensada)**: parte da força centrípeta vem da normal. Sem atrito, `tg θ = v²/(R·g)`.
- **Topo de lombada**: `N = m·g − m·v²/R`. Se `v² ≥ g·R`, o veículo perde contato com a pista.

### Exemplos resolvidos
1. **Curva plana** de raio 50 m, coeficiente de atrito 0,8, g = 10 m/s².
   - `vmáx = √(0,8 · 10 · 50) = √400 = 20 m/s` = 72 km/h.
   - Com pista de pouca aderência (μ = 0,2): `√(0,2 · 10 · 50) = √100 = 10 m/s` = 36 km/h.
2. **Roda** de raio 0,3 m a 600 rpm.
   - `f = 600/60 = 10 Hz`; `ω = 2π · 10 ≈ 62,8 rad/s`.
   - `v = ω·R ≈ 62,8 · 0,3 ≈ 18,8 m/s`.
3. **Polias** ligadas por correia: a menor (raio 10 cm) gira a 30 Hz. A maior tem raio 30 cm.
   - `f₁·R₁ = f₂·R₂` → `30 · 10 = f₂ · 30` → `f₂ = 10 Hz`.
4. **Força centrípeta**: carro de 1.000 kg a 20 m/s numa curva de raio 100 m.
   - `Fc = 1.000 · 20² / 100 = 4.000 N`. A 40 m/s: `1.000 · 1.600 / 100 = 16.000 N` (quatro vezes mais).

## Pegadinhas do Cebraspe

- **"No MCU a aceleração é nula"**: errado. Há aceleração centrípeta, porque a direção da velocidade muda.
- **Velocidade constante no MCU**: só o **módulo** é constante; o vetor velocidade muda.
- **Dobrar a velocidade dobra a força centrípeta?** Não: a força depende de `v²`, então quadruplica.
- **Veículo mais pesado faz a curva mais devagar?** A velocidade máxima na curva plana não depende da massa, só de μ, g e R.
- **Polias**: na correia, iguais são as velocidades lineares; no mesmo eixo, as angulares.
- **Força centrífuga como força real**: para o observador externo, a resultante aponta para o centro.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. Em um movimento circular uniforme, a aceleração do corpo é nula, pois o módulo de sua velocidade é constante.
   **Errado**. A aceleração centrípeta (`v²/R`) existe porque a direção da velocidade muda continuamente.
2. Em uma curva plana, a velocidade máxima com que um veículo pode trafegar sem derrapar depende do coeficiente de atrito e do raio da curva, mas não da massa do veículo.
   **Certo**. `vmáx = √(μ·g·R)`: a massa se cancela.
3. Se um veículo dobrar sua velocidade em uma mesma curva, a força centrípeta necessária para mantê-lo na trajetória também dobrará.
   **Errado**. Como `Fc = m·v²/R`, a força fica quatro vezes maior.

Veja também [Cinemática escalar e vetorial](/topico/fisica-1) e [Leis de Newton](/topico/fisica-3).
