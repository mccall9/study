Estática estuda corpos em **equilíbrio**, em geral parados. Para um ponto material, basta que as forças se anulem. Para um corpo extenso (barra, porta, veículo), as forças também não podem fazê-lo girar, e entra em cena o **momento** (torque). Na PRF, o tema aparece em alavancas, chaves de roda, cargas penduradas por cabos, barras apoiadas e estabilidade de veículos.

## O essencial

### Condições de equilíbrio
| Corpo | Condições |
|---|---|
| Ponto material | resultante nula: `ΣFx = 0` e `ΣFy = 0` |
| Corpo extenso | resultante nula **e** soma dos momentos nula: `ΣF = 0` e `ΣM = 0` |

- **Momento (torque)** de uma força em relação a um ponto: `M = F · d`, em N·m, em que `d` é o **braço**: a distância **perpendicular** entre o ponto e a linha de ação da força.
- Dica: some os momentos em relação ao ponto onde atua uma força desconhecida; ela sai da conta, porque seu braço é zero.
- **Binário**: duas forças iguais, opostas e não alinhadas. A resultante é nula, mas o corpo gira. Por isso, no corpo extenso, `ΣF = 0` não basta.

### Tipos de equilíbrio
- **Estável**: afastado da posição, o corpo volta (bola no fundo de uma tigela).
- **Instável**: afastado, o corpo se afasta mais (bola no topo de uma tigela invertida).
- **Indiferente**: permanece na nova posição (bola em piso plano).
- Quanto mais **baixo** o centro de gravidade e mais **larga** a base de apoio, maior a estabilidade. Veículos altos e carregados no teto tombam com mais facilidade em curvas.

### Alavancas
| Tipo | O que fica no meio | Exemplos |
|---|---|---|
| Interfixa | o apoio | gangorra, tesoura, alicate |
| Inter-resistente | a resistência (carga) | carrinho de mão, quebra-nozes |
| Interpotente | a força aplicada | pinça, antebraço |

### Exemplos resolvidos (g = 10 m/s²)
1. **Gangorra**: criança de 30 kg a 2 m do apoio. Onde deve sentar uma de 40 kg, do outro lado?
   - `300 · 2 = 400 · d` → `d = 1,5 m`. O mais pesado senta mais perto do apoio.
2. **Chave de roda**: o parafuso exige 100 N·m.
   - Braço de 0,25 m: `F = 100 / 0,25 = 400 N`.
   - Braço de 0,50 m: `F = 100 / 0,5 = 200 N`. Cabo mais longo, menos força.
3. **Barra apoiada**: barra de 4 m, de peso desprezível, apoiada nas pontas A e B, com carga de 600 N a 1 m de A.
   - Momentos em relação a A: `NB · 4 = 600 · 1` → `NB = 150 N`.
   - Forças verticais: `NA + NB = 600` → `NA = 450 N`. O apoio mais próximo da carga suporta mais.
4. **Carga pendurada por dois cabos** simétricos, cada um a 60° da vertical, sustentando 100 N (cos 60° = 0,5).
   - Vertical: `2 · T · cos 60° = 100` → `2 · T · 0,5 = 100` → `T = 100 N`.
   - Cada cabo suporta o peso inteiro. Quanto mais abertos os cabos, maior a tração em cada um.

## Pegadinhas do Cebraspe

- **"Resultante nula basta para o equilíbrio de corpo extenso"**: errado; também é preciso momento resultante nulo.
- **Braço do momento**: é a distância perpendicular à linha de ação, não qualquer distância até o ponto de aplicação.
- **Cabos mais abertos aliviam a tração?** Não; aumentam. Cabos verticais dividem o peso igualmente (cada um com metade).
- **Equilíbrio só em repouso?** Não: em movimento retilíneo uniforme também há equilíbrio (dinâmico).
- **Centro de gravidade alto** deixa o corpo **menos** estável.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. Para que um corpo extenso permaneça em equilíbrio, basta que a resultante das forças que atuam sobre ele seja nula.
   **Errado**. Também é necessário que a soma dos momentos seja nula; um binário tem resultante nula e faz o corpo girar.
2. Para soltar um parafuso emperrado, uma chave de roda com cabo mais longo exige menor força, porque o momento é o produto da força pelo braço.
   **Certo**. Com o mesmo momento exigido, braço maior significa força menor.
3. Uma gangorra com apoio central fica em equilíbrio com uma criança de 20 kg a 3 m do apoio e outra de 30 kg a 2,5 m do apoio, do lado oposto.
   **Errado**. Momentos: 200 · 3 = 600 N·m e 300 · 2,5 = 750 N·m. O equilíbrio exigiria a segunda criança a 2 m.
