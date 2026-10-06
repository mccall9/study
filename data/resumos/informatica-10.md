Este tópico junta três assuntos da transformação digital: bancos de dados (como a informação é organizada e consultada), big data (volumes enormes e variados de dados) e inteligência artificial (sistemas que aprendem com dados). O Cebraspe cobra conceitos, não programação: chave primária, os "Vs" do big data, tipos de aprendizado de máquina e o papel da Internet das coisas.

## O essencial

### Banco de dados
- **Banco de dados**: coleção organizada de dados relacionados. **SGBD** (sistema gerenciador de banco de dados) é o software que o administra: MySQL, PostgreSQL, Oracle, SQL Server.
- **Modelo relacional**: dados em **tabelas**. Cada **linha** (registro ou tupla) é uma ocorrência; cada **coluna** (campo ou atributo) é uma característica.
- **Chave primária**: identifica cada registro de forma única; não se repete e não pode ficar vazia (ex.: CPF numa tabela de segurados).
- **Chave estrangeira**: campo que aponta para a chave primária de outra tabela, criando o relacionamento (ex.: o CPF do segurado na tabela de benefícios).
- **SQL**: linguagem de consulta. SELECT consulta; INSERT inclui; UPDATE altera; DELETE apaga. CREATE, ALTER e DROP criam, alteram e apagam a estrutura (tabelas).
- **NoSQL**: bancos não relacionais (documentos, chave-valor, grafos, colunas), usados para dados muito volumosos ou sem estrutura fixa.

Exemplo resolvido: tabela SEGURADO (CPF, Nome) e tabela BENEFICIO (Numero, Tipo, CPF). Em SEGURADO, o CPF é chave primária. Em BENEFICIO, a chave primária é o Numero e o CPF é chave estrangeira, pois liga cada benefício ao seu titular. Um mesmo CPF pode aparecer em vários benefícios.

### Big data
| V | Significado |
|---|---|
| Volume | quantidade enorme de dados |
| Velocidade | dados gerados e processados em ritmo muito rápido, às vezes em tempo real |
| Variedade | formatos diferentes: tabelas, textos, imagens, vídeos, sensores |
| Veracidade | confiabilidade e qualidade dos dados |
| Valor | utilidade dos dados para gerar decisões |

- Os três primeiros são os "Vs" clássicos; veracidade e valor foram acrescentados depois.
- **Estruturados** (tabelas), **semiestruturados** (JSON, XML) e **não estruturados** (e-mails, fotos, vídeos).
- **Data warehouse**: repositório de dados tratados e organizados para análise. **Data lake**: guarda dados brutos, no formato original. **Mineração de dados**: busca padrões escondidos em grandes bases.
- **Internet das coisas (IoT)**: objetos com sensores conectados à Internet (câmeras, relógios, medidores, veículos). Multiplicam as fontes e os formatos de dados, aumentando volume, velocidade e variedade.

### Inteligência artificial
- **Aprendizado de máquina**: o sistema aprende padrões a partir de exemplos, em vez de seguir só regras escritas à mão.
  - **Supervisionado**: dados com resposta conhecida (rotulados). Ex.: classificar placas a partir de fotos já identificadas.
  - **Não supervisionado**: dados sem rótulo; o sistema agrupa por semelhança. Ex.: separar perfis de requerimentos.
  - **Por reforço**: aprende por tentativa e erro, com recompensas e punições.
- **Aprendizado profundo (deep learning)**: redes neurais com muitas camadas; base do reconhecimento de imagem e voz.
- **Processamento de linguagem natural**: entender e gerar texto (chatbots). **IA generativa** produz conteúdo novo (textos, imagens).

## Pegadinhas do Cebraspe

- **Chave primária repetida**: não pode. Quem pode se repetir é a chave estrangeira.
- **SQL é um SGBD?** Não. SQL é a linguagem; o SGBD é o software.
- **Big data é só volume**: errado. Velocidade e variedade são igualmente centrais.
- **Supervisionado x não supervisionado**: o supervisionado usa dados rotulados; inverter é erro clássico.
- **Data lake x data warehouse**: o lago guarda dados brutos; o armazém, dados tratados para análise.

## Como caiu na prova

- **PRF 2021** (1 item, sobre transformação digital): afirmou que a Internet das coisas aumenta a quantidade e a complexidade dos dados, com novas formas e fontes, influenciando características do big data como volume, velocidade e variedade. Gabarito: **Certo**.
