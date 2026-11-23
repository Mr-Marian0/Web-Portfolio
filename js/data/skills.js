/*
  Hard-skill groups — each one becomes a card in the Skills section:
  a carousel of images on top, the skill list underneath.

  Carousel slides: { src, caption }.
  - Art slides come from artworks.js (entries marked featured: true).
  - Hardware slides point at image/hardware/ — swap the placeholder SVGs for real photos.
  - Programming slides reuse the project screenshots.
  The programming card also lists every tool from icons.js (toolsMeta).
*/
import { artworks } from "./artworks.js";
import { projects } from "./projects.js";

export const hardSkillGroups = [
  {
    id: "art",
    code: "A",
    icon: "paintbrush", // animated icon in image/lottie/
    title: "Traditional & Digital Art",
    blurb: "I start with pencil and paper, then bring those drawing skills into illustration, animation, and UI design.",
    fit: "contain",
    slides: artworks.filter((a) => a.featured).map((a) => ({ src: a.src, caption: a.title })),
    lists: [
      {
        label: "Skills",
        items: [
          "Sketching",
          "Perspective Drawing",
          "Anatomy Drawing",
          "Digital Illustration",
          "Character Design",
          "2D Animation",
          "Storyboarding",
          "Logo Design",
          "Icon Design",
          "Adobe Photoshop",
          "UI Design",
          "UX Design",
          "Photo Editing",
          "Video Editing",
          "Web Design",
        ],
      },
    ],
  },
  {
    id: "hardware",
    code: "B",
    icon: "pc",
    title: "Hardware, Networking & Systems",
    blurb: "My Computer Engineering side. I work with circuit boards, wiring, and networks, and I keep computers running.",
    fit: "cover",
    slides: [
      { src: "image/hardware/hw-01.svg", caption: "Microcontroller wiring" },
      { src: "image/hardware/hw-02.svg", caption: "Network setup" },
      { src: "image/hardware/hw-03.svg", caption: "Soldering work" },
      { src: "image/hardware/hw-04.svg", caption: "PC maintenance" },
    ],
    lists: [
      {
        label: "Skills",
        items: [
          "Basic Computer Hardware Troubleshooting",
          "Microcontroller Operation",
          "Basic Electronics",
          "Networking",
          "Technical Support",
          "Soldering",
          "Data Backup & Recovery",
          "Network Security Configuration",
          "PC Maintenance",
          "Internet of Things (IoT)",
          "Embedded Systems",
        ],
      },
    ],
  },
  {
    id: "programming",
    code: "C",
    icon: "programming-software",
    title: "Programming & Software Development",
    blurb: "I build websites, local-server systems, Android apps, and 2D games. Click a tool to see how I used it.",
    fit: "cover",
    wide: true,
    slides: projects.flatMap((p) =>
      [p.image, ...p.additionalImage].slice(0, 2).map((src) => ({ src, caption: p.jobType }))
    ),
    tools: true,
    lists: [
      {
        label: "Domain knowledge",
        items: [
          "Full-stack Development",
          "Database Management",
          "Algorithms",
          "Software Architecture",
          "Debugging",
          "Version Control (Git)",
          "API Integration",
          "Software Documentation",
          "Software Testing",
          "2D Game Development",
          "Game Design",
          "Prompt Engineering",
          "OOP",
          "Data Structures",
          "Android Development",
        ],
      },
    ],
  },
];
