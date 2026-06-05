export type CaseOption = {
  id: string;
  label: string;
  correct: boolean;
  articleId: string;
  concept: string;
  feedback: string;
};

export type LegalCase = {
  id: string;
  title: string;
  world: string;
  difficulty: number;
  dossier: string;
  facts: string[];
  question: string;
  options: CaseOption[];
  resolution: string;
  reward: {
    exp: number;
    reputation: number;
    articleIds: string[];
  };
};

export type ClassifierRound = {
  id: string;
  title: string;
  prompt: string;
  columns: string[];
  items: {
    id: string;
    label: string;
    answer: string;
    articleId: string;
    explanation: string;
  }[];
};

export type Flashcard = {
  id: string;
  world: string;
  articleId: string;
  front: string;
  back: string;
  mnemonic: string;
};

export type AchievementRule =
  | { kind: "encounters"; target: number }
  | { kind: "cases"; target: number }
  | { kind: "classifier"; target: number }
  | { kind: "flashcards"; target: number }
  | { kind: "articles"; target: number }
  | { kind: "reputation"; target: number };

export type Achievement = {
  id: string;
  title: string;
  description: string;
  reward: string;
  rule: AchievementRule;
};

export const legalCases: LegalCase[] = [
  {
    id: "cv-vicio-oculto",
    title: "Casa con daño estructural oculto",
    world: "Compraventa",
    difficulty: 3,
    dossier:
      "Elizabeth compra una casa para vivir con su hijo. Meses después de inscrita la compraventa, una lluvia deja ver daños estructurales preexistentes que no fueron informados.",
    facts: [
      "La compraventa recae sobre inmueble.",
      "El defecto existía al tiempo de la venta.",
      "El daño era oculto y grave para el uso natural de la casa.",
      "La compradora busca remedio frente al vendedor.",
    ],
    question: "¿Qué institución debes activar primero?",
    options: [
      {
        id: "redhibitorio",
        label: "Vicios redhibitorios: rescisión o rebaja proporcional",
        correct: true,
        articleId: "art-1793",
        concept: "Saneamiento por vicios ocultos",
        feedback:
          "Correcto. El caso exige probar vicio existente al tiempo de la venta, grave y oculto; luego elegir acción redhibitoria o rebaja.",
      },
      {
        id: "lesion",
        label: "Lesión enorme por precio injusto",
        correct: false,
        articleId: "art-1888",
        concept: "Lesión enorme",
        feedback:
          "La lesión mira desproporción del precio, no defectos ocultos de la cosa.",
      },
      {
        id: "nulidad",
        label: "Nulidad absoluta por falta de causa",
        correct: false,
        articleId: "art-1467",
        concept: "Causa",
        feedback:
          "Nada indica falta o ilicitud de causa; el conflicto nace del saneamiento de la cosa vendida.",
      },
    ],
    resolution:
      "Respuesta de examen: identificar compraventa, obligación de saneamiento, vicio oculto grave existente al tiempo de la venta y remedios del comprador.",
    reward: {
      exp: 150,
      reputation: 8,
      articleIds: ["art-1793"],
    },
  },
  {
    id: "promesa-mandato-menor",
    title: "Promesa firmada por mandataria menor adulto",
    world: "Mandato y promesa",
    difficulty: 4,
    dossier:
      "María encarga a Camila, de 16 años, comprar un departamento. Camila firma promesa de compraventa con Manuel para celebrar la compraventa en fecha determinada.",
    facts: [
      "Hay encargo de gestión por cuenta y riesgo de María.",
      "Camila es menor adulto.",
      "La promesa tiene fecha para celebrar la compraventa.",
      "Manuel luego se niega porque recibió mejor oferta.",
    ],
    question: "¿Qué cadena de análisis es más sólida?",
    options: [
      {
        id: "mandato-promesa",
        label: "Mandato: capacidad especial del mandatario; promesa: revisar requisitos del 1554",
        correct: true,
        articleId: "art-1554",
        concept: "Mandato con promesa",
        feedback:
          "Correcto. Primero separas mandato y promesa, luego revisas capacidad especial del mandatario y exigibilidad de otorgar el contrato prometido.",
      },
      {
        id: "nulo-menor",
        label: "Todo es nulo porque una menor adulto jamás puede ser mandataria",
        correct: false,
        articleId: "art-2128",
        concept: "Capacidad del mandatario",
        feedback:
          "Demasiado amplio. El PPT destaca una regla especial para el menor adulto mandatario.",
      },
      {
        id: "venta-perfecta",
        label: "Ya se perfeccionó la compraventa y se transfirió el dominio",
        correct: false,
        articleId: "art-670",
        concept: "Título y modo",
        feedback:
          "La promesa no equivale a compraventa definitiva ni a tradición.",
      },
    ],
    resolution:
      "La respuesta ganadora distingue mandato, representación, capacidad del mandatario y promesa como obligación de hacer si cumple el art. 1554.",
    reward: {
      exp: 180,
      reputation: 10,
      articleIds: ["art-2116", "art-2128", "art-1554"],
    },
  },
  {
    id: "hipoteca-tercero",
    title: "Inmueble hipotecado vendido a tercero",
    world: "Hipoteca",
    difficulty: 4,
    dossier:
      "Un deudor vende un inmueble hipotecado. El comprador sostiene que la venta borró el gravamen porque él no firmó la obligación principal.",
    facts: [
      "La hipoteca fue constituida e inscrita antes de la venta.",
      "El inmueble permanece materialmente en poder del nuevo dueño.",
      "El acreedor no ha sido pagado.",
      "El tercero pretende desconocer la persecución.",
    ],
    question: "¿Cuál es la respuesta de examen?",
    options: [
      {
        id: "persecucion",
        label: "Puede venderse, pero el acreedor conserva persecución y preferencia",
        correct: true,
        articleId: "art-2428",
        concept: "Derecho de persecución",
        feedback:
          "Correcto. Art. 2415 permite enajenar; art. 2428 permite perseguir la finca hipotecada en manos de tercero.",
      },
      {
        id: "nula",
        label: "La venta es nula por existir hipoteca",
        correct: false,
        articleId: "art-2415",
        concept: "Facultad de enajenar",
        feedback:
          "La hipoteca no impide por sí sola enajenar; el gravamen sigue a la finca.",
      },
      {
        id: "extinguida",
        label: "La hipoteca se extingue automáticamente con cada venta",
        correct: false,
        articleId: "art-2434",
        concept: "Extinción de hipoteca",
        feedback:
          "La extinción exige causal; la venta a tercero no la extingue por sí sola.",
      },
    ],
    resolution:
      "La estructura correcta: contrato de hipoteca, derecho real inscrito, accesoriedad, facultad de enajenar, persecución contra tercero poseedor.",
    reward: {
      exp: 190,
      reputation: 12,
      articleIds: ["art-2407", "art-2415", "art-2428"],
    },
  },
  {
    id: "solidaridad-pago",
    title: "Codeudor sin interés paga el total",
    world: "Obligaciones solidarias",
    difficulty: 5,
    dossier:
      "Tres codeudores solidarios aparecen en una obligación divisible. Uno de ellos no tenía interés real en la deuda, pero paga el total al acreedor.",
    facts: [
      "La solidaridad fue pactada expresamente.",
      "La deuda interesaba sólo a dos codeudores.",
      "El tercero sin interés pagó al acreedor.",
      "Ahora busca recuperar lo pagado.",
    ],
    question: "¿Cómo explicas la fase interna?",
    options: [
      {
        id: "subrogacion-total",
        label: "Se subroga contra los interesados por el total, subsistiendo la solidaridad",
        correct: true,
        articleId: "art-1511",
        concept: "Contribución a la deuda",
        feedback:
          "Correcto. El PPT distingue pago que interesa a todos y pago que interesa sólo a algunos.",
      },
      {
        id: "cuotas-iguales",
        label: "Siempre cobra sólo cuotas iguales de todos",
        correct: false,
        articleId: "art-1511",
        concept: "Solidaridad pasiva",
        feedback:
          "La regla cambia si la deuda no interesaba a todos.",
      },
      {
        id: "sin-accion",
        label: "Pierde acción por pagar deuda ajena",
        correct: false,
        articleId: "art-1568",
        concept: "Pago",
        feedback:
          "El pago tiene efectos extintivos frente al acreedor y abre relaciones internas.",
      },
    ],
    resolution:
      "Respuesta oral: acreedor queda pagado; internamente se analiza interés en la deuda, subrogación, reembolso y subsistencia o no de solidaridad.",
    reward: {
      exp: 210,
      reputation: 14,
      articleIds: ["art-1511"],
    },
  },
  {
    id: "acto-dolo-lesion",
    title: "Contrato ventajoso con engaño y precio bajo",
    world: "Acto jurídico",
    difficulty: 4,
    dossier:
      "Una parte oculta información decisiva para inducir a contratar. Además, el precio parece desproporcionado, pero el contrato no es de aquellos con lesión enorme regulada.",
    facts: [
      "Hubo maniobra o artificio de una parte.",
      "El engaño fue determinante para contratar.",
      "La desproporción no encaja en caso especial de lesión enorme.",
      "La parte afectada pide dejar sin efecto e indemnización.",
    ],
    question: "¿Qué institución lidera la respuesta?",
    options: [
      {
        id: "dolo",
        label: "Dolo como vicio del consentimiento, con nulidad relativa e indemnización",
        correct: true,
        articleId: "art-1458",
        concept: "Dolo determinante",
        feedback:
          "Correcto. Determinante y obra de una parte: nulidad relativa e indemnización según el enfoque del PPT.",
      },
      {
        id: "lesion",
        label: "Lesión enorme como vicio general",
        correct: false,
        articleId: "art-1451",
        concept: "Lesión enorme",
        feedback:
          "La lesión no es vicio general en Chile y requiere supuesto legal específico.",
      },
      {
        id: "inexistencia",
        label: "Inexistencia por falta total de voluntad",
        correct: false,
        articleId: "art-1445",
        concept: "Existencia",
        feedback:
          "Aquí hubo voluntad, pero viciada; no falta total de consentimiento.",
      },
    ],
    resolution:
      "La clave es no dejarse atraer por el precio bajo: si no hay caso especial de lesión, analiza dolo determinante.",
    reward: {
      exp: 170,
      reputation: 10,
      articleIds: ["art-1458", "art-1451"],
    },
  },
  {
    id: "bienes-arrendatario",
    title: "Arrendatario que se cree dueño por los años",
    world: "Bienes",
    difficulty: 3,
    dossier:
      "Una persona arrienda una casa durante largo tiempo y luego afirma que, por vivir ahí, adquirió posesión útil para prescribir.",
    facts: [
      "Entró al inmueble reconociendo dominio ajeno.",
      "Su título es arrendamiento.",
      "Ha tenido tenencia material prolongada.",
      "No se describe interversión del título.",
    ],
    question: "¿Qué clasificación debes usar?",
    options: [
      {
        id: "mera-tenencia",
        label: "Mera tenencia: actúa a nombre del dueño, no como señor y dueño",
        correct: true,
        articleId: "art-714",
        concept: "Mera tenencia",
        feedback:
          "Correcto. El punto decisivo es el reconocimiento de dominio ajeno.",
      },
      {
        id: "poseedor",
        label: "Poseedor regular sólo por el paso de los años",
        correct: false,
        articleId: "art-700",
        concept: "Posesión",
        feedback:
          "Falta ánimo de señor y dueño; el título revela mera tenencia.",
      },
      {
        id: "tradente",
        label: "Tradente por tradición ficta",
        correct: false,
        articleId: "art-670",
        concept: "Tradición",
        feedback:
          "No hay entrega con intención de transferir y adquirir dominio.",
      },
    ],
    resolution:
      "Respuesta de grado: separar corpus y animus, identificar título de mera tenencia y explicar por qué el tiempo por sí solo no basta.",
    reward: {
      exp: 140,
      reputation: 8,
      articleIds: ["art-700", "art-714"],
    },
  },
];

export const classifierRounds: ClassifierRound[] = [
  {
    id: "obligaciones-objeto",
    title: "Clasificador de prestaciones",
    prompt: "Clasifica cada situación según el objeto o intensidad de la obligación.",
    columns: ["Dar", "Hacer fungible", "Hacer no fungible", "No hacer", "Medios", "Resultado"],
    items: [
      {
        id: "dar-dominio",
        label: "Transferir el dominio de una casa",
        answer: "Dar",
        articleId: "art-1460",
        explanation: "Obligación de dar: transferir dominio o constituir un derecho real.",
      },
      {
        id: "hacer-fungible",
        label: "Construir una bodega estándar",
        answer: "Hacer fungible",
        articleId: "art-1460",
        explanation: "Puede ejecutarla otra persona sin depender de talento especial del deudor.",
      },
      {
        id: "hacer-no-fungible",
        label: "Pintar un retrato por artista específico",
        answer: "Hacer no fungible",
        articleId: "art-1460",
        explanation: "Requiere aptitud personal del deudor.",
      },
      {
        id: "no-hacer",
        label: "No abrir un local competidor por dos años",
        answer: "No hacer",
        articleId: "art-1460",
        explanation: "Consiste en abstenerse de un hecho que sería lícito sin prohibición.",
      },
      {
        id: "medios",
        label: "Abogado que patrocina con diligencia un juicio",
        answer: "Medios",
        articleId: "art-1698",
        explanation: "Compromete conducta diligente, no un resultado garantizado.",
      },
      {
        id: "resultado",
        label: "Transportista que debe entregar mercaderías en destino",
        answer: "Resultado",
        articleId: "art-1460",
        explanation: "Se obliga a obtener el resultado pactado.",
      },
    ],
  },
  {
    id: "contratos-rasgos",
    title: "Clasificador contractual",
    prompt: "Elige el rasgo dominante pedido por el profesor.",
    columns: ["Bilateral oneroso", "Accesorio", "Preparatorio", "Confianza", "Solemne", "Título traslaticio"],
    items: [
      {
        id: "cv",
        label: "Compraventa",
        answer: "Título traslaticio",
        articleId: "art-1793",
        explanation: "La compraventa genera obligación y sirve de título traslaticio; no transfiere sola.",
      },
      {
        id: "hipoteca",
        label: "Hipoteca",
        answer: "Accesorio",
        articleId: "art-2407",
        explanation: "La hipoteca garantiza una obligación principal y sigue su suerte.",
      },
      {
        id: "promesa",
        label: "Promesa",
        answer: "Preparatorio",
        articleId: "art-1554",
        explanation: "Prepara la celebración de un contrato futuro.",
      },
      {
        id: "mandato",
        label: "Mandato",
        answer: "Confianza",
        articleId: "art-2116",
        explanation: "Su eje es confiar la gestión de uno o más negocios por cuenta y riesgo del mandante.",
      },
      {
        id: "hipoteca-ep",
        label: "Contrato de hipoteca",
        answer: "Solemne",
        articleId: "art-2407",
        explanation: "El contrato exige escritura pública e inscripción para el derecho real.",
      },
      {
        id: "cv-base",
        label: "Compraventa común",
        answer: "Bilateral oneroso",
        articleId: "art-1793",
        explanation: "Obliga a ambas partes y reporta utilidad recíproca.",
      },
    ],
  },
];

export const flashcards: Flashcard[] = [
  {
    id: "fc-1554",
    world: "Promesa",
    articleId: "art-1554",
    front: "Promesa: enumera los cuatro requisitos que la hacen obligatoria.",
    back: "Escrito; contrato prometido eficaz; plazo o condición que fije época; especificación suficiente del contrato prometido.",
    mnemonic: "E-E-P-E: Escrito, Eficaz, Plazo/condición, Especificado.",
  },
  {
    id: "fc-1511",
    world: "Obligaciones",
    articleId: "art-1511",
    front: "Solidaridad: ¿por qué no basta que existan varios deudores?",
    back: "Porque la solidaridad no se presume: requiere fuente expresa en ley, testamento o convención.",
    mnemonic: "Pluralidad no es solidaridad: falta la fuente.",
  },
  {
    id: "fc-2407",
    world: "Hipoteca",
    articleId: "art-2407",
    front: "Define hipoteca en una frase de examen.",
    back: "Derecho de prenda sobre inmuebles que permanecen en poder del deudor; garantía real, accesoria e indivisible.",
    mnemonic: "Inmueble, sin desplazamiento, garantía real.",
  },
  {
    id: "fc-2428",
    world: "Hipoteca",
    articleId: "art-2428",
    front: "¿Qué significa persecución hipotecaria?",
    back: "El acreedor puede perseguir la finca hipotecada sea quien fuere quien la posea y a cualquier título.",
    mnemonic: "La finca corre; la hipoteca la sigue.",
  },
  {
    id: "fc-1793",
    world: "Compraventa",
    articleId: "art-1793",
    front: "Compraventa: concepto y advertencia de título/modo.",
    back: "Una parte se obliga a dar una cosa y la otra a pagarla en dinero; es título traslaticio, no modo.",
    mnemonic: "Contrato abre la puerta; tradición cruza.",
  },
  {
    id: "fc-1458",
    world: "Acto jurídico",
    articleId: "art-1458",
    front: "Dolo vicio: requisitos mínimos.",
    back: "Maquinación o artificio determinante, obra de una de las partes; genera nulidad relativa e indemnización.",
    mnemonic: "Engaño + parte + determinante.",
  },
  {
    id: "fc-1460",
    world: "Obligaciones",
    articleId: "art-1460",
    front: "Objeto de la obligación.",
    back: "La prestación puede consistir en dar, hacer o no hacer.",
    mnemonic: "D-H-NH.",
  },
  {
    id: "fc-2116",
    world: "Mandato",
    articleId: "art-2116",
    front: "Mandato: elementos esenciales.",
    back: "Confianza, encargo de gestión y actuación por cuenta y riesgo del mandante.",
    mnemonic: "C-E-R: Confianza, Encargo, Riesgo.",
  },
  {
    id: "fc-700",
    world: "Bienes",
    articleId: "art-700",
    front: "Posesión: elementos.",
    back: "Tenencia de cosa determinada con ánimo de señor o dueño.",
    mnemonic: "Corpus + animus.",
  },
  {
    id: "fc-714",
    world: "Bienes",
    articleId: "art-714",
    front: "Mera tenencia: frase de descarte.",
    back: "Se ejerce sobre una cosa no como dueño, sino en lugar o a nombre del dueño.",
    mnemonic: "Tengo, pero reconozco dueño ajeno.",
  },
  {
    id: "fc-1489",
    world: "Contratos",
    articleId: "art-1489",
    front: "Resolución por incumplimiento en contrato bilateral.",
    back: "El acreedor puede pedir resolución o cumplimiento, ambos con indemnización, si se cumplen los requisitos.",
    mnemonic: "Bilateral + incumplimiento + opción.",
  },
  {
    id: "fc-1568",
    world: "Obligaciones",
    articleId: "art-1568",
    front: "Pago efectivo.",
    back: "Es la prestación de lo que se debe, conforme al tenor de la obligación.",
    mnemonic: "Pagar es prestar lo debido.",
  },
];

export const achievements: Achievement[] = [
  {
    id: "primer-duelo",
    title: "Primer Interrogatorio",
    description: "Gana tu primer duelo de campaña.",
    reward: "+1 sello de calma",
    rule: { kind: "encounters", target: 1 },
  },
  {
    id: "maestro-hipoteca",
    title: "Maestro de la Hipoteca",
    description: "Completa un caso o duelo hipotecario y desbloquea sus artículos clave.",
    reward: "Título de Guardián Registral",
    rule: { kind: "articles", target: 12 },
  },
  {
    id: "senor-obligaciones",
    title: "Señor de las Obligaciones",
    description: "Supera tres combates de obligaciones.",
    reward: "+ reputación académica",
    rule: { kind: "encounters", target: 3 },
  },
  {
    id: "detective-civil",
    title: "Detective Civil",
    description: "Resuelve tres casos jurídicos.",
    reward: "Ficha de casos complejos",
    rule: { kind: "cases", target: 3 },
  },
  {
    id: "clasificador",
    title: "Clasificador Implacable",
    description: "Gana dos rondas de clasificación.",
    reward: "Bonus de memoria",
    rule: { kind: "classifier", target: 2 },
  },
  {
    id: "guardian-memoria",
    title: "Guardián de la Memoria",
    description: "Repasa ocho flashcards.",
    reward: "Combo de repaso rápido",
    rule: { kind: "flashcards", target: 8 },
  },
  {
    id: "rango-oro",
    title: "Rango Novato Jurídico",
    description: "Alcanza 45 de reputación.",
    reward: "Insignia de la Academia Jurídica",
    rule: { kind: "reputation", target: 45 },
  },
];

export const npcs = [
  {
    name: "Notaria Aurum",
    role: "Experta en acto jurídico",
    line: "Antes de hablar de nulidad, separa existencia, validez y eficacia.",
  },
  {
    name: "Mercader de la Buena Fe",
    role: "Guía de compraventa",
    line: "En todo contrato, la buena fe debe ser ley invisible que lo guía.",
  },
  {
    name: "Agente Mandatario",
    role: "Representante del gremio",
    line: "El encargo se ejecuta por cuenta y riesgo del mandante; no lo olvides.",
  },
  {
    name: "Guardiana de la Posesión",
    role: "Custodia de bienes",
    line: "Quien tiene la cosa no siempre posee: busca el ánimo.",
  },
  {
    name: "Jurista Promenio",
    role: "Guardián del 1554",
    line: "Sin época fijada, la promesa se vuelve niebla.",
  },
];

export const professors = [
  {
    name: "Prof. Severino Lex",
    specialty: "Acto jurídico y nulidad",
    threat: "Repregunta sobre inexistencia, nulidad absoluta y relativa.",
  },
  {
    name: "Lord Solidarius",
    specialty: "Obligaciones solidarias",
    threat: "Pregunta fase externa, luego contribución a la deuda.",
  },
  {
    name: "Profesor Cabello",
    specialty: "Hipoteca",
    threat: "Vende el inmueble a tercero y exige persecución, preferencia y purga.",
  },
  {
    name: "Mercader Pactos",
    specialty: "Compraventa",
    threat: "Mezcla vicios redhibitorios, evicción, lesión y riesgos.",
  },
];

export const futureExpansions = [
  "Modo oral con evaluación de respuesta escrita por rúbrica CNAP: concepto, norma, aplicación y precisión.",
  "Árbol de desbloqueo por profesores reales del grado y perfiles de repregunta.",
  "Editor de casos JSON desde la propia interfaz.",
  "Rutas avanzadas de responsabilidad contractual y extracontractual.",
  "Módulo de bienes completo: reivindicación, posesión inscrita y prescripción adquisitiva.",
];
