Quantidade de movimento e impulso descrevem choques, freadas bruscas, recuo de armas e colisões entre veículos. A ideia central da prova é saber **o que se conserva** em cada situação: a quantidade de movimento (quase sempre, nas colisões) e a energia cinética (só na colisão elástica).

## O essencial

**Quantidade de movimento (momento linear)**: `Q = m · v`. É vetor, com a direção e o sentido da velocidade. Unidade: kg·m/s.

**Impulso**: `I = F · Δt`, em N·s (equivale a kg·m/s). Com força variável, o impulso é a área do gráfico F × t.

**Teorema do impulso**: `I = ΔQ = m·v_final − m·v_inicial`. Para a mesma variação de Q, quanto maior o tempo do choque, menor a força média. É o princípio do air bag, do cinto que estica um pouco e das barreiras deformáveis.

**Conservação**: se a resultante das forças **externas** for nula (ou desprezível durante o choque, que é muito rápido), `Q antes = Q depois`. Vale em colisões, explosões e recuo de armas.

**Colisões e coeficiente de restituição** `e = (velocidade relativa de afastamento) / (velocidade relativa de aproximação)`:

| Tipo | e | Quantidade de movimento | Energia cinética |
|---|---|---|---|
| Elástica | 1 | conserva | conserva |
| Parcialmente elástica | entre 0 e 1 | conserva | perde parte |
| Perfeitamente inelástica (corpos seguem juntos) | 0 | conserva | maior perda possível |

Na colisão elástica frontal entre massas iguais, os corpos trocam de velocidade.

## Exemplo resolvido (bloco com mola)

Projétil de 0,02 kg a 300 m/s se aloja num bloco de 1,98 kg parado, preso a uma mola com `k = 800 N/m`, sem atrito.

1. **Colisão** (conserva Q): `0,02 · 300 = (0,02 + 1,98) · V`, logo `V = 6 / 2 = 3 m/s`.
2. **Energia antes**: `0,5 · 0,02 · 300² = 900 J`. **Depois**: `0,5 · 2 · 3² = 9 J`. Perderam-se 891 J em deformação e calor.
3. **Compressão** (agora conserva a energia mecânica): `0,5 · 800 · x² = 9`, logo `x² = 0,0225` e `x = 0,15 m`.

A energia elástica máxima da mola (9 J) é bem menor que a energia cinética inicial do projétil (900 J).

**Impulso na freada.** Carro de 1.000 kg a 20 m/s para totalmente: `ΔQ = 20.000 kg·m/s`. Se o choque dura 0,1 s, a força média é 200.000 N; se dura 1 s, cai para 20.000 N.

## Pegadinhas do Cebraspe

- "Sem atrito com o piso, a energia cinética se conserva na colisão": errado. A falta de atrito garante a conservação de **Q**, não a da energia cinética.
- "Na colisão inelástica não se conserva a quantidade de movimento": errado; Q se conserva em todos os tipos de colisão do sistema isolado.
- "Bola que bate e volta com a mesma velocidade não sofre variação de Q": errado; Q é vetor, e `ΔQ = 2·m·v`.
- Explosão: Q total continua zero (se estava parado), mas a energia cinética **aumenta** (vem da energia química).
- Energia cinética depende de `v²`, quantidade de movimento depende de `v`: dobrar a velocidade dobra Q e quadruplica a energia.

## Como caiu na prova

Na PRF 2021, um projétil se encravou num bloco preso a uma mola, e os dois seguiram juntos. A banca afirmou que a energia elástica na compressão máxima é menor que a energia cinética inicial do projétil: Certo (colisão perfeitamente inelástica perde energia). Depois afirmou que, por não haver atrito, a energia cinética logo antes e logo depois da colisão seria igual: Errado, pois só a quantidade de movimento se conserva.
