# DNA-2026 — LOG DE PROGRESSO (anti-crush)

Data: 2026-08-08 · Sessão: opencode
Repo fonte: https://github.com/majinmagros/dnatraining.git
Branch clonada: master → será `main` no novo repo dna-2026
Conta GitHub: majinmagros (logada via gh, escopo repo)

## STATUS: TODOS OS PASSOS DE CÓDIGO CONCLUÍDOS, VERIFICADOS E TESTADOS
FALTA APENAS: push + abrir navegador.

## 1. Análise (realizada)
- 3 páginas HTML, 4 CSS, 12 imagens, get-pip.py (2MB, lixo).
- Bugs: "Academia DNA.html" com espaço no nome; meta viewport errado
  (`width-device-width`); tags não fechadas (contato.html <tr>, <em></em>);
  imagens sem alt; CSS duplicado/conflitante (produtos.css/contato.css
  sobrescreviam style.css); `transition: 5s all`; `.enviar` com color red em
  bg red (ilegível); `.produtos li :active` seletor quebrado; `.utencilios`
  box-shadow com vírgula inválida; typos (Potualidade/Proporcinar/fomulário);
  copyright 2020.

## 2. Refatoração executada
- `Academia DNA.html` → `index.html` (com link correto, injeção de links).
- viewport corrigido (`width=device-width, initial-scale=1.0`).
- Tags fechadas, <table> com <caption>, <tr> fechado, radios com name.
- alt em todas as imagens; lang pt-br; favicon; autocomplete nos inputs.
- typos corrigidos (Pontualidade, Proporcionar, formulário, pretende).
- Removidos: get-pip.py, produtos.css, contato.css, css/ (vazio),
  `Academia DNA.html` (renomeado).
- Copyright atualizado para 2026.

## 3. CSS unificado → style.css (++ reset.css mantido)
- Dark theme (variáveis CSS: --bg, --red #e11d3c, --cyan #00e5ff, --panel).
- Flexbox responsivo, cards, form, table, footer, media queries < 760px.

## 4. three.js r160 integrado (vendored em js/build, sem CDN)
- js/build/three.module.js e js/build/OrbitControls.js (baixados de jsdelivr).
- importmap em cada página: { "three": "./js/build/three.module.js" }.
- js/core.js: utilities (renderer alpha, resize, TextureLoader com SRGB,
  createPhotoPlane, setPhoto, addStars).
- js/hero.js (página index): hélice dupla de DNA de fotos girando (strand
  lines cyan/red), 10 imagens nas "rungs", anéis torus, OrbitControls com
  auto-rotate, fog, partículas de estrelas. Carrossel 3D (canção benefícios)
  com 6 imagens orbitando.
- js/galeria.js (produtos): anel de 6 imagens orbitando Orbitos + cubo
  texturizado 6 imagens (mini-seção).
- js/contato.js: partículas forming dupla hélice de pontos (vertex colors),
  sprites dnalogo/dnalogo1/dnaLogo girar ao redor.
- IMPORTANTE FIX: OrbitControls é named export — usamos `new OrbitControls`,
  não `new THREE.OrbitControls` (corrigido, causava TypeError).

## 5. Verificação
- `node --check` em todos os js: OK.
- Servidor python http.server:8123 + Chrome headless (--enable-unsafe-swiftshader):
  - index.html, produtos.html, contato.html → (sem erros)/canvas count: 2/2/1.
- Nenhum 404 de imagens.

## 6. PRÓXIMOS PASSOS (se houver travamento)
1. git: `git switch -c main` (renomear master), config repository.
2. Commit com mensagem descritiva.
3. gh repo create dna-2026 --public --source . --push (conta majinmagros).
4. Abrir navegador nas 3 páginas (localhost ou GitHub Pages) para conferir.