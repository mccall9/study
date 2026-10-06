Rede de computadores é um conjunto de dispositivos interligados para trocar dados e compartilhar recursos (internet, arquivos, impressoras). O Cebraspe cobra a classificação das redes, a função de cada equipamento, os protocolos do modelo TCP/IP e diferenças como hub x switch, TCP x UDP e IPv4 x IPv6.

## O essencial

### Classificação por alcance
| Sigla | Alcance | Exemplo |
|---|---|---|
| PAN | pessoal, poucos metros | fone Bluetooth ligado ao celular |
| LAN | local (casa, escritório, prédio) | rede interna de um posto da PRF |
| MAN | metropolitana (cidade) | rede que liga órgãos de uma cidade |
| WAN | longa distância (países, continentes) | a internet |

Uma LAN sem fio é chamada **WLAN** (o Wi-Fi, padrão IEEE 802.11).

### Topologias
- **Estrela**: todos ligados a um equipamento central (switch). A mais comum hoje; se um cabo falha, só aquele computador sai da rede.
- **Barramento**: todos no mesmo cabo; uma falha no cabo principal derruba a rede.
- **Anel**: cada nó ligado ao seguinte, formando um círculo.
- **Malha**: vários caminhos entre os nós; mais tolerante a falhas.

### Equipamentos
| Equipamento | Função |
|---|---|
| Placa de rede | conecta o computador à rede; tem um endereço físico, o **MAC** |
| Hub | repete o sinal para **todas** as portas (obsoleto) |
| Switch | envia os dados apenas para a porta do destinatário, usando o endereço MAC |
| Roteador | interliga **redes diferentes** e escolhe caminhos usando o endereço **IP** |
| Ponto de acesso (access point) | conecta dispositivos sem fio à rede cabeada |
| Modem | converte o sinal digital do computador para o meio de transmissão da operadora e vice-versa |

### Meios de transmissão
- **Par trançado**: cabo de rede comum, com conector RJ-45.
- **Fibra óptica**: transmite luz; alcança grandes distâncias, tem alta velocidade e é imune a interferência eletromagnética.
- **Sem fio**: Wi-Fi, Bluetooth, redes móveis (4G, 5G).

### Modelo TCP/IP (camadas)
| Camada | Protocolos e funções |
|---|---|
| Aplicação | HTTP/HTTPS (páginas web), SMTP (envio de e-mail), POP3 e IMAP (recebimento de e-mail), DNS (nomes), FTP (arquivos), DHCP (IP automático) |
| Transporte | **TCP**: com conexão, confiável, garante entrega e ordem. **UDP**: sem conexão, mais rápido, sem garantia de entrega (voz, vídeo ao vivo) |
| Internet (rede) | **IP**: endereçamento e roteamento |
| Acesso à rede (enlace e física) | Ethernet, Wi-Fi |

O **modelo OSI** tem 7 camadas: física, enlace, rede, transporte, sessão, apresentação e aplicação.

### Endereçamento
- **IPv4**: 32 bits, escrito em 4 números de 0 a 255 (ex.: 192.168.0.10).
- **IPv6**: 128 bits, escrito em hexadecimal; resolve a falta de endereços IPv4.
- Faixas **privadas** (uso interno, não roteadas na internet): 10.x.x.x, 172.16.x.x a 172.31.x.x e 192.168.x.x.
- **DHCP** distribui IPs automaticamente; **DNS** traduz nomes (www.gov.br) em endereços IP; **NAT** permite que vários dispositivos de uma rede privada saiam para a internet com um IP público.
- Portas conhecidas: HTTP 80, HTTPS 443, DNS 53, SSH 22.

### Exemplo resolvido
Ao digitar um endereço no navegador: (1) o DNS converte o nome em IP; (2) o navegador abre uma conexão TCP com o servidor (porta 443 se for HTTPS); (3) o roteador de casa encaminha os pacotes para a rede da operadora; (4) a página volta pelo mesmo processo.

## Pegadinhas do Cebraspe

- **Hub x switch**: o hub repassa para todas as portas; o switch, só para o destino.
- **Switch x roteador**: switch organiza a rede local; roteador liga redes distintas (a sua e a da operadora).
- **UDP confiável?** Não. Quem garante entrega e ordem é o TCP.
- **Tamanho do IPv6**: 128 bits (quatro vezes os 32 bits do IPv4), não 64.
- **MAC x IP**: MAC é o endereço físico da placa; IP é o endereço lógico na rede e pode mudar.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. O switch encaminha os dados apenas para a porta em que está o destinatário, ao passo que o hub repete os dados para todas as portas.
   **Certo**. O switch usa a tabela de endereços MAC para direcionar o tráfego.
2. O protocolo UDP garante a entrega e a ordem dos pacotes, razão pela qual é usado em transmissões de voz em tempo real.
   **Errado**. Quem garante entrega e ordem é o TCP; o UDP é usado em voz por ser mais rápido, sem essas garantias.
3. O endereço IPv6 possui 64 bits, o dobro do tamanho do endereço IPv4.
   **Errado**. O IPv6 tem 128 bits, quatro vezes os 32 bits do IPv4.

Veja também [Conceitos de Internet e intranet](/topico/informatica-1).
