// Simulated data for the Aula Raíz prototype (CRA "Los Olivos", multinivel).

export type SubjectId = "numeros" | "letras" | "naturaleza" | "arte" | "musica";
export type Tone = "sun" | "leaf" | "sky" | "clay" | "berry";
export type LevelGroup = "infantil" | "primaria-baja" | "primaria-alta";

export interface Subject {
  id: SubjectId;
  name: string; // name for adults / readers
  kidSymbol: string; // pictogram shown to non-readers
  tone: Tone;
}

export const SUBJECTS: Record<SubjectId, Subject> = {
  numeros: { id: "numeros", name: "Matemáticas", kidSymbol: "⭐", tone: "sun" },
  letras: { id: "letras", name: "Lengua", kidSymbol: "🦁", tone: "clay" },
  naturaleza: { id: "naturaleza", name: "Ciencias", kidSymbol: "🌻", tone: "leaf" },
  arte: { id: "arte", name: "Plástica", kidSymbol: "🎨", tone: "berry" },
  musica: { id: "musica", name: "Música", kidSymbol: "🎵", tone: "sky" },
};

export const SUBJECT_LIST = Object.values(SUBJECTS);

export interface Student {
  id: string;
  name: string;
  age: number;
  course: string;
  level: LevelGroup;
  avatar: string;
  tone: Tone;
  tutor: string;
  tutorContact: string;
  completion: number; // % weekly tasks delivered
  accuracy: number; // % right answers
  mainIssue: "comprension" | "no-entrega" | "atencion" | "tiempo" | "ninguno";
  note: string;
  stars: number;
}

export const LEVEL_LABEL: Record<LevelGroup, string> = {
  infantil: "Infantil (3-5 años)",
  "primaria-baja": "Primaria 1º-3º",
  "primaria-alta": "Primaria 4º-6º",
};

export const STUDENTS: Student[] = [
  {
    id: "lucia",
    name: "Lucía",
    age: 3,
    course: "Infantil 3 años",
    level: "infantil",
    avatar: "🐣",
    tone: "sun",
    tutor: "Antonio Ruiz",
    tutorContact: "WhatsApp · 6** *** 412",
    completion: 92,
    accuracy: 81,
    mainIssue: "atencion",
    note: "Se distrae en tareas de más de 3 minutos. Mejor sesiones cortas.",
    stars: 34,
  },
  {
    id: "mateo",
    name: "Mateo",
    age: 4,
    course: "Infantil 4 años",
    level: "infantil",
    avatar: "🦊",
    tone: "clay",
    tutor: "Rocío Gómez",
    tutorContact: "Email · rocio.g***@gmail.com",
    completion: 58,
    accuracy: 88,
    mainIssue: "no-entrega",
    note: "Acierta casi todo cuando lo intenta, pero deja tareas sin empezar.",
    stars: 21,
  },
  {
    id: "nora",
    name: "Nora",
    age: 5,
    course: "Infantil 5 años",
    level: "infantil",
    avatar: "🐞",
    tone: "berry",
    tutor: "Fátima El Amrani",
    tutorContact: "WhatsApp · 6** *** 908",
    completion: 85,
    accuracy: 74,
    mainIssue: "comprension",
    note: "Confunde formas parecidas (cuadrado / rectángulo).",
    stars: 40,
  },
  {
    id: "sara",
    name: "Sara",
    age: 7,
    course: "2º Primaria",
    level: "primaria-baja",
    avatar: "🦋",
    tone: "sky",
    tutor: "Manuel Torres",
    tutorContact: "Email · mtorres***@hotmail.com",
    completion: 96,
    accuracy: 62,
    mainIssue: "comprension",
    note: "Entrega todo, pero confunde decenas y unidades en sumas llevando.",
    stars: 57,
  },
  {
    id: "hugo",
    name: "Hugo",
    age: 10,
    course: "5º Primaria",
    level: "primaria-alta",
    avatar: "🦉",
    tone: "leaf",
    tutor: "Antonio Ruiz",
    tutorContact: "WhatsApp · 6** *** 412",
    completion: 71,
    accuracy: 69,
    mainIssue: "tiempo",
    note: "Ayuda en la finca por las tardes; entrega tarde las tareas largas.",
    stars: 63,
  },
];

export const ISSUE_LABEL: Record<Student["mainIssue"], string> = {
  comprension: "Falta de comprensión",
  "no-entrega": "No hace la tarea",
  atencion: "Atención / distracción",
  tiempo: "Falta de tiempo en casa",
  ninguno: "Sin incidencias",
};

// ---------- Exercises ----------

export type OptionVisual =
  | { kind: "emoji"; value: string }
  | { kind: "color"; value: Tone }
  | { kind: "shape"; value: "circle" | "square" | "triangle" | "star" | "heart" }
  | { kind: "number"; value: number }
  | { kind: "text"; value: string };

export interface Question {
  id: string;
  prompt: string; // read aloud to kids
  scene?: string; // big emoji scene shown above the options
  options: { id: string; visual: OptionVisual }[];
  answer: string;
}

export interface Task {
  id: string;
  studentId: string;
  subject: SubjectId;
  title: string;
  cover: string;
  minutes: number;
  status: "pendiente" | "hecha";
  assignedBy: string;
  assignedAt: string;
  adaptation: string;
  questions: Question[];
}

const opt = (id: string, visual: OptionVisual) => ({ id, visual });

// Library of activities per subject and level. Used for seed data and when the
// teacher sends a new task: the same topic is adapted to each child's level.
export const ACTIVITY_LIBRARY: Record<SubjectId, Record<LevelGroup, Omit<Task, "id" | "studentId" | "status" | "assignedBy" | "assignedAt">>> = {
  numeros: {
    infantil: {
      subject: "numeros",
      title: "Contamos manzanas",
      cover: "🍎",
      minutes: 3,
      adaptation: "Versión con imágenes y audio, sin lectura",
      questions: [
        {
          id: "q1",
          prompt: "¿Cuántas manzanas hay?",
          scene: "🍎🍎🍎",
          options: [opt("a", { kind: "number", value: 2 }), opt("b", { kind: "number", value: 3 }), opt("c", { kind: "number", value: 5 })],
          answer: "b",
        },
        {
          id: "q2",
          prompt: "¿Dónde hay más ovejas?",
          options: [opt("a", { kind: "emoji", value: "🐑" }), opt("b", { kind: "emoji", value: "🐑🐑🐑🐑" }), opt("c", { kind: "emoji", value: "🐑🐑" })],
          answer: "b",
        },
        {
          id: "q3",
          prompt: "¿Cuántos pollitos ves?",
          scene: "🐥🐥",
          options: [opt("a", { kind: "number", value: 1 }), opt("b", { kind: "number", value: 4 }), opt("c", { kind: "number", value: 2 })],
          answer: "c",
        },
      ],
    },
    "primaria-baja": {
      subject: "numeros",
      title: "Sumas llevando en la huerta",
      cover: "🥕",
      minutes: 10,
      adaptation: "Problemas cortos con apoyo visual de decenas",
      questions: [
        {
          id: "q1",
          prompt: "En la huerta hay 27 zanahorias y recogemos 15 más. ¿Cuántas hay?",
          options: [opt("a", { kind: "text", value: "32" }), opt("b", { kind: "text", value: "42" }), opt("c", { kind: "text", value: "312" })],
          answer: "b",
        },
        {
          id: "q2",
          prompt: "¿Cuántas decenas tiene el número 46?",
          options: [opt("a", { kind: "text", value: "4" }), opt("b", { kind: "text", value: "6" }), opt("c", { kind: "text", value: "46" })],
          answer: "a",
        },
        {
          id: "q3",
          prompt: "38 + 4 = ?",
          options: [opt("a", { kind: "text", value: "312" }), opt("b", { kind: "text", value: "41" }), opt("c", { kind: "text", value: "42" })],
          answer: "c",
        },
      ],
    },
    "primaria-alta": {
      subject: "numeros",
      title: "Fracciones en la finca",
      cover: "🧀",
      minutes: 15,
      adaptation: "Problemas contextualizados con fracciones equivalentes",
      questions: [
        {
          id: "q1",
          prompt: "Un campo se divide en 4 parcelas iguales y se siembran 3. ¿Qué fracción está sembrada?",
          options: [opt("a", { kind: "text", value: "3/4" }), opt("b", { kind: "text", value: "4/3" }), opt("c", { kind: "text", value: "1/3" })],
          answer: "a",
        },
        {
          id: "q2",
          prompt: "¿Qué fracción es igual a 1/2?",
          options: [opt("a", { kind: "text", value: "2/3" }), opt("b", { kind: "text", value: "3/6" }), opt("c", { kind: "text", value: "1/4" })],
          answer: "b",
        },
        {
          id: "q3",
          prompt: "Un queso pesa 2 kg. ¿Cuánto pesa 1/4 del queso?",
          options: [opt("a", { kind: "text", value: "250 g" }), opt("b", { kind: "text", value: "500 g" }), opt("c", { kind: "text", value: "1 kg" })],
          answer: "b",
        },
      ],
    },
  },
  letras: {
    infantil: {
      subject: "letras",
      title: "¿Quién hace ese ruido?",
      cover: "🐄",
      minutes: 3,
      adaptation: "Sonidos de animales con audio",
      questions: [
        {
          id: "q1",
          prompt: "¿Quién hace muuu?",
          options: [opt("a", { kind: "emoji", value: "🐓" }), opt("b", { kind: "emoji", value: "🐄" }), opt("c", { kind: "emoji", value: "🐑" })],
          answer: "b",
        },
        {
          id: "q2",
          prompt: "¿Quién hace kikirikí?",
          options: [opt("a", { kind: "emoji", value: "🐓" }), opt("b", { kind: "emoji", value: "🐷" }), opt("c", { kind: "emoji", value: "🐶" })],
          answer: "a",
        },
        {
          id: "q3",
          prompt: "¿Qué empieza por la letra O? ¡Oso!",
          options: [opt("a", { kind: "emoji", value: "🐸" }), opt("b", { kind: "emoji", value: "🐻" }), opt("c", { kind: "emoji", value: "🐟" })],
          answer: "b",
        },
      ],
    },
    "primaria-baja": {
      subject: "letras",
      title: "Palabras del campo",
      cover: "🌾",
      minutes: 8,
      adaptation: "Lectura de palabras cortas con imagen de apoyo",
      questions: [
        {
          id: "q1",
          prompt: "¿Cuál está bien escrita?",
          options: [opt("a", { kind: "text", value: "tractor" }), opt("b", { kind: "text", value: "trastor" }), opt("c", { kind: "text", value: "tactor" })],
          answer: "a",
        },
        {
          id: "q2",
          prompt: "¿Cuál es un animal?",
          options: [opt("a", { kind: "text", value: "olivo" }), opt("b", { kind: "text", value: "cabra" }), opt("c", { kind: "text", value: "trigo" })],
          answer: "b",
        },
        {
          id: "q3",
          prompt: "Completa: La vaca da ...",
          options: [opt("a", { kind: "text", value: "huevos" }), opt("b", { kind: "text", value: "lana" }), opt("c", { kind: "text", value: "leche" })],
          answer: "c",
        },
      ],
    },
    "primaria-alta": {
      subject: "letras",
      title: "Sujeto y predicado",
      cover: "📜",
      minutes: 12,
      adaptation: "Análisis de oraciones sobre la vida en el pueblo",
      questions: [
        {
          id: "q1",
          prompt: "En «Mi abuelo poda los olivos», ¿cuál es el sujeto?",
          options: [opt("a", { kind: "text", value: "los olivos" }), opt("b", { kind: "text", value: "Mi abuelo" }), opt("c", { kind: "text", value: "poda" })],
          answer: "b",
        },
        {
          id: "q2",
          prompt: "¿Qué palabra es un verbo?",
          options: [opt("a", { kind: "text", value: "cosechar" }), opt("b", { kind: "text", value: "cosecha" }), opt("c", { kind: "text", value: "cosechero" })],
          answer: "a",
        },
        {
          id: "q3",
          prompt: "¿Qué oración es interrogativa?",
          options: [opt("a", { kind: "text", value: "¡Qué calor!" }), opt("b", { kind: "text", value: "Llueve mucho." }), opt("c", { kind: "text", value: "¿Vendrás a la feria?" })],
          answer: "c",
        },
      ],
    },
  },
  naturaleza: {
    infantil: {
      subject: "naturaleza",
      title: "¿De qué color es?",
      cover: "🌈",
      minutes: 3,
      adaptation: "Colores con objetos cotidianos",
      questions: [
        {
          id: "q1",
          prompt: "Toca el color del sol",
          scene: "☀️",
          options: [opt("a", { kind: "color", value: "sky" }), opt("b", { kind: "color", value: "sun" }), opt("c", { kind: "color", value: "berry" })],
          answer: "b",
        },
        {
          id: "q2",
          prompt: "Toca el color de la hierba",
          scene: "🌿",
          options: [opt("a", { kind: "color", value: "leaf" }), opt("b", { kind: "color", value: "clay" }), opt("c", { kind: "color", value: "sky" })],
          answer: "a",
        },
        {
          id: "q3",
          prompt: "Toca el color del cielo",
          scene: "☁️",
          options: [opt("a", { kind: "color", value: "berry" }), opt("b", { kind: "color", value: "sun" }), opt("c", { kind: "color", value: "sky" })],
          answer: "c",
        },
      ],
    },
    "primaria-baja": {
      subject: "naturaleza",
      title: "Las partes de la planta",
      cover: "🌱",
      minutes: 8,
      adaptation: "Identificación con dibujos",
      questions: [
        {
          id: "q1",
          prompt: "¿Qué parte de la planta bebe el agua de la tierra?",
          options: [opt("a", { kind: "text", value: "La raíz" }), opt("b", { kind: "text", value: "La flor" }), opt("c", { kind: "text", value: "La hoja" })],
          answer: "a",
        },
        {
          id: "q2",
          prompt: "¿Qué necesita una planta para crecer?",
          options: [opt("a", { kind: "text", value: "Solo oscuridad" }), opt("b", { kind: "text", value: "Agua, luz y tierra" }), opt("c", { kind: "text", value: "Sal" })],
          answer: "b",
        },
        {
          id: "q3",
          prompt: "¿De dónde sale una planta nueva?",
          options: [opt("a", { kind: "text", value: "De una piedra" }), opt("b", { kind: "text", value: "De una nube" }), opt("c", { kind: "text", value: "De una semilla" })],
          answer: "c",
        },
      ],
    },
    "primaria-alta": {
      subject: "naturaleza",
      title: "Los cambios de estado del agua",
      cover: "💧",
      minutes: 15,
      adaptation: "Ejercicios de física con ejemplos del día a día",
      questions: [
        {
          id: "q1",
          prompt: "Un charco desaparece al sol. ¿Cómo se llama ese cambio?",
          options: [opt("a", { kind: "text", value: "Evaporación" }), opt("b", { kind: "text", value: "Solidificación" }), opt("c", { kind: "text", value: "Fusión" })],
          answer: "a",
        },
        {
          id: "q2",
          prompt: "El agua del bebedero se congela en invierno. Pasa de líquido a...",
          options: [opt("a", { kind: "text", value: "gas" }), opt("b", { kind: "text", value: "sólido" }), opt("c", { kind: "text", value: "plasma" })],
          answer: "b",
        },
        {
          id: "q3",
          prompt: "El rocío de la mañana en la hierba es un ejemplo de...",
          options: [opt("a", { kind: "text", value: "Fusión" }), opt("b", { kind: "text", value: "Evaporación" }), opt("c", { kind: "text", value: "Condensación" })],
          answer: "c",
        },
      ],
    },
  },
  arte: {
    infantil: {
      subject: "arte",
      title: "Buscamos formas",
      cover: "🔺",
      minutes: 3,
      adaptation: "Formas grandes y de colores",
      questions: [
        {
          id: "q1",
          prompt: "Encuentra el círculo",
          options: [opt("a", { kind: "shape", value: "triangle" }), opt("b", { kind: "shape", value: "circle" }), opt("c", { kind: "shape", value: "square" })],
          answer: "b",
        },
        {
          id: "q2",
          prompt: "Encuentra el corazón",
          options: [opt("a", { kind: "shape", value: "heart" }), opt("b", { kind: "shape", value: "star" }), opt("c", { kind: "shape", value: "circle" })],
          answer: "a",
        },
        {
          id: "q3",
          prompt: "Encuentra el triángulo",
          options: [opt("a", { kind: "shape", value: "square" }), opt("b", { kind: "shape", value: "star" }), opt("c", { kind: "shape", value: "triangle" })],
          answer: "c",
        },
      ],
    },
    "primaria-baja": {
      subject: "arte",
      title: "Mezclamos colores",
      cover: "🖌️",
      minutes: 6,
      adaptation: "Mezclas primarias",
      questions: [
        {
          id: "q1",
          prompt: "Amarillo + azul = ?",
          options: [opt("a", { kind: "color", value: "leaf" }), opt("b", { kind: "color", value: "berry" }), opt("c", { kind: "color", value: "clay" })],
          answer: "a",
        },
        {
          id: "q2",
          prompt: "Rojo + amarillo = ?",
          options: [opt("a", { kind: "color", value: "sky" }), opt("b", { kind: "color", value: "clay" }), opt("c", { kind: "color", value: "leaf" })],
          answer: "b",
        },
      ],
    },
    "primaria-alta": {
      subject: "arte",
      title: "Simetría en la naturaleza",
      cover: "🦋",
      minutes: 10,
      adaptation: "Ejes de simetría",
      questions: [
        {
          id: "q1",
          prompt: "¿Cuál tiene simetría?",
          options: [opt("a", { kind: "emoji", value: "🦋" }), opt("b", { kind: "emoji", value: "🌪️" }), opt("c", { kind: "emoji", value: "🪨" })],
          answer: "a",
        },
      ],
    },
  },
  musica: {
    infantil: {
      subject: "musica",
      title: "¿Qué suena?",
      cover: "🥁",
      minutes: 3,
      adaptation: "Instrumentos con imagen grande",
      questions: [
        {
          id: "q1",
          prompt: "Toca el tambor",
          options: [opt("a", { kind: "emoji", value: "🎺" }), opt("b", { kind: "emoji", value: "🥁" }), opt("c", { kind: "emoji", value: "🎸" })],
          answer: "b",
        },
        {
          id: "q2",
          prompt: "Toca la guitarra",
          options: [opt("a", { kind: "emoji", value: "🎸" }), opt("b", { kind: "emoji", value: "🎹" }), opt("c", { kind: "emoji", value: "🥁" })],
          answer: "a",
        },
      ],
    },
    "primaria-baja": {
      subject: "musica",
      title: "Instrumentos de la banda",
      cover: "🎺",
      minutes: 6,
      adaptation: "Familias de instrumentos",
      questions: [
        {
          id: "q1",
          prompt: "¿Cuál es de viento?",
          options: [opt("a", { kind: "emoji", value: "🎺" }), opt("b", { kind: "emoji", value: "🥁" }), opt("c", { kind: "emoji", value: "🎻" })],
          answer: "a",
        },
      ],
    },
    "primaria-alta": {
      subject: "musica",
      title: "Figuras musicales",
      cover: "🎼",
      minutes: 10,
      adaptation: "Duración de las notas",
      questions: [
        {
          id: "q1",
          prompt: "¿Cuántas negras caben en una blanca?",
          options: [opt("a", { kind: "text", value: "1" }), opt("b", { kind: "text", value: "2" }), opt("c", { kind: "text", value: "4" })],
          answer: "b",
        },
      ],
    },
  },
};

export function buildTask(studentId: string, subject: SubjectId, opts: { id: string; assignedAt: string; status?: Task["status"] }): Task {
  const student = STUDENTS.find((s) => s.id === studentId);
  if (!student) throw new Error(`Unknown student ${studentId}`);
  const base = ACTIVITY_LIBRARY[subject][student.level];
  return {
    ...base,
    id: opts.id,
    studentId,
    status: opts.status ?? "pendiente",
    assignedBy: "Maestra Carmen",
    assignedAt: opts.assignedAt,
  };
}

const seed: [string, SubjectId, Task["status"]][] = [
  ["lucia", "numeros", "pendiente"],
  ["lucia", "naturaleza", "pendiente"],
  ["lucia", "letras", "hecha"],
  ["lucia", "arte", "pendiente"],
  ["mateo", "letras", "pendiente"],
  ["mateo", "numeros", "pendiente"],
  ["mateo", "musica", "pendiente"],
  ["nora", "arte", "pendiente"],
  ["nora", "numeros", "hecha"],
  ["nora", "musica", "pendiente"],
  ["sara", "numeros", "pendiente"],
  ["sara", "letras", "hecha"],
  ["sara", "naturaleza", "pendiente"],
  ["hugo", "naturaleza", "pendiente"],
  ["hugo", "numeros", "pendiente"],
  ["hugo", "letras", "hecha"],
];

export const SEED_TASKS: Task[] = seed.map(([s, subj, status], i) =>
  buildTask(s, subj, { id: `t${i + 1}`, assignedAt: "Lun 2 nov", status }),
);

// ---------- Teacher analytics ----------

export const WEEKLY_ACTIVITY = [
  { day: "Lun", entregadas: 14, pendientes: 4, aciertos: 72 },
  { day: "Mar", entregadas: 16, pendientes: 3, aciertos: 76 },
  { day: "Mié", entregadas: 11, pendientes: 7, aciertos: 68 },
  { day: "Jue", entregadas: 17, pendientes: 2, aciertos: 81 },
  { day: "Vie", entregadas: 13, pendientes: 5, aciertos: 79 },
];

export const ERROR_CAUSES = [
  { cause: "Falta de comprensión", value: 38, key: "comprension" },
  { cause: "No hace la tarea", value: 24, key: "noentrega" },
  { cause: "Atención", value: 18, key: "atencion" },
  { cause: "Falta de tiempo", value: 12, key: "tiempo" },
  { cause: "Otros", value: 8, key: "otros" },
];

export const ACCURACY_TREND = [
  { week: "S-4", infantil: 70, primaria: 61 },
  { week: "S-3", infantil: 74, primaria: 64 },
  { week: "S-2", infantil: 73, primaria: 66 },
  { week: "S-1", infantil: 79, primaria: 65 },
  { week: "Esta", infantil: 81, primaria: 70 },
];

export const SUBJECT_STRUGGLES = [
  { subject: "Matemáticas", fallos: 31 },
  { subject: "Ciencias", fallos: 22 },
  { subject: "Lengua", fallos: 14 },
  { subject: "Plástica", fallos: 6 },
  { subject: "Música", fallos: 4 },
];

export const INSIGHTS = [
  {
    studentId: "sara",
    title: "Sara confunde decenas y unidades",
    detail: "Entrega todo, pero falla el 58% de las sumas llevando. Es comprensión, no esfuerzo.",
    action: "Enviar refuerzo visual con regletas",
    tone: "sky" as Tone,
  },
  {
    studentId: "mateo",
    title: "Mateo no empieza las tareas de Lengua",
    detail: "Cuando las hace acierta el 88%. Probable falta de motivación, no de capacidad.",
    action: "Activar recompensa de estrellas dobles",
    tone: "clay" as Tone,
  },
  {
    studentId: "hugo",
    title: "Hugo entrega tarde las tareas largas",
    detail: "Ayuda en la finca por las tardes. Mejor dividir en bloques de 10 minutos.",
    action: "Dividir tareas en bloques cortos",
    tone: "leaf" as Tone,
  },
];

// ---------- Textbook licenses ----------

export interface BookLicense {
  id: string;
  title: string;
  publisher: string;
  subject: SubjectId;
  levels: string;
  total: number;
  assigned: string[];
  expires: string;
  cover: string;
}

export const BOOK_LICENSES: BookLicense[] = [
  { id: "b1", title: "Pequeños Exploradores", publisher: "Editorial Alba", subject: "naturaleza", levels: "Infantil 3-5", total: 5, assigned: ["lucia", "mateo", "nora"], expires: "30 jun 2027", cover: "🌻" },
  { id: "b2", title: "Matemáticas Vivas 2", publisher: "Ediciones Sol", subject: "numeros", levels: "2º Primaria", total: 3, assigned: ["sara"], expires: "30 jun 2027", cover: "⭐" },
  { id: "b3", title: "Matemáticas Vivas 5", publisher: "Ediciones Sol", subject: "numeros", levels: "5º Primaria", total: 3, assigned: ["hugo"], expires: "30 jun 2027", cover: "📐" },
  { id: "b4", title: "Letras al Viento", publisher: "Editorial Alba", subject: "letras", levels: "Primaria 1º-6º", total: 4, assigned: ["sara", "hugo"], expires: "15 dic 2026", cover: "🦁" },
  { id: "b5", title: "Ciencias del Entorno 5", publisher: "Grupo Raíces", subject: "naturaleza", levels: "5º Primaria", total: 2, assigned: [], expires: "30 jun 2027", cover: "💧" },
];

// ---------- Family mode ----------

export const FAMILY = {
  tutor: "Antonio",
  fullName: "Antonio Ruiz",
  children: ["hugo", "lucia"],
};

export const FAMILY_WEEK: Record<string, { day: string; value: number }[]> = {
  hugo: [
    { day: "L", value: 2 },
    { day: "M", value: 1 },
    { day: "X", value: 0 },
    { day: "J", value: 3 },
    { day: "V", value: 2 },
  ],
  lucia: [
    { day: "L", value: 3 },
    { day: "M", value: 2 },
    { day: "X", value: 3 },
    { day: "J", value: 2 },
    { day: "V", value: 3 },
  ],
};

export const FAMILY_ALERTS: Record<string, { level: "ok" | "warn" | "info"; icon: string; text: string }[]> = {
  hugo: [
    { level: "warn", icon: "💧", text: "Le cuesta «los cambios de estado del agua». Pregúntale a Raíz cómo ayudarle." },
    { level: "info", icon: "⏰", text: "Tiene una tarea de fracciones para el jueves (15 min)." },
    { level: "ok", icon: "🏅", text: "¡Ha sacado 3 de 3 en Lengua esta semana!" },
  ],
  lucia: [
    { level: "ok", icon: "⭐", text: "Ha ganado 6 estrellas esta semana. ¡Felicítala!" },
    { level: "info", icon: "🍎", text: "Le toca contar manzanas. Podéis contar cosas en casa." },
  ],
};
