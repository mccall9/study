"""Importa o texto oficial compilado de leis do Planalto para data/leis/<id>.json.

Requer: pip install beautifulsoup4 html5lib

Uso:
  python3 scripts/importar-lei.py            # todas as leis de LEIS
  python3 scripts/importar-lei.py cf l8112   # só algumas

O texto revogado (riscado com <strike> no Planalto) e as notas de alteração
("Redação dada pela...", "Incluído pela...", "Vide...") são descartados.
Cada artigo ganha uma âncora estável (art5, art67-a) e cada dispositivo também
(art5-i, art5-i-a, art5-p1, art5-pu), usada nos links do app.
"""

import json
import re
import sys
import urllib.request
from datetime import date
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString

RAIZ = Path(__file__).resolve().parent.parent
P = "https://www.planalto.gov.br/ccivil_03"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36"

# id -> (nome curto, nome completo, url)
LEIS = {
    "cf": ("CF/88", "Constituição Federal de 1988", f"{P}/constituicao/constituicao.htm"),
    "emc103": ("EC 103/2019", "Emenda Constitucional nº 103/2019 (Reforma da Previdência)", f"{P}/constituicao/emendas/emc/emc103.htm"),
    "ctb": ("CTB", "Código de Trânsito Brasileiro (Lei nº 9.503/1997)", f"{P}/leis/l9503compilado.htm"),
    "l8112": ("Lei 8.112/1990", "Regime Jurídico dos Servidores Públicos Federais", f"{P}/leis/l8112cons.htm"),
    "l8212": ("Lei 8.212/1991", "Organização e Custeio da Seguridade Social", f"{P}/leis/l8212cons.htm"),
    "l8213": ("Lei 8.213/1991", "Planos de Benefícios da Previdência Social", f"{P}/leis/l8213cons.htm"),
    "d3048": ("Decreto 3.048/1999", "Regulamento da Previdência Social", f"{P}/decreto/d3048.htm"),  # só o anexo
    "l8742": ("LOAS", "Lei Orgânica da Assistência Social (Lei nº 8.742/1993)", f"{P}/leis/l8742.htm"),
    "lcp142": ("LC 142/2013", "Aposentadoria da pessoa com deficiência (Lei Complementar nº 142/2013)", f"{P}/leis/lcp/lcp142.htm"),
    "l10779": ("Lei 10.779/2003", "Seguro-desemprego do pescador artesanal (seguro-defeso)", f"{P}/leis/2003/l10.779.htm"),
    "d1171": ("Decreto 1.171/1994", "Código de Ética Profissional do Servidor Público Civil do Poder Executivo Federal", f"{P}/decreto/d1171.htm"),
    "d6029": ("Decreto 6.029/2007", "Sistema de Gestão da Ética do Poder Executivo Federal", f"{P}/_ato2007-2010/2007/decreto/d6029.htm"),
    "d9203": ("Decreto 9.203/2017", "Política de governança da administração pública federal", f"{P}/_ato2015-2018/2017/decreto/d9203.htm"),
    "l12813": ("Lei 12.813/2013", "Conflito de interesses no Poder Executivo federal", f"{P}/_ato2011-2014/2013/lei/l12813.htm"),
    "l12527": ("LAI", "Lei de Acesso à Informação (Lei nº 12.527/2011)", f"{P}/_ato2011-2014/2011/lei/l12527.htm"),
    "l9784": ("Lei 9.784/1999", "Processo administrativo federal", f"{P}/leis/l9784.htm"),
    "l8429": ("Lei 8.429/1992", "Improbidade administrativa", f"{P}/leis/l8429.htm"),
    "l14133": ("Lei 14.133/2021", "Licitações e contratos administrativos", f"{P}/_ato2019-2022/2021/lei/l14133.htm"),
    "l9654": ("Lei 9.654/1998", "Carreira de Policial Rodoviário Federal", f"{P}/leis/l9654.htm"),
    "cp": ("Código Penal", "Código Penal (Decreto-Lei nº 2.848/1940)", f"{P}/decreto-lei/del2848compilado.htm"),
    "cpp": ("CPP", "Código de Processo Penal (Decreto-Lei nº 3.689/1941)", f"{P}/decreto-lei/del3689compilado.htm"),
    "l11343": ("Lei de Drogas", "Lei de Drogas (Lei nº 11.343/2006)", f"{P}/_ato2004-2006/2006/lei/l11343.htm"),
    "l10826": ("Estatuto do Desarmamento", "Estatuto do Desarmamento (Lei nº 10.826/2003)", f"{P}/leis/2003/l10.826.htm"),
    "l13869": ("Abuso de Autoridade", "Lei de Abuso de Autoridade (Lei nº 13.869/2019)", f"{P}/_ato2019-2022/2019/lei/l13869.htm"),
    "l8072": ("Crimes Hediondos", "Lei dos Crimes Hediondos (Lei nº 8.072/1990)", f"{P}/leis/l8072.htm"),
    "l11340": ("Maria da Penha", "Lei Maria da Penha (Lei nº 11.340/2006)", f"{P}/_ato2004-2006/2006/lei/l11340.htm"),
    "l8069": ("ECA", "Estatuto da Criança e do Adolescente (Lei nº 8.069/1990)", f"{P}/leis/l8069.htm"),
    "l9605": ("Crimes Ambientais", "Lei de Crimes Ambientais (Lei nº 9.605/1998)", f"{P}/leis/l9605.htm"),
    "l12850": ("Organizações Criminosas", "Lei das Organizações Criminosas (Lei nº 12.850/2013)", f"{P}/_ato2011-2014/2013/lei/l12850.htm"),
    "l9613": ("Lavagem de Dinheiro", "Lei de Lavagem de Dinheiro (Lei nº 9.613/1998)", f"{P}/leis/l9613.htm"),
    "l9455": ("Lei de Tortura", "Lei de Tortura (Lei nº 9.455/1997)", f"{P}/leis/l9455.htm"),
    "l7716": ("Lei do Racismo", "Crimes de preconceito de raça ou cor (Lei nº 7.716/1989)", f"{P}/leis/l7716.htm"),
    "l9099": ("Juizados Especiais", "Juizados Especiais Cíveis e Criminais (Lei nº 9.099/1995)", f"{P}/leis/l9099.htm"),
    "l12037": ("Identificação Criminal", "Identificação criminal do civilmente identificado (Lei nº 12.037/2009)", f"{P}/_ato2007-2010/2009/lei/l12037.htm"),
    "d678": ("Pacto de San José", "Convenção Americana sobre Direitos Humanos (Decreto nº 678/1992)", f"{P}/decreto/d0678.htm"),
}

NOTA = re.compile(
    r"\(\s*(?:Redação dada|Redação do|Incluíd[oa]|Incluso|Acrescid[oa]|Acrescentad[oa]|Vide|Revogad[oa]|"
    r"Regulamento|Regulamentação|Produção de efeitos?|Vigência|Renumerad[oa]|Promulga|Inclusão|"
    r"Texto|Transformad[oa]|Alterad[oa]|Suprimid[oa]|Expressão|Execução suspensa|Em vigor|"
    r"Mantid[oa]|Restabelecid[oa]|Nova redação|Revigorad[oa]|Convertid[oa]|Prorrogad[oa]|Vetad[oa]|"
    r"VETADO|Declarad[oa]|Medida Provisória|Lei|Decreto|Emenda|Ver )"
    r"[^()]*(?:\([^()]*\)[^()]*)*\)",
    re.I,
)
NOTA_FINAL = re.compile(
    r"(?<=[.;:])\s+(?:Vide|Redação dada|Redação do|Incluíd[oa]|Acrescid[oa]|Revogad[oa]|Regulamento|"
    r"Vigência|Produção de efeitos?|Renumerad[oa])\b.*$"
)
NOTA_SOLTA = re.compile(
    r"\s+(?:(?:Incluíd[oa]|Acrescid[oa]|Redação dada|Revogad[oa]|Renumerad[oa]) pel[oa] "
    r"(?:Lei|Medida|Decreto|Emenda)\b.*|Vigência\.?)$"
)
NOTA_ABERTA = re.compile(r"\s*\((?:Incluíd|Redação|Revogad|Vide|Acrescid|Renumerad|Vigência)[^()]*$")
NOTA_SOZINHA = re.compile(r"^\)?\s*(?:Vigência(?: encerrada)?|Vide\b.*|Regulamento|Produção de efeitos?)\.?$")
# Sufixo de letra colado ao hífen ("Art. 8º-A"); "Art. 3º - A lei..." é só travessão.
ART = re.compile(r"^Art(?:igo|\.)?\s*(\d+)\s*[º°o]?\s*(?:-([A-Z])(?![a-záéíóúâêôãõç]))?\s*[\.\-–]?\s", re.I)
CABECALHO = re.compile(r"^(PARTE|LIVRO|TÍTULO|TITULO|CAPÍTULO|CAPITULO|SEÇÃO|SECAO|SUBSEÇÃO|SUBSECAO)\b", re.I)
INCISO = re.compile(r"^([IVXLC]+)\s*[-–—]\s")
ALINEA = re.compile(r"^([a-z]{1,2})\)\s")  # "aa)" vem depois do "z)" em listas longas
PARAGRAFO = re.compile(r"^§\s*(\d+)\s*[º°o]?(?:-([A-Z])(?![a-záéíóúâêôãõç]))?\s*[\.\-–]?\s")
UNICO = re.compile(r"^Parágrafo único", re.I)
NUMERADO = re.compile(r"^(\d+)\.\s")
FIM = re.compile(r"^(Brasília,|Rio de Janeiro,|Este texto não substitui|ATO DAS DISPOSIÇÕES CONSTITUCIONAIS TRANSITÓRIAS)", re.I)


# Restos de nota de alteração que sobram quando o texto revogado (riscado) é removido.
SOBRA = re.compile(r"^\(?\s*(Revogad|Vide\b|Redação|Incluíd|Acrescid|Renumerad|Vetad|VETAD|Regulament)", re.I)


def so_rotulo(texto: str) -> bool:
    """Dispositivo que ficou só com o rótulo ("XVII -", "§ 3º", "Art. 12.") depois de tirar o revogado."""
    if texto.upper().startswith("ARTIGO"):  # convenções: "ARTIGO 1" é título, o texto vem depois
        return False
    if re.fullmatch(r"(\d+|[IVXLC]+|[a-z])\s*[.)\-–]?\s*[;,.]?", texto):  # item revogado: "3.;", "IV -"
        return True
    for padrao in (ART, PARAGRAFO, INCISO, ALINEA, UNICO, NUMERADO):
        m = padrao.match(texto + " ")
        if m:
            return not (texto + " ")[m.end() :].strip(" .-–—:;()")
    return False


def baixar(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=90) as r:
        raw = r.read()
    if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):  # algumas páginas antigas estão em UTF-16
        return raw[: len(raw) // 2 * 2].decode("utf-16", errors="replace")
    if raw[:3] == b"\xef\xbb\xbf":
        return raw[3:].decode("utf-8", errors="replace")
    m = re.search(rb'charset=["\']?([\w-]+)', raw[:3000], re.I)
    enc = m.group(1).decode().lower() if m else "windows-1252"
    if enc in ("iso-8859-1", "latin-1", "latin1"):
        enc = "windows-1252"
    return raw.decode(enc, errors="replace")


def texto_do_paragrafo(p) -> str:
    for s in p.find_all(["strike", "s", "del"]):
        s.decompose()
    partes = []
    for el in p.descendants:
        if isinstance(el, NavigableString):
            partes.append(str(el))
    t = "".join(partes).replace("\xa0", " ")
    t = re.sub(r"\s+", " ", t).strip()
    for _ in range(3):
        t = NOTA.sub("", t).strip()
    # Notas sem parênteses no fim do dispositivo ("...; Vigência", ". Vide art. 96 - ADCT").
    t = NOTA_FINAL.sub("", t).strip()
    t = NOTA_SOLTA.sub("", t).strip()
    t = NOTA_ABERTA.sub("", t).strip()
    if NOTA_SOZINHA.match(t):
        return ""
    t = re.sub(r"\s+([,.;:])", r"\1", t)
    t = re.sub(r"\s+", " ", t).strip()
    if re.fullmatch(r"[\s.;,:…]*", t):  # linha de pontos (trecho omitido) ou sobra de pontuação
        return ""
    # Ponto que sobrou da nota removida: "idade avançada;." e "Art. 43.." (revogado, só rótulo).
    t = re.sub(r"([.;:])\.+$", r"\1", t)
    # Chamada de nota de rodapé colada no fim: "...Previdência Social. 12".
    t = re.sub(r"(?<![Aa]rt)([.;:])\s+\d{1,2}$", r"\1", t)
    return t


def romano(r: str) -> str:
    return r.lower()


# Onde começa o conteúdo útil, quando o decreto só aprova/promulga um texto que vem depois dele.
INICIO = {
    "d3048": re.compile(r"^Art\. ?1\s+A seguridade social"),
    "d678": re.compile(r"^CONVENÇÃO AMERICANA SOBRE DIREITOS HUMANOS$"),
}


def importar(lei_id: str) -> dict:
    curto, nome, url = LEIS[lei_id]
    inicio = INICIO.get(lei_id)
    soup = BeautifulSoup(baixar(url), "html5lib")  # html5lib: o HTML do Planalto é malformado
    blocos: list[dict] = []
    artigo: dict | None = None
    ids: set[str] = set()
    inciso_atual = None
    paragrafo_atual = None
    alinea_atual = None
    cabecalho_pendente: dict | None = None
    comecou = False
    assinado = False  # passou da assinatura: só continua se houver ANEXO (ex.: Código de Ética)
    anexo = False

    def unico(base: str) -> str:
        i, cand = 2, base
        while cand in ids:
            cand = f"{base}-{i}"
            i += 1
        ids.add(cand)
        return cand

    for p in soup.find_all("p"):
        texto = texto_do_paragrafo(p)
        if not texto or texto in ("(VETADO)", "VETADO", "(Vetado).") or SOBRA.match(texto) or so_rotulo(texto):
            continue
        if inicio is not None:
            if not inicio.match(texto):
                continue
            inicio = None
        if FIM.match(texto) and comecou:
            if texto.upper().startswith("ATO DAS DISPOSIÇÕES") or anexo:
                break
            assinado = True
            continue
        if assinado and not anexo:
            if texto.upper().startswith("ANEXO") and len(texto) < 20:
                anexo = True
                artigo = None
            continue
        aguardando_subtitulo = cabecalho_pendente is not None and not cabecalho_pendente["s"]
        if anexo and artigo is None and not aguardando_subtitulo and not CABECALHO.match(texto) and not (
            INCISO.match(texto) or ALINEA.match(texto) or PARAGRAFO.match(texto)
        ):
            if len(texto) < 150:
                blocos.append({"t": "h", "n": 4, "x": texto, "s": ""})
                continue
        centralizado = (p.get("align") or "").lower() == "center" or "center" in (p.get("style") or "").lower()
        m = ART.match(texto + " ")
        if m:
            comecou = True
            num = m.group(1) + (f"-{m.group(2).upper()}" if m.group(2) else "")
            aid = unico(f"art{num.lower()}")
            artigo = {"t": "a", "id": aid, "num": num, "d": [{"id": aid, "x": texto}]}
            blocos.append(artigo)
            inciso_atual = paragrafo_atual = alinea_atual = None
            cabecalho_pendente = None
            continue
        if CABECALHO.match(texto) and (centralizado or len(texto) < 80):
            comecou = True
            nivel = {"PARTE": 1, "LIVRO": 1, "TÍTULO": 2, "TITULO": 2, "CAPÍTULO": 3, "CAPITULO": 3}.get(
                texto.split()[0].upper(), 4
            )
            cabecalho_pendente = {"t": "h", "n": nivel, "x": texto, "s": ""}
            blocos.append(cabecalho_pendente)
            artigo = None
            continue
        if not comecou:
            continue
        if (
            cabecalho_pendente is not None
            and not cabecalho_pendente["s"]
            and len(texto) < 150
            and not (INCISO.match(texto) or ALINEA.match(texto) or PARAGRAFO.match(texto) or UNICO.match(texto))
        ):
            if len(texto.strip("*. ")) >= 3:
                cabecalho_pendente["s"] = texto
            continue
        if artigo is None:
            if anexo:
                # No anexo não há "Art.": cada seção vira um bloco com os itens numerados.
                titulo = next((b["s"] or b["x"] for b in reversed(blocos) if b["t"] == "h"), "Anexo")
                artigo = {"t": "a", "id": unico(f"anexo-s{sum(1 for b in blocos if b['t'] == 'a' and b['num'] == 'Anexo') + 1}"),
                          "num": "Anexo", "rotulo": titulo, "d": []}
                blocos.append(artigo)
            else:
                if centralizado and len(texto) < 120:
                    blocos.append({"t": "h", "n": 4, "x": texto, "s": ""})
                continue
        base = "anexo" if anexo else artigo["id"]
        # Hierarquia: artigo > parágrafo > inciso > alínea > item numerado. Nas convenções
        # ("ARTIGO 7" seguido de "1.", "2."), o número faz o papel de parágrafo.
        if (mm := PARAGRAFO.match(texto)):
            paragrafo_atual = f"{base}-p{mm.group(1)}" + (f"-{mm.group(2).lower()}" if mm.group(2) else "")
            inciso_atual = alinea_atual = None
            did = paragrafo_atual
        elif UNICO.match(texto):
            paragrafo_atual = f"{base}-pu"
            inciso_atual = alinea_atual = None
            did = paragrafo_atual
        elif (mm := INCISO.match(texto)):
            inciso_atual = f"{paragrafo_atual or base}-{romano(mm.group(1))}"
            alinea_atual = None
            did = inciso_atual
        elif (mm := ALINEA.match(texto)):
            alinea_atual = f"{inciso_atual or paragrafo_atual or base}-{mm.group(1)}"
            did = alinea_atual
        elif (mm := NUMERADO.match(texto)):
            if alinea_atual or inciso_atual:
                did = f"{alinea_atual or inciso_atual}-n{mm.group(1)}"
            else:
                paragrafo_atual = f"{base}-n{mm.group(1)}"
                did = paragrafo_atual
        else:
            did = f"{base}-txt"
        artigo["d"].append({"id": unico(did), "x": texto})

    artigos = sum(1 for b in blocos if b["t"] == "a")
    if artigos == 0:
        raise ValueError(f"nenhum artigo encontrado em {url}")
    return {
        "id": lei_id,
        "curto": curto,
        "nome": nome,
        "url": url,
        "importado_em": date.today().isoformat(),
        "blocos": blocos,
    }


def main(ids: list[str]):
    destino = RAIZ / "data" / "leis"
    destino.mkdir(parents=True, exist_ok=True)
    falhas = []
    for lei_id in ids:
        try:
            lei = importar(lei_id)
        except Exception as e:  # noqa: BLE001
            falhas.append(f"{lei_id}: {e}")
            continue
        (destino / f"{lei_id}.json").write_text(json.dumps(lei, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
        artigos = sum(1 for b in lei["blocos"] if b["t"] == "a")
        disp = sum(len(b["d"]) for b in lei["blocos"] if b["t"] == "a")
        print(f"{lei_id:8} {artigos:4d} artigos {disp:5d} dispositivos  {lei['curto']}")
    if falhas:
        print("FALHAS:\n  " + "\n  ".join(falhas))
        sys.exit(1)


if __name__ == "__main__":
    main(sys.argv[1:] or list(LEIS))
