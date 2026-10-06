// Ligação entre os tópicos do edital (lib/edital.ts) e os trechos da lei seca (data/leis).
// Intervalos "37:41" incluem os artigos com letra (41-A...). "*" = lei inteira.
// O teste lib/materiais.test.ts garante que toda referência aponta para lei e artigo que existem.

import type { Referencia } from "./leis-logica";

export const REFERENCIAS: Record<string, Referencia[]> = {
  // Direito Constitucional
  "direito-constitucional-1": [{ lei: "cf", artigos: ["1:4"] }],
  "direito-constitucional-2": [{ lei: "cf", artigos: ["5"] }],
  "direito-constitucional-3": [
    {
      lei: "cf",
      artigos: ["5"],
      dispositivos: ["art5-lxviii", "art5-lxix", "art5-lxx", "art5-lxxi", "art5-lxxii", "art5-lxxiii"],
      nota: "Habeas corpus, mandado de segurança, mandado de injunção, habeas data e ação popular",
    },
  ],
  "direito-constitucional-4": [{ lei: "cf", artigos: ["6:11"] }],
  "direito-constitucional-5": [{ lei: "cf", artigos: ["12:13"] }],
  "direito-constitucional-6": [{ lei: "cf", artigos: ["14:16"] }],
  "direito-constitucional-7": [{ lei: "cf", artigos: ["18:36"] }],
  "direito-constitucional-8": [{ lei: "cf", artigos: ["37:41"] }],
  "direito-constitucional-9": [{ lei: "cf", artigos: ["76:91"] }],
  "direito-constitucional-10": [{ lei: "cf", artigos: ["44:75"] }],
  "direito-constitucional-11": [{ lei: "cf", artigos: ["92:135"] }],
  "direito-constitucional-12": [{ lei: "cf", artigos: ["136:144"] }],
  "direito-constitucional-13": [{ lei: "cf", artigos: ["194:204"] }],

  // Direito Administrativo
  "direito-administrativo-2": [{ lei: "cf", artigos: ["37"] }, { lei: "l9784", artigos: ["2"] }],
  "direito-administrativo-3": [{ lei: "cf", artigos: ["37"], dispositivos: ["art37-xix", "art37-xx"], nota: "Criação de entidades da administração indireta" }],
  "direito-administrativo-4": [{ lei: "cf", artigos: ["37:41"] }, { lei: "l8112", artigos: ["*"] }],
  "direito-administrativo-6": [{ lei: "l9784", artigos: ["50:55"], nota: "Motivação, anulação, revogação e convalidação" }],
  "direito-administrativo-7": [{ lei: "l14133", artigos: ["*"] }],
  "direito-administrativo-8": [{ lei: "cf", artigos: ["70:75"] }],
  "direito-administrativo-9": [{ lei: "cf", artigos: ["37"], dispositivos: ["art37-p6"], nota: "Responsabilidade objetiva do Estado" }],
  "direito-administrativo-10": [{ lei: "l8429", artigos: ["*"] }],
  "direito-administrativo-11": [{ lei: "l9784", artigos: ["*"] }],
  "direito-administrativo-12": [{ lei: "cf", artigos: ["175"] }],

  // Ética
  "etica-4": [{ lei: "d9203", artigos: ["*"] }, { lei: "d6029", artigos: ["*"] }, { lei: "l12527", artigos: ["*"] }],
  "etica-5": [{ lei: "d1171", artigos: ["*"] }],
  "etica-6": [{ lei: "l12813", artigos: ["*"] }],

  // Lei 8.112/1990
  "lei-8112-1": [{ lei: "l8112", artigos: ["5:39"] }],
  "lei-8112-2": [{ lei: "l8112", artigos: ["40:48"] }],
  "lei-8112-3": [{ lei: "l8112", artigos: ["49:76"] }],
  "lei-8112-4": [{ lei: "l8112", artigos: ["77:96"] }],
  "lei-8112-5": [{ lei: "l8112", artigos: ["97:115"] }],
  "lei-8112-6": [{ lei: "l8112", artigos: ["116:117"] }],
  "lei-8112-7": [{ lei: "l8112", artigos: ["118:126"] }],
  "lei-8112-8": [{ lei: "l8112", artigos: ["127:142"] }],
  "lei-8112-9": [{ lei: "l8112", artigos: ["143:182"] }],

  // Seguridade social
  "seguridade-social-1": [{ lei: "cf", artigos: ["194:204"] }, { lei: "l8212", artigos: ["1:5"] }],
  "seguridade-social-2": [{ lei: "cf", artigos: ["195"] }, { lei: "l8212", artigos: ["10:33"] }],
  "seguridade-social-3": [{ lei: "l8213", artigos: ["1:10"] }],
  "seguridade-social-4": [{ lei: "l8213", artigos: ["11:15"] }, { lei: "d3048", artigos: ["9:13"] }],
  "seguridade-social-5": [{ lei: "l8213", artigos: ["17"] }, { lei: "d3048", artigos: ["18:20"] }],
  "seguridade-social-6": [{ lei: "l8213", artigos: ["16"] }],
  "seguridade-social-7": [{ lei: "l8212", artigos: ["28"] }],
  "seguridade-social-8": [{ lei: "l8213", artigos: ["24:27"] }],
  "seguridade-social-9": [{ lei: "l8213", artigos: ["28:40"] }],
  "seguridade-social-10": [{ lei: "l8213", artigos: ["42:58"] }, { lei: "lcp142", artigos: ["*"] }, { lei: "emc103", artigos: ["19:26"] }],
  "seguridade-social-11": [{ lei: "l8213", artigos: ["59:63", "86", "89:93"] }],
  "seguridade-social-12": [{ lei: "l8213", artigos: ["65:73"] }],
  "seguridade-social-13": [{ lei: "l8213", artigos: ["74:80"] }],
  "seguridade-social-14": [{ lei: "l8213", artigos: ["15", "29-A"] }],
  "seguridade-social-15": [{ lei: "l8213", artigos: ["103:103-A"] }],
  "seguridade-social-16": [
    { lei: "l8212", artigos: ["*"] },
    { lei: "l8213", artigos: ["*"] },
    { lei: "d3048", artigos: ["*"] },
    { lei: "l10779", artigos: ["*"], nota: "Seguro-defeso do pescador artesanal" },
  ],
  "seguridade-social-17": [{ lei: "l8742", artigos: ["*"] }],

  // Legislação de trânsito (CTB)
  "legislacao-transito-1": [{ lei: "ctb", artigos: ["1:4"] }],
  "legislacao-transito-2": [{ lei: "ctb", artigos: ["5:25"] }],
  "legislacao-transito-3": [{ lei: "ctb", artigos: ["26:67"] }],
  "legislacao-transito-4": [{ lei: "ctb", artigos: ["68:71"] }],
  "legislacao-transito-5": [{ lei: "ctb", artigos: ["80:90"] }],
  "legislacao-transito-6": [{ lei: "ctb", artigos: ["96:135"] }],
  "legislacao-transito-7": [{ lei: "ctb", artigos: ["136:139"] }],
  "legislacao-transito-8": [{ lei: "ctb", artigos: ["140:160"] }],
  "legislacao-transito-9": [{ lei: "ctb", artigos: ["161:255"] }],
  "legislacao-transito-10": [{ lei: "ctb", artigos: ["256:279"] }],
  "legislacao-transito-11": [{ lei: "ctb", artigos: ["280:290"] }],
  "legislacao-transito-12": [{ lei: "ctb", artigos: ["291:312"] }],

  // Direito Penal
  "direito-penal-1": [
    { lei: "cf", artigos: ["5"], dispositivos: ["art5-xxxix", "art5-xl", "art5-xlv", "art5-xlvi"], nota: "Legalidade, anterioridade, retroatividade benéfica e pessoalidade da pena" },
    { lei: "cp", artigos: ["1"] },
  ],
  "direito-penal-2": [{ lei: "cp", artigos: ["1:12"] }],
  "direito-penal-3": [{ lei: "cp", artigos: ["13:21"] }],
  "direito-penal-4": [{ lei: "cp", artigos: ["23:25"] }],
  "direito-penal-5": [{ lei: "cp", artigos: ["26:28"] }],
  "direito-penal-6": [{ lei: "cp", artigos: ["29:31"] }],
  "direito-penal-7": [{ lei: "cp", artigos: ["121:154"] }],
  "direito-penal-8": [{ lei: "cp", artigos: ["155:183"] }],
  "direito-penal-9": [{ lei: "cp", artigos: ["289:311"] }],
  "direito-penal-10": [{ lei: "cp", artigos: ["312:359"] }],

  // Processo Penal
  "processo-penal-1": [{ lei: "cpp", artigos: ["4:23"] }, { lei: "l12037", artigos: ["*"], nota: "Identificação criminal" }],
  "processo-penal-2": [{ lei: "cpp", artigos: ["24:62"] }],
  "processo-penal-3": [{ lei: "cpp", artigos: ["155:250"] }],
  "processo-penal-4": [{ lei: "cpp", artigos: ["301:310"] }],
  "processo-penal-5": [{ lei: "cpp", artigos: ["311:316"] }],
  "processo-penal-6": [{ lei: "cpp", artigos: ["319:320"] }],
  "processo-penal-7": [{ lei: "cpp", artigos: ["321:350"] }],
  "processo-penal-8": [{ lei: "cpp", artigos: ["3-A", "3-B", "3-C", "3-D", "3-E", "3-F", "28-A"] }],

  // Legislação penal especial
  "legislacao-especial-1": [{ lei: "l11343", artigos: ["*"] }],
  "legislacao-especial-2": [{ lei: "l10826", artigos: ["*"] }],
  "legislacao-especial-3": [{ lei: "l13869", artigos: ["*"] }],
  "legislacao-especial-4": [{ lei: "l8072", artigos: ["*"] }],
  "legislacao-especial-5": [{ lei: "l11340", artigos: ["*"] }],
  "legislacao-especial-6": [{ lei: "l8069", artigos: ["*"] }],
  "legislacao-especial-7": [{ lei: "l9605", artigos: ["*"] }],
  "legislacao-especial-8": [{ lei: "l12850", artigos: ["*"] }],
  "legislacao-especial-9": [{ lei: "l9613", artigos: ["*"] }],
  "legislacao-especial-10": [{ lei: "l9455", artigos: ["*"] }, { lei: "l7716", artigos: ["*"] }],
  "legislacao-especial-11": [{ lei: "l9099", artigos: ["60:92"] }],

  // Direitos humanos
  "direitos-humanos-3": [{ lei: "d678", artigos: ["*"] }],
  "direitos-humanos-4": [{ lei: "cf", artigos: ["1:5"] }],
  "direitos-humanos-5": [{ lei: "d678", artigos: ["33:73"] }],
};

/** Acima disso, a página do tópico mostra um link para o leitor em vez do texto inteiro. */
export const LIMITE_ARTIGOS_NA_PAGINA = 12;
