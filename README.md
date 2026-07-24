# Anima Eventos — Landing Page

Landing page da **Anima Eventos**, empresa de organização, decoração e animação de festas
premium em Campo Grande e todo o Mato Grosso do Sul. Site estático (HTML + CSS + JS puro,
sem build), com design editorial (navy + vermelho + dourado, serifada) replicando o mockup
de referência do cliente.

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
├── index.html
├── css/style.css
├── js/script.js            # monta os grids de fotos, carrossel, lightbox, menu, animações
└── assets/
    ├── fonts/               # Playfair Display + Inter (self-hosted, sem depender de CDN)
    └── images/
        ├── decoracao/       # 1.jpg .. 6.jpg — Coleção 01
        ├── carreta-furacao/ # 1.jpg .. 6.jpg — Coleção 02
        ├── pelucias/        # 1.jpg .. 6.jpg — Coleção 03
        ├── robos/           # 1.jpg .. 6.jpg — Coleção 04 (robôs de LED)
        └── galeria/         # 1.jpg .. 8.jpg — fotos do carrossel "A festa vive para sempre"
```

## Seções da página

1. **Hero** — "do jeito Anima", CTA para WhatsApp
2. **Quem somos** — texto institucional + 3 destaques (festa do começo ao fim / todo o MS / padrão premium)
3. **Estatísticas** — +10 anos, +500 eventos, 100% clientes satisfeitos, 24h atendimento
4. **Serviços** — 14 cards (Organização de Eventos, Casamentos, Corporativos, Escolares,
   Planejamento de Festas, Festas de 15 anos, Personagens Vivos, Heróis, Plataforma 360°,
   Piso de LED, Túnel de LED, Sonorização, Ações Sociais, Muvies)
5. **Galeria (carrossel)** — 8 fotos com legenda, navegação por setas
6. **Catálogo de personagens** — 4 coleções (Decoração, Carreta Furacão, Pelúcias, Robôs de
   LED), cada uma com CTA de reserva direto pro WhatsApp e grid de 6 fotos com legenda
7. **Depoimentos** — 4 depoimentos ilustrativos (marcados como tal no subtítulo — trocar
   pelos relatos reais quando disponíveis)
8. **CTA final** — cartão navy→vermelho com botão dourado de WhatsApp
9. **Contato** — endereço, WhatsApp, Instagram + mapa do Google Maps incorporado
10. **Rodapé** — navegação, redes sociais, crédito "Desenvolvido por AceIt"

## Como trocar fotos

Basta salvar o arquivo como `assets/images/<pasta>/<numero>.jpg` (numeração sequencial,
1 em diante) — o site carrega automaticamente, sem precisar editar código. Se um arquivo
não existir, a imagem simplesmente não aparece (sem placeholder quebrado).

## Contato usado no site

- WhatsApp: **+55 (67) 99104-1770** (atendimento 24h)
- Endereço: Av. Rita Vieira de Andrade, 700 — Rita Vieira, Campo Grande - MS
- Instagram: **[@animaeventosms](https://instagram.com/animaeventosms)**

Para trocar, edite os links `https://wa.me/...`, o endereço e o link do Instagram em
`index.html` (aparecem no hero, catálogos, CTA final e seção de contato).

## Observação sobre o mapa

O `<iframe>` do Google Maps na seção de Contato não carrega em ambientes de teste sem
acesso à internet (como sandboxes de CI), mas funciona normalmente em qualquer navegador
com internet — é o formato padrão de embed do Google Maps sem necessidade de API key.
