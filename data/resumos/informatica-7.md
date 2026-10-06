Organizar arquivos, pastas e programas é saber onde as informações ficam guardadas, como são nomeadas e o que acontece ao copiar, mover, renomear ou excluir. O Cebraspe cobra o tema com situações do Explorador de Arquivos do Windows e, às vezes, do gerenciador de arquivos do Linux: extensões, caminhos, atalhos, Lixeira e comportamento ao arrastar itens.

## O essencial

### Arquivos e pastas
- **Arquivo**: conjunto de dados gravado com um nome e, em geral, uma **extensão** (.pdf, .docx). A extensão indica o formato e o programa que o abre.
- **Pasta (diretório)**: agrupa arquivos e outras pastas (subpastas), formando uma estrutura em **árvore**.
- No Windows, cada unidade tem uma letra (C:, D:) e o caminho usa barra invertida: `C:\Users\Ana\Documentos\edital.pdf`. No Linux, tudo parte da raiz `/`, com barra normal: `/home/ana/documentos/edital.pdf`.
- **Caminho absoluto**: completo, a partir da unidade ou da raiz. **Relativo**: a partir da pasta atual.

### Nomes
- No Windows, não são permitidos nos nomes os caracteres `\ / : * ? " < > |`.
- O Windows **não diferencia** maiúsculas de minúsculas nos nomes (Relatorio.txt e relatorio.txt são o mesmo nome); o Linux **diferencia**.
- Na mesma pasta, não podem existir dois itens com o mesmo nome.
- O Windows pode ocultar as extensões de tipos conhecidos; a exibição é ajustada nas opções de visualização do Explorador.

### Extensões comuns
| Tipo | Extensões |
|---|---|
| Texto | .docx, .odt, .txt, .pdf |
| Planilha / apresentação | .xlsx, .ods / .pptx, .odp |
| Imagem | .jpg, .png, .gif |
| Áudio e vídeo | .mp3, .mp4 |
| Compactado | .zip, .rar, .7z |
| Executável (Windows) | .exe |

### Operações
| Ação | Efeito |
|---|---|
| Copiar (Ctrl+C) e colar (Ctrl+V) | cria uma cópia; o original continua no lugar |
| Recortar (Ctrl+X) e colar | move: o item sai da origem |
| Renomear (F2) | muda o nome, sem alterar o conteúdo |
| Excluir (Delete) | em disco local, envia para a Lixeira |
| Shift+Delete | exclui sem passar pela Lixeira |
| Arrastar para pasta da **mesma unidade** | move, por padrão |
| Arrastar para **outra unidade** | copia, por padrão |

- Itens excluídos de pen drive ou pasta de rede, em regra, não vão para a Lixeira.
- **Compactar** (.zip) reduz o tamanho e agrupa vários arquivos em um só; o Windows abre e cria arquivos .zip sem programa extra.

### Programas e atalhos
- **Programa** (aplicativo) é instalado no sistema; no Windows, os executáveis costumam ter extensão .exe. A desinstalação é feita pelas configurações do sistema.
- **Programa padrão**: cada extensão é associada a um programa. A opção "Abrir com" permite escolher outro.
- **Atalho**: pequeno arquivo que **aponta** para outro item (programa, pasta ou arquivo). Excluir o atalho **não** apaga o original; se o original for movido ou apagado, o atalho pode deixar de funcionar.

### Exemplos resolvidos
1. Caminho `C:\Users\Ana\Documentos\PRF\edital.pdf`: unidade **C:**, arquivo dentro da pasta **PRF** (subpasta de Documentos), nome **edital**, extensão **.pdf**.
2. Ana arrasta `edital.pdf` da pasta Documentos (no C:) para um pen drive (E:). Como são unidades diferentes, o arquivo é **copiado**: passa a existir nos dois lugares.
3. Ana renomeia `foto.jpg` para `foto.pdf`. O conteúdo continua sendo imagem; só o nome mudou, e o leitor de PDF tende a não abri-lo.

## Pegadinhas do Cebraspe

- **Excluir atalho desinstala o programa?** Não. O atalho é só um apontador.
- **Mudar a extensão converte o arquivo?** Não. Conversão exige salvar ou exportar em outro formato.
- **Arrastar sempre move?** Não. Entre unidades diferentes, o padrão é copiar.
- **Tudo vai para a Lixeira?** Não. Shift+Delete e itens de unidades removíveis ou de rede, em regra, são apagados direto.
- **Maiúsculas e minúsculas**: o Windows trata como o mesmo nome; o Linux, como nomes diferentes.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. No Windows, ao se excluir da Área de Trabalho o atalho de um programa, o programa é desinstalado do computador.
   **Errado**. O atalho só aponta para o programa; apagá-lo não remove a instalação.
2. No Explorador de Arquivos do Windows, arrastar um arquivo com o mouse para uma pasta localizada em outra unidade de disco, por padrão, copia o arquivo.
   **Certo**. Na mesma unidade, o padrão é mover; em unidades diferentes, copiar.
3. Renomear um arquivo de "relatorio.docx" para "relatorio.pdf" converte o documento para o formato PDF.
   **Errado**. Só o nome muda; para converter, é preciso exportar ou salvar como PDF.

Veja também [Sistemas operacionais (Windows e Linux)](/topico/informatica-5).
