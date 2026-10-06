Probabilidade mede a chance de um evento acontecer, num número entre 0 (impossível) e 1 (certo), ou entre 0% e 100%. No Cebraspe, aparece com sorteios, dados, urnas e tabelas de dados de pessoas, e quase sempre usa ferramentas de [contagem](/topico/raciocinio-logico-5). O segredo é identificar o espaço amostral e se os eventos são dependentes, independentes ou excludentes.

## O essencial

### Definição clássica
- **Espaço amostral (Ω)**: todos os resultados possíveis. **Evento**: os resultados que interessam.
- Com resultados igualmente prováveis: **P(A) = casos favoráveis / casos possíveis**.

### Regras
| Regra | Fórmula |
|---|---|
| Complementar | P(não A) = 1 − P(A) |
| União (A ou B) | P(A ∪ B) = P(A) + P(B) − P(A ∩ B) |
| Eventos mutuamente exclusivos | P(A ∩ B) = 0, logo P(A ∪ B) = P(A) + P(B) |
| Eventos independentes (A e B) | P(A ∩ B) = P(A) · P(B) |
| Probabilidade condicional | P(A \| B) = P(A ∩ B) / P(B) |
| Binomial: exatamente k sucessos em n tentativas | C(n, k) · pᵏ · (1 − p)ⁿ⁻ᵏ |

- **"Pelo menos um"**: 1 − P(nenhum).
- **Sem reposição**: a cada retirada, o total diminui, e as probabilidades mudam (eventos dependentes).
- **Exclusivos x independentes**: exclusivos não podem ocorrer juntos; independentes não influenciam um ao outro. Dois eventos exclusivos com probabilidades positivas **nunca** são independentes.

### Exemplos resolvidos
1. **Dado honesto**, sair número par: favoráveis {2, 4, 6} = 3; possíveis = 6. P = 3/6 = **1/2**.
2. **Duas moedas**, pelo menos uma cara: P(nenhuma cara) = 1/2 · 1/2 = 1/4. Logo, P = 1 − 1/4 = **3/4**.
3. **Urna** com 5 bolas brancas e 3 pretas, duas retiradas **sem reposição**, ambas brancas: 5/8 · 4/7 = 20/56 = **5/14**. Com reposição seria 5/8 · 5/8 = 25/64.
4. **Condicional**. Num órgão com 100 servidores, 60 homens e 40 mulheres; 30 homens e 20 mulheres têm pós-graduação. Sorteado alguém com pós-graduação, qual a chance de ser mulher? O novo universo são os 50 com pós: P = 20/50 = **0,4 = 40%**.
5. **Binomial**. Três lançamentos de moeda, exatamente duas caras: C(3, 2) · (1/2)² · (1/2)¹ = 3 · 1/8 = **3/8**. O fator 3 conta as posições possíveis das caras (com C = cara e K = coroa: CCK, CKC, KCC).
6. **União**. Num grupo, P(estudar para a PRF) = 0,5, P(estudar para o INSS) = 0,4 e P(ambos) = 0,2. P(PRF ou INSS) = 0,5 + 0,4 − 0,2 = **0,7**.

## Pegadinhas do Cebraspe

- **Somar sem descontar a interseção**: se os eventos podem ocorrer juntos, subtraia P(A ∩ B).
- **Ignorar o "sem reposição"**: o denominador cai a cada retirada.
- **Inverter a condicional**: P(A | B) é diferente de P(B | A). "Ser mulher dado que tem pós" não é "ter pós dado que é mulher" (20/40 = 0,5).
- **Esquecer as ordens possíveis** em "exatamente k": multiplique por C(n, k).
- **Confundir exclusivos com independentes**: são conceitos diferentes.
- **Probabilidade maior que 1**: resultado impossível; sinal de conta errada.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. No lançamento de dois dados honestos, a probabilidade de a soma dos resultados ser 7 é igual a 1/6.
   **Certo**. Há 36 resultados e 6 somam 7 (1-6, 2-5, 3-4, 4-3, 5-2, 6-1): 6/36 = 1/6.
2. Retirando-se duas cartas, sem reposição, de um grupo com 4 cartas azuis e 6 vermelhas, a probabilidade de ambas serem azuis é igual a 4/25.
   **Errado**. Sem reposição: 4/10 · 3/9 = 12/90 = 2/15. O valor 4/25 corresponde a retiradas com reposição.
3. Se A e B são eventos mutuamente exclusivos, com P(A) = 0,3 e P(B) = 0,4, então A e B são independentes.
   **Errado**. P(A ∩ B) = 0, mas P(A) · P(B) = 0,12; logo, não são independentes.
