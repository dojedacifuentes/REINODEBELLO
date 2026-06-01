import {
  Anchor,
  BookMarked,
  Crown,
  Feather,
  Gavel,
  Ghost,
  Handshake,
  Landmark,
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
  | "inventory"
  | "codex"
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
    id: "obligaciones",
    name: "Distrito de las Obligaciones",
    subtitle: "Fuentes, modalidades, pago y extinción",
    theme: "Deudas vivas, contratos encadenados y juramentos que respiran.",
    boss: "El Cobrador Eterno",
    topics: ["fuentes", "modalidades", "solidaridad", "pago", "novación", "compensación", "remisión"],
    x: 50,
    y: 46,
    playable: true,
    icon: Scale,
  },
  {
    id: "contratos",
    name: "Distrito de los Contratos",
    subtitle: "Consentimiento, objeto, causa y solemnidades",
    theme: "Los pactos caminan de noche y sólo obedecen a su verdadera intención.",
    boss: "El Notario Inmortal",
    topics: ["consentimiento", "capacidad", "objeto", "causa", "solemnidades", "interpretación"],
    x: 18,
    y: 64,
    playable: false,
    icon: Handshake,
  },
  {
    id: "responsabilidad",
    name: "Ciudadela de la Responsabilidad",
    subtitle: "Culpa, dolo, daño y causalidad",
    theme: "Una fortaleza donde cada grieta pregunta quién debe repararla.",
    boss: "La Dama del Daño",
    topics: ["contractual", "extracontractual", "culpa", "dolo", "daño moral", "causalidad"],
    x: 78,
    y: 60,
    playable: false,
    icon: Shield,
  },
  {
    id: "bienes",
    name: "Archipiélago de los Bienes",
    subtitle: "Posesión, dominio, tradición y prescripción",
    theme: "Islas de piedra donde cada cosa exige dueño, título y modo.",
    boss: "El Usurpador",
    topics: ["posesión", "dominio", "tradición", "ocupación", "accesión", "prescripción adquisitiva"],
    x: 73,
    y: 27,
    playable: false,
    icon: Crown,
  },
  {
    id: "sucesiones",
    name: "Criptas de las Sucesiones",
    subtitle: "Herencia, legado y asignaciones",
    theme: "Pasillos testamentarios donde las voces muertas todavía disponen.",
    boss: "El Testador Maldito",
    topics: ["herencia", "legado", "asignaciones", "representación", "transmisión"],
    x: 28,
    y: 30,
    playable: false,
    icon: Landmark,
  },
  {
    id: "familia",
    name: "Templo de la Familia",
    subtitle: "Matrimonio, filiación, alimentos y cuidado personal",
    theme: "Un templo de vínculos, deberes y protección de los más vulnerables.",
    boss: "El Patriarca",
    topics: ["matrimonio", "filiación", "alimentos", "cuidado personal"],
    x: 57,
    y: 76,
    playable: false,
    icon: LibraryBig,
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
