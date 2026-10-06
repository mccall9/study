Computação em nuvem (cloud computing) é o uso, pela Internet e sob demanda, de recursos computacionais de um provedor: servidores, armazenamento, plataformas de desenvolvimento e programas prontos, com pagamento conforme o uso. O Cebraspe cobra principalmente os modelos de serviço (IaaS, PaaS e SaaS), os modelos de implantação e as características da nuvem.

## O essencial

### Características (definição clássica do NIST)
- **Autoatendimento sob demanda**: o cliente contrata e ajusta recursos sozinho, sem falar com o provedor.
- **Amplo acesso pela rede**: acesso de qualquer lugar, por computador, celular ou tablet.
- **Pool de recursos**: o provedor atende vários clientes com a mesma infraestrutura.
- **Elasticidade rápida**: os recursos aumentam ou diminuem conforme a necessidade.
- **Serviço medido**: o uso é monitorado e cobrado como uma conta de luz.

### Modelos de serviço
| Modelo | O que o provedor entrega | O que o cliente faz | Exemplos |
|---|---|---|---|
| **IaaS** (Infraestrutura como Serviço) | máquinas virtuais, armazenamento, rede | instala e gerencia o sistema operacional e os programas | servidores virtuais na AWS ou no Azure |
| **PaaS** (Plataforma como Serviço) | ambiente pronto para desenvolver e implantar aplicações | cria e publica seus próprios aplicativos | Google App Engine, Heroku |
| **SaaS** (Software como Serviço) | o programa pronto, acessado pela Internet | apenas usa | Gmail, Microsoft 365, Google Docs |

Regra prática: quanto mais se sobe de IaaS para SaaS, menos o cliente administra e mais o provedor assume.

### Modelos de implantação
- **Pública**: recursos de um provedor, compartilhados por vários clientes (Google, Microsoft, Amazon).
- **Privada**: exclusiva de uma organização, podendo ficar no próprio prédio ou em um provedor.
- **Comunitária**: compartilhada por organizações com interesses comuns (órgãos de governo, por exemplo).
- **Híbrida**: combina duas ou mais, com troca de dados entre elas.

### Armazenamento em nuvem
- Serviços como OneDrive, Google Drive, Dropbox e iCloud guardam arquivos em servidores remotos, sincronizam entre dispositivos e permitem compartilhar com outras pessoas.
- **Sincronização não é backup**: se o arquivo é apagado ou corrompido num dispositivo, a mudança é replicada nos demais. Alguns serviços mantêm lixeira e histórico de versões por um período, o que ajuda, mas não substitui uma cópia de segurança.

### Vantagens e cuidados
- Vantagens: não exige comprar servidores, cresce conforme a demanda, acesso de qualquer lugar, atualização feita pelo provedor.
- Cuidados: depende de conexão com a Internet, envolve confiar dados a terceiros e pode gerar dependência do fornecedor.

Exemplo resolvido: um órgão quer um sistema próprio de agendamento, sem se preocupar com servidores e sistema operacional. Contrata **PaaS** e só programa a aplicação. Se quisesse apenas usar um e-mail pronto, seria **SaaS**; se quisesse máquinas virtuais para instalar tudo, **IaaS**.

## Pegadinhas do Cebraspe

- **SaaS x PaaS**: ambiente para os usuários construírem e publicarem aplicativos é PaaS. SaaS é o software pronto para uso.
- **IaaS entrega software pronto?** Não. Entrega infraestrutura; o cliente instala o resto.
- **"Nuvem privada não é nuvem"**: errado. É nuvem dedicada a uma organização.
- **"A nuvem funciona sem Internet"**: o acesso depende de rede. Alguns serviços permitem trabalhar off-line e sincronizar depois, mas isso é recurso do aplicativo.
- **Elasticidade** é aumentar **e** reduzir recursos, não só aumentar.

## Como caiu na prova

- **PRF 2021** (1 item): afirmou que se identifica Software como Serviço (SaaS) quando o provedor oferece um ambiente em nuvem no qual os usuários podem construir e disponibilizar aplicativos. Gabarito: **Errado**. Essa é a definição de Plataforma como Serviço (PaaS); no SaaS, o usuário apenas usa um programa pronto.
