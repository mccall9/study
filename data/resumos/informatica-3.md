Buscadores (Google, Bing, DuckDuckGo) usam robôs que percorrem a web e montam um índice das páginas. Quando se digita uma pesquisa, o buscador consulta esse índice e ordena os resultados. O Cebraspe cobra principalmente os **operadores de busca** do Google: símbolos e palavras que refinam a pesquisa.

## O essencial

### Operadores do Google

| Operador | Efeito | Exemplo |
|---|---|---|
| aspas | frase exata, nessa ordem | `"seguro-defeso"` |
| hífen (sinal de menos), colado à palavra | exclui o termo | `jaguar -carro` |
| site: | só resultados de um site ou domínio | `concurso site:gov.br` |
| filetype: | só arquivos de um tipo | `edital filetype:pdf` |
| OR (maiúsculo) | um termo ou outro | `PRF OR INSS` |
| asterisco | curinga para palavra desconhecida, em geral dentro de aspas | `"o maior * do Brasil"` |
| intitle: | termo no título da página | `intitle:concurso` |
| inurl: | termo no endereço da página | `inurl:edital` |
| @ | busca em redes sociais | `campanha PRF @twitter` |
| # | busca hashtags | `#concursopublico` |
| $ | busca preços | `notebook $3000` |
| dois pontos seguidos (..) | intervalo de números | `notebook $2000..$3000` |

### Regras gerais
- O Google **não diferencia maiúsculas de minúsculas** nos termos ("prf" e "PRF" dão o mesmo resultado). A exceção é o operador **OR**, que precisa estar em maiúsculas para funcionar como operador.
- Os operadores com dois-pontos vão **sem espaço**: `site:gov.br`, e não `site: gov.br`.
- Termos digitados soltos são combinados: o buscador procura páginas relevantes para todos eles, não necessariamente na ordem digitada.
- Resultados marcados como **patrocinados** são anúncios pagos.
- O buscador só encontra o que indexou: páginas que exigem login, conteúdos bloqueados aos robôs e a chamada deep web ficam de fora.

### Exemplos resolvidos
1. Achar o edital do INSS em PDF apenas em sites do governo: `edital INSS filetype:pdf site:gov.br`.
2. Notícias sobre o concurso da PRF que não tratem de resultado: `concurso PRF -resultado`.
3. A frase exata "tabela de infrações": `"tabela de infrações"`. Sem aspas, aparecem páginas com as palavras espalhadas.
4. Publicações com "campanha" e "PRF" no Twitter: `campanha PRF @twitter`.

## Pegadinhas do Cebraspe

- **Aspas não significam "todas as palavras em qualquer ordem"**: significam frase exata.
- **Sinal de menos com espaço**: `concurso - resultado` não exclui nada; o sinal precisa estar colado ao termo (`-resultado`).
- **OR minúsculo**: `prf or inss` é lido como três palavras comuns.
- **"O Google encontra tudo o que existe na Internet"**: falso. Só o que foi indexado e está acessível.
- **Maiúsculas fazem diferença?** Para os termos, não.
- **Ordem dos resultados**: o primeiro resultado não é necessariamente o mais confiável; pode ser anúncio.

## Como caiu na prova

- **PRF 2021** (1 item): afirmou que digitar `campanha PRF @twitter` no Google pesquisa publicações com os termos "PRF" e "campanha" na rede social Twitter. Gabarito: **Certo**. O símbolo @ antes de uma palavra direciona a busca para redes sociais, conforme a própria ajuda do Google; os outros termos são procurados nas publicações dessa rede.
