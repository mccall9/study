Duas proposições são **equivalentes** quando têm a mesma tabela-verdade: em todas as linhas, o valor lógico é o mesmo. A **negação** de uma proposição tem sempre o valor oposto. O Cebraspe cobra muito este tema com frases do cotidiano: "a proposição X é equivalente a Y" ou "a negação de X é Y". Saber poucas regras de cor resolve quase todos os itens.

## O essencial

### Equivalências da condicional
| Proposição | Equivalente | Nome |
|---|---|---|
| p → q | ¬q → ¬p | contrapositiva (inverte e nega) |
| p → q | ¬p ∨ q | troca "se... então" por "ou" |
| p ↔ q | (p → q) ∧ (q → p) | bicondicional = ida e volta |
| ¬(¬p) | p | dupla negação |

- **Não são equivalentes** a p → q: a recíproca (q → p) e a inversa (¬p → ¬q).
- "E" e "ou" são comutativos (p ∧ q ≡ q ∧ p); a condicional **não** é.

### Negações (leis de De Morgan e outras)
| Proposição | Negação |
|---|---|
| p ∧ q | ¬p ∨ ¬q (nega as duas e troca "e" por "ou") |
| p ∨ q | ¬p ∧ ¬q (nega as duas e troca "ou" por "e") |
| p → q | p ∧ ¬q (mantém a primeira, "e", nega a segunda) |
| p ↔ q | p ⊻ q (ou... ou...) |
| p ⊻ q | p ↔ q |

### Negação com quantificadores
| Proposição | Negação |
|---|---|
| Todo A é B | Algum A não é B (pelo menos um A não é B) |
| Algum A é B | Nenhum A é B |
| Nenhum A é B | Algum A é B |
| Algum A não é B | Todo A é B |

### Exemplos resolvidos
1. P: "Se o motorista bebeu, então foi autuado."
   - Contrapositiva: "Se o motorista **não** foi autuado, então **não** bebeu."
   - Com "ou": "O motorista **não** bebeu **ou** foi autuado."
   - Negação: "O motorista bebeu **e não** foi autuado."
2. Negação de "O servidor é pontual e assíduo": "O servidor **não** é pontual **ou não** é assíduo."
3. Negação de "Ana estuda ou trabalha": "Ana **não** estuda **e não** trabalha."
4. Negação de "Todos os candidatos foram aprovados": "**Algum** candidato **não** foi aprovado." "Nenhum candidato foi aprovado" está errado: basta um reprovado para a frase original ser falsa.
5. Conferindo p → q ≡ ¬p ∨ q pela tabela:

| p | q | p → q | ¬p | ¬p ∨ q |
|---|---|---|---|---|
| V | V | V | F | V |
| V | F | F | F | F |
| F | V | V | V | V |
| F | F | V | V | V |

As colunas de p → q e ¬p ∨ q são iguais: as proposições são equivalentes.

## Pegadinhas do Cebraspe

- **Recíproca apresentada como equivalente**: "Se A, então B" **não** equivale a "Se B, então A".
- **Inversa apresentada como equivalente**: "Se A, então B" **não** equivale a "Se não A, então não B".
- **Negar a condicional com outra condicional**: a negação de "se A, então B" é "A **e** não B", nunca "se A, então não B".
- **Negar "e" mantendo o "e"**: "não A e não B" nega o "ou", não o "e".
- **"Todo" negado por "nenhum"**: errado; "todo" se nega com "algum... não" (ou "pelo menos um... não").
- **Antônimo no lugar da negação**: a negação de "a prova foi fácil" é "a prova **não** foi fácil". "A prova foi difícil" é antônimo, não negação: pode haver meio-termo.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. A proposição "Se Ana estudou, então foi aprovada" é equivalente a "Se Ana foi aprovada, então estudou".
   **Errado**. Essa é a recíproca; o equivalente é "Se Ana não foi aprovada, então não estudou".
2. A negação de "Pedro é agente e Maria é técnica" é "Pedro não é agente ou Maria não é técnica".
   **Certo**. Pela lei de De Morgan, nega-se cada parte e troca-se "e" por "ou".
3. A negação de "Todo motorista respeita o limite de velocidade" é "Nenhum motorista respeita o limite de velocidade".
   **Errado**. A negação é "Algum motorista não respeita o limite de velocidade".

Veja também [Proposições, conectivos e tabelas-verdade](/topico/raciocinio-logico-1).
