Sistema operacional é o software que gerencia o computador: controla o hardware, a memória, os processos (programas em execução) e os arquivos, e oferece a interface para o usuário. Os editais pedem Windows (versão 10 nos últimos concursos) e noções de Linux. O Cebraspe cobra recursos do Windows, atalhos, gerenciamento de arquivos e as diferenças básicas entre os dois sistemas.

## O essencial

### Windows 10
- **Explorador de Arquivos** (Win+E): navega por pastas e unidades. **Área de Trabalho**, **Menu Iniciar** e **Barra de Tarefas** formam a interface principal.
- **Lixeira**: guarda os itens excluídos de discos locais e permite restaurá-los. **Shift+Delete** exclui sem passar pela Lixeira. Itens apagados de pen drive ou pasta de rede, em regra, não vão para a Lixeira.
- **Configurações** (Win+I) e **Painel de Controle** ajustam o sistema. **Gerenciador de Tarefas** (Ctrl+Shift+Esc) mostra e encerra processos.
- **Conta Microsoft**: permite sincronizar configurações entre computadores que usam a mesma conta (tema e plano de fundo, preferências de idioma, senhas e outras configurações do Windows).
- **Segurança**: Microsoft Defender (antivírus nativo), Firewall do Windows e **BitLocker** (criptografia de disco, nas edições Pro e superiores). Atualizações pelo Windows Update.
- **Sistemas de arquivos**: NTFS (padrão do Windows, com permissões e criptografia), FAT32 (antigo, limite de 4 GB por arquivo), exFAT (comum em pen drives e cartões).

Atalhos que mais caem:

| Atalho | Ação |
|---|---|
| Win+D | mostrar a Área de Trabalho |
| Win+L | bloquear o computador |
| Win+E | abrir o Explorador de Arquivos |
| Win+V | histórico da área de transferência |
| Alt+Tab | alternar entre janelas abertas |
| Ctrl+C / Ctrl+X / Ctrl+V | copiar / recortar / colar |
| Ctrl+Z | desfazer |
| F2 | renomear o item selecionado |

### Linux
- É um **núcleo (kernel)** de código aberto, distribuído sob licença livre (GPL). O sistema completo vem em **distribuições**: Ubuntu, Debian, Fedora, Linux Mint.
- **Multiusuário e multitarefa**. O superusuário é o **root**; o comando **sudo** executa uma tarefa com privilégios de administrador.
- **Diferencia maiúsculas de minúsculas** nos nomes: Relatorio.txt e relatorio.txt são arquivos diferentes. Arquivos que começam com ponto (.config) são ocultos.
- Estrutura de pastas a partir da raiz **/**: /home (pastas dos usuários), /etc (configurações), /bin (comandos), /tmp (temporários), /dev (dispositivos).
- Tem interfaces gráficas (GNOME, KDE, entre outras) e também o terminal.

| Comando | Função |
|---|---|
| ls | listar arquivos |
| cd | mudar de pasta |
| pwd | mostrar a pasta atual |
| mkdir | criar pasta |
| cp / mv / rm | copiar / mover ou renomear / apagar |
| cat | exibir o conteúdo de um arquivo |
| chmod | alterar permissões |

- **Permissões**: leitura (r), escrita (w) e execução (x) para dono, grupo e outros. Em número, r = 4, w = 2, x = 1. Exemplo resolvido: chmod 755 dá 7 (4+2+1 = rwx) ao dono e 5 (4+1 = r-x) ao grupo e aos outros.

## Pegadinhas do Cebraspe

- **"O Windows não sincroniza senhas entre computadores"**: errado. Com a mesma conta Microsoft, a sincronização de configurações inclui senhas.
- **"Linux não tem interface gráfica"**: errado. Tem várias; o terminal é opcional para o usuário comum.
- **Software livre = gratuito?** Não necessariamente. Livre diz respeito à liberdade de usar, estudar, modificar e redistribuir; a distribuição pode ser cobrada.
- **Shift+Delete**: apaga sem mandar para a Lixeira. No terminal do Linux, **rm** também apaga direto.
- **Barras**: o Windows usa barra invertida (C:\Users); o Linux usa barra normal (/home).

## Como caiu na prova

- **PRF 2021** (1 item): afirmou que o Windows 10 permite compartilhar configurações (como plano de fundo e histórico do Internet Explorer) entre computadores com a mesma conta, mas não permite, por segurança, compartilhar senhas. Gabarito: **Errado**. A sincronização de configurações da conta Microsoft no Windows 10 tem a opção de sincronizar senhas.
