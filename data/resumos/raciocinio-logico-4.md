Diagramas lógicos (diagramas de Venn) representam conjuntos por círculos e mostram o que é comum a eles. No Cebraspe, aparecem em dois tipos de item: problemas de contagem com pessoas ou percentuais em mais de um grupo, e proposições como "todo A é B" ou "algum A é B". O segredo é nunca contar duas vezes quem está na interseção.

## O essencial

### Operações
- **União (A ∪ B)**: está em A, em B ou em ambos.
- **Interseção (A ∩ B)**: está em A e em B ao mesmo tempo.
- **Diferença (A − B)**: está em A e não está em B ("só A").
- **Complementar**: o que está fora do conjunto, dentro do total considerado.

### Fórmulas (princípio da inclusão-exclusão)
- Dois conjuntos: n(A ∪ B) = n(A) + n(B) − n(A ∩ B).
- Três conjuntos: n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A ∩ B) − n(A ∩ C) − n(B ∩ C) + n(A ∩ B ∩ C).
- Se ninguém fica de fora (todos estão em A ou em B), a união é o total. Então n(A ∩ B) = n(A) + n(B) − total.

### Proposições categóricas
| Proposição | Diagrama |
|---|---|
| Todo A é B | círculo A inteiro dentro de B |
| Nenhum A é B | círculos separados |
| Algum A é B | há interseção (pelo menos um elemento comum) |
| Algum A não é B | há parte de A fora de B |

"Todo A é B" **não** garante que todo B seja A. E "algum A é B" não exclui a possibilidade de todo A ser B.

### Exemplos resolvidos
1. **Dois grupos**. Numa turma de 40 pessoas, 25 estudam para a PRF, 20 para o INSS e 8 para os dois.
   - União: 25 + 20 − 8 = 37.
   - Nenhum dos dois: 40 − 37 = **3**.
   - Só PRF: 25 − 8 = **17**. Só INSS: 20 − 8 = **12**.
2. **Percentuais**. Se 60% dos condutores usam o aplicativo A, 55% usam o B e todos usam pelo menos um, então os dois são usados por 60% + 55% − 100% = **15%**.
3. **Três grupos**. Entre 100 motoristas: 50 multados por velocidade (V), 40 por estacionamento (E), 30 por celular (C); 15 em V e E, 10 em V e C, 8 em E e C, e 5 nas três.
   - União: 50 + 40 + 30 − 15 − 10 − 8 + 5 = **92**. Sem multa: 100 − 92 = **8**.
   - Só V: 50 − 15 − 10 + 5 = **30** (subtrai as duas interseções e devolve o centro, que foi tirado duas vezes).
   - Dica: preencha o diagrama do centro para fora (primeiro as três, depois as interseções de duas, por último o "só").

## Pegadinhas do Cebraspe

- **Soma passando de 100%**: quando os percentuais somam mais que 100%, o excesso indica interseção. Mas só dá para afirmar o valor exato se todos estiverem em pelo menos um grupo.
- **"Só A" x "A"**: o item pergunta quantos estão "apenas" num grupo e a conta exige tirar a interseção.
- **Interseção mínima**: sem a informação de que todos estão em algum grupo, n(A) + n(B) − total é só o **mínimo** possível da interseção.
- **Inverter "todo A é B"**: concluir "todo B é A" é erro.
- **Percentual de percentual**: "20% dos que estão em A" é 20% de n(A), não 20% do total.

## Como caiu na prova

- **INSS 2022** (1 item): 75% dos segurados tiveram atendimento remoto e 35%, presencial. O item afirmou que, havendo só essas duas modalidades, 10% passaram pelas duas. Gabarito: **Certo**. Como todos foram atendidos em pelo menos uma modalidade, a união é 100%: 75% + 35% − 100% = 10%.
