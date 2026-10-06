"""Extrai os itens certo/errado de uma prova do Cebraspe para o formato do app.

Uso:
  python3 scripts/extrair-prova.py <prova>
onde <prova> é uma das chaves de PROVAS (ex.: prf-2021). Baixa os PDFs oficiais
(prova e gabarito definitivo), extrai o texto em duas colunas com o pdftotext,
separa texto de apoio, comando e item, aplica o gabarito e a classificação por
matéria/tópico definida abaixo e grava data/questoes/<prova>.json.

A classificação foi feita à mão, lendo cada item. Os ids de tópico seguem
lib/edital.ts (<materia>-<n>).
"""

import json
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CDN = "https://cdn.cebraspe.org.br/concursos"

# (primeiro item, último item, matéria, {item: n do tópico} ou n para o intervalo todo)
PROVAS = {
    "prf-2021": {
        "nome": "PRF 2021 · Policial Rodoviário Federal",
        "concurso": "PRF",
        "ano": 2021,
        "cadernos": [f"{CDN}/prf_21/arquivos/578_PRF_001_01.PDF"],
        "gabaritos": [f"{CDN}/prf_21/arquivos/GAB_DEFINITIVO_578_PRF_001_01.PDF"],
        "classificacao": [
            (9, 26, "portugues", {9: 1, 10: 13, 11: 1, 12: 1, 13: 1, 14: 1, 15: 4, 16: 1, 17: 14,
                                  18: 9, 19: 13, 20: 13, 21: 13, 22: 15, 23: 15, 24: 15, 25: 15, 26: 15}),
            (27, 32, "raciocinio-logico", {27: 10, 28: 10, 29: 10, 30: 10, 31: 8, 32: 8}),
            (33, 39, "informatica", {33: 2, 34: 5, 35: 3, 36: 10, 37: 8, 38: 9, 39: 8}),
            (40, 44, "fisica", {40: 1, 41: 3, 42: 1, 43: 6, 44: 6}),
            (45, 50, "etica", {45: 4, 46: 5, 47: 4, 48: 5, 49: 4, 50: 6}),
            (51, 55, "geopolitica-historia", {51: 5, 52: 5, 53: 5, 54: 3, 55: 3}),
            (56, 85, "legislacao-transito", {56: 3, 57: 6, 58: 3, 59: 3, 60: 8, **{n: 13 for n in range(61, 86)}}),
            (86, 92, "direito-administrativo", {86: 8, 87: 3, 88: 7, 89: 5, 90: 8, 91: 4, 92: 4}),
            (93, 99, "direito-constitucional", {93: 2, 94: 2, 95: 5, 96: 6, 97: 3, 98: 12, 99: 12}),
            (100, 104, "direito-penal", {100: 9, 101: 9, 102: 10, 103: 3, 104: 3}),
            (105, 109, "processo-penal", {105: 3, 106: 4, 107: 1, 108: 3, 109: 4}),
            (110, 115, "legislacao-especial", {110: 4, 111: 3, 112: None, 113: 1, 114: 2, 115: 10}),
            (116, 120, "direitos-humanos", {116: 4, 117: 4, 118: 4, 119: 2, 120: 4}),
        ],
        "observacoes": {
            63: "Item sobre a campanha educativa de trânsito de 2021.",
            80: "Item sobre a campanha educativa de trânsito de 2021.",
        },
        "pular": {},
    },
    "inss-2022": {
        "nome": "INSS 2022 · Técnico do Seguro Social",
        "concurso": "INSS",
        "ano": 2022,
        "cadernos": [
            f"{CDN}/inss_22/arquivos/760_INSS_CB1_01.PDF",
            f"{CDN}/inss_22/arquivos/760_INSS_001_01.PDF",
        ],
        "gabaritos": [
            f"{CDN}/inss_22/arquivos/GAB_DEFINITIVO_760_INSS_CB1_01.PDF",
            f"{CDN}/INSS_22/arquivos/GAB_DEFINITIVO_760_INSS_001_01.PDF",
        ],
        "classificacao": [
            (1, 14, "portugues", {1: 1, 2: 1, 3: 2, 4: 1, 5: 1, 6: 4, 7: 4, 8: 4, 9: 8, 10: 4,
                                  11: 3, 12: 4, 13: 4, 14: 9}),
            (15, 20, "etica", {15: 5, 16: 5, 17: 5, 18: 4, 19: 4, 20: 4}),
            (21, 30, "direito-constitucional", {21: 2, 22: 2, 23: 2, 24: 4, 25: 6, 26: 5,
                                                27: 8, 28: 8, 29: 8, 30: 8}),
            (31, 34, "direito-administrativo", {31: 1, 32: 5, 33: 1, 34: 3}),
            (35, 35, "lei-8112", {35: 1}),
            (36, 40, "direito-administrativo", {36: 6, 37: 12, 38: 11, 39: 9, 40: 10}),
            (41, 45, "informatica", {41: 2, 42: 1, 43: 6, 44: 8, 45: 8}),
            (46, 50, "raciocinio-logico", {46: 7, 47: 4, 48: 1, 49: 1, 50: 1}),
            (51, 120, "seguridade-social", {
                51: 1, 52: 1, 53: 16, 54: 16, 55: 4, 56: 4, 57: 4, 58: 2, 59: 5, 60: 4,
                61: 2, 62: 2, 63: 2, 64: 2, 65: 2, 66: 2, 67: 7, 68: 7, 69: 7, 70: 7,
                71: 7, 72: 9, 73: 2, 74: 2, 75: 2, 76: 16, 77: 16, 78: 16, 79: 16, 80: 16,
                81: 11, 82: 11, 83: 16, 84: 15, 85: 16, 86: 16, 87: 4, 88: 12, 89: 10, 90: 14,
                91: 16, 92: 16, 93: 16, 94: 16, 95: 16, 96: 16, 97: 16, 98: 16, 99: 16,
                100: 17, 101: 17, 102: 17, 103: 17, 104: 17, 105: 17, 106: 16, 107: 16,
                108: 10, 109: 10, 110: 10, 111: 10, 112: 10, 113: 1, 114: 1, 115: 1, 116: 1,
                117: 1, 118: 14, 119: 14, 120: 14}),
        ],
        "observacoes": {
            34: "Em 2023 o INSS passou a ser vinculado ao Ministério da Previdência Social.",
            42: "Na prova, o item vinha com a imagem de uma página com cadeado e https:// na barra de endereço.",
        },
        # Itens que não fazem sentido sem a figura da prova.
        "pular": {43: "depende da planilha mostrada na figura"},
    },
}

LIXO = re.compile(
    r"^\s*(CEBRASPE –|Espaço livre|BLOCO I+\b|-- |\d{3}\w*_\d{2}N\d+|[A-ZÁÉÍÓÚÇ ]+ --\s*$)"
)
ITEM = re.compile(r"^(\s*)(\d{1,3})\s+(\S.*)$")


def baixar(url: str, destino: Path) -> Path:
    arq = destino / url.rsplit("/", 1)[1]
    with urllib.request.urlopen(url, timeout=60) as r:
        arq.write_bytes(r.read())
    return arq


def texto_em_colunas(pdf: Path) -> list[str]:
    """Texto da coluna esquerda e depois da direita de cada página (A4, 595pt)."""
    info = subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True, check=True).stdout
    paginas = int(re.search(r"^Pages:\s+(\d+)", info, re.M).group(1))
    linhas: list[str] = []
    for p in range(1, paginas + 1):
        for x, w in ((0, 298), (298, 297)):
            saida = subprocess.run(
                ["pdftotext", "-f", str(p), "-l", str(p), "-x", str(x), "-y", "0",
                 "-W", str(w), "-H", "842", "-layout", str(pdf), "-"],
                capture_output=True, text=True, check=True,
            ).stdout
            linhas.extend(saida.splitlines())
    return linhas


def ler_gabarito(pdf: Path) -> dict[int, str]:
    txt = subprocess.run(["pdftotext", "-layout", str(pdf), "-"], capture_output=True, text=True, check=True).stdout
    gabarito: dict[int, str] = {}
    itens: list[str] = []
    for linha in txt.splitlines():
        partes = linha.split()
        if partes[:1] == ["Item"]:
            itens = partes[1:]
        elif partes[:1] == ["Gabarito"]:
            for n, g in zip(itens, partes[1:]):
                if n != "0" and g in ("C", "E", "X"):
                    gabarito[int(n)] = g
    return gabarito


def juntar(linhas: list[str]) -> str:
    """Junta linhas de um parágrafo; hífen no fim da linha une a palavra composta."""
    texto = ""
    for l in linhas:
        l = re.sub(r"\s+", " ", l.strip())
        if not l:
            continue
        if not texto:
            texto = l
        elif texto.endswith("-"):
            texto += l
        else:
            texto += " " + l
    return texto


def texto_de_apoio(linhas: list[str]) -> str:
    """Mantém a quebra de parágrafos do texto de apoio (linhas com recuo grande abrem parágrafo)."""
    paragrafos: list[list[str]] = []
    for l in linhas:
        if not l.strip():
            continue
        recuo = len(l) - len(l.lstrip())
        if not paragrafos or recuo >= 6 or re.match(r"\s*[IVX]+\s", l):
            paragrafos.append([l])
        else:
            paragrafos[-1].append(l)
    return "\n".join(juntar(p) for p in paragrafos)


def separar_comando(pendente: list[str]) -> tuple[list[str], list[str]]:
    """Divide as linhas entre o último item e o próximo em (texto de apoio, comando)."""
    linhas = [l for l in pendente if l.strip()]
    inicio = None
    for i, l in enumerate(linhas):
        recuo = len(l) - len(l.lstrip())
        anterior = linhas[i - 1].rstrip() if i > 0 else ""
        if recuo < 6 and l.strip()[:1].isupper() and (i == 0 or anterior.endswith((".", ":", ")"))):
            inicio = i
    if inicio is None:
        return linhas, []
    return linhas[:inicio], linhas[inicio:]


def extrair(linhas: list[str], primeiro: int) -> list[dict]:
    itens: list[dict] = []
    esperado = primeiro
    atual: dict | None = None
    recuo_num = 0
    brancas = 0  # linhas em branco seguidas: duas ou mais (lugar de figura) fecham o item
    pendente: list[str] = []
    apoio_atual: str | None = None
    rotulo_atual: str | None = None
    comando_atual = ""

    def abrir_bloco():
        nonlocal apoio_atual, rotulo_atual, comando_atual, pendente
        apoio, comando = separar_comando(pendente)
        comando_txt = juntar(comando)
        if apoio:
            apoio_atual = texto_de_apoio(apoio)
            m = re.match(r"Texto\s+(\S+)", apoio_atual)
            rotulo_atual = m.group(1) if m else None
        elif comando_txt:
            # Comando novo sem texto: só herda o texto anterior se o citar pelo rótulo.
            if not (rotulo_atual and rotulo_atual in comando_txt):
                apoio_atual = None
        if comando_txt:
            comando_atual = comando_txt
        pendente = []

    for linha in linhas:
        if LIXO.match(linha):
            continue
        m = ITEM.match(linha)
        if m and int(m.group(2)) == esperado:
            if pendente:
                abrir_bloco()
            atual = {"numero": esperado, "linhas": [m.group(3)], "apoio": apoio_atual, "comando": comando_atual}
            itens.append(atual)
            recuo_num = len(m.group(1))
            brancas = 0
            esperado += 1
            continue
        if atual is not None and not pendente:
            recuo = len(linha) - len(linha.lstrip())
            if not linha.strip():
                brancas += 1
                continue
            if brancas < 2 and recuo_num + 2 <= recuo < recuo_num + 7:
                atual["linhas"].append(linha)
                continue
        pendente.append(linha)

    for item in itens:
        item["enunciado"] = juntar(item.pop("linhas"))
    return itens


def main(chave: str):
    cfg = PROVAS[chave]
    classif: dict[int, tuple[str, int | None]] = {}
    for ini, fim, materia, topicos in cfg["classificacao"]:
        for n in range(ini, fim + 1):
            classif[n] = (materia, topicos[n] if isinstance(topicos, dict) else topicos)

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        itens: list[dict] = []
        for url in cfg["cadernos"]:
            linhas = texto_em_colunas(baixar(url, tmp))
            primeiro = next(int(m.group(2)) for l in linhas if (m := ITEM.match(l)) and not LIXO.match(l))
            itens.extend(extrair(linhas, primeiro))
        gabarito: dict[int, str] = {}
        for url in cfg["gabaritos"]:
            gabarito.update(ler_gabarito(baixar(url, tmp)))

    textos: dict[str, str] = {}
    ids_texto: dict[str, str] = {}
    saida = []
    for item in itens:
        n = item["numero"]
        if n in cfg["pular"]:
            continue
        materia, topico = classif[n]
        texto_id = None
        if item["apoio"]:
            if item["apoio"] not in ids_texto:
                ids_texto[item["apoio"]] = f"{chave}-t{len(ids_texto) + 1}"
                textos[ids_texto[item["apoio"]]] = item["apoio"]
            texto_id = ids_texto[item["apoio"]]
        q = {
            "id": f"{chave}-{n:03d}",
            "numero": n,
            "materia": materia,
            "topico": f"{materia}-{topico}" if topico else None,
            "texto": texto_id,
            "comando": item["comando"],
            "enunciado": item["enunciado"],
            "gabarito": gabarito[n],
        }
        if n in cfg["observacoes"]:
            q["observacao"] = cfg["observacoes"][n]
        saida.append(q)

    numeros = {q["numero"] for q in saida} | set(cfg["pular"])
    faltando = sorted(set(gabarito) - numeros)
    if faltando:
        sys.exit(f"Itens do gabarito que não foram extraídos: {faltando}")

    prova = {
        "id": chave,
        "nome": cfg["nome"],
        "concurso": cfg["concurso"],
        "banca": "Cebraspe",
        "ano": cfg["ano"],
        "fontes": cfg["cadernos"] + cfg["gabaritos"],
        "textos": textos,
        "itens": saida,
    }
    destino = RAIZ / "data" / "questoes" / f"{chave}.json"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(json.dumps(prova, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    anulados = sum(1 for q in saida if q["gabarito"] == "X")
    print(f"{destino.relative_to(RAIZ)}: {len(saida)} itens ({anulados} anulados), {len(textos)} textos de apoio")


if __name__ == "__main__":
    for chave in sys.argv[1:] or PROVAS:
        main(chave)
