import {
  Anchor,
  BookMarked,
  Crown,
  Feather,
  Gavel,
  Ghost,
  Handshake,
  LibraryBig,
  Scale,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StatKey =
  | "conocimiento"
  | "estrategia"
  | "oratoria"
  | "memoria"
  | "temple";

export type SceneKey =
  | "map"
  | "district"
  | "combat"
  | "cases"
  | "classifier"
  | "memory"
  | "inventory"
  | "codex"
  | "achievements"
  | "profile";

export type ActionKey =
  | "atacar"
  | "argumentar"
  | "citar"
  | "interpretar"
  | "contraargumentar"
  | "defender";

export type Rarity = "Comun" | "Raro" | "Epico" | "Legendario" | "Mitico";

export type Article = {
  id: string;
  number: string;
  title: string;
  school: string;
  incantation: string;
  unlockHint: string;
  requirements: string[];
  effects: string[];
  exceptions: string[];
  questions: string[];
};

export type Relic = {
  id: string;
  name: string;
  rarity: Rarity;
  icon: LucideIcon;
  stat: StatKey;
  bonus: number;
  description: string;
  flavor: string;
};

export type Choice = {
  id: string;
  text: string;
  correct: boolean;
  articleId?: string;
  note: string;
};

export type Question = {
  id: string;
  bossLine: string;
  prompt: string;
  idealAction: ActionKey;
  articleId: string;
  trap?: string;
  choices: Choice[];
};

export type Encounter = {
  id: string;
  districtId: string;
  title: string;
  subtitle: string;
  bossName: string;
  kind: "duel" | "boss";
  hp: number;
  unlocksAfter?: string[];
  rewards: {
    exp: number;
    reputation: number;
    relicId?: string;
    articleIds: string[];
  };
  questions: Question[];
};

export type District = {
  id: string;
  name: string;
  subtitle: string;
  theme: string;
  boss: string;
  topics: string[];
  x: number;
  y: number;
  playable: boolean;
  icon: LucideIcon;
};

export type CombatLogEntry = {
  id: string;
  tone: "good" | "bad" | "neutral" | "reward";
  text: string;
};

export type CombatState = {
  encounterId: string;
  bossHp: number;
  playerHp: number;
  focus: number;
  questionIndex: number;
  selectedAction: ActionKey;
  selectedChoiceId: string | null;
  turn: number;
  status: "active" | "won" | "lost";
  log: CombatLogEntry[];
};

export type GameState = {
  level: number;
  exp: number;
  reputation: number;
  trauma: number;
  seals: number;
  activeDistrictId: string;
  completedEncounters: string[];
  solvedCases: string[];
  classifierWins: number;
  reviewedFlashcards: Record<string, number>;
  unlockedArticles: string[];
  relics: string[];
  equippedRelics: string[];
  articleMastery: Record<string, number>;
  combat: CombatState | null;
  activity: CombatLogEntry[];
};

export const actionMeta: Record<
  ActionKey,
  {
    label: string;
    short: string;
    description: string;
    icon: LucideIcon;
    color: "red" | "cyan" | "amber" | "violet" | "emerald" | "slate";
    focusCost: number;
    baseDamage: number;
  }
> = {
  atacar: {
    label: "Atacar",
    short: "Respuesta directa",
    description: "Golpea con una definición precisa.",
    icon: Swords,
    color: "red",
    focusCost: 0,
    baseDamage: 24,
  },
  argumentar: {
    label: "Argumentar",
    short: "Razonamiento lógico",
    description: "Ordena requisitos, efectos y consecuencia jurídica.",
    icon: Scale,
    color: "cyan",
    focusCost: 10,
    baseDamage: 34,
  },
  citar: {
    label: "Citar norma",
    short: "Artículo-hechizo",
    description: "Invoca un artículo desbloqueado o descubierto en combate.",
    icon: ScrollText,
    color: "amber",
    focusCost: 14,
    baseDamage: 38,
  },
  interpretar: {
    label: "Interpretar",
    short: "Conectar instituciones",
    description: "Combina artículo, principio y caso concreto.",
    icon: WandSparkles,
    color: "violet",
    focusCost: 20,
    baseDamage: 45,
  },
  contraargumentar: {
    label: "Contraargumentar",
    short: "Romper trampa",
    description: "Desarma contradicciones doctrinarias.",
    icon: Shield,
    color: "emerald",
    focusCost: 18,
    baseDamage: 43,
  },
  defender: {
    label: "Defender",
    short: "Templar memoria",
    description: "Reduce trauma y recupera foco; hace poco daño.",
    icon: Anchor,
    color: "slate",
    focusCost: 0,
    baseDamage: 8,
  },
};

export const articles: Article[] = [
  {
    id: "art-1437",
    number: "1437",
    title: "Fuentes de las obligaciones",
    school: "Pórtico de las Fuentes",
    incantation:
      "Las obligaciones nacen del concurso real de voluntades, de un hecho voluntario, del delito o cuasidelito, y de la ley.",
    unlockHint: "Supera el duelo de las fuentes.",
    requirements: ["Contrato o convención", "Cuasicontrato", "Delito", "Cuasidelito", "Ley"],
    effects: ["Ordena el origen de la deuda", "Permite clasificar remedios", "Activa ataques de fuente correcta"],
    exceptions: ["No todo deber moral es obligación civil", "La fuente define el régimen aplicable"],
    questions: [
      "¿De dónde nace una obligación civil?",
      "¿Qué diferencia una fuente contractual de una legal?",
    ],
  },
  {
    id: "art-1445",
    number: "1445",
    title: "Requisitos del acto jurídico",
    school: "Sala de la Voluntad",
    incantation:
      "Para que una persona se obligue debe ser legalmente capaz, consentir sin vicio, recaer sobre objeto lícito y tener causa lícita.",
    unlockHint: "Rompe una trampa sobre consentimiento.",
    requirements: ["Capacidad", "Consentimiento no viciado", "Objeto lícito", "Causa lícita"],
    effects: ["Abre lectura de nulidad", "Refuerza argumentos de contrato", "Detecta solemnidades externas"],
    exceptions: ["Las solemnidades dependen del acto", "La incapacidad puede ser absoluta o relativa"],
    questions: [
      "¿Qué falta si hay objeto ilícito?",
      "¿Basta que el contrato parezca justo?",
    ],
  },
  {
    id: "art-1473",
    number: "1473",
    title: "Condición suspensiva y resolutoria",
    school: "Galería de las Modalidades",
    incantation:
      "La condición es suspensiva si, mientras no se cumple, suspende la adquisición de un derecho; y resolutoria cuando extingue el derecho por su cumplimiento.",
    unlockHint: "Vence el reloj de las modalidades.",
    requirements: ["Hecho futuro", "Hecho incierto", "Efecto suspensivo o extintivo"],
    effects: ["Distingue nacimiento y extinción", "Permite leer riesgos de cumplimiento", "Reduce daño de repreguntas"],
    exceptions: ["El plazo mira un hecho futuro cierto", "La mera expectativa no equivale a derecho adquirido"],
    questions: [
      "¿Qué se suspende en una condición suspensiva?",
      "¿Qué extingue la condición resolutoria?",
    ],
  },
  {
    id: "art-1511",
    number: "1511",
    title: "Solidaridad",
    school: "Cámara de las Voces Múltiples",
    incantation:
      "En virtud de la solidaridad, cada deudor puede ser obligado al total, o cada acreedor exigir el total, cuando la ley, testamento o convención la establecen.",
    unlockHint: "Domina la deuda de muchos rostros.",
    requirements: ["Pluralidad de sujetos", "Unidad de prestación", "Fuente expresa de solidaridad"],
    effects: ["Aumenta daño contra deudas colectivas", "Evita confundir mancomunidad", "Activa cobro total"],
    exceptions: ["La solidaridad no se presume", "Puede ser activa o pasiva"],
    questions: [
      "¿Puede un acreedor cobrar todo a un deudor solidario?",
      "¿La solidaridad se presume por existir varios deudores?",
    ],
  },
  {
    id: "art-1545",
    number: "1545",
    title: "Fuerza obligatoria del contrato",
    school: "Trono del Pacto",
    incantation:
      "Todo contrato legalmente celebrado es una ley para los contratantes, y no puede ser invalidado sino por consentimiento mutuo o causas legales.",
    unlockHint: "Derrota al guardián del pacto.",
    requirements: ["Contrato legalmente celebrado", "Partes obligadas", "Mutuo consentimiento o causa legal para invalidar"],
    effects: ["Golpe crítico al incumplimiento", "Sube precisión de Citar Norma", "Fortalece reputación"],
    exceptions: ["No cubre contratos inválidos", "La ley puede autorizar revisión o terminación"],
    questions: [
      "¿Por qué el contrato obliga?",
      "¿Cómo puede dejarse sin efecto un contrato válido?",
    ],
  },
  {
    id: "art-1560",
    number: "1560",
    title: "Intención conocida",
    school: "Espejo de la Interpretación",
    incantation:
      "Conocida claramente la intención de los contratantes, debe estarse a ella más que a lo literal de las palabras.",
    unlockHint: "Interpreta una cláusula viva.",
    requirements: ["Intención claramente conocida", "Texto ambiguo o insuficiente", "Preferencia por voluntad real"],
    effects: ["Sube daño de Interpretar", "Revela trampas literales", "Desbloquea lecturas de contrato"],
    exceptions: ["No inventa voluntad inexistente", "La intención debe probarse con claridad"],
    questions: [
      "¿Qué pesa más que las palabras literales?",
      "¿Cuándo sirve la regla de intención conocida?",
    ],
  },
  {
    id: "art-1567",
    number: "1567",
    title: "Modos de extinguir obligaciones",
    school: "Archivo de las Deudas Muertas",
    incantation:
      "Toda obligación puede extinguirse por convención, pago, novación, transacción, remisión, compensación, confusión, pérdida de la cosa, nulidad, resolución, prescripción y otros modos legales.",
    unlockHint: "Sobrevive al Cobrador Eterno.",
    requirements: ["Obligación existente", "Modo extintivo aplicable", "Efecto liberatorio o transformador"],
    effects: ["Desbloquea final del distrito", "Mejora memoria de pago", "Rompe cadenas del Cobrador"],
    exceptions: ["Cada modo tiene requisitos propios", "No todos operan de pleno derecho"],
    questions: [
      "¿Qué modos extinguen obligaciones?",
      "¿Por qué la novación no es simplemente pagar?",
    ],
  },
  {
    id: "art-1698",
    number: "1698",
    title: "Carga de la prueba",
    school: "Balanza Probatoria",
    incantation:
      "Incumbe probar las obligaciones o su extinción al que alega aquéllas o ésta.",
    unlockHint: "Obtén el báculo probatorio.",
    requirements: ["Alegación de obligación", "Alegación de extinción", "Necesidad de probar"],
    effects: ["Mejora contraargumentos", "Detecta afirmaciones sin sustento", "Aumenta reputación por precisión"],
    exceptions: ["La ley puede alterar cargas", "Presunciones modifican el debate probatorio"],
    questions: [
      "¿Quién prueba la obligación?",
      "¿Quién prueba que la obligación se extinguió?",
    ],
  },
  {
    id: "art-1451",
    number: "1451",
    title: "Vicios del consentimiento",
    school: "Sala de la Voluntad Herida",
    incantation:
      "Los vicios del consentimiento son error, fuerza y dolo; la lesión enorme no opera como vicio general en Chile.",
    unlockHint: "Responde sin confundir lesión con vicio general.",
    requirements: ["Consentimiento existente", "Defecto que lo desfigura", "Error, fuerza o dolo"],
    effects: ["Abre rutas de nulidad relativa", "Revela trampas de lesión", "Mejora respuestas de acto jurídico"],
    exceptions: ["La lesión enorme solo opera en casos regulados", "La fuerza física puede conducir a falta de voluntad"],
    questions: [
      "¿Cuáles son los vicios del consentimiento?",
      "¿Por qué la lesión enorme no se trata como vicio general en Chile?",
    ],
  },
  {
    id: "art-1458",
    number: "1458",
    title: "Dolo vicio",
    school: "Cámara del Engaño Principal",
    incantation:
      "El dolo vicia el consentimiento cuando es determinante y obra de una de las partes; además puede generar indemnización.",
    unlockHint: "Desarma una maquinación contractual.",
    requirements: ["Maquinación o artificio", "Carácter determinante", "Obra de una de las partes"],
    effects: ["Aumenta daño de Contraargumentar", "Distingue nulidad e indemnización", "Conecta vicios con responsabilidad"],
    exceptions: ["El tercero que aprovecha el dolo responde por el provecho", "El dolo incidental no siempre anula"],
    questions: [
      "¿Qué requisitos debe cumplir el dolo para viciar el consentimiento?",
      "¿Qué efectos indemnizatorios puede producir?",
    ],
  },
  {
    id: "art-1460",
    number: "1460",
    title: "Objeto de la obligación",
    school: "Forja de Dar, Hacer y No Hacer",
    incantation:
      "El objeto de la obligación consiste en dar, hacer o no hacer algo.",
    unlockHint: "Clasifica correctamente la prestación.",
    requirements: ["Prestación identificable", "Dar, hacer o no hacer", "Determinación o determinabilidad"],
    effects: ["Potencia el clasificador", "Conecta acto jurídico con obligaciones", "Reduce confusión entre cosa y prestación"],
    exceptions: ["El objeto de dar debe ser real, comerciable y determinado o determinable", "El hacer debe ser física y moralmente posible"],
    questions: [
      "¿En qué puede consistir el objeto de una obligación?",
      "¿Qué exige el objeto de dar?",
    ],
  },
  {
    id: "art-1467",
    number: "1467",
    title: "Causa lícita",
    school: "Archivo de los Motivos",
    incantation:
      "La causa es el motivo que induce al acto o contrato; es ilícita si la prohíbe la ley o es contraria a las buenas costumbres u orden público.",
    unlockHint: "Identifica una causa prohibida.",
    requirements: ["Motivo que induce al acto", "Licitud", "No contrariar ley, buenas costumbres u orden público"],
    effects: ["Fortalece respuestas de validez", "Abre ataques por nulidad absoluta", "Distingue causa final y motivo"],
    exceptions: ["La causa ilícita produce nulidad absoluta", "La causa varía según el contrato"],
    questions: [
      "¿Qué entiende el Código Civil por causa?",
      "¿Cuándo la causa es ilícita?",
    ],
  },
  {
    id: "art-1489",
    number: "1489",
    title: "Resolución por incumplimiento",
    school: "Trono de la Condición Resolutoria",
    incantation:
      "En los contratos bilaterales va envuelta la condición resolutoria de no cumplirse por una de las partes lo pactado.",
    unlockHint: "Vence un caso de incumplimiento bilateral.",
    requirements: ["Contrato bilateral", "Incumplimiento imputable", "Obligación exigible", "Parte cumplidora o llana a cumplir"],
    effects: ["Permite elegir cumplimiento o resolución", "Suma indemnización", "Activa remedios de compraventa"],
    exceptions: ["Requiere declaración judicial según la regla general", "En tracto sucesivo sus efectos miran hacia el futuro"],
    questions: [
      "¿Qué puede pedir el acreedor ante incumplimiento en contrato bilateral?",
      "¿Qué requisitos exige la resolución por inejecución?",
    ],
  },
  {
    id: "art-1554",
    number: "1554",
    title: "Promesa de celebrar contrato",
    school: "Santuario del Contrato Futuro",
    incantation:
      "La promesa solo obliga si consta por escrito, el contrato prometido es eficaz, fija época por plazo o condición y queda suficientemente especificado.",
    unlockHint: "Guarda el pergamino de la promesa.",
    requirements: ["Escrito", "Contrato prometido eficaz", "Plazo o condición que fije época", "Especificación suficiente"],
    effects: ["Desbloquea cumplimiento de celebrar", "Evita promesas vacías", "Mejora casos de compraventa futura"],
    exceptions: ["La falta de requisitos se asocia a nulidad absoluta según doctrina mayoritaria", "Es esencialmente transitoria"],
    questions: [
      "¿Cuáles son los cuatro requisitos de la promesa?",
      "¿Qué obligación produce una promesa válida?",
    ],
  },
  {
    id: "art-1568",
    number: "1568",
    title: "Pago efectivo",
    school: "Caja del Cumplimiento",
    incantation:
      "El pago efectivo es la prestación de lo que se debe.",
    unlockHint: "Cumple en identidad, integridad e indivisibilidad.",
    requirements: ["Prestación debida", "Cumplimiento conforme al tenor", "Ánimo de extinguir"],
    effects: ["Cura trauma en memoria", "Conecta extinción y prueba", "Abre subrogación y consignación"],
    exceptions: ["En obligación de dar se vincula con tradición", "La prueba del pago corresponde al deudor que lo alega"],
    questions: [
      "¿Qué es el pago efectivo?",
      "¿Qué principios básicos gobiernan el pago?",
    ],
  },
  {
    id: "art-1793",
    number: "1793",
    title: "Compraventa",
    school: "Mercado del Precio y la Cosa",
    incantation:
      "La compraventa es un contrato en que una parte se obliga a dar una cosa y la otra a pagarla en dinero.",
    unlockHint: "Compra sin confundir título y modo.",
    requirements: ["Cosa vendida", "Precio en dinero", "Obligación de dar y pagar"],
    effects: ["Abre mercado de saneamientos", "Activa preguntas de título traslaticio", "Mejora casos de precio y cosa"],
    exceptions: ["Generalmente consensual; ciertos objetos exigen escritura pública", "Es título traslaticio, no tradición por sí sola"],
    questions: [
      "¿Cuál es el concepto legal de compraventa?",
      "¿Por qué la compraventa no transfiere por sí sola el dominio?",
    ],
  },
  {
    id: "art-1826",
    number: "1826",
    title: "Entrega y excepción en compraventa",
    school: "Puerta de la Entrega",
    incantation:
      "La obligación de entregar permite conectar compraventa con la excepción de contrato no cumplido cuando la contraparte no cumple o no se allana a cumplir.",
    unlockHint: "Defiende al comprador o vendedor incumplido con precisión.",
    requirements: ["Contrato bilateral", "Obligación actualmente exigible", "Parte demandante incumplidora o no llana a cumplir"],
    effects: ["Mejora defensa en casos de compraventa", "Conecta art. 1552 con compraventa", "Evita respuestas automáticas de resolución"],
    exceptions: ["La excepción suspende temporalmente", "No reemplaza el cumplimiento definitivo"],
    questions: [
      "¿Cuándo puede oponerse la excepción de contrato no cumplido?",
      "¿Qué efecto produce la excepción?",
    ],
  },
  {
    id: "art-1888",
    number: "1888-1896",
    title: "Lesión enorme en compraventa de inmuebles",
    school: "Balanza del Justo Precio",
    incantation:
      "La lesión enorme en compraventa de inmuebles permite rescisión o ajuste del precio conforme a las reglas especiales.",
    unlockHint: "Resuelve el caso del precio desproporcionado.",
    requirements: ["Compraventa de inmueble", "Desproporción relevante", "Justo precio de mercado"],
    effects: ["Distingue rescisión especial de nulidad relativa", "Entrena cálculo de justo precio", "Activa casos de inmuebles"],
    exceptions: ["No es vicio general del consentimiento", "El legislador permite evitar rescisión ajustando el precio"],
    questions: [
      "¿En qué casos aparece la lesión enorme en compraventa?",
      "¿Por qué no es una nulidad relativa común?",
    ],
  },
  {
    id: "art-582",
    number: "582",
    title: "Dominio",
    school: "Castillo de la Propiedad",
    incantation:
      "El dominio o propiedad es el derecho real en una cosa corporal para gozar y disponer de ella, no siendo contra la ley o derecho ajeno.",
    unlockHint: "Entra al Reino de los Derechos Reales.",
    requirements: ["Cosa corporal", "Gozar", "Disponer", "Límites de ley y derecho ajeno"],
    effects: ["Ordena propiedad plena y nuda", "Conecta reivindicación", "Distingue derecho real de crédito"],
    exceptions: ["Sobre cosas incorporales también hay especie de propiedad", "La propiedad separada del goce es mera o nuda propiedad"],
    questions: [
      "¿Cómo define el Código Civil el dominio?",
      "¿Qué límites contiene la definición?",
    ],
  },
  {
    id: "art-588",
    number: "588",
    title: "Modos de adquirir el dominio",
    school: "Puerta de los Modos",
    incantation:
      "Los modos de adquirir el dominio son ocupación, accesión, tradición, sucesión por causa de muerte y prescripción.",
    unlockHint: "Enumera los modos sin mezclar título y modo.",
    requirements: ["Modo adquisitivo", "Dominio a adquirir", "Regla aplicable según la cosa"],
    effects: ["Conecta compraventa con tradición", "Evita confundir contrato con adquisición", "Abre ruta de bienes"],
    exceptions: ["La sucesión y prescripción tienen tratamiento propio", "En Chile opera la lógica de título y modo"],
    questions: [
      "¿Cuáles son los modos de adquirir el dominio?",
      "¿Por qué la compraventa es título y no modo?",
    ],
  },
  {
    id: "art-670",
    number: "670",
    title: "Tradición",
    school: "Puente del Título al Dominio",
    incantation:
      "La tradición es un modo de adquirir que consiste en la entrega del dueño con intención de transferir y capacidad e intención de adquirir.",
    unlockHint: "Cruza del contrato al derecho real.",
    requirements: ["Entrega", "Facultad e intención de transferir", "Capacidad e intención de adquirir", "Título traslaticio válido"],
    effects: ["Resuelve compraventas de inmuebles", "Conecta inscripción conservatoria", "Activa combos de bienes"],
    exceptions: ["La tradición de inmuebles exige inscripción", "Si el tradente no es dueño se adquieren solo derechos transmisibles"],
    questions: [
      "¿Qué elementos exige la tradición?",
      "¿Cómo se efectúa la tradición de bienes raíces?",
    ],
  },
  {
    id: "art-700",
    number: "700",
    title: "Posesión",
    school: "Bosque del Ánimo de Señor",
    incantation:
      "La posesión es la tenencia de una cosa determinada con ánimo de señor o dueño.",
    unlockHint: "Distingue poseedor y mero tenedor.",
    requirements: ["Tenencia de cosa determinada", "Ánimo de señor o dueño", "Por sí o por otro"],
    effects: ["Abre prescripción adquisitiva", "Revela posesión regular e irregular", "Mejora casos de reivindicación"],
    exceptions: ["El poseedor se reputa dueño mientras otro no justifica serlo", "La posesión inscrita tiene reglas especiales"],
    questions: [
      "¿Qué dos elementos forman la posesión?",
      "¿Qué presunción favorece al poseedor?",
    ],
  },
  {
    id: "art-714",
    number: "714",
    title: "Mera tenencia",
    school: "Campamento del Reconocimiento Ajeno",
    incantation:
      "La mera tenencia se ejerce sobre una cosa no como dueño, sino en lugar o a nombre del dueño.",
    unlockHint: "No confundas arrendatario con poseedor.",
    requirements: ["Tenencia material o jurídica", "Reconocimiento de dominio ajeno", "Ausencia de ánimo de señor"],
    effects: ["Evita errores en prescripción", "Distingue posesión de usufructo, arriendo o depósito", "Mejora casos de bienes"],
    exceptions: ["El simple lapso de tiempo no muda mera tenencia en posesión salvo excepción legal", "Debe mirarse el título de tenencia"],
    questions: [
      "¿Qué distingue la mera tenencia de la posesión?",
      "¿Puede el mero tenedor ganar por prescripción solo por el tiempo?",
    ],
  },
  {
    id: "art-2116",
    number: "2116",
    title: "Mandato",
    school: "Gremio del Encargo",
    incantation:
      "El mandato es un contrato por el cual una persona confía la gestión de uno o más negocios a otra, que se hace cargo por cuenta y riesgo de la primera.",
    unlockHint: "Entrega el encargo sin perder la cuenta.",
    requirements: ["Confianza", "Encargo de gestión", "Cuenta y riesgo del mandante"],
    effects: ["Desbloquea gestión jurídica", "Distingue representación como elemento de la naturaleza", "Mejora casos de menor adulto mandatario"],
    exceptions: ["Versa sobre actos jurídicos, no meros actos materiales", "Puede existir mandato sin representación"],
    questions: [
      "¿Cuáles son los elementos esenciales del mandato?",
      "¿La representación es siempre de la esencia del mandato?",
    ],
  },
  {
    id: "art-2128",
    number: "2128",
    title: "Capacidad del mandatario",
    school: "Licencia del Menor Adulto",
    incantation:
      "El mandatario puede ser menor adulto; sus actos como representante del mandante pueden ser válidos bajo la regla especial.",
    unlockHint: "No confundas capacidad del mandante y del mandatario.",
    requirements: ["Mandato válido", "Mandatario menor adulto", "Actuación por cuenta del mandante"],
    effects: ["Desarma trampas de capacidad", "Refuerza casos de mandato", "Conecta representación y efectos frente a terceros"],
    exceptions: ["La capacidad del mandante sigue reglas generales", "Debe distinguirse responsabilidad interna del mandatario"],
    questions: [
      "¿Qué regla especial existe sobre capacidad del mandatario?",
      "¿Por qué importa distinguir mandante y mandatario?",
    ],
  },
  {
    id: "art-2158",
    number: "2158",
    title: "Obligaciones del mandante",
    school: "Tesorería del Encargo",
    incantation:
      "Las obligaciones del mandante justifican que el mandato sea bilateral, incluso cuando no se pacte remuneración.",
    unlockHint: "Rinde cuenta y cobra gastos correctamente.",
    requirements: ["Mandato ejecutado", "Gastos o perjuicios derivados", "Cuenta del negocio"],
    effects: ["Mejora casos de reembolso", "Conecta bilateralidad del mandato", "Abre recompensas de confianza"],
    exceptions: ["La remuneración es de la naturaleza, no de la esencia", "Debe mirarse el encargo concreto"],
    questions: [
      "¿Por qué el mandato es siempre bilateral?",
      "¿Qué debe mirar el mandante frente al mandatario?",
    ],
  },
  {
    id: "art-2163",
    number: "2163",
    title: "Terminación del mandato",
    school: "Puerta de la Revocación",
    incantation:
      "El mandato termina, entre otros modos, por cumplimiento, vencimiento, revocación, renuncia, muerte o insolvencia.",
    unlockHint: "Cierra el encargo sin dejar cabos sueltos.",
    requirements: ["Causal de término", "Efectos internos", "Aviso o conocimiento cuando corresponda"],
    effects: ["Evita responsabilidad por seguir actuando", "Mejora memoria de causales", "Conecta revocación y solemnidad"],
    exceptions: ["Si el mandato es solemne, la revocación puede exigir solemnidad", "La ignorancia de la causal puede alterar efectos"],
    questions: [
      "¿Cuáles son causales típicas de terminación del mandato?",
      "¿Qué pasa si el mandatario ignora la causal de término?",
    ],
  },
  {
    id: "art-2407",
    number: "2407",
    title: "Hipoteca",
    school: "Fortaleza del Acreedor",
    incantation:
      "La hipoteca es la prenda que recae sobre inmuebles y que no por eso deja de estar en poder del deudor.",
    unlockHint: "Abre la fortaleza hipotecaria.",
    requirements: ["Inmueble o derecho hipotecable", "Garantía accesoria", "No desplazamiento de la cosa"],
    effects: ["Activa preferencia y persecución", "Conecta contrato y derecho real", "Mejora casos de tercero poseedor"],
    exceptions: ["El contrato de hipoteca es título; el derecho real exige inscripción", "Es indivisible y accesorio"],
    questions: [
      "¿Cuál es el concepto legal de hipoteca?",
      "¿Por qué se critica esa definición?",
    ],
  },
  {
    id: "art-2415",
    number: "2415",
    title: "Facultad de enajenar e hipotecar",
    school: "Puente de la Disposición Jurídica",
    incantation:
      "El constituyente conserva la facultad de disposición jurídica sobre el inmueble hipotecado, sin perjuicio de los derechos del acreedor.",
    unlockHint: "Vende el inmueble gravado sin borrar la hipoteca.",
    requirements: ["Inmueble hipotecado", "Gravamen vigente", "Disposición jurídica posterior"],
    effects: ["Explica venta a tercero", "Conecta persecución hipotecaria", "Evita confundir hipoteca con prohibición absoluta"],
    exceptions: ["El acreedor no siempre debe respetar derechos reales posteriores", "La disposición material puede estar limitada"],
    questions: [
      "¿Puede venderse un inmueble hipotecado?",
      "¿Qué derecho conserva el acreedor frente al tercero?",
    ],
  },
  {
    id: "art-2428",
    number: "2428",
    title: "Persecución hipotecaria",
    school: "Camino del Desposeimiento",
    incantation:
      "La hipoteca permite perseguir la finca hipotecada sea quien fuere quien la posea y a cualquier título que la haya adquirido.",
    unlockHint: "Alcanza al tercero poseedor.",
    requirements: ["Hipoteca vigente", "Finca en poder de tercero", "Acción de persecución o desposeimiento"],
    effects: ["Daño crítico contra ventas con gravamen", "Conecta tercero poseedor y pago preferente", "Mejora examen oral de hipoteca"],
    exceptions: ["El tercero puede pagar y subrogarse o abandonar según el caso", "Debe distinguirse fiador hipotecario"],
    questions: [
      "¿Qué significa el derecho de persecución?",
      "¿Quién es tercero poseedor?",
    ],
  },
  {
    id: "art-2434",
    number: "2434",
    title: "Extinción de la hipoteca",
    school: "Bóveda de la Purga",
    incantation:
      "La hipoteca se extingue por vía consecuencial al extinguirse la obligación principal, o por vía directa en causales propias.",
    unlockHint: "Purga la bóveda hipotecaria.",
    requirements: ["Extinción de la obligación principal o causal directa", "Accesoriedad", "Cancelación o efecto correspondiente"],
    effects: ["Ordena pago, novación y purga", "Conecta lo accesorio con lo principal", "Evita perder garantías por novación sin reserva"],
    exceptions: ["La reserva de garantías puede operar en novación bajo requisitos", "La pérdida total de la cosa extingue directamente"],
    questions: [
      "¿Cómo se extingue la hipoteca por vía consecuencial?",
      "¿Qué causales directas recuerdas?",
    ],
  },
];

export const relics: Relic[] = [
  {
    id: "codigo-bello",
    name: "Código de Bello",
    rarity: "Epico",
    icon: BookMarked,
    stat: "conocimiento",
    bonus: 15,
    description: "+15 Conocimiento. Los artículos usados ganan maestría adicional.",
    flavor: "No pesa por sus páginas, sino por las puertas que abre.",
  },
  {
    id: "pluma-claro",
    name: "Pluma de Claro Solar",
    rarity: "Raro",
    icon: Feather,
    stat: "memoria",
    bonus: 10,
    description: "+10 Memoria. Reduce el costo de Citar Norma.",
    flavor: "Traza distinciones donde otros sólo ven tinta.",
  },
  {
    id: "báculo-probatorio",
    name: "Báculo Probatorio",
    rarity: "Legendario",
    icon: Gavel,
    stat: "estrategia",
    bonus: 20,
    description: "+20 Estrategia. Contraargumentar hace daño crítico contra trampas.",
    flavor: "Lo presenta quien no teme explicar de dónde viene la prueba.",
  },
  {
    id: "espiritu-alessandri",
    name: "Espíritu de Alessandri",
    rarity: "Legendario",
    icon: Ghost,
    stat: "oratoria",
    bonus: 18,
    description: "+18 Oratoria. Argumentar cura una pequeña porción de trauma.",
    flavor: "Una voz antigua que vuelve ordenada cualquier respuesta.",
  },
  {
    id: "tratado-abeliuk",
    name: "Tratado de Abeliuk",
    rarity: "Mitico",
    icon: LibraryBig,
    stat: "conocimiento",
    bonus: 25,
    description: "+25 Conocimiento. Interpretar suma daño por cada artículo desbloqueado.",
    flavor: "Sus lomos contienen un distrito completo de obligaciones.",
  },
  {
    id: "sello-de-ejecucion",
    name: "Sello de Ejecución",
    rarity: "Raro",
    icon: Sparkles,
    stat: "temple",
    bonus: 8,
    description: "+8 Temple. Defender resta más trauma académico.",
    flavor: "Marca de quien aprendió a respirar antes de contestar.",
  },
];

export const districts: District[] = [
  {
    id: "acto-juridico",
    name: "Torre del Acto Jurídico",
    subtitle: "Existencia, validez, vicios, nulidad e ineficacia",
    theme: "Biblioteca arcana donde voluntad, objeto y causa se someten a examen.",
    boss: "Prof. Severino Lex",
    topics: ["existencia", "validez", "vicios", "objeto", "causa", "nulidad", "inoponibilidad"],
    x: 19,
    y: 31,
    playable: true,
    icon: WandSparkles,
  },
  {
    id: "obligaciones",
    name: "Ciudad de las Obligaciones",
    subtitle: "Fuentes, clasificación, modalidades, solidaridad y pago",
    theme: "Calles comerciales donde cada deuda exige fuente, prestación y remedio.",
    boss: "Lord Solidarius",
    topics: ["fuentes", "dar hacer no hacer", "modalidades", "solidaridad", "pago", "extinción"],
    x: 51,
    y: 38,
    playable: true,
    icon: Scale,
  },
  {
    id: "bienes",
    name: "Reino de los Derechos Reales",
    subtitle: "Dominio, posesión, tradición y modos de adquirir",
    theme: "Bosques, castillos y registros donde las cosas preguntan por dueño, título y modo.",
    boss: "Guardiana de la Posesión",
    topics: ["posesión", "dominio", "tradición", "ocupación", "accesión", "prescripción adquisitiva"],
    x: 72,
    y: 25,
    playable: true,
    icon: Crown,
  },
  {
    id: "compraventa",
    name: "Mercado de la Compraventa",
    subtitle: "Precio, cosa, entrega, riesgos, saneamientos y lesión",
    theme: "Mercaderes de buena fe negocian bajo toldos, escrituras y cosas gravadas.",
    boss: "Mercader Pactos",
    topics: ["1793", "cosa", "precio", "entrega", "evicción", "vicios redhibitorios", "lesión enorme"],
    x: 30,
    y: 68,
    playable: true,
    icon: Handshake,
  },
  {
    id: "mandato",
    name: "Gremio del Mandato",
    subtitle: "Encargo, representación, obligaciones y terminación",
    theme: "Un gremio de agentes, cartas poder y encargos ejecutados por cuenta ajena.",
    boss: "Agente Mandatario",
    topics: ["2116", "capacidad", "representación", "obligaciones del mandatario", "obligaciones del mandante", "terminación"],
    x: 56,
    y: 74,
    playable: true,
    icon: Anchor,
  },
  {
    id: "hipoteca",
    name: "Fortaleza Hipotecaria",
    subtitle: "Contrato, derecho real, persecución, preferencia y purga",
    theme: "Bóvedas oscuras donde el acreedor persigue la finca sin desplazarla.",
    boss: "Guardián Hipotecario",
    topics: ["2407", "inscripción", "2415", "2428", "preferencia", "purga", "2434"],
    x: 81,
    y: 57,
    playable: true,
    icon: Shield,
  },
  {
    id: "promesa",
    name: "Santuario de la Promesa",
    subtitle: "Artículo 1554, modalidad, contrato prometido y cumplimiento",
    theme: "Un templo de pergaminos futuros donde solo falta tradición o solemnidad final.",
    boss: "Jurista Promenio",
    topics: ["1554", "escrito", "plazo o condición", "especificación", "promesa unilateral", "promesa de compraventa"],
    x: 42,
    y: 20,
    playable: true,
    icon: ScrollText,
  },
];

export const encounters: Encounter[] = [
  {
    id: "fuentes-vivas",
    districtId: "obligaciones",
    title: "Pórtico de las Fuentes",
    subtitle: "El origen de toda obligación se manifiesta.",
    bossName: "Escriba de las Cinco Fuentes",
    kind: "duel",
    hp: 110,
    rewards: {
      exp: 120,
      reputation: 6,
      relicId: "codigo-bello",
      articleIds: ["art-1437", "art-1445"],
    },
    questions: [
      {
        id: "q-fuentes-1",
        bossLine:
          "Si todo deber que incomoda fuera obligación, el reino no tendría murallas. Nómbrame sus fuentes.",
        prompt: "¿Cuál es el mapa correcto de las fuentes de las obligaciones civiles?",
        idealAction: "atacar",
        articleId: "art-1437",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-1437",
            text: "Contrato o convención, cuasicontrato, delito, cuasidelito y ley.",
            note: "Art. 1437 ordena el origen de las obligaciones.",
          },
          {
            id: "b",
            correct: false,
            text: "Sólo los contratos y las sentencias generan obligaciones.",
            note: "Reduce indebidamente las fuentes y deja fuera ley y hechos ilícitos.",
          },
          {
            id: "c",
            correct: false,
            text: "La costumbre, la equidad y la buena fe como fuentes autónomas generales.",
            note: "Pueden incidir, pero no son el listado base del art. 1437.",
          },
        ],
      },
      {
        id: "q-fuentes-2",
        bossLine:
          "El contrato no ha nacido, pero alguien gestionó lo ajeno. ¿Lo llamarás pacto?",
        prompt: "¿Qué fuente explica obligaciones nacidas de un hecho voluntario lícito no convencional?",
        idealAction: "argumentar",
        articleId: "art-1437",
        choices: [
          {
            id: "a",
            correct: false,
            text: "Delito civil, porque todo hecho produce responsabilidad.",
            note: "El delito exige ilicitud y daño imputable.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-1437",
            text: "Cuasicontrato, porque falta convención aunque hay hecho voluntario lícito.",
            note: "La clave es distinguir voluntad no convencional e ilicitud.",
          },
          {
            id: "c",
            correct: false,
            text: "Contrato tácito, porque cualquier beneficio aceptado crea contrato.",
            note: "Confunde la fuente con consentimiento contractual.",
          },
        ],
      },
    ],
  },
  {
    id: "modalidades-reloj",
    districtId: "obligaciones",
    title: "Galería de las Modalidades",
    subtitle: "El tiempo no siempre es condición.",
    bossName: "Relojero Suspensivo",
    kind: "duel",
    hp: 125,
    unlocksAfter: ["fuentes-vivas"],
    rewards: {
      exp: 150,
      reputation: 8,
      relicId: "pluma-claro",
      articleIds: ["art-1473", "art-1511"],
    },
    questions: [
      {
        id: "q-modalidad-1",
        bossLine:
          "La campana sonará mañana. Todos esperan, nadie duda. ¿Condición o plazo?",
        prompt: "Si el hecho futuro es cierto, ¿qué modalidad corresponde?",
        idealAction: "contraargumentar",
        articleId: "art-1473",
        trap: "Trampa: llamar condición a todo hecho futuro.",
        choices: [
          {
            id: "a",
            correct: false,
            text: "Condición suspensiva, porque aún no ocurre.",
            note: "La condición exige incertidumbre; aquí sólo falta el tiempo.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-1473",
            text: "Plazo, porque el hecho futuro es cierto.",
            note: "El plazo suspende exigibilidad o extinción, no la incertidumbre del derecho.",
          },
          {
            id: "c",
            correct: false,
            text: "Modo, porque impone una carga futura.",
            note: "El modo es una carga en liberalidades, no la regla general del vencimiento.",
          },
        ],
      },
      {
        id: "q-modalidad-2",
        bossLine:
          "Tres deudores firman una misma deuda. ¿El acreedor puede devorarla entera de uno?",
        prompt: "¿Qué se necesita para que exista solidaridad pasiva?",
        idealAction: "citar",
        articleId: "art-1511",
        choices: [
          {
            id: "a",
            correct: false,
            text: "Basta pluralidad de deudores; la solidaridad se presume.",
            note: "La solidaridad no se presume.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-1511",
            text: "Pluralidad, unidad de prestación y fuente expresa en ley, testamento o convención.",
            note: "Art. 1511: fuente expresa de la solidaridad.",
          },
          {
            id: "c",
            correct: false,
            text: "Que la prestación sea divisible y haya culpa de todos.",
            note: "La divisibilidad no crea solidaridad por sí sola.",
          },
        ],
      },
    ],
  },
  {
    id: "trono-del-pacto",
    districtId: "obligaciones",
    title: "Trono del Pacto",
    subtitle: "Los contratos legalmente celebrados respiran como ley.",
    bossName: "Guardián del Artículo 1545",
    kind: "duel",
    hp: 145,
    unlocksAfter: ["modalidades-reloj"],
    rewards: {
      exp: 180,
      reputation: 10,
      relicId: "espiritu-alessandri",
      articleIds: ["art-1545", "art-1560"],
    },
    questions: [
      {
        id: "q-pacto-1",
        bossLine:
          "Un pacto válido se arrepiente a medianoche. ¿Puede huir por simple cansancio?",
        prompt: "¿Qué expresa la fuerza obligatoria del contrato?",
        idealAction: "citar",
        articleId: "art-1545",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-1545",
            text: "El contrato legalmente celebrado es ley para las partes y sólo cede por mutuo consentimiento o causa legal.",
            note: "Art. 1545 es el hechizo central del pacto.",
          },
          {
            id: "b",
            correct: false,
            text: "Las partes pueden dejarlo sin efecto unilateralmente si cambia su conveniencia.",
            note: "Eso rompe la fuerza obligatoria.",
          },
          {
            id: "c",
            correct: false,
            text: "Todo contrato obliga aunque falten objeto o causa lícita.",
            note: "El artículo supone contrato legalmente celebrado.",
          },
        ],
      },
      {
        id: "q-pacto-2",
        bossLine:
          "El pergamino dice una cosa, pero las partes probaron otra intención. ¿A quién sigues?",
        prompt: "Cuando la intención de las partes es claramente conocida, ¿qué regla manda?",
        idealAction: "interpretar",
        articleId: "art-1560",
        trap: "Trampa: absolutizar la literalidad.",
        choices: [
          {
            id: "a",
            correct: false,
            text: "Siempre se prefiere la literalidad, aunque la intención sea clara.",
            note: "Eso niega la regla del art. 1560.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-1560",
            text: "Debe estarse a la intención conocida más que a lo literal de las palabras.",
            note: "La voluntad real claramente conocida vence a la literalidad.",
          },
          {
            id: "c",
            correct: false,
            text: "Se anula el contrato por falta de solemnidad interpretativa.",
            note: "No existe esa solemnidad.",
          },
        ],
      },
    ],
  },
  {
    id: "cobrador-eterno",
    districtId: "obligaciones",
    title: "Cámara de las Deudas Muertas",
    subtitle: "Boss del Distrito de las Obligaciones.",
    bossName: "El Cobrador Eterno",
    kind: "boss",
    hp: 260,
    unlocksAfter: ["fuentes-vivas", "modalidades-reloj", "trono-del-pacto"],
    rewards: {
      exp: 320,
      reputation: 22,
      relicId: "báculo-probatorio",
      articleIds: ["art-1567", "art-1698"],
    },
    questions: [
      {
        id: "q-boss-1",
        bossLine:
          "Dices que la deuda murió. Entonces prueba el rito. ¿Qué puede extinguir una obligación?",
        prompt: "¿Cuál respuesta clasifica correctamente modos de extinguir obligaciones?",
        idealAction: "argumentar",
        articleId: "art-1567",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-1567",
            text: "Pago, novación, compensación, remisión, confusión, pérdida de la cosa, nulidad, resolución, prescripción y otros modos legales.",
            note: "El art. 1567 abre el archivo de extinción.",
          },
          {
            id: "b",
            correct: false,
            text: "Sólo el pago extingue; los demás son defensas procesales.",
            note: "El pago es uno de varios modos extintivos.",
          },
          {
            id: "c",
            correct: false,
            text: "La buena fe extingue por sí sola cualquier obligación onerosa.",
            note: "La buena fe informa, pero no reemplaza los modos extintivos.",
          },
        ],
      },
      {
        id: "q-boss-2",
        bossLine:
          "Si alegas que pagaste, no basta la voz. ¿Quién sostiene la carga?",
        prompt: "Según la regla probatoria, ¿quién debe probar la extinción de la obligación?",
        idealAction: "citar",
        articleId: "art-1698",
        choices: [
          {
            id: "a",
            correct: false,
            text: "Siempre el acreedor, porque él inició la persecución.",
            note: "Quien alega extinción debe probarla.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-1698",
            text: "Quien alega la extinción; así como quien alega la obligación prueba su existencia.",
            note: "Art. 1698: obligación o extinción se prueban por quien las alega.",
          },
          {
            id: "c",
            correct: false,
            text: "Nadie, porque el pago se presume por el paso del tiempo.",
            note: "El tiempo puede relacionarse con prescripción, no presume pago sin más.",
          },
        ],
      },
      {
        id: "q-boss-3",
        bossLine:
          "Llamas novación a cualquier abono. Cuidado: esa palabra cobra caro.",
        prompt: "¿Qué distingue a la novación frente al pago parcial?",
        idealAction: "contraargumentar",
        articleId: "art-1567",
        trap: "Trampa: confundir extinción transformadora con cumplimiento parcial.",
        choices: [
          {
            id: "a",
            correct: false,
            text: "Toda entrega parcial nova automáticamente la obligación.",
            note: "La novación exige intención y sustitución obligacional.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-1567",
            text: "La novación extingue una obligación sustituyéndola por otra; el pago parcial sólo cumple en parte.",
            note: "Buena distinción entre transformación y cumplimiento.",
          },
          {
            id: "c",
            correct: false,
            text: "La novación sólo existe en responsabilidad extracontractual.",
            note: "No corresponde a ese ámbito restringido.",
          },
        ],
      },
    ],
  },
  {
    id: "guardian-validez",
    districtId: "acto-juridico",
    title: "Torre de la Validez",
    subtitle: "La voluntad entra, la nulidad espera.",
    bossName: "Prof. Severino Lex",
    kind: "boss",
    hp: 230,
    rewards: {
      exp: 280,
      reputation: 18,
      relicId: "espiritu-alessandri",
      articleIds: ["art-1445", "art-1451", "art-1458", "art-1460", "art-1467"],
    },
    questions: [
      {
        id: "q-aj-1",
        bossLine:
          "Un acto parece impecable porque todos firmaron. Pero el Código no mira sólo tinta.",
        prompt: "¿Qué requisitos ordenan la validez del acto jurídico según la ruta del art. 1445?",
        idealAction: "argumentar",
        articleId: "art-1445",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-1445",
            text: "Capacidad, consentimiento no viciado, objeto lícito y causa lícita, sin olvidar solemnidades cuando la ley las exige.",
            note: "La respuesta separa existencia, validez y formalidades exigidas.",
          },
          {
            id: "b",
            correct: false,
            text: "Sólo firma, precio y entrega material.",
            note: "Eso confunde requisitos generales con elementos de contratos particulares.",
          },
          {
            id: "c",
            correct: false,
            text: "Buena fe, equidad y ausencia de perjuicio.",
            note: "Son criterios relevantes, pero no reemplazan la estructura de validez.",
          },
        ],
      },
      {
        id: "q-aj-2",
        bossLine:
          "La lesión enorme se disfraza de vicio universal. ¿La dejarás pasar?",
        prompt: "¿Cuál es la trampa sobre lesión enorme en Chile?",
        idealAction: "contraargumentar",
        articleId: "art-1451",
        trap: "Trampa: tratar lesión enorme como vicio general del consentimiento.",
        choices: [
          {
            id: "a",
            correct: false,
            text: "Es siempre un vicio del consentimiento junto al error, fuerza y dolo.",
            note: "Los PPT la marcan expresamente como no vicio general en Chile.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-1451",
            text: "No es vicio general; opera sólo en casos específicos y con sanciones especiales.",
            note: "Gran defensa: evita convertir un remedio especial en regla universal.",
          },
          {
            id: "c",
            correct: false,
            text: "No existe en ningún caso del Código Civil.",
            note: "Sí existe en supuestos como compraventa de inmuebles, permuta, partición y cláusula penal.",
          },
        ],
      },
      {
        id: "q-aj-3",
        bossLine:
          "El objeto ilícito no se arregla con una sonrisa notarial.",
        prompt: "¿Qué consecuencia produce el objeto ilícito en el acto o contrato?",
        idealAction: "citar",
        articleId: "art-1460",
        choices: [
          {
            id: "a",
            correct: false,
            text: "Nulidad relativa porque protege sólo a una parte.",
            note: "Objeto ilícito se vincula con nulidad absoluta.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-1460",
            text: "Nulidad absoluta, porque falta un requisito de validez exigido en consideración al acto.",
            note: "El PPT recalca nulidad absoluta para objeto ilícito.",
          },
          {
            id: "c",
            correct: false,
            text: "Inoponibilidad automática frente a terceros, pero el contrato queda sano entre partes.",
            note: "La inoponibilidad no reemplaza la sanción de objeto ilícito.",
          },
        ],
      },
    ],
  },
  {
    id: "lord-solidarius",
    districtId: "obligaciones",
    title: "Cámara de las Voces Múltiples",
    subtitle: "Un acreedor, muchos deudores, una deuda que no se divide sola.",
    bossName: "Lord Solidarius",
    kind: "boss",
    hp: 240,
    unlocksAfter: ["modalidades-reloj"],
    rewards: {
      exp: 260,
      reputation: 20,
      relicId: "tratado-abeliuk",
      articleIds: ["art-1511", "art-1568", "art-1567"],
    },
    questions: [
      {
        id: "q-sol-1",
        bossLine:
          "Tres codeudores. Una prestación divisible. Un acreedor impaciente. ¿Basta la pluralidad?",
        prompt: "¿Qué elementos exige una obligación solidaria?",
        idealAction: "argumentar",
        articleId: "art-1511",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-1511",
            text: "Pluralidad de sujetos, prestación divisible, unidad de prestación, pluralidad de vínculos y fuente expresa.",
            note: "El PPT insiste: no hay solidaridad sin fuente.",
          },
          {
            id: "b",
            correct: false,
            text: "Pluralidad de deudores y cualquier deuda de dinero.",
            note: "La deuda de dinero puede ser divisible, pero falta fuente expresa.",
          },
          {
            id: "c",
            correct: false,
            text: "Una deuda indivisible y varios herederos.",
            note: "La solidaridad se distingue de la indivisibilidad.",
          },
        ],
      },
      {
        id: "q-sol-2",
        bossLine:
          "Un codeudor sin interés paga todo. El profesor levanta la ceja.",
        prompt: "Si paga el codeudor que no tenía interés en la deuda, ¿qué ocurre en la fase interna?",
        idealAction: "interpretar",
        articleId: "art-1511",
        trap: "Trampa: creer que siempre se divide en partes iguales después del pago.",
        choices: [
          {
            id: "a",
            correct: false,
            text: "Sólo puede cobrar su cuota, porque la solidaridad siempre desaparece internamente.",
            note: "El PPT distingue si el pago interesaba a todos o sólo a algunos.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-1511",
            text: "Se subroga para dirigirse contra los interesados por el total, subsistiendo la solidaridad.",
            note: "Muy buen cierre de contribución a la deuda.",
          },
          {
            id: "c",
            correct: false,
            text: "No tiene acción porque pagó deuda ajena voluntariamente.",
            note: "La solidaridad pasiva abre subrogación y reembolso según el caso.",
          },
        ],
      },
    ],
  },
  {
    id: "bosque-posesion",
    districtId: "bienes",
    title: "Bosque de la Posesión",
    subtitle: "Título, modo, tenencia y ánimo de señor.",
    bossName: "Guardiana de la Posesión",
    kind: "boss",
    hp: 220,
    rewards: {
      exp: 245,
      reputation: 16,
      relicId: "codigo-bello",
      articleIds: ["art-582", "art-588", "art-670", "art-700", "art-714"],
    },
    questions: [
      {
        id: "q-bienes-1",
        bossLine:
          "El comprador tiene contrato. ¿Tiene dominio? No respondas como mercader apurado.",
        prompt: "¿Por qué la compraventa no basta para adquirir dominio?",
        idealAction: "interpretar",
        articleId: "art-588",
        trap: "Trampa: confundir título traslaticio con modo de adquirir.",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-588",
            text: "Porque la compraventa es título; el dominio requiere un modo, normalmente la tradición.",
            note: "Bienes vive de esta distinción: título más modo.",
          },
          {
            id: "b",
            correct: false,
            text: "Porque la compraventa chilena nunca genera obligaciones.",
            note: "Sí genera obligaciones; lo que no produce sola es tradición.",
          },
          {
            id: "c",
            correct: false,
            text: "Porque sólo la sucesión por causa de muerte transfiere dominio.",
            note: "El art. 588 enumera varios modos.",
          },
        ],
      },
      {
        id: "q-bienes-2",
        bossLine:
          "El arrendatario vive en la casa hace años. ¿Poseedor o tenedor?",
        prompt: "¿Qué distingue la posesión de la mera tenencia?",
        idealAction: "contraargumentar",
        articleId: "art-714",
        choices: [
          {
            id: "a",
            correct: false,
            text: "La mera tenencia se convierte siempre en posesión por el solo paso del tiempo.",
            note: "La mera tenencia reconoce dominio ajeno.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-700",
            text: "La posesión exige tenencia con ánimo de señor o dueño; la mera tenencia se ejerce a nombre del dueño.",
            note: "La clave es el ánimo y el reconocimiento de dominio ajeno.",
          },
          {
            id: "c",
            correct: false,
            text: "La posesión sólo existe si hay escritura pública.",
            note: "La inscripción importa en ciertos bienes, pero no define por sí sola toda posesión.",
          },
        ],
      },
    ],
  },
  {
    id: "mercado-saneamiento",
    districtId: "compraventa",
    title: "Mercado del Trato",
    subtitle: "Precio, cosa, riesgos y saneamientos.",
    bossName: "Mercader Pactos",
    kind: "boss",
    hp: 250,
    rewards: {
      exp: 275,
      reputation: 18,
      relicId: "pluma-claro",
      articleIds: ["art-1793", "art-1826", "art-1888", "art-1489"],
    },
    questions: [
      {
        id: "q-cv-1",
        bossLine:
          "Te vendo una casa, pero la entrega no es lo mismo que el dominio.",
        prompt: "¿Cuál es el concepto base de compraventa y su efecto central?",
        idealAction: "atacar",
        articleId: "art-1793",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-1793",
            text: "Una parte se obliga a dar una cosa y la otra a pagarla en dinero; opera como título traslaticio.",
            note: "El PPT recalca eficacia obligacional: título traslaticio.",
          },
          {
            id: "b",
            correct: false,
            text: "Transfiere inmediatamente el dominio por el solo consentimiento.",
            note: "En Chile se requiere título y modo.",
          },
          {
            id: "c",
            correct: false,
            text: "Es siempre solemne, aunque verse sobre bienes muebles.",
            note: "Generalmente es consensual, con excepciones solemnes.",
          },
        ],
      },
      {
        id: "q-cv-2",
        bossLine:
          "Elizabeth descubre daños estructurales ocultos después de comprar.",
        prompt: "¿Qué debe identificar primero en un caso de vicios redhibitorios?",
        idealAction: "argumentar",
        articleId: "art-1793",
        choices: [
          {
            id: "a",
            correct: false,
            text: "Si el comprador se arrepintió del precio.",
            note: "El arrepentimiento no estructura vicio redhibitorio.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-1793",
            text: "Que el vicio existía al tiempo de la venta, era grave y estaba oculto.",
            note: "Esa triada viene directa del PPT de compraventa.",
          },
          {
            id: "c",
            correct: false,
            text: "Que la cosa haya sido robada por un tercero.",
            note: "Eso se acerca a evicción, no a vicio oculto.",
          },
        ],
      },
      {
        id: "q-cv-3",
        bossLine:
          "El precio de inmueble fue una sombra del justo precio.",
        prompt: "¿Cómo debes tratar la lesión enorme en compraventa de inmuebles?",
        idealAction: "contraargumentar",
        articleId: "art-1888",
        trap: "Trampa: responder como nulidad relativa ordinaria.",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-1888",
            text: "Como rescisión especial o ajuste del precio, no como vicio general del consentimiento.",
            note: "El PPT remarca que no es rescisión general como nulidad relativa.",
          },
          {
            id: "b",
            correct: false,
            text: "Como dolo automático del vendedor.",
            note: "Puede haber dolo en otro caso, pero la lesión tiene régimen propio.",
          },
          {
            id: "c",
            correct: false,
            text: "Como inoponibilidad frente a todo tercero poseedor.",
            note: "La lesión se trata por reglas especiales de compraventa de inmuebles.",
          },
        ],
      },
    ],
  },
  {
    id: "gremio-encargo",
    districtId: "mandato",
    title: "Gremio del Encargo",
    subtitle: "Confianza, cuenta y riesgo.",
    bossName: "Agente Mandatario",
    kind: "boss",
    hp: 215,
    rewards: {
      exp: 240,
      reputation: 16,
      relicId: "sello-de-ejecucion",
      articleIds: ["art-2116", "art-2128", "art-2158", "art-2163"],
    },
    questions: [
      {
        id: "q-mandato-1",
        bossLine:
          "Camila actúa por María. ¿Qué hace que esto sea mandato y no favor doméstico?",
        prompt: "¿Cuáles son los elementos esenciales del mandato?",
        idealAction: "argumentar",
        articleId: "art-2116",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-2116",
            text: "Confianza, encargo de gestión y actuación por cuenta y riesgo del mandante.",
            note: "Esos tres ejes salen del PPT de mandato.",
          },
          {
            id: "b",
            correct: false,
            text: "Remuneración, escritura pública y representación.",
            note: "La remuneración es de la naturaleza; la representación no es de la esencia.",
          },
          {
            id: "c",
            correct: false,
            text: "Entrega de una cosa y pago de precio.",
            note: "Eso corresponde a compraventa.",
          },
        ],
      },
      {
        id: "q-mandato-2",
        bossLine:
          "La mandataria tiene 16 años. El caso se ríe de la regla general.",
        prompt: "¿Qué regla especial aparece sobre capacidad del mandatario?",
        idealAction: "citar",
        articleId: "art-2128",
        choices: [
          {
            id: "a",
            correct: false,
            text: "El mandatario siempre debe ser plenamente capaz de enajenar.",
            note: "El PPT destaca la regla especial del menor adulto mandatario.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-2128",
            text: "Puede ser menor adulto, y sus actos como representante del mandante pueden ser válidos.",
            note: "La pregunta exige distinguir capacidad del mandante y del mandatario.",
          },
          {
            id: "c",
            correct: false,
            text: "Todo acto del menor adulto mandatario es inexistente.",
            note: "Respuesta demasiado amplia y contraria a la regla especial.",
          },
        ],
      },
      {
        id: "q-mandato-3",
        bossLine:
          "El encargo terminó, pero alguien siguió actuando.",
        prompt: "¿Qué causales típicas terminan el mandato?",
        idealAction: "atacar",
        articleId: "art-2163",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-2163",
            text: "Cumplimiento, vencimiento o condición, revocación, renuncia, muerte, quiebra o insolvencia.",
            note: "Buena lista de término según el PPT.",
          },
          {
            id: "b",
            correct: false,
            text: "Sólo pago del precio y entrega de la cosa.",
            note: "Eso no corresponde a mandato.",
          },
          {
            id: "c",
            correct: false,
            text: "Nunca termina si fue conferido en escritura pública.",
            note: "La solemnidad no lo vuelve perpetuo.",
          },
        ],
      },
    ],
  },
  {
    id: "fortaleza-persecucion",
    districtId: "hipoteca",
    title: "Fortaleza de la Persecución",
    subtitle: "El inmueble cambia de manos; el gravamen no se asusta.",
    bossName: "Guardián Hipotecario",
    kind: "boss",
    hp: 270,
    rewards: {
      exp: 300,
      reputation: 22,
      relicId: "báculo-probatorio",
      articleIds: ["art-2407", "art-2415", "art-2428", "art-2434"],
    },
    questions: [
      {
        id: "q-hip-1",
        bossLine:
          "La hipoteca no arrebata la casa, pero tampoco duerme.",
        prompt: "¿Cuál es el concepto y carácter central de la hipoteca?",
        idealAction: "citar",
        articleId: "art-2407",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-2407",
            text: "Derecho de prenda constituido sobre inmuebles que permanecen en poder del deudor; garantía real, accesoria e indivisible.",
            note: "Concepto legal más rasgos de examen.",
          },
          {
            id: "b",
            correct: false,
            text: "Contrato principal que exige entregar el inmueble al acreedor.",
            note: "La cosa no deja de permanecer en poder del deudor.",
          },
          {
            id: "c",
            correct: false,
            text: "Caución personal equivalente a fianza simple.",
            note: "La hipoteca es garantía real.",
          },
        ],
      },
      {
        id: "q-hip-2",
        bossLine:
          "El deudor vende el inmueble hipotecado. ¿La fortaleza cae?",
        prompt: "¿Qué ocurre si el dueño vende un inmueble gravado con hipoteca?",
        idealAction: "interpretar",
        articleId: "art-2415",
        trap: "Trampa: creer que la hipoteca prohíbe toda enajenación.",
        choices: [
          {
            id: "a",
            correct: false,
            text: "La venta es siempre nula por objeto ilícito.",
            note: "La hipoteca no equivale por sí sola a prohibición de enajenar.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-2415",
            text: "Puede enajenarlo, pero el acreedor conserva persecución y preferencia según la hipoteca.",
            note: "Art. 2415 más derecho de persecución.",
          },
          {
            id: "c",
            correct: false,
            text: "La hipoteca se extingue automáticamente por la venta.",
            note: "Precisamente puede perseguirse la finca.",
          },
        ],
      },
      {
        id: "q-hip-3",
        bossLine:
          "El tercero poseedor escucha pasos en el registro.",
        prompt: "¿Qué significa el derecho de persecución hipotecaria?",
        idealAction: "citar",
        articleId: "art-2428",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-2428",
            text: "El acreedor puede perseguir la finca hipotecada sea quien fuere quien la posea y a cualquier título.",
            note: "Es la frase clave del art. 2428.",
          },
          {
            id: "b",
            correct: false,
            text: "Sólo puede demandar al deudor personal, jamás al tercero poseedor.",
            note: "Eso negaría la acción hipotecaria.",
          },
          {
            id: "c",
            correct: false,
            text: "Puede quedarse con la finca automáticamente sin juicio.",
            note: "Debe ejercer los derechos legales de realización.",
          },
        ],
      },
    ],
  },
  {
    id: "santuario-1554",
    districtId: "promesa",
    title: "Santuario del 1554",
    subtitle: "Un contrato futuro que sólo obliga si está bien escrito.",
    bossName: "Jurista Promenio",
    kind: "boss",
    hp: 225,
    rewards: {
      exp: 250,
      reputation: 18,
      relicId: "pluma-claro",
      articleIds: ["art-1554", "art-1793", "art-1489"],
    },
    questions: [
      {
        id: "q-prom-1",
        bossLine:
          "La promesa es una puerta, no el contrato definitivo.",
        prompt: "¿Qué requisitos exige el art. 1554 para que la promesa obligue?",
        idealAction: "citar",
        articleId: "art-1554",
        choices: [
          {
            id: "a",
            correct: true,
            articleId: "art-1554",
            text: "Escrito, contrato prometido eficaz, plazo o condición que fije época y especificación suficiente del contrato prometido.",
            note: "Es la lista que hay que recitar sin temblar.",
          },
          {
            id: "b",
            correct: false,
            text: "Sólo acuerdo verbal y precio determinado.",
            note: "La promesa exige constar por escrito y fijar época.",
          },
          {
            id: "c",
            correct: false,
            text: "Entrega anticipada de llaves y posesión material.",
            note: "Eso puede crear problemas de hecho, pero no reemplaza el 1554.",
          },
        ],
      },
      {
        id: "q-prom-2",
        bossLine:
          "Manuel se arrepiente porque Juan ofrece más dinero.",
        prompt: "Si la promesa de compraventa de inmueble cumple el 1554, ¿qué obligación nace?",
        idealAction: "argumentar",
        articleId: "art-1554",
        choices: [
          {
            id: "a",
            correct: false,
            text: "Transferir inmediatamente el dominio del inmueble.",
            note: "La promesa no es contrato definitivo ni tradición.",
          },
          {
            id: "b",
            correct: true,
            articleId: "art-1554",
            text: "Una obligación de hacer: otorgar el contrato prometido.",
            note: "El PPT lo marca como efecto principal.",
          },
          {
            id: "c",
            correct: false,
            text: "Una obligación natural sin acción.",
            note: "Si cumple requisitos, sí produce obligación exigible.",
          },
        ],
      },
    ],
  },
];

export const baseStats: Record<StatKey, number> = {
  conocimiento: 42,
  estrategia: 28,
  oratoria: 34,
  memoria: 31,
  temple: 24,
};

export const initialGameState: GameState = {
  level: 1,
  exp: 0,
  reputation: 12,
  trauma: 0,
  seals: 2,
  activeDistrictId: "obligaciones",
  completedEncounters: [],
  solvedCases: [],
  classifierWins: 0,
  reviewedFlashcards: {},
  unlockedArticles: ["art-1437"],
  relics: ["sello-de-ejecucion"],
  equippedRelics: ["sello-de-ejecucion"],
  articleMastery: {
    "art-1437": 1,
  },
  combat: null,
  activity: [
    {
      id: "log-inicio",
      tone: "neutral",
      text: "Ingresaste al Reino de Bello. El Distrito de las Obligaciones abrió sus puertas.",
    },
  ],
};

export function getLevelProgress(exp: number) {
  let level = 1;
  let current = exp;

  while (current >= level * 220) {
    current -= level * 220;
    level += 1;
  }

  const needed = level * 220;
  return {
    level,
    needed,
    current,
    percent: Math.min(100, (current / needed) * 100),
  };
}

export function getArticle(id: string) {
  return articles.find((article) => article.id === id);
}

export function getRelic(id: string) {
  return relics.find((relic) => relic.id === id);
}

export function getEncounter(id: string) {
  return encounters.find((encounter) => encounter.id === id);
}

export function getDistrict(id: string) {
  return districts.find((district) => district.id === id);
}
