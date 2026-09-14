/*
  Icon system — Schematic set
  Every glyph shares one grammar: 24x24 grid, currentColor stroke,
  1.6px weight, round joins. No brand marks are reproduced; each icon is an
  original line-drawing built for this set so the whole grid reads as one
  family instead of a pile of mismatched third-party logos.
*/

const wrap = (key, inner) =>
  `<svg class="tool-glyph tool-glyph--${key}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;

export const tools = {
  html: wrap("html", `<path d="M9 4 4 12l5 8"/><path d="M15 4l5 8-5 8"/>`),
  css: wrap("css", `<path d="M9 4 4 12l5 8"/><path d="M15 4l5 8-5 8"/><rect x="10.5" y="10.5" width="3" height="3"/>`),
  javascript: wrap("javascript", `<path d="M9 4 4 12l5 8"/><path d="M15 4l5 8-5 8"/><circle cx="12" cy="12" r="1.4"/>`),
  php: wrap("php", `<path d="M9 4 4 12l5 8"/><path d="M15 4l5 8-5 8"/><path d="M9.5 12h5"/>`),
  python: wrap("python", `<circle cx="9.5" cy="11" r="4"/><circle cx="14.5" cy="13" r="4"/>`),
  java: wrap("java", `<path d="M7 10h10v6a5 5 0 0 1-5 5 5 5 0 0 1-5-5v-6Z"/><path d="M9.5 6.5C9 8 9.5 9 10.5 9.6M14.5 6.5C14 8 14.5 9 15.5 9.6"/>`),
  csharp: wrap("csharp", `<path d="M9 4 4 12l5 8"/><path d="M15 4l5 8-5 8"/><path d="M9.5 10.2h3M9.5 13.8h3M10.7 8.5l-.8 6.6M13.3 8.5l-.8 6.6"/>`),
  cplus: wrap("cplus", `<path d="M9 4 4 12l5 8"/><path d="M15 4l5 8-5 8"/><path d="M9.3 10.3v3.4M7.6 12h3.4M14 12h3.4M15.7 10.3v3.4"/>`),
  git: wrap("git", `<circle cx="12" cy="5.5" r="1.8"/><circle cx="7" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/><path d="M12 7.3v4a4 4 0 0 1-4 4v1.4M12 11.3v3a4 4 0 0 0 4 4v.2"/>`),
  github: wrap("github", `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="1.6"/><path d="M12 4v6.4M12 13.6V20M4 12h6.4M13.6 12H20"/>`),
  mysql: wrap("mysql", `<ellipse cx="12" cy="6" rx="6.5" ry="2.4"/><path d="M5.5 6v12c0 1.3 2.9 2.4 6.5 2.4s6.5-1.1 6.5-2.4V6"/><path d="M5.5 12c0 1.3 2.9 2.4 6.5 2.4s6.5-1.1 6.5-2.4"/>`),
  nodejs: wrap("nodejs", `<path d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z"/><circle cx="12" cy="12" r="1.6"/>`),
  vscode: wrap("vscode", `<rect x="3.5" y="5" width="17" height="14" rx="1.4"/><path d="M7 9.5h6M7 12h9M7 14.5h4.5"/>`),
  xampp: wrap("xampp", `<rect x="4" y="4.5" width="16" height="4.6" rx="1"/><rect x="4" y="10.7" width="16" height="4.6" rx="1"/><rect x="4" y="16.9" width="16" height="4.6" rx="1"/><path d="M7 6.8h.01M7 13h.01M7 19.2h.01"/>`),
  photoshop: wrap("photoshop", `<path d="M12 4 5 8v8l7 4 7-4V8l-7-4Z"/><path d="M5 8l7 4 7-4M12 12v8"/>`),
  krita: wrap("krita", `<path d="M16.5 3.5 20.5 7.5 9 19 4.5 20.5 6 16 16.5 3.5Z"/><path d="M14.5 5.5l4 4"/>`),
  canva: wrap("canva", `<circle cx="12" cy="12" r="8"/><path d="M12 8a4 4 0 1 0 3.6 5.8"/>`),
  unity: wrap("unity", `<path d="M12 3.5 19.5 8v8L12 20.5 4.5 16V8L12 3.5Z"/><path d="M12 3.5V12M4.5 8 12 12M19.5 8 12 12M12 12v8.5M4.5 16 12 12M19.5 16 12 12"/>`),
  androidstudio: wrap("androidstudio", `<rect x="7" y="3.5" width="10" height="17" rx="2"/><path d="M9.5 6.5h5M9.5 17.5h5"/>`),
  msoffice: wrap("msoffice", `<rect x="4" y="4" width="16" height="16" rx="1.6"/><path d="M4 9.5h16M9.5 9.5V20"/>`),
};

// key must match Object.keys(tools) above, lowercase.
export const toolsMeta = [
  { key: "java", label: "Java", level: 80, description: "The language that got me hooked on programming. Readable syntax made it an easy first step, and I worked through 150 practice problems on w3resource.com to build fluency." },
  { key: "css", label: "CSS", level: 90, description: "Layout, animation, and responsive design are where I spend most of my styling time. A sample of that work is on icodethis.com/Bimo_Bimbo." },
  { key: "python", label: "Python", level: 60, description: "Picked up in a week of seminars for my first programming competition. My Java background made the syntax and logic click fast." },
  { key: "html", label: "HTML", level: 90, description: "The structural backbone of every site I build — semantic markup paired closely with CSS for layout and styling." },
  { key: "javascript", label: "JavaScript", level: 90, description: "My most-used language across my thesis, this portfolio, and academic projects — both frontend interactivity and Node.js backends." },
  { key: "php", label: "PHP", level: 50, description: "Learned in my Software Development course, mainly for connecting sites to databases. Used it on real CRUD systems and server-side scripting." },
  { key: "csharp", label: "C#", level: 80, description: "My go-to for game development in Unity — building interactive mechanics and small playable systems." },
  { key: "cplus", label: "C++", level: 50, description: "Studied alongside Java in Object-Oriented Programming. Linked lists and other data structures here sharpened my grasp of memory management." },
  { key: "git", label: "Git", level: 90, description: "Used through my thesis for collaborative version control, and for every personal and academic repository since." },
  { key: "github", label: "GitHub", level: 90, description: "Where all my major projects live, organized and public. github.com/Mr-Marian0" },
  { key: "mysql", label: "MySQL", level: 90, description: "Storage and retrieval layer for several academic and thesis projects — essential for dynamic, data-driven sites." },
  { key: "nodejs", label: "Node.js", level: 90, description: "Core to my thesis system — serving static files, detecting RFID scanners, and running backend logic." },
  { key: "photoshop", label: "Photoshop", level: 90, description: "Learned in high school; photo editing and digital art here sparked my broader interest in design." },
  { key: "xampp", label: "XAMPP", level: 90, description: "Local MySQL and Apache environment I relied on during OJT and thesis work to test and debug before deploying." },
  { key: "unity", label: "Unity", level: 80, description: "Built my first game, 'I'm Not Insane,' here — a good introduction to real-time systems and C# scripting." },
  { key: "androidstudio", label: "Android Studio", level: 70, description: "Used in college for login flows, responsive transitions, and other mobile-focused coursework." },
  { key: "msoffice", label: "MS Office", level: 80, description: "Comfortable across Word, Excel, PowerPoint, and Copilot for reporting and documentation." },
  { key: "vscode", label: "VS Code", level: 90, description: "My primary editor for every project — extensions and debugging tools I rely on daily." },
  { key: "krita", label: "Krita", level: 90, description: "My tool for art — editing images and building out characters and textures for my game." },
  { key: "canva", label: "Canva", level: 60, description: "Used for reports and presentations, including client-facing work as a real-estate virtual assistant." },
];

export const softSkills = [
  {
    name: "Communication",
    svg: wrap("communication", `<path d="M4 5.5h16v10H9l-4 4v-4H4v-10Z"/><path d="M8 9.5h8M8 12.5h5"/>`),
    description: "I keep updates plain and specific — what changed, what's next, what I need from someone else.",
    level: 80,
  },
  {
    name: "Teamwork",
    svg: wrap("teamwork", `<circle cx="9" cy="10" r="3"/><circle cx="16" cy="12" r="2.4"/><path d="M4.5 19c.4-2.6 2.2-4.2 4.5-4.2s4 1.6 4.5 4.2M13.5 19c.3-1.9 1.6-3.2 3.4-3.4"/>`),
    description: "Thesis work meant syncing constantly with teammates through Git — I like building things that depend on more than one person's work fitting together.",
    level: 85,
  },
  {
    name: "Creativity",
    svg: wrap("creativity", `<path d="M12 3.5a5.5 5.5 0 0 0-3 10.1c.6.4 1 1 1 1.7v1.2h4v-1.2c0-.7.4-1.3 1-1.7A5.5 5.5 0 0 0 12 3.5Z"/><path d="M10 19.5h4M10.7 21.5h2.6"/>`),
    description: "Comfortable moving between code and design — Krita and Photoshop work feed directly into how I build interfaces.",
    level: 90,
  },
  {
    name: "Decision-making",
    svg: wrap("decisions", `<path d="M12 4v6"/><path d="M12 10 6 20M12 10l6 10"/><circle cx="6" cy="20.5" r="1.4"/><circle cx="18" cy="20.5" r="1.4"/>`),
    description: "I weigh trade-offs against constraints — time, tooling, what the project actually needs — rather than defaulting to the familiar option.",
    level: 75,
  },
  {
    name: "Adaptability",
    svg: wrap("adaptability", `<rect x="4" y="4" width="8" height="8" rx="1.4"/><rect x="12" y="12" width="8" height="8" rx="1.4"/><path d="M9 12v3M12 9h3"/>`),
    description: "Every project on this page used a different stack — mapping tools, RFID hardware, a game engine. I pick up what the problem calls for.",
    level: 85,
  },
  {
    name: "Continuous improvement",
    svg: wrap("improvement", `<path d="M4 16 9.5 10 13 13l6.5-7"/><path d="M15.5 6h4v4"/>`),
    description: "When something goes wrong, I trace it back to a skill gap or a process gap and work on that specifically, rather than just patching the symptom.",
    level: 90,
  },
];
