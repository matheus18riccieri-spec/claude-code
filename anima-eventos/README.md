# Anima Eventos — Landing Page

Landing page animada para a **Anima Eventos**, empresa de decoração temática com heróis para
festas. Site estático (HTML + CSS + JS puro, sem build), pensado para funcionar como uma
extensão da página do Instagram (`@animaeventosms`).

## Como visualizar localmente

```bash
cd anima-eventos
python3 -m http.server 8080
# depois abra http://localhost:8080
```

Ou simplesmente abra `index.html` direto no navegador.

## Estrutura

```
anima-eventos/
├── index.html              # página única com todas as seções
├── css/style.css
├── js/script.js            # monta os catálogos, galeria, lightbox, menu, animações
└── assets/images/
    ├── decoracao/           # 1.jpg .. 6.jpg — Catálogo 1 (pista de LED, DJ, photo booth, túnel de luz)
    ├── carreta-furacao/     # 1.jpg .. 6.jpg — Catálogo 2 (personagens/mascotes de máscara)
    ├── pelucias/            # 1.jpg .. 6.jpg — Catálogo 3 (mascotes de pelúcia)
    ├── robos/               # 1.jpg .. 6.jpg — Catálogo 4 (robôs de LED)
    └── logo-desenvolvedora/logo.png  # logo do rodapé (aguardando arquivo)
```

## Status do conteúdo

- ✅ **Catálogo 1 — Decoração**: 6 fotos incluídas (pista de LED, DJ, túnel de luz, photo booth 360°).
- ✅ **Catálogo 2 — Personagens da Carreta Furacão**: 6 fotos incluídas.
- ✅ **Catálogo 3 — Pelúcias**: 6 fotos incluídas.
- ✅ **Catálogo 4 — Robôs**: 6 fotos incluídas (robôs de LED).
- ✏️ **Seção "Declarações" (depoimentos)**: seção de depoimentos de clientes entre o catálogo
  de Pelúcias e o de Robôs, com 3 textos de exemplo bem marcados com
  "✏️ Edite este depoimento...". Troque pelos depoimentos reais em `index.html`
  (seção `<section id="depoimentos">`). Se "declarações" na verdade for outro grupo de fotos
  de produto (ex: painéis/placas de declaração), me avise que eu troco a seção para um
  catálogo de fotos igual aos outros.
- ⏳ **Logo da desenvolvedora**: o rodapé já tem o espaço reservado. Basta salvar o arquivo
  em `assets/images/logo-desenvolvedora/logo.png` (ou `.svg`, ajustando a extensão em
  `index.html`) que ele aparece automaticamente no lugar do texto placeholder.

Para adicionar/trocar fotos de qualquer catálogo no futuro, basta salvar o arquivo como
`assets/images/<catalogo>/<numero>.jpg` (1 a 6) — o site detecta e exibe automaticamente,
sem precisar editar nenhum código. Enquanto um arquivo não existe, aparece um placeholder
"Aguardando imagem" no lugar dele.

## Contato usado no site

- WhatsApp / telefone: **+55 67 9104 1770** (link `wa.me` montado a partir desse número)
- Instagram: **[@animaeventosms](https://instagram.com/animaeventosms)**

Para trocar, edite os links `https://wa.me/...` e `https://instagram.com/...` em
`index.html` (aparecem no menu, no hero e na seção de contato).

## Galeria

A seção "Galeria" mistura automaticamente todas as fotos dos 4 catálogos em um mosaico
(vem do mesmo `js/script.js`, não precisa manter nada duplicado).
