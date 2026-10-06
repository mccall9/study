// Metadados das leis importadas em data/leis (por scripts/importar-lei.py).
// Fica separado do texto para poder ir ao navegador sem carregar as leis inteiras.

export type LeiMeta = { id: string; curto: string; nome: string; grupo: string };

export const GRUPOS = [
  "Constituição",
  "Administração pública e servidores",
  "Ética no serviço público",
  "Previdência e assistência social",
  "Trânsito",
  "Penal e processo penal",
  "Legislação penal especial",
  "Direitos humanos",
] as const;

export const LEIS_META: LeiMeta[] = [
  { id: "cf", curto: "CF/88", nome: "Constituição Federal de 1988", grupo: "Constituição" },
  { id: "emc103", curto: "EC 103/2019", nome: "Emenda Constitucional nº 103/2019 (Reforma da Previdência)", grupo: "Constituição" },
  { id: "l8112", curto: "Lei 8.112/1990", nome: "Regime Jurídico dos Servidores Públicos Federais", grupo: "Administração pública e servidores" },
  { id: "l9784", curto: "Lei 9.784/1999", nome: "Processo administrativo federal", grupo: "Administração pública e servidores" },
  { id: "l8429", curto: "Lei 8.429/1992", nome: "Improbidade administrativa", grupo: "Administração pública e servidores" },
  { id: "l14133", curto: "Lei 14.133/2021", nome: "Licitações e contratos administrativos", grupo: "Administração pública e servidores" },
  { id: "l12527", curto: "LAI", nome: "Lei de Acesso à Informação (Lei nº 12.527/2011)", grupo: "Administração pública e servidores" },
  { id: "l9654", curto: "Lei 9.654/1998", nome: "Carreira de Policial Rodoviário Federal", grupo: "Administração pública e servidores" },
  { id: "d1171", curto: "Decreto 1.171/1994", nome: "Código de Ética Profissional do Servidor Público Civil Federal", grupo: "Ética no serviço público" },
  { id: "d6029", curto: "Decreto 6.029/2007", nome: "Sistema de Gestão da Ética do Poder Executivo Federal", grupo: "Ética no serviço público" },
  { id: "d9203", curto: "Decreto 9.203/2017", nome: "Política de governança da administração pública federal", grupo: "Ética no serviço público" },
  { id: "l12813", curto: "Lei 12.813/2013", nome: "Conflito de interesses no Poder Executivo federal", grupo: "Ética no serviço público" },
  { id: "l8212", curto: "Lei 8.212/1991", nome: "Organização e Custeio da Seguridade Social", grupo: "Previdência e assistência social" },
  { id: "l8213", curto: "Lei 8.213/1991", nome: "Planos de Benefícios da Previdência Social", grupo: "Previdência e assistência social" },
  { id: "d3048", curto: "Decreto 3.048/1999", nome: "Regulamento da Previdência Social", grupo: "Previdência e assistência social" },
  { id: "l8742", curto: "LOAS", nome: "Lei Orgânica da Assistência Social (Lei nº 8.742/1993)", grupo: "Previdência e assistência social" },
  { id: "lcp142", curto: "LC 142/2013", nome: "Aposentadoria da pessoa com deficiência", grupo: "Previdência e assistência social" },
  { id: "l10779", curto: "Lei 10.779/2003", nome: "Seguro-desemprego do pescador artesanal (seguro-defeso)", grupo: "Previdência e assistência social" },
  { id: "ctb", curto: "CTB", nome: "Código de Trânsito Brasileiro (Lei nº 9.503/1997)", grupo: "Trânsito" },
  { id: "cp", curto: "Código Penal", nome: "Código Penal (Decreto-Lei nº 2.848/1940)", grupo: "Penal e processo penal" },
  { id: "cpp", curto: "CPP", nome: "Código de Processo Penal (Decreto-Lei nº 3.689/1941)", grupo: "Penal e processo penal" },
  { id: "l11343", curto: "Lei de Drogas", nome: "Lei de Drogas (Lei nº 11.343/2006)", grupo: "Legislação penal especial" },
  { id: "l10826", curto: "Estatuto do Desarmamento", nome: "Estatuto do Desarmamento (Lei nº 10.826/2003)", grupo: "Legislação penal especial" },
  { id: "l13869", curto: "Abuso de Autoridade", nome: "Lei de Abuso de Autoridade (Lei nº 13.869/2019)", grupo: "Legislação penal especial" },
  { id: "l8072", curto: "Crimes Hediondos", nome: "Lei dos Crimes Hediondos (Lei nº 8.072/1990)", grupo: "Legislação penal especial" },
  { id: "l11340", curto: "Maria da Penha", nome: "Lei Maria da Penha (Lei nº 11.340/2006)", grupo: "Legislação penal especial" },
  { id: "l8069", curto: "ECA", nome: "Estatuto da Criança e do Adolescente (Lei nº 8.069/1990)", grupo: "Legislação penal especial" },
  { id: "l9605", curto: "Crimes Ambientais", nome: "Lei de Crimes Ambientais (Lei nº 9.605/1998)", grupo: "Legislação penal especial" },
  { id: "l12850", curto: "Organizações Criminosas", nome: "Lei das Organizações Criminosas (Lei nº 12.850/2013)", grupo: "Legislação penal especial" },
  { id: "l9613", curto: "Lavagem de Dinheiro", nome: "Lei de Lavagem de Dinheiro (Lei nº 9.613/1998)", grupo: "Legislação penal especial" },
  { id: "l9455", curto: "Lei de Tortura", nome: "Lei de Tortura (Lei nº 9.455/1997)", grupo: "Legislação penal especial" },
  { id: "l7716", curto: "Lei do Racismo", nome: "Crimes de preconceito de raça ou cor (Lei nº 7.716/1989)", grupo: "Legislação penal especial" },
  { id: "l9099", curto: "Juizados Especiais", nome: "Juizados Especiais Cíveis e Criminais (Lei nº 9.099/1995)", grupo: "Legislação penal especial" },
  { id: "l12037", curto: "Identificação Criminal", nome: "Identificação criminal do civilmente identificado (Lei nº 12.037/2009)", grupo: "Legislação penal especial" },
  { id: "d678", curto: "Pacto de San José", nome: "Convenção Americana sobre Direitos Humanos (Decreto nº 678/1992)", grupo: "Direitos humanos" },
];

export function getLeiMeta(id: string): LeiMeta | undefined {
  return LEIS_META.find((l) => l.id === id);
}
