# PROGRESSO · DNA Training v2 — 09/08/2026

> Este arquivo preserva o contexto da sessão caso a conexão caia. Qualquer agente deve ler
> este arquivo ANTES de continuar o trabalho e atualizá-lo ao final.

## Estado geral

- **Repo:** `C:\Projetos\dna-2026` (clonado de https://github.com/majinmagros/dna-2026.git — o pedido era C:\Users\Projetos, mas exigia admin; usuário aprovou C:\Projetos)
- **Branch:** `main` (sincronizada com `origin/main` no início)
- **Último commit:** `0510c81` (InstancedMesh + texture atlas + loopWhenVisible + cleanup). O trabalho do v2 (cards benefícios + página História + timeline 3D + contato real + boas práticas) já está commitado. NÃO push sem pedir.
- Site: estático (HTML/CSS/JS + Three.js r160 vendored em `js/build/`), dark theme (vermelho #e11d3c / ciano #00e5ff), Montserrat, mobile-first

## Contexto do pedido (original)

Coletar informações do site https://kravmaga-bukan.com/pt e cruzar para os 6 benefícios
(Condicionamento Físico, Espaço Diferenciado, Localização, Profissionais Qualificados,
Pontualidade, Limpeza) + criar item "História" + pesquisa aprofundada + boas práticas de dev +
inspiração threejs.org.

### Dados coletados (fonte: kravmaga-bukan.com/pt)

- DNA Training cadastrada oficialmente como academia Bukan:
  - Endereço: Rua Deocleciano Oliveira Filho, 102 (sobreloja), São Paulo/SP, CEP 05834-000
  - Tel: (011) 96254-1010
  - Instrutora: Andrea Braga
  - Maps pin: -23.6650261, -46.7540525
- Filosofia Bukan: "Menor caminho, máxima velocidade e máximo peso em direção ao oponente"
- Krav-Maga: arte marcial (NÃO é esporte/competição), criado por Imi Lichtenfeld (Israel, décadas 60-70);
  15 regras; quimono branco limpo; ensino em hebraico; "destinado a pessoas com inteligência acima da média"
- História Imi Lichtenfeld (pesquisa aprofundada — Wikipedia PT/EN + kravmagabrasil + kravmaga.com.br):
  - 1910: nascimento em Budapeste; cresceu em Bratislava; pai Samuel (atleta/detetive/instrutor policial)
  - ~1930: lutas de rua antinazistas em Bratislava (percebeu luta de rua ≠ luta esportiva)
  - 1940: fuga no barco "Pentcho" rumo à Palestina
  - 1942: Haganá / Palmach, instrutor de combate corpo a corpo
  - 1948: fundação de Israel; instrutor-chefe de preparo físico e Krav-Maga na IDF (Tzahal) por ~20 anos
  - 1964: aposentadoria; adaptou para civis; academias em Netanya e Tel Aviv; sistema de faixas (Judô)
  - 1971: criado oficialmente o nome "Krav-Maga"
  - 1978: Federação de Krav-Maga → depois IKMA (Israeli Krav-Maga Association)
  - 1998 (9 jan): morte em Netanya, 87 anos

### Decisões do usuário (confirmadas)

1. Benefícios → **6 cards com descrição** (ícone SVG + título + parágrafo)
2. História → **página nova `historia.html`** + nav atualizada
3. Visual 3D da História → **Timeline 3D** (anéis de partículas girando + marcos flutuando, estilo threejs.org)

## Trabalho concluído (TUDO commitado em `main`)

- [x] `index.html` — seção Benefícios transformada em `.gradeBeneficios` com 6 `.beneficio-card`
      (SVG inline + h4 + p; card Localização tem link "Como chegar" p/ Google Maps; carrossel 3D mantido
      abaixo em `.conteudoBeneficios`); adicionados `aria-labelledby` e `role="img"`;
      `loading="lazy"` no iframe do YouTube
- [x] `historia.html` — página nova:
      - hero com `#timeline-canvas` (+ fallback noscript)
      - seção `.principal` (o que é Krav-Maga, filosofia)
      - `.timeline` com 9 `.timeline-item` (1910, 1930, 1940, 1942, 1948, 1964, 1971, 1978, 1998)
      - seção final DNA Training + Bukan School
      - importmap + `js/historia.js`
- [x] `js/historia.js` — timeline 3D: 4 anéis de partículas (makeRing) + 6 sprites de marcos
      (makeTextSprite com CanvasTexture) + estrelas + fog; suporta `prefersReducedMotion()` (cena estática)
- [x] `js/core.js` — `prefersReducedMotion()`; `loopWhenVisible` pausa quando aba oculta
      (`visibilitychange`) e fora da viewport (IntersectionObserver); `createRenderer` com
      `failIfMajorPerformanceCaveat: false`
- [x] `js/hero.js` — import de `prefersReducedMotion`; loops de hélice e carrossel não animam se reduced
- [x] `js/galeria.js` — import de `prefersReducedMotion` + `loadTexture`; anel e cubo só animam se motion permitido
- [x] `js/contato.js` — import de `prefersReducedMotion`; `particulas()` pula `points.rotation`/`sprites`
      quando reduced e posiciona os sprites estaticamente (mesmo padrão do historia.js)
- [x] `contato.html` — endereço real (Rua Deocleciano Oliveira Filho, 102 — sobreloja), telefone
      (011) 96254-1010 com `tel:`, link "Como chegar" e badges Bukan School; horários mantidos
- [x] `style.css` — novos blocos no fim do arquivo (respeitando variáveis): `.gradeBeneficios`,
      `.beneficio-card`, `.beneficio-icone`, `.beneficio-link`, `.tituloSub`, `.timeline`,
      `.timeline-item`, `.timeline-ano`, `.timeline-conteudo`, `.infoContato*` + responsivo mobile
- [x] Nav das 4 páginas — link `História` (`historia.html`) + classe `active` correta por página
- [x] `README.md` — estrutura/recursos atualizados (página História, timeline 3D, cards, boas práticas)
- [x] Verificação — `node --check` nos 5 JS; todas as páginas/assets respondem 200 no servidor local
- [x] Commit único em `main` (estilo do repo: "feat: ...")

## Trabalho concluído (retomada — commit pendente ANTES do push)

- [x] Remoção de `imagem1.jpg` a pedido do usuário (foto "Covid" — sessão de retomada):
      arquivo apagado; hero.js (fotos 10 → 9, carrossel 6 → 5), galeria.js (cubo usa `dna1.jpeg`
      no lugar), README.md sem a linha; `node --check` OK nos 2 JS
- [x] Fix das fotos da hélice (bug: só a última foto aparecia — slots sem posição X/Z):
      fotos distribuídas em `(i*2π)/9` ao redor da hélice, face externa (`rotation.y = π/2 - a`),
      raio alternado (+0.12 nos ímpares), guard `d.phase === undefined` (pula ringA/ringB) e
      branch estático para `prefersReducedMotion` — `js/hero.js`
- [x] Push de TODOS os commits para `origin/main` (aprovado pelo usuário) — `main` sincronizada:
      `ebf245f` (fix fotos + remoção imagem1) e `6d1428b` (feature v2) publicados, autor `majinmagros`
      (identidade local do repo configurada; commits reescritos via filter-branch; autenticação
      concluída via Git Credential Manager no push manual do usuário)
- [x] Auditoria de skills (external): 1272 SKILL.md, todos com frontmatter OK; refs ausentes eram
      falsos positivos (exemplos de prosa, duplicatas `.agents/.claude/.cursor/.kiro/docs` e scripts
      no raiz do pacote); causa do erro do loader: PATH sem `C:\Windows\System32\WindowsPowerShell\v1.0`
      → adicionado ao PATH do usuário (fix-path.ps1 → tamanho 764)

## Trabalho pendente

- Formulário da página contato usa `action="#"` — sem destino real de envio. Para ir ao ar de verdade,
  sugerir serviço externo (ex.: FormSubmit/Formspree) — requer decisão do usuário.
- Revisão visual no navegador (WebGL) das novas regras de foco/`skip-link`/chips de radio.
- NÃO commitado NADA desta sessão ainda (mudanças no working tree) — commit/push só com pedido.

## Boas práticas aplicadas (referência)

prefers-reduced-motion, pause on hidden tab, `failIfMajorPerformanceCaveat: false`,
lazy loading (mapa/vídeo), aria-label/aria-labelledby/role, DPR cap (já existia), dispose de
geometries/materiais (já existia), InstancedMesh + atlas (já existia), noscript fallback nas cenas 3D.

## Como rodar

```powershell
python -m http.server 8123   # ou: npx serve
# http://127.0.0.1:8123/index.html ... historia.html
```

---

*Atualizado em: 10/08/2026 — sessão opencode (deepseek-v4-flash-free): auditoria com skills
(accessibility · production-audit · seo · make-interfaces-feel-better) + melhorias aplicadas:
skip-link e `main id="conteudo"` nas 4 páginas + 404.html; `:focus-visible` global (cyan);
contraste do chip `.timeline-ano` corrigido (texto branco sobre red→red-dark, ≥4.71:1);
hit area dos radios/checkbox (padding 10px 14px, chips com hover); `th scope="col"` na tabela;
titles padronizados `X | DNA Training` + meta descriptions + Open Graph + canonical nas 4 páginas;
JSON-LD `HealthClub` no index (endereço/tel/geo/horários reais); `robots.txt` + `sitemap.xml`;
polish CSS: font-smoothing, `text-wrap: balance` em headings, `tabular-nums` em preços/tabela;
typos corrigidos ("Academy DNA" → "Academia DNA", "torne as modalidades" → "conheça").*
Verificação: JS OK via `node --check` (.mjs), todas as 11 URLs responderam 200 no servidor local.
Continuar SEMPRE lendo este arquivo.*