Os editores de texto, planilhas e apresentações são cobrados em dois pacotes: o **Microsoft Office** (Word, Excel, PowerPoint) e o **LibreOffice** (Writer, Calc, Impress), que é software livre e gratuito. O Cebraspe cobra sobretudo planilhas (fórmulas, referências e funções), recursos de formatação de documentos e a diferença entre transição e animação. Atalhos de teclado variam entre versões; o foco aqui está nos conceitos, que valem para os dois pacotes.

## O essencial

### Equivalência entre os programas
| Tipo | Microsoft Office | LibreOffice | Formato Office | Formato ODF (LibreOffice) |
|---|---|---|---|---|
| Texto | Word | Writer | .docx | .odt |
| Planilha | Excel | Calc | .xlsx | .ods |
| Apresentação | PowerPoint | Impress | .pptx | .odp |

- Os dois pacotes abrem e salvam arquivos um do outro; pode haver pequenas diferenças de formatação.
- Os dois exportam documentos para **PDF**.

### Editor de texto (Word / Writer)
- **Estilos** (Título 1, Título 2, Corpo de texto) padronizam a formatação. O **sumário automático** é gerado a partir dos estilos de título.
- **Cabeçalho e rodapé**: conteúdo repetido em todas as páginas (número de página, nome do órgão).
- **Quebra de página** força o texto para a página seguinte. No Word, a **quebra de seção** permite formatações diferentes (orientação, margens) em partes do mesmo documento; no Writer, o mesmo efeito se obtém com estilos de página.
- **Controle de alterações**: registra inserções e exclusões para revisão.
- **Mala direta**: gera várias cartas ou etiquetas a partir de uma lista de dados.

### Planilha (Excel / Calc)
- Célula = coluna + linha (B3). Toda fórmula começa com **=**.
- **Dois-pontos (:)** indica intervalo: A1:A4 = A1, A2, A3 e A4. **Ponto e vírgula (;)** separa argumentos: A1;A4 = só A1 e A4.
- Precedência dos operadores: primeiro `^` (potência), depois `*` e `/`, por último `+` e `-`. Parênteses mudam a ordem. `&` junta textos.
- Referências:

| Tipo | Exemplo | Ao copiar a fórmula |
|---|---|---|
| Relativa | A1 | linha e coluna se ajustam |
| Absoluta | $A$1 | nada muda |
| Mista | $A1 / A$1 | fica fixo só o que tem $ |

- Referência a outra planilha (aba): no Excel, `Planilha2!A1`; no Calc, `Planilha2.A1`.
- Funções básicas: SOMA, MÉDIA, MÁXIMO, MÍNIMO, SE (teste lógico; valor se verdadeiro; valor se falso) e CONT.SE (conta células que atendem a um critério).

### Apresentação (PowerPoint / Impress)
- **Slide mestre**: define o layout e a formatação padrão de todos os slides.
- **Transição**: efeito na **passagem de um slide para outro**.
- **Animação**: efeito aplicado a um **objeto dentro do slide** (texto, imagem).
- **Anotações**: texto de apoio que o apresentador vê e o público não.

### Exemplos resolvidos
Considere A1 = 10, A2 = 20, A3 = 30 e B1 = 2.
1. `=SOMA(A1:A3)` → 60. `=SOMA(A1;A3)` → 40 (só A1 e A3).
2. `=MÉDIA(A1:A3)` → 20.
3. `=A1+A2*B1` → 10 + 40 = **50**. `=(A1+A2)*B1` → 30 · 2 = **60**.
4. `=A3^B1` → 30² = **900**.
5. `=SE(A2>15;"Acima";"Abaixo")` → "Acima".
6. `=A1*$B$1` em C1, copiada para C2, vira `=A2*$B$1`. Copiada para D1 (uma coluna à direita), vira `=B1*$B$1`. O $B$1 não muda.

## Pegadinhas do Cebraspe

- **":" x ";"**: `=SOMA(A1:A4)` soma quatro células; `=SOMA(A1;A4)` soma duas.
- **Referência absoluta "se ajusta"?** Não. O $ fixa a coluna, a linha ou ambas.
- **Transição x animação**: transição é entre slides; animação é em objetos do slide.
- **Sumário automático sem estilos**: ele depende dos estilos de título aplicados aos títulos do texto.
- **"!" x "."**: o separador de planilha no Excel é "!"; no Calc, ".".
- **LibreOffice não abre .docx?** Abre e salva; o formato nativo é que é o ODF.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. No Excel e no Calc, a fórmula `=SOMA(A1;A4)` soma os valores de todas as células de A1 até A4.
   **Errado**. O ponto e vírgula separa argumentos: soma só A1 e A4. Para o intervalo, usa-se `A1:A4`.
2. Se a fórmula `=B2*$C$1`, digitada em D2, for copiada para D3, o resultado em D3 será `=B3*$C$1`.
   **Certo**. A referência relativa B2 avança uma linha; a absoluta $C$1 não muda.
3. No PowerPoint e no Impress, transição é o efeito aplicado a um objeto específico dentro do slide, como uma imagem.
   **Errado**. Isso é animação; transição é o efeito na passagem entre slides.
