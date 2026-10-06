Estatística básica resume um conjunto de dados em poucos números: medidas de **posição** (onde os dados se concentram) e de **dispersão** (quanto eles variam). O Cebraspe costuma dar uma lista pequena de valores ou uma tabela e pedir média, mediana, moda, variância ou desvio padrão, além de propriedades dessas medidas.

## O essencial

### Medidas de posição
- **Média aritmética**: soma dos valores dividida pela quantidade. É sensível a valores extremos.
- **Média ponderada**: soma de (valor · peso) dividida pela soma dos pesos.
- **Mediana**: valor central com os dados **em ordem**. Quantidade ímpar: o do meio. Quantidade par: média dos dois do meio. Pouco afetada por extremos.
- **Moda**: valor mais frequente. Pode não existir (amodal) ou haver mais de uma (bimodal, multimodal).
- **Quartis**: dividem os dados ordenados em quatro partes. Q2 é a mediana; a amplitude interquartil é Q3 − Q1.

### Medidas de dispersão
- **Amplitude**: maior valor − menor valor.
- **Variância**: média dos quadrados dos desvios em relação à média. Na **população**, divide-se por n; na **amostra**, por n − 1.
- **Desvio padrão**: raiz quadrada da variância. Fica na mesma unidade dos dados.
- **Coeficiente de variação**: CV = desvio padrão / média. Compara a variabilidade de conjuntos com médias diferentes.

### Efeito de operações sobre os dados
| Operação em todos os valores | Média | Desvio padrão | Variância |
|---|---|---|---|
| Somar k | soma k | não muda | não muda |
| Multiplicar por k | multiplica por k | multiplica por \|k\| | multiplica por k² |

### Exemplos resolvidos
**Dados: 2, 4, 4, 5, 10** (5 valores, já em ordem).
- Média: (2 + 4 + 4 + 5 + 10) / 5 = 25 / 5 = **5**.
- Mediana: o 3º valor = **4**.
- Moda: **4** (aparece duas vezes).
- Amplitude: 10 − 2 = **8**.
- Variância (população): desvios −3, −1, −1, 0, 5; quadrados 9, 1, 1, 0, 25; soma 36. 36 / 5 = **7,2**.
- Desvio padrão: √7,2 ≈ **2,68**.
- Repare: o 10 puxa a média (5) para cima da mediana (4).

**Mediana com quantidade par**: 3, 6, 8, 11. Os do meio são 6 e 8: mediana = (6 + 8) / 2 = **7**.

**Média ponderada**: prova objetiva nota 6 (peso 2) e discursiva nota 8 (peso 3): (6 · 2 + 8 · 3) / (2 + 3) = 36 / 5 = **7,2**.

**Propriedade**: os salários de um setor têm média R$ 3.000 e desvio padrão R$ 400. Com aumento de R$ 200 para todos, a média vai a R$ 3.200 e o desvio padrão continua R$ 400. Com reajuste de 10% para todos, a média vai a R$ 3.300 e o desvio padrão a R$ 440.

## Pegadinhas do Cebraspe

- **Mediana sem ordenar**: sempre coloque os dados em ordem antes de achar o termo central.
- **Somar constante altera o desvio padrão?** Não. Só desloca os dados; a dispersão continua igual.
- **Multiplicar por k e a variância**: ela é multiplicada por k², não por k.
- **População x amostra**: divisor n ou n − 1. Leia qual o enunciado pede.
- **Média sempre é um dos valores?** Não. A média de 1 e 2 é 1,5.
- **Desvio padrão negativo**: impossível; é raiz quadrada.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. Se cada valor de um conjunto de dados for aumentado em 5 unidades, o desvio padrão também aumentará em 5 unidades.
   **Errado**. Somar uma constante desloca a média, mas não altera o desvio padrão.
2. No conjunto 3, 7, 7, 8, 10, a média, a mediana e a moda são iguais.
   **Certo**. Média 35 / 5 = 7; mediana (3º valor) = 7; moda = 7.
3. Considerando os valores 1, 3 e 5 como uma população, a variância é igual a 4.
   **Errado**. Desvios −2, 0 e 2; soma dos quadrados 8; 8 / 3 ≈ 2,67. O valor 4 seria a variância amostral (8 / 2).
