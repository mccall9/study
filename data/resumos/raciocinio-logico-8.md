Sequências são listas de números (ou letras, figuras) que seguem um padrão. As mais importantes são a progressão aritmética (PA), em que se soma sempre o mesmo valor, e a progressão geométrica (PG), em que se multiplica sempre pelo mesmo valor. O Cebraspe costuma descrever uma situação real (veículos fiscalizados por hora, por exemplo) e pedir o termo de certa posição ou a soma até ele.

## O essencial

### Progressão aritmética (PA)
- Cada termo é o anterior **mais** a razão r. Ex.: 5, 8, 11, 14... (r = 3).
- **Termo geral**: aₙ = a₁ + (n − 1) · r.
- **Soma dos n primeiros termos**: Sₙ = (a₁ + aₙ) · n ÷ 2.
- Em três termos seguidos, o do meio é a média dos vizinhos (8 = (5 + 11) ÷ 2).
- r > 0: crescente; r < 0: decrescente; r = 0: constante.

### Progressão geométrica (PG)
- Cada termo é o anterior **vezes** a razão q. Ex.: 2, 6, 18, 54... (q = 3).
- **Termo geral**: aₙ = a₁ · qⁿ⁻¹.
- **Soma dos n primeiros termos** (q ≠ 1): Sₙ = a₁ · (qⁿ − 1) ÷ (q − 1).
- **Soma infinita** (só quando −1 < q < 1): S = a₁ ÷ (1 − q).
- q entre 0 e 1: decrescente; q negativo: sinais alternados.

### Termos x totais acumulados
Muitos itens dão os **totais acumulados** e perguntam sobre o que ocorreu **em cada período**, ou o contrário. O valor de cada período é a diferença entre dois acumulados seguidos. Se essas diferenças formam uma PA, os acumulados são somas de uma PA.

### Exemplos resolvidos
1. **PA**: a₁ = 5 e r = 3. Décimo termo: a₁₀ = 5 + 9 × 3 = **32**. Soma dos 10 primeiros: (5 + 32) × 10 ÷ 2 = **185**.
2. **PG**: 2, 6, 18... Sexto termo: a₆ = 2 × 3⁵ = 2 × 243 = **486**. Soma dos 6 primeiros: 2 × (3⁶ − 1) ÷ (3 − 1) = 2 × 728 ÷ 2 = **728**.
3. **PG infinita**: 10 + 5 + 2,5 + ... tem q = 0,5. Soma: 10 ÷ (1 − 0,5) = **20**.
4. **Acumulados**: totais de 20, 60, 120, 200, 300 veículos ao fim de cada hora.
   - Fiscalizados em cada hora: 20, 40, 60, 80, 100. É uma PA com a₁ = 20 e r = 20, ou seja, qₙ = 20n.
   - Total até a hora n = soma dessa PA = 20 × (1 + 2 + ... + n) = 20 × n(n + 1) ÷ 2 = **10 · n · (n + 1)**.
   - Conferindo: n = 5 dá 10 × 5 × 6 = 300. Até a 7ª hora: 10 × 7 × 8 = **560**. Até a 10ª: 10 × 10 × 11 = **1.100**.
   - A sequência dos acumulados (20, 60, 120...) **não** é PA: as diferenças entre eles mudam.

## Pegadinhas do Cebraspe

- **Esquecer o (n − 1)**: o 10º termo de uma PA tem 9 razões somadas ao primeiro, não 10.
- **Confundir termo com soma**: "veículos fiscalizados na 7ª hora" (termo: 140) é diferente de "até o fim da 7ª hora" (soma: 560).
- **Chamar de PA o que é soma de PA**: os acumulados crescem cada vez mais rápido; quem é PA são as diferenças.
- **PA x PG**: se a diferença entre termos é constante, é PA; se o quociente é constante, é PG.
- **Soma infinita com q fora do intervalo**: com q ≥ 1, a soma cresce sem limite e a fórmula não vale.

## Como caiu na prova

- **PRF 2021** (2 itens), sobre uma operação com 20, 60, 120, 200 e 300 veículos fiscalizados até o fim de cada uma das cinco primeiras horas, mantido o padrão até a 10ª hora. **Certo**: mais de 550 veículos terão sido fiscalizados até o fim da 7ª hora (10 × 7 × 8 = 560). **Certo**: a sequência das quantidades fiscalizadas apenas em cada hora (20, 40, 60...) é uma PA de razão 20.
