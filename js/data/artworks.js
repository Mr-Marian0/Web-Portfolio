/*
  ARTWORK LIST — this is the file to edit when adding your art.

  1. Drop the image into  image/art/   (jpg, png, webp, or svg all work)
  2. Add (or edit) an entry below:
       src       path to the image
       title     shown in the gallery caption and the viewer
       category  "traditional" | "digital" | "design"   (drives the gallery filters)
       medium    short note: "Graphite on paper", "Photoshop", "Krita"…
       featured  true = also shown in the art carousel inside the Skills section

  The entries below point at placeholder SVGs; swap each src for your real file.
  Any image size or orientation works — the gallery keeps the original proportions.
*/
export const artworks = [
  { src: "image/art/art-01.svg", title: "Figure study", category: "traditional", medium: "Graphite on paper", featured: true },
  { src: "image/art/art-03.svg", title: "Character concept", category: "digital", medium: "Digital painting", featured: true },
  { src: "image/art/art-02.svg", title: "One-point perspective", category: "traditional", medium: "Pencil & ruler", featured: true },
  { src: "image/art/art-04.svg", title: "Digital illustration", category: "digital", medium: "Photoshop", featured: true },
  { src: "image/art/art-05.svg", title: "Logo exploration", category: "design", medium: "Vector", featured: true },
  { src: "image/art/art-06.svg", title: "Gesture sketches", category: "traditional", medium: "Ink on paper" },
  { src: "image/art/art-07.svg", title: "Icon set", category: "design", medium: "Vector" },
  { src: "image/art/art-08.svg", title: "UI concept", category: "design", medium: "UI / UX", featured: true },
  { src: "image/art/art-09.svg", title: "Storyboard", category: "traditional", medium: "Pencil thumbnails" },
  { src: "image/art/art-10.svg", title: "Color study", category: "digital", medium: "Krita" },
];

export const artCategories = [
  { key: "all", label: "All work" },
  { key: "traditional", label: "Traditional" },
  { key: "digital", label: "Digital" },
  { key: "design", label: "Design" },
];
