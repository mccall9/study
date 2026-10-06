O princípio da conservação da energia diz que a energia não é criada nem destruída: ela muda de forma (cinética, potencial, térmica, sonora). Na mecânica, isso permite calcular velocidades e alturas sem conhecer a trajetória nem o tempo. Na PRF, aparece em quedas, rampas, montanhas-russas, molas e na comparação entre uma colisão e uma queda de certa altura.

## O essencial

### Energia mecânica
- `Em = Ec + Ep`, com `Ec = m·v²/2`, `Ep gravitacional = m·g·h` e `Ep elástica = k·x²/2`.
- **Sistema conservativo**: só realizam trabalho forças conservativas (peso, força elástica). Nesse caso, a energia mecânica se conserva:
  `Ec_inicial + Ep_inicial = Ec_final + Ep_final`.
- **Sistema dissipativo**: há atrito ou resistência do ar. A energia mecânica **diminui**:
  `Em_final = Em_inicial − energia dissipada`.
  A parte "perdida" vira calor e som; a energia **total** continua conservada.

### Resultados que mais caem
- Queda livre a partir do repouso, de altura h: `m·g·h = m·v²/2` → `v = √(2·g·h)`. A massa se cancela.
- Subida a partir da velocidade v: `h = v²/(2g)`.
- A velocidade final depende do **desnível**, não do formato da rampa (se não há atrito).
- Altura dobrada não dobra a velocidade: a velocidade fica multiplicada por √2 (≈ 1,41).

### Exemplos resolvidos (g = 10 m/s²)
1. **Queda livre** de 20 m, partindo do repouso.
   - `v = √(2 · 10 · 20) = √400 = 20 m/s` = 72 km/h.
   - Leitura inversa: bater num obstáculo rígido a 72 km/h equivale, em energia, a cair de 20 m de altura.
2. **Montanha-russa** sem atrito: o carrinho parte do repouso a 45 m. Velocidade a 25 m de altura:
   - `m·g·45 = m·g·25 + m·v²/2` → `v² = 2 · 10 · (45 − 25) = 400` → `v = 20 m/s`.
3. **Mola**: constante k = 800 N/m, comprimida 0,1 m, lança um bloco de 2 kg em piso liso.
   - `Ep = 800 · 0,1² / 2 = 4 J`.
   - `4 = 2 · v² / 2` → `v² = 4` → `v = 2 m/s`.
4. **Com atrito**: carro de 1.000 kg desce, a partir do repouso, uma ladeira com 20 m de desnível e chega embaixo a 10 m/s.
   - Energia inicial: `1.000 · 10 · 20 = 200.000 J`.
   - Energia final: `1.000 · 10² / 2 = 50.000 J`.
   - Energia dissipada (calor nos freios e pneus, resistência do ar): **150.000 J**.
5. **Lançamento vertical**: bola lançada para cima a 30 m/s.
   - `h = 30² / (2 · 10) = 900 / 20 = 45 m`. No ponto mais alto, toda a energia cinética virou potencial.

### Transformações em cada trecho
| Situação | O que acontece |
|---|---|
| Corpo caindo (sem ar) | Ep diminui, Ec aumenta, Em constante |
| Corpo subindo (sem ar) | Ec diminui, Ep aumenta, Em constante |
| Frenagem em pista plana | Ec vira calor; Em diminui |
| Mola soltando um bloco | Ep elástica vira Ec |

## Pegadinhas do Cebraspe

- **Corpo mais pesado chega mais rápido?** Sem resistência do ar, não: a velocidade final depende só de g e h.
- **"Com atrito, a energia mecânica se conserva"**: errado. Conserva-se a energia total; a mecânica diminui.
- **Dobrar a altura dobra a velocidade?** Não: multiplica por √2. Para dobrar a velocidade, é preciso quadruplicar a altura.
- **Trajetória importa?** Sem atrito, não: rampa reta, curva ou queda vertical dão a mesma velocidade final para o mesmo desnível.
- **Altura máxima com energia cinética zero**: vale no lançamento vertical. No lançamento oblíquo, a componente horizontal da velocidade continua, e a energia cinética no topo não é nula.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. Desprezada a resistência do ar, dois corpos de massas diferentes, soltos do repouso da mesma altura, chegam ao solo com a mesma velocidade.
   **Certo**. `v = √(2·g·h)` não depende da massa.
2. Em um sistema com atrito, a energia mecânica se conserva, pois a energia não pode ser criada nem destruída.
   **Errado**. A energia total se conserva, mas parte da mecânica é convertida em calor, e a mecânica diminui.
3. Se a altura de queda livre de um corpo for dobrada, a velocidade com que ele atinge o solo também dobrará.
   **Errado**. Como `v = √(2·g·h)`, a velocidade é multiplicada por √2.

Veja também [Trabalho, energia e potência](/topico/fisica-4).
