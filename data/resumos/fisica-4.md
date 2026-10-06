Trabalho é a energia transferida por uma força quando há deslocamento; energia é a capacidade de realizar trabalho; potência é a rapidez com que isso acontece. Na PRF, o tema aparece em frenagens (a energia cinética que os freios precisam dissipar), em motores (potência e rendimento) e em itens conceituais sobre forças que realizam ou não trabalho.

## O essencial

### Trabalho de uma força constante
- `W = F · d · cos θ`, em joules (J), sendo θ o ângulo entre a força e o deslocamento.
- θ = 0°: trabalho máximo e positivo (força a favor do movimento).
- θ = 90°: trabalho **nulo** (força perpendicular: normal em piso horizontal, força centrípeta).
- θ = 180°: trabalho negativo (força contra o movimento: atrito, freio).
- Sem deslocamento, não há trabalho: segurar uma caixa parada cansa, mas o trabalho mecânico é zero.
- **Trabalho do peso**: `W = ± m·g·h` (positivo na descida, negativo na subida). Não depende da trajetória, só do desnível.
- No gráfico força × deslocamento, o trabalho é a **área** sob a curva.

### Energia
| Tipo | Fórmula |
|---|---|
| Cinética | `Ec = m·v²/2` |
| Potencial gravitacional | `Ep = m·g·h` |
| Potencial elástica | `Ep = k·x²/2` |

- **Teorema da energia cinética**: o trabalho da força **resultante** é igual à variação da energia cinética: `W_res = Ec_final − Ec_inicial`.
- Como `Ec` depende de `v²`, dobrar a velocidade quadruplica a energia cinética.

### Potência e rendimento
- `P = W / Δt` (watt, W = J/s). Para força constante na direção do movimento: `P = F · v`.
- 1 cv ≈ 735 W; 1 kW = 1.000 W.
- **kWh** é unidade de **energia**: 1 kWh = 1.000 W × 3.600 s = 3,6 × 10⁶ J.
- Rendimento: `η = P_útil / P_total` (sempre menor que 1, ou 100%).

### Exemplos resolvidos
1. **Força inclinada**: uma força de 50 N, a 60° do deslocamento, move um objeto por 10 m (cos 60° = 0,5).
   - `W = 50 · 10 · 0,5 = 250 J`.
2. **Frenagem**: carro de 1.000 kg a 20 m/s (72 km/h) para totalmente.
   - `Ec = 1.000 · 20² / 2 = 200.000 J = 200 kJ`.
   - O trabalho dos freios é −200 kJ. Com força de frenagem de 5.000 N: `d = 200.000 / 5.000 = 40 m`.
   - A 40 m/s, `Ec = 800 kJ`: com a mesma força, `d = 160 m` (quatro vezes mais).
3. **Elevação de carga**: um guincho ergue 200 kg a 5 m de altura em 10 s (g = 10 m/s²).
   - `W = m·g·h = 200 · 10 · 5 = 10.000 J`.
   - `P = 10.000 / 10 = 1.000 W = 1 kW`.
   - Se o motor consome 1.250 W: `η = 1.000 / 1.250 = 0,8 = 80%`.
4. **Potência de tração**: um caminhão mantém 25 m/s com força de tração de 4.000 N.
   - `P = F · v = 4.000 · 25 = 100.000 W = 100 kW`.

## Pegadinhas do Cebraspe

- **Força perpendicular realiza trabalho?** Não. Normal (em piso horizontal) e força centrípeta têm trabalho nulo.
- **Trabalho é vetor?** Não. É grandeza **escalar**, com sinal (positivo ou negativo).
- **kWh é potência?** Não, é energia. Potência é medida em watts.
- **Energia cinética proporcional à velocidade?** É proporcional ao **quadrado** da velocidade.
- **Trabalho do peso depende do caminho?** Não; uma rampa longa ou uma escada dão o mesmo trabalho do peso para o mesmo desnível.
- **Teorema da energia cinética**: vale para a força **resultante**, não para uma força isolada.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. A força centrípeta que mantém um veículo em uma curva circular realiza trabalho positivo sobre ele.
   **Errado**. Ela é perpendicular ao deslocamento a cada instante; o trabalho é nulo.
2. Se a velocidade de um veículo triplicar, sua energia cinética ficará nove vezes maior.
   **Certo**. `Ec = m·v²/2`: (3v)² = 9v².
3. O quilowatt-hora (kWh), usado nas contas de luz, é unidade de potência.
   **Errado**. É unidade de energia (potência × tempo), equivalente a 3,6 × 10⁶ J.

Veja também [Conservação da energia](/topico/fisica-5).
