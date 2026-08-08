# DNA-2026 · DNA Training

Site da **Academia DNA Training** (Krav-Maga Bukan, Zona Sul de São Paulo) totalmente refatorado e modernizado com animações 3D interativas via **Three.js** e dark theme responsivo.

> Fork/refactor do projeto original `majinmagros/dnatraining`. Repositório público: `majinmagros/dna-2026`.

---

## 🔗 Acesse

| | URL |
|---|---|
| **Site (GitHub Pages)** | https://majinmagros.github.io/dna-2026/ |
| **Páginas iniciais** | [`index.html`](index.html) · [`produtos.html`](produtos.html) · [`contato.html`](contato.html) |

---

## ✨ Destaques

- **Hélice de DNA 3D** (página inicial): a dupla hélice gira em looping infinito com as fotos do repositório "grudadas" nas estruturas, anéis de luz pulsando e estrelas ao fundo. **OrbitControls** (arrastar para orbitar, scroll para zoom, câmera gira sozinha).
- **Carrossel 3D**: imagens orbitando com fade dinâmico (seção Benefícios e página Produtos).
- **Cubo texturizado** com as 6 imagens da academia (página Produtos).
- **Partículas DNA** em dupla hélice com sprites dos logos flutuando (página Contato).
- **Theme dark** com variáveis CSS, acentos em vermelho/ciano e layout 100% responsivo (mobile-first).
- **Sem dependência de CDN**: three.js r160 vendored localmente em `js/build/`.

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
├── index.html            # Home: hero héliceDNA 3D + carrossel benefícios + mapa + vídeo
├── produtos.html         # Galeria 3D de modalidades + cubo texturizado
├── contato.html          # Formulário + tabela de horários + fundo de partículas DNA
├── style.css             # CSS unificado (dark theme, variáveis, responsivo)
├── reset.css             # Reset CSS (Meyer)
├── dnaLogo.png           # Logomarca (160×160)
├── dna1..dna6.jpeg       # Fotos da academia
├── dna.jpg               # Foto — benefícios / carrossel
├── DNA kids.jpg          # Foto — plano Kids
├── imagem1.jpg           # Foto panorâmica (banner/carrossel)
├── dnalogo.jpeg · dnalogo1.jpeg  # Variantes do logo (sprites 3D)
└── js/
    ├── core.js           # Utilitários compartilhados (renderer, resize, texturas, estrelas)
    ├── hero.js           # Animação da página inicial (hélice + carrossel)
    ├── galeria.js        # Animação da página de produtos (anel + cubo)
    ├── contato.js        # Partículas DNA + sprites (página contato)
    └── build/            # three.js r160 vendored
        ├── three.module.js
        └── OrbitControls.js
```

## 🛠 Referências / bibliotecas

- **Three.js r160** — <https://threejs.org/> (documentação oficial usada: `TextureLoader`, `MeshBasicMaterial`, `OrbitControls`, loops com `requestAnimationFrame`).
- Fonte **Montserrat** — Google Fonts.
- Mapas — Google Maps Embed; vídeo — YouTube Embed.

## ✅ Boas práticas aplicadas nesta versão

- Nome de arquivo de entrada corrigido: `Academia DNA.html` (com espaço) → `index.html`.
- `meta viewport` corrigido (`width=device-width, initial-scale=1.0`).
- Tags fechadas e HTML semântico (antes havia `<tr>` e `<em>` não fechados).
- `alt`/`title` em todas as imagens e canvas acessíveis.
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