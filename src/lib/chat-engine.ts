// Simulated "Raíz" family assistant. Replies are chosen by topic keywords and
// always reference the child's real assigned tasks, written for parents
// without academic training (rural, practical examples, step by step).

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

export const CHAT_HISTORY: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    time: "18:02",
    text: "¡Hola, Antonio! Soy **Raíz**. Conozco las tareas que la maestra Carmen ha mandado a Hugo y a Lucía. Pregúntame lo que quieras, sin vergüenza: te lo explico paso a paso y con ejemplos de casa.",
  },
  {
    id: "m2",
    role: "user",
    time: "18:05",
    text: "Hugo tiene deberes de ciencias del agua que se evapora y no sé ni por dónde empezar. Yo he trabajado toda la vida en el campo y de física no sé nada.",
  },
  {
    id: "m3",
    role: "assistant",
    time: "18:05",
    text: "Pues sabes más de lo que crees, porque lo ves cada día en el campo. La tarea de Hugo es **«Los cambios de estado del agua»**. La idea es que el agua puede estar de 3 formas: **sólida** (hielo), **líquida** (agua) y **gas** (vapor).\n\n1. **Empieza con lo que conoce:** pregúntale qué pasa con el agua del bebedero de los animales en una helada. Se hace hielo: eso es pasar de líquido a sólido (**solidificación**).\n2. **El charco que desaparece:** cuando sale el sol, el charco del camino se seca. El agua no se ha ido «a ningún sitio», se ha convertido en vapor que sube al aire. Eso es **evaporación**.\n3. **El rocío de la mañana:** el vapor del aire, al enfriarse de noche, vuelve a ser gotitas en la hierba. Eso es **condensación**.\n4. **Hacedlo juntos:** poned un cubito de hielo en un plato al sol y miradlo cada 10 minutos. Que Hugo te cuente lo que ve.\n\n💡 Truco: no tienes que saber la respuesta. Pregúntale «¿y tú qué crees que pasa?» y deja que él lo explique. Explicar es la mejor forma de aprender.",
  },
  {
    id: "m4",
    role: "user",
    time: "18:09",
    text: "¿Y cómo sé si lo ha entendido de verdad?",
  },
  {
    id: "m5",
    role: "assistant",
    time: "18:09",
    text: "Hazle estas **3 preguntas** mientras cenáis. Te pongo la respuesta buena para que puedas comprobarla:\n\n1. «Si pongo una cazuela a hervir, ¿qué es el humo blanco que sale?» → **Vapor de agua** (evaporación).\n2. «¿Por qué se moja por fuera un vaso de agua muy fría?» → El vapor del aire se enfría al tocar el vaso y se hace gotitas: **condensación**.\n3. «¿Qué le pasa a la nieve de la sierra en primavera?» → Se derrite y pasa a líquido: **fusión**.\n\nSi acierta 2 de 3, va bien. Si duda, no pasa nada: la maestra ya sabe que este tema cuesta y le mandará un refuerzo.",
  },
];

export const SUGGESTIONS = [
  "¿Cómo le explico las fracciones?",
  "No quiere hacer los deberes",
  "¿Cómo ayudo a Lucía a contar?",
  "¿Qué es la fotosíntesis?",
];

const RESPONSES: { keys: string[]; reply: string }[] = [
  {
    keys: ["fraccion", "fracción", "fracciones", "quebrado", "mitad", "cuarto"],
    reply:
      "La tarea de Hugo para el jueves es **«Fracciones en la finca»**. Una fracción es solo **repartir algo en partes iguales**.\n\n1. **Coge una tortilla o un queso** y córtalo en 4 trozos iguales. Cada trozo es **1/4** (uno de cuatro).\n2. **El número de abajo** dice en cuántas partes has cortado. **El de arriba**, cuántas partes coges. Si os coméis 3 trozos: **3/4**.\n3. **Con el campo:** si una tierra tiene 4 parcelas iguales y sembráis 3, está sembrada **3/4** de la tierra. Es justo la primera pregunta de su tarea.\n4. **Mitades iguales:** corta una naranja en 2 (1/2) y otra en 6. Si coges 3 de 6, comes lo mismo que media naranja: **3/6 = 1/2**.\n\n💡 Deja que él corte y reparta. Tocar las cosas ayuda mucho más que mirar el libro.",
  },
  {
    keys: ["no quiere", "ganas", "motiv", "pereza", "se niega", "llora", "cansado", "no hace"],
    reply:
      "Es muy normal, sobre todo después de un día largo. Algunas ideas que funcionan:\n\n1. **Bloques cortos:** la maestra ha dividido las tareas de Hugo en partes de 10 minutos. Haced una parte, descanso, y otra.\n2. **Mismo sitio y hora:** por ejemplo, después de merendar en la mesa de la cocina. La rutina quita discusiones.\n3. **Tú también «trabajas» a su lado:** mientras él hace la tarea, tú lees o apuntas cosas de la finca. Se siente acompañado.\n4. **Celebra el esfuerzo, no la nota:** «Qué bien que lo has intentado» motiva más que «muy bien, un 10».\n\nSi sigue costando, pulsa en **avisar a la maestra** y lo hablaréis juntos.",
  },
  {
    keys: ["lucía", "lucia", "contar", "números", "numeros", "manzana", "pequeña"],
    reply:
      "Lucía tiene 3 años y su tarea es **«Contamos manzanas»** (3 minutos, solo con dibujos y voz). Para reforzar en casa:\n\n1. **Contad cosas de verdad:** huevos del gallinero, zapatos en la puerta, ovejas en el corral. Tocad cada cosa al decir el número.\n2. **Hasta 5 es suficiente** a su edad. No hace falta que escriba los números.\n3. **Más y menos:** pon 2 galletas en un plato y 4 en otro. «¿Dónde hay más?».\n4. **Juego de dedos:** «enséñame 3 dedos». Le encanta y aprende sin darse cuenta.\n\n⭐ Cuando termine la tarea en la tablet le saldrán estrellas y confeti. ¡Pídele que te las enseñe!",
  },
  {
    keys: ["fotosíntesis", "fotosintesis", "planta", "plantas", "hojas"],
    reply:
      "La **fotosíntesis** es cómo **las plantas fabrican su comida**. Tú lo sabes de sobra aunque no lo llames así:\n\n1. **La raíz bebe** el agua de la tierra (por eso regáis).\n2. **Las hojas toman la luz del sol** y el aire. Por eso una planta a la sombra crece peor.\n3. **Con agua + luz + aire** la planta fabrica azúcar, que es su alimento, y suelta **oxígeno**, el aire que respiramos.\n4. **Experimento:** tapad una hoja de una planta con papel de aluminio una semana. Se pondrá más pálida porque no ha podido «comer» luz.\n\n💡 Pregúntale: «¿Por qué crees que el trigo necesita sol?». Si dice que es para hacer su comida, ¡lo ha entendido!",
  },
  {
    keys: ["agua", "evapora", "hielo", "vapor", "estado", "condens", "física", "fisica"],
    reply:
      "Repasemos la tarea **«Los cambios de estado del agua»** con un ejemplo de la cocina:\n\n1. **Hielo → agua (fusión):** saca un cubito del congelador. Al rato es agua.\n2. **Agua → vapor (evaporación):** pon agua a hervir. El humo blanco es vapor.\n3. **Vapor → agua (condensación):** pon una tapa fría encima de la olla. Se llena de gotitas.\n4. **Agua → hielo (solidificación):** mete agua en el congelador.\n\nCon esos 4 pasos Hugo tiene **toda la tarea** entendida. Puede dibujar un círculo con las 4 flechas.",
  },
  {
    keys: ["suma", "llevando", "decena", "unidades", "restar", "resta"],
    reply:
      "Para las **sumas llevando** lo mejor es usar cosas que se puedan agrupar:\n\n1. **Haced paquetes de 10** con palillos o garbanzos, atados con una goma. Cada paquete es **una decena**.\n2. **Los sueltos son unidades.** 27 = 2 paquetes y 7 sueltos.\n3. **Al sumar,** si juntas más de 10 sueltos, ¡haz un paquete nuevo! Eso es «llevarse una».\n\n💡 Es justo lo que le cuesta a Sara en su tarea de la huerta.",
  },
];

const FALLBACK =
  "Buena pregunta. Te lo explico con calma:\n\n1. **Lee con tu hijo el enunciado en voz alta**, despacio. Muchas veces el problema es entender qué se pide.\n2. **Busca un ejemplo de casa o del campo** que se parezca. Yo te puedo ayudar a encontrarlo si me dices el tema.\n3. **Pregúntale qué cree él** antes de darle la respuesta.\n\nAhora mismo Hugo tiene **«Los cambios de estado del agua»** y **«Fracciones en la finca»**, y Lucía **«Contamos manzanas»**. ¿Sobre cuál quieres que te ayude?";

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function replyFor(question: string): string {
  const q = normalize(question);
  const match = RESPONSES.find((r) => r.keys.some((k) => q.includes(normalize(k))));
  return match?.reply ?? FALLBACK;
}
