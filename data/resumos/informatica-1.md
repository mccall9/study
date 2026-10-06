Internet é a rede mundial de computadores, pública, que interliga redes do mundo todo usando o conjunto de protocolos TCP/IP. Intranet é uma rede privada de uma organização que usa as mesmas tecnologias da Internet (protocolos, navegador, páginas web), mas com acesso restrito. O Cebraspe explora a diferença entre as duas, o papel dos protocolos e o que o cadeado do navegador realmente indica.

## O essencial

| | Internet | Intranet | Extranet |
|---|---|---|---|
| Acesso | público | só usuários autorizados da organização | parceiros externos autorizados (fornecedores, clientes) |
| Tecnologia | TCP/IP, HTTP/HTTPS, navegador | a mesma da Internet | a mesma da Internet |
| Exemplo | site gov.br | portal interno de servidores | área de fornecedores de uma empresa |

- A intranet pode ser acessada de fora da organização, por exemplo por **VPN** (rede privada virtual, que cria um "túnel" criptografado pela Internet).
- **Web (WWW)** não é sinônimo de Internet: é um dos serviços que funcionam sobre ela, assim como o e-mail e a transferência de arquivos.

### Protocolos que mais caem
- **TCP/IP**: conjunto de protocolos base da Internet. **IP** endereça e encaminha os pacotes; **TCP** garante a entrega ordenada e confiável; **UDP** é mais rápido, sem garantia de entrega (usado em vídeo e voz ao vivo).
- **HTTP**: transfere páginas web. **HTTPS**: HTTP com criptografia (TLS), usando certificado digital do site.
- **DNS**: traduz nomes (www.gov.br) em endereços IP.
- **DHCP**: distribui endereços IP automaticamente aos dispositivos da rede.
- **FTP**: transferência de arquivos.
- **SMTP**: envio de e-mail. **POP3** e **IMAP**: recebimento.
- **IPv4** usa endereços de 32 bits (ex.: 192.168.0.1); **IPv6**, de 128 bits, criado porque os endereços IPv4 se esgotaram.

### Endereço (URL)
Em https://www.gov.br/inss: **https** é o protocolo; **www.gov.br** é o domínio (o **.gov.br** indica órgão do governo brasileiro); **/inss** é o caminho dentro do site.

### O cadeado e o HTTPS
- Indicam que a **conexão** entre o navegador e o site é **criptografada** e que o site apresentou um certificado digital válido.
- **Não** indicam que a página é de intranet, nem que exige senha, nem que o conteúdo é confiável. Sites falsos de phishing também podem usar HTTPS.

Exemplo resolvido: um servidor acessa, de casa, o sistema interno do órgão por VPN. Ele está usando a intranet, por meio da Internet. Se o mesmo sistema abre com cadeado no navegador, isso só mostra que a conexão é criptografada.

## Pegadinhas do Cebraspe

- **"A intranet usa protocolos diferentes da Internet"**: errado. Usa os mesmos (TCP/IP, HTTP, HTTPS).
- **"A intranet só pode ser acessada dentro da empresa"**: errado. Pode haver acesso remoto autorizado, por VPN, por exemplo.
- **"O cadeado garante que o site é seguro e honesto"**: errado. Garante a criptografia da conexão, não a boa-fé de quem está do outro lado.
- **Internet = Web**: errado. A Web é um serviço da Internet.
- **Extranet = Internet pública**: errado. É a parte da rede interna aberta a parceiros específicos.

## Como caiu na prova

- **INSS 2022** (1 item): a partir de uma tela com aviso de cookies e barra de endereço com cadeado e "https://", o item afirmou que a página seria da intranet do INSS, acessível só com senha, como indicaria o cadeado. Gabarito: **Errado**. O cadeado e o HTTPS só indicam conexão criptografada com certificado digital; a maioria dos sites públicos da Internet usa HTTPS.
