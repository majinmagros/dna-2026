# DNA-2026 · DNA Training

Site da **Academia DNA Training** (Krav-Maga Bukan, Zona Sul de São Paulo) totalmente refatorado e modernizado com animações 3D interativas via **Three.js** e dark theme responsivo.

> Fork/refactor do projeto original `majinmagros/dnatraining`. Repositório público: `majinmagros/dna-2026`.

---

## 🔗 Acesse

| | URL |
|---|---|
| **Site (GitHub Pages)** | https://majinmagros.github.io/dna-2026/ |
| **Páginas iniciais** | [`index.html`](index.html) · [`produtos.html`](produtos.html) · [`historia.html`](historia.html) · [`contato.html`](contato.html) |

---

## ✨ Destaques

- **Hélice de DNA 3D** (página inicial): a dupla hélice gira em looping infinito com as fotos do repositório "grudadas" nas estruturas, anéis de luz pulsando e estrelas ao fundo. **OrbitControls** (arrastar para orbitar, scroll para zoom, câmera gira sozinha).
- **Carrossel 3D (NodeMaterial + TSL)**: imagens orbitando com fade dinâmico via **NodeMaterial/TSL** (Three.js r185) — funciona em **WebGL e WebGPU** sem shaders customizados.
- **Timeline 3D do Krav-Maga** (página História): 4 anéis de partículas girando (vermelho/ciano/azul) + marcos flutuantes (1910 → 1998) com fading, estrelas e fog, no estilo threejs.org.
- **6 cards de benefícios** (página inicial): ícones SVG + título + descrição cruzados com os dados reais do site kravmaga-bukan.com/pt (inclui link "Como chegar" para o Google Maps).
- **Cubo texturizado** com as 6 imagens da academia (página Produtos).
- **Partículas DNA** em dupla hélice com sprites dos logos flutuando (página Contato).
- **Theme dark** com variáveis CSS, acentos em vermelho/ciano e layout 100% responsivo (mobile-first).
- **WebGPU + WebGL fallback**: `createRenderer` tenta `THREE.WebGPURenderer` primeiro e cai para `WebGLRenderer` se indisponível.
- **Timer API**: migração de `THREE.Clock` → `THREE.Timer` em todos os loops de animação.
- **Sem dependência de CDN**: three.js **r185** vendored localmente em `js/build/`.

## 🚀 Como rodar

Como o site usa **ES modules + importmap**, abra via servidor HTTP (não funciona abrindo o arquivo direto):

```powershell
# opção 1: Python
python -m http.server 8123
# acessar http://127.0.0.1:8123/index.html
```

Ou abra a versão publicada no GitHub Pages: https://majinmagros.github.io/dna-2026/

## 📁 Estrutura

```
.
├── index.html            # Home: hero héliceDNA 3D + 6 cards de benefícios + carrossel + mapa + vídeo
├── produtos.html         # Galeria 3D de modalidades + cubo texturizado
├── historia.html         # História do Krav-Maga: timeline 3D + linha do tempo (1910-1998) + Bukan
├── contato.html          # Formulário + horários + informações reais (endereço/telefone Bukan) + partículas DNA
├── 404.html              # Página 404 customizada (GitHub Pages)
├── robots.txt            # Permite rastreamento + aponta o sitemap
├── sitemap.xml           # Sitemap com as 4 páginas públicas
├── style.css             # CSS unificado (dark theme, variáveis, responsivo)
├── reset.css             # Reset CSS (Meyer)
├── dnaLogo.png           # Logomarca (160×160)
├── dna1..dna6.jpeg       # Fotos da academia
├── dna.jpg               # Foto — benefícios / carrossel
├── DNA kids.jpg          # Foto — plano Kids

├── dnalogo.jpeg · dnalogo1.jpeg  # Variantes do logo (sprites 3D)
└── js/
    ├── core.js           # Utilitários compartilhados (renderer WebGPU+WebGL, resize, texturas, estrelas, NodeMaterial/TSL, reduced-motion, THREE.Timer)
    ├── hero.js           # Animação da página inicial (hélice + carrossel)
    ├── galeria.js        # Animação da página de produtos (anel + cubo)
    ├── historia.js       # Timeline 3D da página história (anéis de partículas + marcos)
    ├── contato.js        # Partículas DNA + sprites (página contato)
    └── build/            # three.js r185 vendored
        ├── three.module.js
        ├── OrbitControls.js
        └── three.webgpu.min.js
```

## 🛠 Referências / bibliotecas

- **Three.js r185** — <https://threejs.org/> (NodeMaterial/TSL, WebGPURenderer, THREE.Timer, TextureLoader, MeshBasicNodeMaterial, OrbitControls).
- Fonte **Montserrat** — Google Fonts.
- Mapas — Google Maps Embed; vídeo — YouTube Embed.

## ✅ Boas práticas aplicadas nesta versão

- Nome de arquivo de entrada corrigido: `Academia DNA.html` (com espaço) → `index.html`.
- `meta viewport` corrigido (`width=device-width, initial-scale=1.0`).
- Tags fechadas e HTML semântico (antes havia `<tr>` e `<em>` não fechados).
- `alt`/`title` em todas as imagens e canvas acessíveis; `aria-labelledby`/`role` nos cards e carrosséis.
- `prefers-reduced-motion`: todas as animações 3D (hélice, carrossel, timeline, partículas) viram cena estática quando o usuário pede menos movimento.
- Acessibilidade WCAG 2.2: skip-link "Pular para o conteúdo", `:focus-visible` com anel cyan, hit areas ≥ 40px nos radios/checkbox, contraste ≥ 4.5:1 nos textos de UI.
- SEO: meta description, Open Graph e canonical em todas as páginas; JSON-LD `HealthClub` no index; `robots.txt` + `sitemap.xml`.
- Pausa automática das animações quando a aba fica oculta (`visibilitychange`) e quando o canvas sai da viewport (`IntersectionObserver`, `loopWhenVisible`).
- `failIfMajorPerformanceCaveat: false` + DPR limitado a 2 (desempenho em máquinas fracas).
- `loading="lazy"` em iframes (mapa/vídeo); `noscript` com fallback estático em todas as cenas 3D.
- CSS consolidado (antes 3 folhas conflitantes) com variáveis e tema responsivo.
- Removidos arquivos desnecessários (`get-pip.py`, CSS duplicados, `Academia DNA.html`).
- Typos corrigidos (Pontualidade, Proporcionar, formulário, pretende).
- `autocomplete` e atributos modernos nos formulários.
- Copyright atualizado para 2026.

## 🚢 Implantação

O site é publicado automaticamente via **GitHub Pages** a partir da branch `main`:

- Repo: `majinmagros/dna-2026`
- Endereço do deploy: https://majinmagros.github.io/dna-2026/

Qualquer `git push` para `main` atualiza o Pages em poucos minutos.

---

Feito com 💜 para a **DNA Training** — treinamento de Krav-Maga na Zona Sul. Todos os direitos reservados © 2026.