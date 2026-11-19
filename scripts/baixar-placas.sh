#!/usr/bin/env bash
# Baixa do Wikimedia Commons (domínio público) as placas citadas nos enunciados que ainda faltam em src/assets/placas.
# Uso: bash scripts/baixar-placas.sh   (pode rodar de novo se o Wikimedia limitar os downloads: erro 429)
set -u
cd "$(dirname "$0")/../src/assets/placas"
codigos=$(python3 -c "
import json,re
s=set()
for f in ['../../data/questoes-autorais.json','../../data/questoes-provas.json']:
  for q in json.load(open(f)): s.update(re.findall(r'\b[RA]-\d+[a-z]?\b',q['enunciado']))
print(' '.join(sorted(s)))")
for c in $codigos; do
  [ -s "$c.svg" ] && continue
  nome="$c"; [ "$c" = R-19 ] && nome="R-19 (80)"; [ "$c" = A-6a ] && nome="A-6"
  arq=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "Brasil $nome.svg")
  code=$(curl -sL -m 30 -A "simulador-cnh/1.0" -o "$c.svg" -w '%{http_code}' "https://commons.wikimedia.org/wiki/Special:FilePath/$arq")
  if [ "$code" = 200 ] && grep -q "<svg" "$c.svg"; then echo "ok    $c"; else echo "falhou $c ($code)"; rm -f "$c.svg"; fi
  sleep 3
done
echo "$(ls *.svg | wc -l) placas em src/assets/placas"
