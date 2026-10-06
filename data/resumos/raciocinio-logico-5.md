Análise combinatória conta de quantas maneiras algo pode acontecer sem precisar listar todas as possibilidades. No Cebraspe, aparece em senhas, placas, filas, comissões, anagramas e escalas de plantão. O passo mais importante é decidir se a **ordem importa**: isso separa arranjo de combinação.

## O essencial

### Princípios básicos
- **Princípio multiplicativo (PFC)**: se uma tarefa tem etapas sucessivas, multiplica-se o número de opções de cada etapa. "E" multiplica.
- **Princípio aditivo**: se os casos são separados (um **ou** outro, sem sobreposição), soma-se. "Ou" soma.
- **Fatorial**: n! = n · (n − 1) · ... · 1. Por definição, 0! = 1. Exemplos: 3! = 6; 4! = 24; 5! = 120; 6! = 720.

### Fórmulas
| Situação | Fórmula | Quando usar |
|---|---|---|
| Permutação simples | Pₙ = n! | ordenar **todos** os n elementos |
| Permutação com repetição | n! / (a! · b! · ...) | anagramas com letras repetidas |
| Arranjo | A(n, p) = n! / (n − p)! | escolher p de n e a **ordem importa** |
| Combinação | C(n, p) = n! / [p! · (n − p)!] | escolher p de n e a ordem **não** importa |
| Permutação circular | (n − 1)! | pessoas em volta de uma mesa redonda |

**Teste da ordem**: troque a posição de dois escolhidos. Se o resultado muda (chefe e subchefe, senha, pódio), a ordem importa. Se não muda (comissão, equipe, grupo de amigos), é combinação.

Atalho de cálculo: C(n, p) = [n · (n − 1) · ... (p fatores)] / p!. Exemplo: C(10, 3) = (10 · 9 · 8) / (3 · 2 · 1) = 120.

### Exemplos resolvidos
1. **Senha** de 4 dígitos (0 a 9) **sem repetição**: 10 · 9 · 8 · 7 = **5.040**. Com repetição permitida: 10⁴ = **10.000**.
2. **Comissão** de 3 agentes entre 10: ordem não importa. C(10, 3) = 720 / 6 = **120**.
3. **Chefe e subchefe** entre 10 agentes: ordem importa. A(10, 2) = 10 · 9 = **90**.
4. **Anagramas** de PROVA (5 letras distintas): 5! = **120**. Começando por P: fixa-se o P e permutam-se as outras 4: 4! = **24**.
5. **Anagramas** de ARARA: 5 letras, com A repetido 3 vezes e R 2 vezes: 5! / (3! · 2!) = 120 / 12 = **10**.
6. **Fila** com 5 pessoas em que duas devem ficar juntas: trate as duas como um bloco. São 4 "itens" (4! = 24) e o bloco pode se organizar de 2 formas (2! = 2): 24 · 2 = **48**.
7. **"Pelo menos um"**: comissões de 3 pessoas, entre 5 homens e 4 mulheres, com pelo menos uma mulher. Total: C(9, 3) = 84. Só homens: C(5, 3) = 10. Resposta: 84 − 10 = **74**.

## Pegadinhas do Cebraspe

- **Arranjo no lugar de combinação**: em comissões e equipes sem cargos, a ordem não importa. Usar arranjo multiplica o resultado indevidamente.
- **Esquecer letras repetidas**: anagramas de palavras com letras iguais exigem dividir pelos fatoriais das repetições.
- **"Pelo menos um"**: calcule o total e subtraia os casos com nenhum; somar caso a caso é mais trabalhoso e propenso a erro.
- **Somar quando era multiplicar**: escolher camisa **e** calça multiplica; escolher camisa **ou** calça soma.
- **Elementos juntos**: lembre de multiplicar pelas permutações internas do bloco.
- **Com ou sem repetição**: confira se o enunciado permite repetir dígitos ou pessoas.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. Com 6 agentes disponíveis, é possível formar 20 equipes distintas de 3 agentes.
   **Certo**. C(6, 3) = (6 · 5 · 4) / (3 · 2 · 1) = 120 / 6 = 20.
2. O número de anagramas da palavra CARRO é igual a 120.
   **Errado**. A letra R se repete duas vezes: 5! / 2! = 60.
3. Se uma senha tiver 3 dígitos distintos, escolhidos entre 0 e 9, haverá 720 senhas possíveis.
   **Certo**. 10 · 9 · 8 = 720 (a ordem dos dígitos importa).
