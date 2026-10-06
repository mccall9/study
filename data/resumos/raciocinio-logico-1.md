Lógica proposicional é a base de quase toda a prova de Raciocínio Lógico do Cebraspe. É preciso reconhecer o que é proposição, identificar os conectivos escondidos no texto e saber de cor quando cada um é verdadeiro ou falso. Com isso se resolvem itens de tabela-verdade, número de linhas, tautologia e valor lógico.

## O essencial

### Proposição
- É uma frase **declarativa** que pode ser julgada como verdadeira (V) ou falsa (F), nunca as duas.
- **Não são proposições**: perguntas ("Que horas são?"), ordens ("Feche a porta"), exclamações ("Que dia lindo!"), sentenças abertas com variável ("x + 2 = 5") e paradoxos ("Esta frase é falsa").
- **Simples**: uma só ideia. **Composta**: duas ou mais simples ligadas por conectivos.

### Conectivos
| Conectivo | Símbolo | Leitura | Valor lógico |
|---|---|---|---|
| Negação | ¬p | não p | inverte o valor de p |
| Conjunção | p ∧ q | p e q | V só quando as duas são V |
| Disjunção inclusiva | p ∨ q | p ou q | F só quando as duas são F |
| Disjunção exclusiva | p ⊻ q | ou p ou q | V só quando os valores são diferentes |
| Condicional | p → q | se p, então q | F só quando p é V e q é F |
| Bicondicional | p ↔ q | p se e somente se q | V só quando os valores são iguais |

### Tabela-verdade completa
| p | q | p ∧ q | p ∨ q | p ⊻ q | p → q | p ↔ q |
|---|---|---|---|---|---|---|
| V | V | V | V | F | V | V |
| V | F | F | V | V | F | F |
| F | V | F | V | V | V | F |
| F | F | F | F | F | V | V |

- **Número de linhas** = 2ⁿ, em que n é o número de proposições simples **diferentes**. 2 proposições: 4 linhas; 3: 8 linhas; 4: 16 linhas.
- A condicional aparece disfarçada: "quando A, B", "sempre que A, B", "caso A, B", "A implica B", "A somente se B". Também: "A é condição **suficiente** para B" e "B é condição **necessária** para A" significam A → B.
- **Tautologia**: sempre V (ex.: p ∨ ¬p). **Contradição**: sempre F (ex.: p ∧ ¬p). **Contingência**: depende dos valores.

### Exemplos resolvidos
1. P: "Se chove, então a pista fica escorregadia." Choveu (V) e a pista não ficou escorregadia (F): V → F = **F**. Em qualquer outra combinação, P é V.
2. Quantas linhas tem a tabela de "Se o condutor bebeu e dirigiu, então será autuado"? Proposições simples: bebeu, dirigiu, será autuado. São 3, logo 2³ = **8 linhas**.
3. Valor de (p ∧ q) → r com p = V, q = V e r = F: primeiro p ∧ q = V; depois V → F = **F**.
4. p ∨ ¬p é tautologia: se p é V, a disjunção é V; se p é F, ¬p é V e a disjunção é V.

## Pegadinhas do Cebraspe

- **Contar linhas errado**: a frase pode ser longa, mas o que conta é o número de proposições simples distintas. Uma condicional com duas ideias tem 4 linhas, não 8.
- **Condicional falsa**: só existe um caso (V → F). Antecedente falso deixa a condicional verdadeira, qualquer que seja o consequente.
- **"Ou" inclusivo x exclusivo**: "ou... ou..." indica exclusiva; "ou" simples, em regra, é inclusiva.
- **Necessária x suficiente**: em A → B, A é suficiente e B é necessária. Inverter é erro clássico.
- **Sentença aberta não é proposição**: "Ele é policial" sem saber quem é "ele" não tem valor lógico definido.

## Como caiu na prova

- **INSS 2022** (3 itens), sobre a proposição P: "Nos processos de justificações administrativas, quando o segurado apresentar testemunhas com valor de prova, a agência fornecerá um servidor exclusivo para o atendimento". **Errado** o item que dizia que a tabela-verdade de P tem oito linhas: P é uma condicional com duas proposições simples, logo 2² = 4 linhas. **Certo** o que dizia haver uma única combinação de valores que torna P falsa (antecedente V e consequente F). O item que chamava de tautologia "o segurado apresentar testemunhas com ou sem valor de prova" foi **anulado**.
