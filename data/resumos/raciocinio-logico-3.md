Argumento é um conjunto de **premissas** que sustentam uma **conclusão**. O Cebraspe pergunta se o argumento é **válido**, isto é, se a conclusão decorre obrigatoriamente das premissas. A lógica de primeira ordem acrescenta predicados e quantificadores ("todo", "existe") e aparece em itens de tradução para símbolos e de negação.

## O essencial

### Validade
- **Válido**: sempre que todas as premissas forem verdadeiras, a conclusão será verdadeira. A validade depende da **forma**, não do conteúdo.
- Um argumento válido pode ter conclusão falsa, se alguma premissa for falsa. Validade não é o mesmo que verdade.
- **Inválido (falácia ou sofisma)**: existe pelo menos um caso com premissas verdadeiras e conclusão falsa.

### Formas válidas
| Nome | Premissas | Conclusão |
|---|---|---|
| Modus ponens | p → q; p | q |
| Modus tollens | p → q; ¬q | ¬p |
| Silogismo hipotético | p → q; q → r | p → r |
| Silogismo disjuntivo | p ∨ q; ¬p | q |

### Formas inválidas (falácias formais)
| Nome | Premissas | Conclusão errada |
|---|---|---|
| Afirmação do consequente | p → q; q | p |
| Negação do antecedente | p → q; ¬p | ¬q |

### Dois métodos de teste
1. **Partir das premissas**: considere todas verdadeiras, comece pela mais simples (proposição isolada ou conjunção) e descubra os valores das demais. Veja se a conclusão sai verdadeira.
2. **Buscar contraexemplo**: suponha a conclusão falsa e tente deixar todas as premissas verdadeiras. Se conseguir, o argumento é inválido.

### Lógica de primeira ordem
- **Predicado**: propriedade atribuída a um elemento. P(x): "x é policial".
- **Quantificador universal** ∀x: "para todo x". **Existencial** ∃x: "existe x".
- "Todo policial é servidor": ∀x (P(x) → S(x)). Com "todo", usa-se a **condicional**.
- "Algum policial é motorista": ∃x (P(x) ∧ M(x)). Com "existe", usa-se a **conjunção**.
- Negações: ¬∀x P(x) ≡ ∃x ¬P(x) ("nem todos" = "algum não"); ¬∃x P(x) ≡ ∀x ¬P(x) ("não existe x com P" = "nenhum x tem P").

### Silogismos categóricos
- "Todo A é B. Todo B é C. Logo, todo A é C." Válido (círculos encaixados).
- "Todo A é B. Algum C é B. Logo, algum C é A." Inválido: os C que são B podem estar fora de A.

### Exemplos resolvidos
1. "Se chove, a pista fica molhada. A pista não está molhada. Logo, não choveu." Forma p → q; ¬q; logo ¬p. **Modus tollens: válido.**
2. "Se chove, a pista fica molhada. A pista está molhada. Logo, choveu." Forma p → q; q; logo p. **Inválido.** Contraexemplo: p = F e q = V (a pista foi lavada). As premissas ficam V (F → V = V) e a conclusão fica F.
3. Premissas: P1 "Se João é aprovado, toma posse." P2 "Se João toma posse, muda de cidade." P3 "João não mudou de cidade." Conclusão: "João não foi aprovado."
   - P3 verdadeira: "muda" = F.
   - P2 verdadeira com consequente F: "toma posse" = F.
   - P1 verdadeira com consequente F: "aprovado" = F.
   - A conclusão é V. **Válido.**

## Pegadinhas do Cebraspe

- **Confundir válido com verdadeiro**: o item afirma que, por ter conclusão falsa, o argumento é inválido. Não necessariamente.
- **Afirmação do consequente**: parece lógico ("a pista está molhada, logo choveu"), mas é falácia.
- **Negação do antecedente**: "não choveu, logo a pista não está molhada" também é inválido.
- **Quantificador com o conectivo trocado**: "todo" usa →; "existe" usa ∧. ∃x (P(x) → M(x)) não traduz "algum policial é motorista".
- **"Algum" não exclui "todo"**: "algum A é B" continua verdadeiro se todo A for B.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. O argumento "Se o servidor faltou, perdeu o ponto. O servidor perdeu o ponto. Logo, o servidor faltou" é válido.
   **Errado**. É a falácia da afirmação do consequente: ele pode ter perdido o ponto por outro motivo.
2. Um argumento válido pode ter conclusão falsa, desde que pelo menos uma de suas premissas seja falsa.
   **Certo**. Validade garante a conclusão apenas quando todas as premissas são verdadeiras.
3. A sentença "Existe policial que é motorista" pode ser representada por ∃x (P(x) → M(x)), em que P(x) é "x é policial" e M(x) é "x é motorista".
   **Errado**. Com o quantificador existencial, a forma correta é ∃x (P(x) ∧ M(x)).

Veja também [Equivalências e negações lógicas](/topico/raciocinio-logico-2) e [Diagramas lógicos](/topico/raciocinio-logico-4).
