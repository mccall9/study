Hidrostática estuda os fluidos (líquidos e gases) em repouso. Três ideias resolvem quase tudo: a pressão aumenta com a profundidade (**Stevin**), um acréscimo de pressão se transmite a todo o fluido (**Pascal**) e todo corpo mergulhado recebe uma força para cima (**Arquimedes**). Na PRF, aparece em freios e macacos hidráulicos, pneus, mergulho e flutuação.

## O essencial

### Densidade e pressão
- **Densidade (massa específica)**: `ρ = m / V`. Água: 1.000 kg/m³ = 1 g/cm³.
- **Pressão**: `p = F / A`, em pascal (Pa = N/m²). A mesma força em área menor produz pressão maior (faca afiada, salto fino).
- **Pressão atmosférica** ao nível do mar: cerca de 1 atm ≈ 1,0 × 10⁵ Pa.

### Teorema de Stevin
- `p = p_atm + ρ · g · h` (pressão absoluta a uma profundidade h).
- Diferença entre dois pontos: `Δp = ρ · g · Δh`.
- Pontos na **mesma profundidade** de um mesmo líquido em repouso têm a **mesma pressão**, seja qual for o formato do recipiente.
- Na água, cada 10 m de profundidade somam cerca de 1 atm: `1.000 · 10 · 10 = 10⁵ Pa`.
- **Vasos comunicantes**: com um só líquido, o nível é o mesmo em todos os ramos. Com dois líquidos que não se misturam: `ρ₁ · h₁ = ρ₂ · h₂` (o menos denso fica mais alto).

### Princípio de Pascal
- Um acréscimo de pressão num ponto do líquido se transmite **integralmente** a todos os pontos.
- **Prensa ou elevador hidráulico**: `F₁ / A₁ = F₂ / A₂`. A força é multiplicada na razão das áreas.
- O trabalho não é multiplicado: `F₁ · d₁ = F₂ · d₂`. O êmbolo pequeno percorre distância maior.
- O **freio hidráulico** dos veículos funciona assim: o pedal pressiona o fluido, e a pressão chega às rodas.

### Princípio de Arquimedes
- **Empuxo**: `E = ρ_líquido · V_submerso · g`, vertical e para cima. É igual ao peso do líquido deslocado.
- Corpo **flutua** se sua densidade média é menor que a do líquido; **afunda** se é maior.
- Corpo flutuando: `E = P`, e a fração submersa é `ρ_corpo / ρ_líquido`.
- **Peso aparente** = `P − E`.

### Exemplos resolvidos (g = 10 m/s²)
1. **Elevador hidráulico**: êmbolos de 10 cm² e 500 cm². Força de 200 N no menor.
   - `F₂ = 200 · 500 / 10 = 10.000 N`: ergue um carro de 1.000 kg.
   - Se o êmbolo pequeno descer 50 cm, o grande sobe `50 · 10 / 500 = 1 cm`.
2. **Mergulhador** a 20 m de profundidade no mar (use ρ ≈ 1.000 kg/m³).
   - `p = 10⁵ + 1.000 · 10 · 20 = 10⁵ + 2 × 10⁵ = 3 × 10⁵ Pa` ≈ 3 atm.
3. **Empuxo**: objeto de 2 L (0,002 m³) totalmente submerso em água.
   - `E = 1.000 · 0,002 · 10 = 20 N`. Se o objeto pesa 50 N, o peso aparente é 30 N.
4. **Flutuação**: bloco de madeira com densidade 600 kg/m³ na água.
   - Fração submersa: `600 / 1.000 = 0,6` → 60% do volume fica abaixo da superfície.

## Pegadinhas do Cebraspe

- **Pressão depende da quantidade de líquido?** Não: depende da profundidade, da densidade do líquido e de g.
- **Elevador hidráulico multiplica energia?** Não; multiplica a força, e o deslocamento cai na mesma proporção.
- **Empuxo aumenta com a profundidade?** Para corpo totalmente submerso em líquido praticamente incompressível, não: depende só do volume submerso e da densidade do líquido.
- **Empuxo depende da densidade do corpo?** Não; depende da densidade do **líquido**. A densidade do corpo decide se ele afunda ou flutua.
- **Navio de aço flutua por quê?** A densidade **média** (aço mais o ar no casco) é menor que a da água.

## Como pode cair

*Itens de treino escritos para este resumo, não são de prova oficial.*

1. Em um elevador hidráulico, a força aplicada no êmbolo menor é ampliada no êmbolo maior na razão entre as áreas, e o mesmo ocorre com a energia transferida.
   **Errado**. A força é ampliada, mas o trabalho se conserva (o êmbolo maior se desloca menos).
2. No interior de um líquido em equilíbrio, a pressão em um ponto depende de sua profundidade, mas não do formato do recipiente.
   **Certo**. Pelo teorema de Stevin, `p = p_atm + ρ·g·h`.
3. Um corpo totalmente submerso na água recebe empuxo tanto maior quanto mais fundo estiver.
   **Errado**. Totalmente submerso, o volume deslocado não muda, e o empuxo é o mesmo em qualquer profundidade.
