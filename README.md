# Web-Portfolio
Building my portfolio without using Wordpress, Canva or any tools.

## Structure

```
index.html
css/
  base.css        tokens, reset, nav, intro loader, footer
  hero.css        hero, image reel, marquee
  skills.css      hard-skill cards, tool tiles, readout, soft skills
  carousel.css    carousel inside each skill card
  gallery.css     art gallery + image viewer (lightbox)
  projects.css    project cards
  modal.css       project detail modal
  contact.css     contact form
  motion.css      intro / scroll-reveal / mask animations, reduced-motion rules
  responsive.css  breakpoints
js/
  main.js         entry point
  data/           the content — edit these
    artworks.js   gallery + art carousel
    skills.js     the three hard-skill groups
    projects.js   project cards
    icons.js      tool icons, tool descriptions, soft skills
  components/     skill cards, carousel, tool grid, gallery, lightbox, projects, nav, contact form
  effects/        intro, scroll reveal, parallax, shared easing
image/
  art/            artwork images
  hardware/       hardware photos for the Hardware card
  projects/       project screenshots
  lottie/         animated skill icons (play on hover; colour comes from CSS)
```

## Adding artwork

1. Put the image in `image/art/`.
2. Add an entry in `js/data/artworks.js`:
   ```js
   { src: "image/art/my-drawing.jpg", title: "My drawing", category: "traditional", medium: "Graphite", featured: true },
   ```
   `category` is `traditional`, `digital` or `design` (drives the gallery filters).
   `featured: true` also shows it in the art carousel in the Skills section.

Every artwork also appears in the looping reel in the hero, mixed with project screenshots.

The `art-XX.svg` and `hw-XX.svg` files are placeholders. Replace them with real images
and update the paths in `artworks.js` / `skills.js`.

## Running locally

The scripts are ES modules, so open the site through a local server rather than `file://`:

```
python -m http.server 8000
```
