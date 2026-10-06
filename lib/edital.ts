// Conteúdo programático baseado nos últimos editais (PRF 2021 e INSS 2022, ambos Cebraspe).
// Quando os editais novos saírem, revise este arquivo. Os ids dos tópicos ficam salvos no
// banco junto com o progresso, então não reutilize um id para um assunto diferente:
// para remover um tópico, apague a linha; para incluir, use um número novo.

export type Concurso = "PRF" | "INSS";

export const CONCURSOS: Concurso[] = ["PRF", "INSS"];

export type Topico = { id: string; titulo: string };

export type Materia = {
  slug: string;
  nome: string;
  concursos: Concurso[];
  topicos: Topico[];
};

function materia(
  slug: string,
  nome: string,
  concursos: Concurso[],
  titulos: string[],
): Materia {
  return {
    slug,
    nome,
    concursos,
    topicos: titulos.map((titulo, i) => ({ id: `${slug}-${i + 1}`, titulo })),
  };
}

export const MATERIAS: Materia[] = [
  materia("portugues", "Língua Portuguesa", ["PRF", "INSS"], [
    "Compreensão e interpretação de textos",
    "Tipologia e gêneros textuais",
    "Ortografia oficial",
    "Mecanismos de coesão textual",
    "Emprego de tempos e modos verbais",
    "Classes de palavras",
    "Relações de coordenação e subordinação",
    "Emprego dos sinais de pontuação",
    "Concordância verbal e nominal",
    "Regência verbal e nominal",
    "Emprego do sinal indicativo de crase",
    "Colocação pronominal",
    "Reescrita de frases e parágrafos",
    "Significação das palavras",
    "Redação oficial (Manual de Redação da Presidência)",
  ]),
  materia("raciocinio-logico", "Raciocínio Lógico-Matemático", ["PRF", "INSS"], [
    "Proposições, conectivos e tabelas-verdade",
    "Equivalências e negações lógicas",
    "Argumentação e lógica de primeira ordem",
    "Diagramas lógicos (conjuntos)",
    "Princípios de contagem e análise combinatória",
    "Probabilidade",
    "Razões, proporções, porcentagem e juros",
    "Sequências, progressões aritméticas e geométricas",
    "Estatística básica",
    "Problemas aritméticos, geométricos e matriciais",
  ]),
  materia("informatica", "Informática", ["PRF", "INSS"], [
    "Conceitos de Internet e intranet",
    "Navegadores e correio eletrônico",
    "Busca e pesquisa na web",
    "Redes de computadores",
    "Sistemas operacionais (Windows e Linux)",
    "Pacote Office / LibreOffice (texto, planilhas, apresentações)",
    "Organização de arquivos, pastas e programas",
    "Segurança da informação, vírus, malware e backup",
    "Computação em nuvem",
    "Noções de banco de dados, big data e inteligência artificial",
  ]),
  materia("direito-constitucional", "Direito Constitucional", ["PRF", "INSS"], [
    "Princípios fundamentais (arts. 1º a 4º)",
    "Direitos e deveres individuais e coletivos (art. 5º)",
    "Remédios constitucionais",
    "Direitos sociais",
    "Nacionalidade",
    "Direitos políticos",
    "Organização político-administrativa do Estado",
    "Administração pública (arts. 37 a 41)",
    "Poder Executivo",
    "Poder Legislativo e processo legislativo",
    "Poder Judiciário e funções essenciais à Justiça",
    "Defesa do Estado e segurança pública (art. 144)",
    "Ordem social: seguridade social (arts. 194 a 204)",
  ]),
  materia("direito-administrativo", "Direito Administrativo", ["PRF", "INSS"], [
    "Estado, governo e administração pública",
    "Princípios da administração pública",
    "Organização administrativa (direta e indireta)",
    "Agentes públicos",
    "Poderes administrativos",
    "Atos administrativos",
    "Licitações e contratos (Lei 14.133/2021)",
    "Controle da administração pública",
    "Responsabilidade civil do Estado",
    "Improbidade administrativa (Lei 8.429/1992)",
    "Processo administrativo (Lei 9.784/1999)",
    "Serviços públicos",
  ]),
  materia("etica", "Ética no Serviço Público", ["PRF", "INSS"], [
    "Ética e moral",
    "Ética, princípios e valores",
    "Ética e democracia: exercício da cidadania",
    "Ética e função pública",
    "Código de Ética do Servidor (Decreto 1.171/1994)",
    "Conflito de interesses (Lei 12.813/2013)",
  ]),
  materia("lei-8112", "Regime Jurídico (Lei 8.112/1990)", ["INSS"], [
    "Provimento, vacância, remoção, redistribuição e substituição",
    "Direitos e vantagens: vencimento e remuneração",
    "Indenizações, gratificações e adicionais",
    "Férias, licenças e afastamentos",
    "Concessões, tempo de serviço e direito de petição",
    "Regime disciplinar: deveres e proibições",
    "Acumulação de cargos e responsabilidades",
    "Penalidades",
    "Processo administrativo disciplinar",
  ]),
  materia("seguridade-social", "Seguridade Social (Direito Previdenciário)", ["INSS"], [
    "Seguridade social: conceito, organização e princípios",
    "Custeio da seguridade social",
    "Regime Geral de Previdência Social",
    "Segurados obrigatórios e facultativos",
    "Filiação e inscrição",
    "Dependentes",
    "Salário de contribuição",
    "Carência",
    "Salário de benefício e renda mensal",
    "Aposentadorias",
    "Auxílio por incapacidade temporária e auxílio-acidente",
    "Salário-maternidade e salário-família",
    "Pensão por morte e auxílio-reclusão",
    "Reconhecimento da filiação e manutenção da qualidade de segurado",
    "Decadência e prescrição",
    "Lei 8.212/1991, Lei 8.213/1991 e Decreto 3.048/1999",
    "Lei Orgânica da Assistência Social (Lei 8.742/1993) e BPC",
  ]),
  materia("legislacao-transito", "Legislação de Trânsito", ["PRF"], [
    "Código de Trânsito Brasileiro (Lei 9.503/1997): disposições gerais",
    "Sistema Nacional de Trânsito",
    "Normas gerais de circulação e conduta",
    "Pedestres e condutores de veículos não motorizados",
    "Sinalização de trânsito",
    "Veículos: classificação, segurança, identificação e registro",
    "Condução de escolares e transporte de cargas",
    "Habilitação",
    "Infrações de trânsito",
    "Penalidades e medidas administrativas",
    "Processo administrativo de trânsito",
    "Crimes de trânsito",
    "Resoluções do CONTRAN",
  ]),
  materia("fisica", "Física", ["PRF"], [
    "Cinemática escalar e vetorial",
    "Movimento circular",
    "Leis de Newton e aplicações",
    "Trabalho, energia e potência",
    "Conservação da energia",
    "Quantidade de movimento, impulso e colisões",
    "Estática",
    "Hidrostática",
    "Ondas, som e efeito Doppler",
  ]),
  materia("direito-penal", "Direito Penal", ["PRF"], [
    "Princípios do direito penal",
    "Aplicação da lei penal",
    "Fato típico e seus elementos",
    "Ilicitude e excludentes",
    "Culpabilidade",
    "Concurso de pessoas",
    "Crimes contra a pessoa",
    "Crimes contra o patrimônio",
    "Crimes contra a fé pública",
    "Crimes contra a administração pública",
  ]),
  materia("processo-penal", "Direito Processual Penal", ["PRF"], [
    "Inquérito policial",
    "Ação penal",
    "Prova",
    "Prisão em flagrante",
    "Prisão preventiva e temporária",
    "Medidas cautelares diversas da prisão",
    "Liberdade provisória",
    "Juiz das garantias e acordo de não persecução penal",
  ]),
  materia("legislacao-especial", "Legislação Especial", ["PRF"], [
    "Lei de Drogas (Lei 11.343/2006)",
    "Estatuto do Desarmamento (Lei 10.826/2003)",
    "Abuso de autoridade (Lei 13.869/2019)",
    "Crimes hediondos (Lei 8.072/1990)",
    "Lei Maria da Penha (Lei 11.340/2006)",
    "Estatuto da Criança e do Adolescente",
    "Crimes ambientais (Lei 9.605/1998)",
    "Organizações criminosas (Lei 12.850/2013)",
    "Lavagem de dinheiro (Lei 9.613/1998)",
    "Tortura (Lei 9.455/1997) e racismo (Lei 7.716/1989)",
    "Juizados especiais criminais (Lei 9.099/1995)",
  ]),
  materia("direitos-humanos", "Direitos Humanos", ["PRF"], [
    "Teoria geral dos direitos humanos",
    "Declaração Universal dos Direitos Humanos",
    "Pacto de San José da Costa Rica",
    "Direitos humanos na Constituição Federal",
    "Sistema interamericano de direitos humanos",
  ]),
  materia("geopolitica-historia", "Geopolítica e História da PRF", ["PRF"], [
    "O Brasil político: nação e território",
    "Divisão inter-regional do trabalho e da produção",
    "Estrutura urbana e regiões metropolitanas",
    "Fronteiras e faixa de fronteira",
    "Transportes e logística no Brasil",
    "Meio ambiente e desenvolvimento sustentável",
    "História da Polícia Rodoviária Federal",
  ]),
  materia("lingua-estrangeira", "Língua Estrangeira (Inglês ou Espanhol)", ["PRF"], [
    "Compreensão de textos",
    "Itens gramaticais relevantes para a compreensão",
    "Vocabulário e falsos cognatos",
  ]),
];

export function getMateria(slug: string): Materia | undefined {
  return MATERIAS.find((m) => m.slug === slug);
}

export function materiasDoConcurso(concurso: Concurso | null): Materia[] {
  if (!concurso) return MATERIAS;
  return MATERIAS.filter((m) => m.concursos.includes(concurso));
}

export function parseConcurso(value: string | undefined | null): Concurso | null {
  return value === "PRF" || value === "INSS" ? value : null;
}
