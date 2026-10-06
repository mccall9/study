Segurança da informação é a proteção dos dados contra acesso indevido, alteração e perda. O tema cai em toda prova do Cebraspe, quase sempre trocando a definição de um tipo de malware pela de outro, ou confundindo golpe com programa malicioso. Também aparecem ferramentas de proteção (firewall, antivírus, criptografia) e tipos de backup.

## O essencial

### Princípios
- **Confidencialidade**: só quem tem autorização acessa.
- **Integridade**: a informação não é alterada indevidamente.
- **Disponibilidade**: a informação está acessível quando necessária.
- Complementares: **autenticidade** (garantia de quem é o autor) e **não repúdio** (o autor não pode negar a autoria).

### Malware (códigos maliciosos)
| Tipo | Característica principal |
|---|---|
| Vírus | Insere cópias de si mesmo em outros arquivos ou programas; depende da execução do hospedeiro para agir |
| Worm | Propaga-se sozinho pela rede, explorando falhas; não precisa de hospedeiro e consome recursos |
| Cavalo de troia | Parece um programa útil, mas executa funções ocultas e maliciosas |
| Ransomware | Criptografa os dados (ou bloqueia o equipamento) e exige resgate, em geral em criptomoeda |
| Spyware | Monitora a atividade e envia as informações a terceiros (keylogger captura o que é digitado) |
| Backdoor | Abre uma "porta dos fundos" para o invasor voltar ao sistema |
| Bot | Permite controle remoto; uma rede de bots (botnet) é usada em ataques de negação de serviço |
| Rootkit | Esconde a presença do invasor e de outros códigos maliciosos |

### Golpes (engenharia social)
- **Phishing**: mensagem, site ou ligação falsa que imita instituição conhecida (banco, INSS, Receita) para enganar a vítima e obter senhas e dados. Não é um tipo de programa: é um golpe.
- **Pharming**: redireciona o usuário a um site falso mesmo quando ele digita o endereço correto (manipulação de DNS).
- **Hoax**: boato espalhado como se fosse verdade.

### Ferramentas de proteção
- **Antivírus**: detecta e remove malware.
- **Firewall**: filtra o tráfego de rede segundo regras, liberando ou bloqueando conexões. Não é antivírus.
- **IDS** detecta intrusões e alerta; **IPS** detecta e bloqueia.
- **Criptografia**: simétrica (mesma chave para cifrar e decifrar) ou assimétrica (par de chaves pública e privada).
- **Assinatura digital**: feita com a chave **privada** do autor e conferida com a chave **pública**. Garante autenticidade, integridade e não repúdio (não garante sigilo).
- **BitLocker**: criptografia de disco do Windows; protege os dados se o computador for perdido ou furtado.
- **Autenticação multifator**: combina algo que a pessoa sabe (senha), tem (celular, token) ou é (biometria).

### Backup
| Tipo | O que copia | Para restaurar |
|---|---|---|
| Completo | todos os arquivos selecionados | só o último completo |
| Incremental | o que mudou desde o último backup de qualquer tipo | o completo + todos os incrementais seguintes |
| Diferencial | o que mudou desde o último completo | o completo + o último diferencial |

Exemplo resolvido: completo no domingo, falha na quinta. Com incrementais diários, a restauração usa o completo de domingo mais os incrementais de segunda, terça e quarta. Com diferenciais, usa o completo de domingo mais só o diferencial de quarta. Uma cópia guardada fora do computador e desconectada protege contra ransomware.

## Pegadinhas do Cebraspe

- **Ransomware x vírus**: inserir cópias em outros arquivos é do vírus; sequestrar dados com criptografia é do ransomware.
- **Phishing descrito como malware que criptografa dados**: errado; a descrição é de ransomware.
- **Vírus x worm**: o worm se propaga sozinho; o vírus precisa de um hospedeiro executado.
- **Firewall remove vírus?** Não. Ele filtra conexões.
- **Assinatura digital garante sigilo?** Não. Para sigilo, cifra-se com a chave pública do destinatário.
- **Incremental x diferencial**: o incremental compara com o último backup de qualquer tipo; o diferencial, com o último completo.

## Como caiu na prova

- **PRF 2021** (2 itens): **Errado** o que definia ransomware como programa que se propaga inserindo cópias de si mesmo em arquivos criptografados (isso é do vírus). O item sobre o firewall de próxima geração (NGFW) reunir IDS, IPS e antivírus foi **anulado**.
- **INSS 2022** (2 itens): **Errado** o que chamava de phishing o malware que torna os dados inacessíveis por criptografia e cobra resgate (é ransomware). **Certo** o que dizia que o BitLocker, ferramenta de criptografia do Windows 10, permite proteger a privacidade dos dados.
