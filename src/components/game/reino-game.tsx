"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  BookOpen,
  ChevronRight,
  CircleDot,
  Compass,
  Flame,
  Gem,
  Lock,
  Map,
  Medal,
  Package,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Swords,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";

import { ParticleField } from "@/components/game/particle-field";
import { Button } from "@/components/ui/button";
import {
  achievements,
  classifierRounds,
  flashcards,
  futureExpansions,
  legalCases,
  npcs,
  professors,
  type Achievement,
  type ClassifierRound,
  type Flashcard,
  type LegalCase,
} from "@/lib/civil-content";
import {
  actionMeta,
  articles,
  baseStats,
  districts,
  encounters,
  getArticle,
  getDistrict,
  getEncounter,
  getLevelProgress,
  getRelic,
  initialGameState,
  relics,
  type ActionKey,
  type CombatLogEntry,
  type GameState,
  type Relic,
  type SceneKey,
  type StatKey,
} from "@/lib/game-data";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "rpg-civil-reino-de-bello-save-v1";
const statKeys: StatKey[] = ["conocimiento", "estrategia", "oratoria", "memoria", "temple"];

const sceneLabels: Record<SceneKey, { label: string; icon: typeof Map }> = {
  map: { label: "Mapa", icon: Map },
  district: { label: "Mundo", icon: Compass },
  combat: { label: "Duelo", icon: Swords },
  cases: { label: "Casos", icon: Archive },
  classifier: { label: "Clasif.", icon: CircleDot },
  memory: { label: "Memoria", icon: Zap },
  inventory: { label: "Reliq.", icon: Package },
  codex: { label: "Códex", icon: BookOpen },
  achievements: { label: "Logros", icon: Trophy },
  profile: { label: "Ficha", icon: UserRound },
};

const mainScenes: SceneKey[] = [
  "map",
  "district",
  "combat",
  "cases",
  "classifier",
  "memory",
  "inventory",
  "codex",
  "achievements",
  "profile",
];

const actionOrder: ActionKey[] = [
  "atacar",
  "argumentar",
  "citar",
  "interpretar",
  "contraargumentar",
  "defender",
];

const actionClasses: Record<ActionKey, string> = {
  atacar: "border-rose-400/55 bg-rose-500/12 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.18)]",
  argumentar: "border-cyan-300/55 bg-cyan-400/12 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.18)]",
  citar: "border-amber-300/60 bg-amber-400/15 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.22)]",
  interpretar: "border-violet-300/55 bg-violet-500/14 text-violet-100 shadow-[0_0_30px_rgba(139,92,246,0.2)]",
  contraargumentar: "border-emerald-300/55 bg-emerald-400/12 text-emerald-100 shadow-[0_0_30px_rgba(52,211,153,0.18)]",
  defender: "border-slate-300/35 bg-slate-300/8 text-slate-100 shadow-[0_0_24px_rgba(148,163,184,0.12)]",
};

const toneClasses: Record<CombatLogEntry["tone"], string> = {
  good: "text-emerald-200",
  bad: "text-rose-200",
  neutral: "text-slate-300",
  reward: "text-amber-200",
};

function makeLog(tone: CombatLogEntry["tone"], text: string): CombatLogEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    tone,
    text,
  };
}

function normalizeSave(value: Partial<GameState>): GameState {
  return {
    ...initialGameState,
    ...value,
    completedEncounters: value.completedEncounters ?? initialGameState.completedEncounters,
    solvedCases: value.solvedCases ?? initialGameState.solvedCases,
    classifierWins: value.classifierWins ?? initialGameState.classifierWins,
    reviewedFlashcards: value.reviewedFlashcards ?? initialGameState.reviewedFlashcards,
    unlockedArticles: value.unlockedArticles ?? initialGameState.unlockedArticles,
    relics: value.relics ?? initialGameState.relics,
    equippedRelics: value.equippedRelics ?? initialGameState.equippedRelics,
    articleMastery: value.articleMastery ?? initialGameState.articleMastery,
    activity: value.activity ?? initialGameState.activity,
    combat: null,
  };
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function isEncounterUnlocked(state: GameState, encounterId: string) {
  const encounter = getEncounter(encounterId);
  if (!encounter) {
    return false;
  }
  return (encounter.unlocksAfter ?? []).every((id) => state.completedEncounters.includes(id));
}

function getPlayerStats(state: GameState) {
  const totals = { ...baseStats };
  for (const relicId of state.equippedRelics) {
    const relic = getRelic(relicId);
    if (relic) {
      totals[relic.stat] += relic.bonus;
    }
  }
  totals.conocimiento += Math.max(0, state.level - 1) * 4;
  totals.memoria += Math.max(0, state.level - 1) * 3;
  totals.temple += Math.max(0, state.level - 1) * 2;
  totals.memoria = Math.max(8, totals.memoria - Math.floor(state.trauma / 4));
  totals.temple = Math.max(8, totals.temple - Math.floor(state.trauma / 5));
  return totals;
}

function getRarityClass(relic: Relic) {
  return cn(
    relic.rarity === "Mitico" && "border-fuchsia-300/60 text-fuchsia-100 shadow-[0_0_34px_rgba(217,70,239,0.22)]",
    relic.rarity === "Legendario" && "border-amber-300/65 text-amber-100 shadow-[0_0_34px_rgba(245,158,11,0.2)]",
    relic.rarity === "Epico" && "border-violet-300/60 text-violet-100 shadow-[0_0_28px_rgba(139,92,246,0.18)]",
    relic.rarity === "Raro" && "border-cyan-300/55 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.16)]",
    relic.rarity === "Comun" && "border-slate-300/30 text-slate-100",
  );
}

function getReviewedCount(state: GameState) {
  return Object.values(state.reviewedFlashcards).reduce((total, value) => total + value, 0);
}

function isAchievementUnlocked(achievement: Achievement, state: GameState) {
  const rule = achievement.rule;
  if (rule.kind === "encounters") {
    return state.completedEncounters.length >= rule.target;
  }
  if (rule.kind === "cases") {
    return state.solvedCases.length >= rule.target;
  }
  if (rule.kind === "classifier") {
    return state.classifierWins >= rule.target;
  }
  if (rule.kind === "flashcards") {
    return getReviewedCount(state) >= rule.target;
  }
  if (rule.kind === "articles") {
    return state.unlockedArticles.length >= rule.target;
  }
  return state.reputation >= rule.target;
}

export function ReinoGame() {
  const [state, setState] = useState<GameState>(initialGameState);
  const [scene, setScene] = useState<SceneKey>("map");
  const [selectedArticleId, setSelectedArticleId] = useState("art-1437");
  const [caseDeck, setCaseDeck] = useState<LegalCase[]>(legalCases);
  const [selectedCaseId, setSelectedCaseId] = useState(legalCases[0]?.id ?? "");
  const [caseResultId, setCaseResultId] = useState<string | null>(null);
  const [classifierRoundId, setClassifierRoundId] = useState(classifierRounds[0]?.id ?? "");
  const [classifierAnswers, setClassifierAnswers] = useState<Record<string, string>>({});
  const [classifierResult, setClassifierResult] = useState<{ score: number; total: number } | null>(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardRevealed, setFlashcardRevealed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<GameState>;
        const normalized = normalizeSave(parsed);
        const progress = getLevelProgress(normalized.exp);
        setState({ ...normalized, level: progress.level });
      }
    } catch {
      setState(initialGameState);
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/cases/civil-cases.json")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: unknown) => {
        if (!alive || !Array.isArray(payload) || payload.length === 0) {
          return;
        }
        const cases = payload as LegalCase[];
        setCaseDeck(cases);
        setSelectedCaseId((current) => current || cases[0]?.id || "");
      })
      .catch(() => {
        setCaseDeck(legalCases);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [mounted, state]);

  const activeDistrict = getDistrict(state.activeDistrictId) ?? districts[0];
  const stats = useMemo(() => getPlayerStats(state), [state]);
  const progress = getLevelProgress(state.exp);
  const activeEncounter = state.combat ? getEncounter(state.combat.encounterId) : null;
  const activeQuestion =
    state.combat && activeEncounter
      ? activeEncounter.questions[state.combat.questionIndex % activeEncounter.questions.length]
      : null;
  const selectedCase = caseDeck.find((item) => item.id === selectedCaseId) ?? caseDeck[0] ?? legalCases[0]!;
  const selectedCaseResult = selectedCase?.options.find((option) => option.id === caseResultId) ?? null;
  const activeClassifierRound =
    classifierRounds.find((round) => round.id === classifierRoundId) ?? classifierRounds[0]!;
  const activeFlashcard = flashcards[flashcardIndex % flashcards.length] ?? flashcards[0]!;

  const addActivity = (entry: CombatLogEntry) => {
    setState((current) => ({
      ...current,
      activity: [entry, ...current.activity].slice(0, 8),
    }));
  };

  const selectDistrict = (districtId: string) => {
    setState((current) => ({ ...current, activeDistrictId: districtId }));
    setScene("district");
  };

  const startCombat = (encounterId: string) => {
    const encounter = getEncounter(encounterId);
    if (!encounter || !isEncounterUnlocked(state, encounterId)) {
      return;
    }

    setState((current) => ({
      ...current,
      combat: {
        encounterId,
        bossHp: encounter.hp,
        playerHp: 120 + current.level * 12 + Math.floor(stats.temple / 2),
        focus: 80 + Math.floor(stats.memoria / 3),
        questionIndex: 0,
        selectedAction: encounter.kind === "boss" ? "argumentar" : "atacar",
        selectedChoiceId: null,
        turn: 1,
        status: "active",
        log: [
          makeLog(
            "neutral",
            `${encounter.bossName} aparece en ${encounter.title}. El interrogatorio queda sellado.`,
          ),
        ],
      },
    }));
    setScene("combat");
  };

  const finishCombat = () => {
    setState((current) => ({ ...current, combat: null }));
    setScene("district");
  };

  const abandonCombat = () => {
    setState((current) => ({
      ...current,
      trauma: Math.min(100, current.trauma + 4),
      combat: null,
      activity: [
        makeLog("bad", "Abandonaste el estrado. El trauma académico subió ligeramente."),
        ...current.activity,
      ].slice(0, 8),
    }));
    setScene("district");
  };

  const selectAction = (action: ActionKey) => {
    setState((current) => {
      if (!current.combat || current.combat.status !== "active") {
        return current;
      }
      return {
        ...current,
        combat: {
          ...current.combat,
          selectedAction: action,
        },
      };
    });
  };

  const selectChoice = (choiceId: string) => {
    setState((current) => {
      if (!current.combat || current.combat.status !== "active") {
        return current;
      }
      return {
        ...current,
        combat: {
          ...current.combat,
          selectedChoiceId: choiceId,
        },
      };
    });
  };

  const resolveTurn = () => {
    const combat = state.combat;
    const encounter = activeEncounter;
    const question = activeQuestion;
    if (!combat || !encounter || !question || combat.status !== "active") {
      return;
    }

    const choice = question.choices.find((item) => item.id === combat.selectedChoiceId);
    if (!choice) {
      return;
    }

    const selectedAction = combat.selectedAction;
    const action = actionMeta[selectedAction];
    const currentStats = getPlayerStats(state);
    const focusCost =
      selectedAction === "citar" && state.equippedRelics.includes("pluma-claro")
        ? Math.max(5, action.focusCost - 6)
        : action.focusCost;

    if (combat.focus < focusCost) {
      setState((current) => ({
        ...current,
        combat: current.combat
          ? {
              ...current.combat,
              log: [
                makeLog("bad", "No queda foco suficiente para sostener esa maniobra."),
                ...current.combat.log,
              ].slice(0, 8),
            }
          : null,
      }));
      return;
    }

    const statDamage =
      selectedAction === "atacar"
        ? currentStats.conocimiento * 0.18
        : selectedAction === "argumentar"
          ? currentStats.oratoria * 0.2 + currentStats.estrategia * 0.16
          : selectedAction === "citar"
            ? currentStats.memoria * 0.26
            : selectedAction === "interpretar"
              ? currentStats.conocimiento * 0.16 + currentStats.estrategia * 0.24
              : selectedAction === "contraargumentar"
                ? currentStats.estrategia * 0.28
                : currentStats.temple * 0.12;

    const articleId = choice.articleId ?? question.articleId;
    const mastery = state.articleMastery[articleId] ?? 0;
    const idealBonus = selectedAction === question.idealAction ? 22 : -4;
    const trapBonus =
      question.trap && selectedAction === "contraargumentar"
        ? state.equippedRelics.includes("báculo-probatorio")
          ? 34
          : 22
        : 0;
    const codeBonus = state.equippedRelics.includes("codigo-bello") ? 8 : 0;
    const abeliukBonus =
      selectedAction === "interpretar" && state.equippedRelics.includes("tratado-abeliuk")
        ? state.unlockedArticles.length * 2
        : 0;

    if (choice.correct) {
      const rawDamage =
        action.baseDamage + statDamage + idealBonus + trapBonus + codeBonus + abeliukBonus + mastery * 6;
      const damage = Math.max(10, Math.round(rawDamage));
      const nextBossHp = Math.max(0, combat.bossHp - damage);
      const newArticleMastery = {
        ...state.articleMastery,
        [articleId]: Math.min(5, mastery + (state.equippedRelics.includes("codigo-bello") ? 2 : 1)),
      };
      const unlockedArticles = unique([...state.unlockedArticles, articleId]);
      const traumaRelief =
        selectedAction === "argumentar" && state.equippedRelics.includes("espiritu-alessandri") ? 2 : 0;
      const turnLog = [
        makeLog(
          "good",
          `${action.label}: respuesta correcta. Infligiste ${damage} de daño a ${encounter.bossName}.`,
        ),
        makeLog("neutral", choice.note),
      ];

      if (nextBossHp <= 0) {
        const newExp = state.exp + encounter.rewards.exp;
        const nextProgress = getLevelProgress(newExp);
        const rewardRelics = encounter.rewards.relicId
          ? unique([...state.relics, encounter.rewards.relicId])
          : state.relics;
        const wonLog = [
          makeLog("reward", `${encounter.bossName} fue derrotado. +${encounter.rewards.exp} EXP.`),
          makeLog("reward", `Reputación +${encounter.rewards.reputation}. Artículos añadidos al Códex.`),
          ...turnLog,
          ...combat.log,
        ].slice(0, 10);
        const relicLog = encounter.rewards.relicId
          ? makeLog("reward", `Reliquia obtenida: ${getRelic(encounter.rewards.relicId)?.name ?? "reliquia"}.`)
          : null;

        setState((current) => ({
          ...current,
          level: nextProgress.level,
          exp: newExp,
          reputation: Math.min(100, current.reputation + encounter.rewards.reputation),
          trauma: Math.max(0, current.trauma - 3 - traumaRelief),
          seals: current.seals + (encounter.kind === "boss" ? 4 : 2),
          completedEncounters: unique([...current.completedEncounters, encounter.id]),
          unlockedArticles: unique([...unlockedArticles, ...encounter.rewards.articleIds]),
          relics: rewardRelics,
          articleMastery: newArticleMastery,
          combat: {
            ...combat,
            bossHp: 0,
            focus: Math.max(0, combat.focus - focusCost + 12),
            status: "won",
            log: relicLog ? [relicLog, ...wonLog].slice(0, 10) : wonLog,
          },
          activity: [
            makeLog("reward", `${encounter.title} superado. El Reino registra tu victoria.`),
            ...current.activity,
          ].slice(0, 8),
        }));
        return;
      }

      setState((current) => ({
        ...current,
        trauma: Math.max(0, current.trauma - traumaRelief),
        unlockedArticles,
        articleMastery: newArticleMastery,
        combat: {
          ...combat,
          bossHp: nextBossHp,
          focus: Math.min(110, combat.focus - focusCost + 14),
          questionIndex: (combat.questionIndex + 1) % encounter.questions.length,
          selectedChoiceId: null,
          turn: combat.turn + 1,
          log: [...turnLog, ...combat.log].slice(0, 10),
        },
      }));
      return;
    }

    const incomingDamage =
      encounter.kind === "boss" ? 28 + Math.floor(state.trauma / 8) : 20 + Math.floor(state.trauma / 10);
    const mitigated = selectedAction === "defender" ? Math.max(8, incomingDamage - 14) : incomingDamage;
    const nextPlayerHp = Math.max(0, combat.playerHp - mitigated);
    const traumaGain = selectedAction === "defender" ? 2 : encounter.kind === "boss" ? 8 : 5;
    const failLog = [
      makeLog("bad", `${action.label}: la respuesta cedió. Recibiste ${mitigated} de daño.`),
      makeLog("neutral", choice.note),
    ];

    setState((current) => ({
      ...current,
      reputation: Math.max(0, current.reputation - 1),
      trauma: Math.min(100, current.trauma + traumaGain),
      combat: {
        ...combat,
        playerHp: nextPlayerHp,
        focus: Math.min(110, combat.focus - focusCost + 18),
        questionIndex: (combat.questionIndex + 1) % encounter.questions.length,
        selectedChoiceId: null,
        turn: combat.turn + 1,
        status: nextPlayerHp <= 0 ? "lost" : "active",
        log:
          nextPlayerHp <= 0
            ? [makeLog("bad", "Tu memoria colapsó en el estrado."), ...failLog, ...combat.log].slice(0, 10)
            : [...failLog, ...combat.log].slice(0, 10),
      },
    }));
  };

  const equipRelic = (relicId: string) => {
    if (!state.relics.includes(relicId)) {
      return;
    }
    const relic = getRelic(relicId);
    setState((current) => {
      const isEquipped = current.equippedRelics.includes(relicId);
      const equippedRelics = isEquipped
        ? current.equippedRelics.filter((id) => id !== relicId)
        : [...current.equippedRelics.slice(current.equippedRelics.length >= 3 ? 1 : 0), relicId];

      return {
        ...current,
        equippedRelics,
        activity: [
          makeLog(
            "neutral",
            isEquipped
              ? `${relic?.name ?? "Reliquia"} quedó en el inventario.`
              : `${relic?.name ?? "Reliquia"} fue equipada.`,
          ),
          ...current.activity,
        ].slice(0, 8),
      };
    });
  };

  const restAtArchive = () => {
    if (state.seals <= 0) {
      addActivity(makeLog("bad", "No tienes sellos para abrir el Archivo de Calma."));
      return;
    }
    setState((current) => ({
      ...current,
      seals: current.seals - 1,
      trauma: Math.max(0, current.trauma - 18),
      activity: [makeLog("good", "El Archivo de Calma redujo tu trauma académico."), ...current.activity].slice(
        0,
        8,
      ),
    }));
  };

  const selectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCaseResultId(null);
  };

  const resolveCase = (optionId: string) => {
    if (!selectedCase || caseResultId) {
      return;
    }
    const option = selectedCase.options.find((item) => item.id === optionId);
    if (!option) {
      return;
    }
    setCaseResultId(optionId);

    setState((current) => {
      const alreadySolved = current.solvedCases.includes(selectedCase.id);
      const expGain = option.correct ? (alreadySolved ? 35 : selectedCase.reward.exp) : 8;
      const newExp = current.exp + expGain;
      const progress = getLevelProgress(newExp);
      const articleIds = option.correct
        ? unique([...selectedCase.reward.articleIds, option.articleId])
        : [option.articleId];

      return {
        ...current,
        level: progress.level,
        exp: newExp,
        reputation: option.correct
          ? Math.min(100, current.reputation + (alreadySolved ? 1 : selectedCase.reward.reputation))
          : Math.max(0, current.reputation - 1),
        trauma: option.correct ? Math.max(0, current.trauma - 3) : Math.min(100, current.trauma + 5),
        solvedCases: option.correct ? unique([...current.solvedCases, selectedCase.id]) : current.solvedCases,
        unlockedArticles: unique([...current.unlockedArticles, ...articleIds]),
        articleMastery: {
          ...current.articleMastery,
          [option.articleId]: Math.min(5, (current.articleMastery[option.articleId] ?? 0) + (option.correct ? 1 : 0)),
        },
        activity: [
          makeLog(
            option.correct ? "reward" : "bad",
            option.correct
              ? `Caso resuelto: ${selectedCase.title}. +${expGain} EXP.`
              : `Caso fallido: ${option.concept}. Revisa el Códex antes de insistir.`,
          ),
          ...current.activity,
        ].slice(0, 8),
      };
    });
  };

  const selectClassifierRound = (roundId: string) => {
    setClassifierRoundId(roundId);
    setClassifierAnswers({});
    setClassifierResult(null);
  };

  const setClassifierAnswer = (itemId: string, value: string) => {
    setClassifierAnswers((current) => ({ ...current, [itemId]: value }));
    setClassifierResult(null);
  };

  const checkClassifier = () => {
    if (!activeClassifierRound || classifierResult) {
      return;
    }
    const total = activeClassifierRound.items.length;
    const score = activeClassifierRound.items.filter((item) => classifierAnswers[item.id] === item.answer).length;
    setClassifierResult({ score, total });

    setState((current) => {
      const perfect = score === total;
      const expGain = perfect ? 170 : Math.max(20, score * 18);
      const newExp = current.exp + expGain;
      const progress = getLevelProgress(newExp);
      const articleIds = unique(activeClassifierRound.items.map((item) => item.articleId));

      return {
        ...current,
        level: progress.level,
        exp: newExp,
        reputation: perfect ? Math.min(100, current.reputation + 8) : current.reputation,
        trauma: perfect ? Math.max(0, current.trauma - 4) : Math.min(100, current.trauma + (total - score) * 2),
        classifierWins: perfect ? current.classifierWins + 1 : current.classifierWins,
        unlockedArticles: perfect ? unique([...current.unlockedArticles, ...articleIds]) : current.unlockedArticles,
        activity: [
          makeLog(
            perfect ? "reward" : "neutral",
            perfect
              ? `Clasificador perfecto: ${activeClassifierRound.title}. +${expGain} EXP.`
              : `Clasificador: ${score}/${total}. El error también deja huella útil.`,
          ),
          ...current.activity,
        ].slice(0, 8),
      };
    });
  };

  const reviewFlashcard = (grade: "again" | "good" | "perfect") => {
    const card = activeFlashcard;
    const expGain = grade === "perfect" ? 36 : grade === "good" ? 22 : 10;
    setState((current) => {
      const newExp = current.exp + expGain;
      const progress = getLevelProgress(newExp);
      const currentReviews = current.reviewedFlashcards[card.id] ?? 0;
      const mastery = current.articleMastery[card.articleId] ?? 0;

      return {
        ...current,
        level: progress.level,
        exp: newExp,
        reputation: grade === "again" ? current.reputation : Math.min(100, current.reputation + 1),
        trauma: grade === "again" ? Math.min(100, current.trauma + 1) : Math.max(0, current.trauma - 1),
        reviewedFlashcards: {
          ...current.reviewedFlashcards,
          [card.id]: currentReviews + 1,
        },
        unlockedArticles: unique([...current.unlockedArticles, card.articleId]),
        articleMastery: {
          ...current.articleMastery,
          [card.articleId]: Math.min(5, mastery + (grade === "perfect" ? 2 : 1)),
        },
        activity: [
          makeLog("good", `Memoria jurídica: ${card.world} repasado. +${expGain} EXP.`),
          ...current.activity,
        ].slice(0, 8),
      };
    });
    setFlashcardIndex((current) => (current + 1) % flashcards.length);
    setFlashcardRevealed(false);
  };

  const resetRun = () => {
    if (!window.confirm("¿Reiniciar la partida del Reino de Bello?")) {
      return;
    }
    window.localStorage.removeItem(STORAGE_KEY);
    setState(initialGameState);
    setScene("map");
    setSelectedArticleId("art-1437");
  };

  const selectedArticle = getArticle(selectedArticleId) ?? articles[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#02050a] text-slate-100">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-35"
        style={{
          backgroundImage:
            scene === "combat"
              ? "url('/assets/cobrador-eterno-battle.png')"
              : "url('/assets/reino-de-bello-map.png')",
        }}
      />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_18%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,rgba(2,5,10,0.45),#02050a_78%)]" />
      <div className="scanlines fixed inset-0 z-[1]" />
      <ParticleField />

      <section className="relative z-20 mx-auto flex min-h-screen w-full max-w-[1820px] flex-col px-3 py-3 sm:px-4 lg:px-5">
        <TopBar
          progress={progress}
          scene={scene}
          setScene={setScene}
          state={state}
          stats={stats}
        />

        <AnimatePresence mode="wait">
          {scene === "map" && (
            <MapScene
              key="map"
              activeDistrictId={state.activeDistrictId}
              progress={progress}
              selectDistrict={selectDistrict}
              setScene={setScene}
              state={state}
              stats={stats}
            />
          )}

          {scene === "district" && (
            <DistrictScene
              key="district"
              district={activeDistrict}
              setScene={setScene}
              startCombat={startCombat}
              state={state}
            />
          )}

          {scene === "combat" && (
            <CombatScene
              key="combat"
              abandonCombat={abandonCombat}
              activeEncounter={activeEncounter}
              activeQuestion={activeQuestion}
              combat={state.combat}
              finishCombat={finishCombat}
              resolveTurn={resolveTurn}
              selectAction={selectAction}
              selectChoice={selectChoice}
              startCombat={startCombat}
              state={state}
            />
          )}

          {scene === "cases" && (
            <CasesScene
              key="cases"
              caseDeck={caseDeck}
              caseResult={selectedCaseResult}
              resolveCase={resolveCase}
              selectCase={selectCase}
              selectedCase={selectedCase}
              selectedCaseId={selectedCaseId}
              setScene={setScene}
              state={state}
            />
          )}

          {scene === "classifier" && (
            <ClassifierScene
              key="classifier"
              answers={classifierAnswers}
              checkClassifier={checkClassifier}
              result={classifierResult}
              round={activeClassifierRound}
              roundId={classifierRoundId}
              selectRound={selectClassifierRound}
              setAnswer={setClassifierAnswer}
              setScene={setScene}
              state={state}
            />
          )}

          {scene === "memory" && (
            <MemoryScene
              key="memory"
              card={activeFlashcard}
              flashcardIndex={flashcardIndex}
              revealed={flashcardRevealed}
              reviewFlashcard={reviewFlashcard}
              setFlashcardIndex={setFlashcardIndex}
              setRevealed={setFlashcardRevealed}
              setScene={setScene}
              state={state}
            />
          )}

          {scene === "inventory" && (
            <InventoryScene
              key="inventory"
              equipRelic={equipRelic}
              restAtArchive={restAtArchive}
              setScene={setScene}
              state={state}
              stats={stats}
            />
          )}

          {scene === "codex" && (
            <CodexScene
              key="codex"
              selectedArticle={selectedArticle}
              selectedArticleId={selectedArticleId}
              setScene={setScene}
              setSelectedArticleId={setSelectedArticleId}
              state={state}
            />
          )}

          {scene === "achievements" && (
            <AchievementsScene
              key="achievements"
              setScene={setScene}
              state={state}
            />
          )}

          {scene === "profile" && (
            <ProfileScene
              key="profile"
              progress={progress}
              resetRun={resetRun}
              setScene={setScene}
              state={state}
              stats={stats}
            />
          )}
        </AnimatePresence>

        <BottomNav scene={scene} setScene={setScene} state={state} />
      </section>
    </main>
  );
}

function TopBar({
  progress,
  scene,
  setScene,
  state,
  stats,
}: {
  progress: ReturnType<typeof getLevelProgress>;
  scene: SceneKey;
  setScene: (scene: SceneKey) => void;
  state: GameState;
  stats: Record<StatKey, number>;
}) {
  return (
    <header className="mb-3 grid gap-3 lg:grid-cols-[330px_1fr_720px]">
      <button
        className="arcane-panel group flex items-center gap-3 p-3 text-left"
        onClick={() => setScene("profile")}
      >
        <div className="relative h-16 w-16 overflow-hidden rounded-sm border border-cyan-300/35 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_32%,rgba(34,211,238,0.55),transparent_18%),linear-gradient(135deg,#06111f,#02030a_65%)]" />
          <UserRound className="absolute inset-0 m-auto h-9 w-9 text-cyan-100" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm uppercase tracking-[0.24em] text-cyan-200">Litigante de Bello</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span>Nivel {progress.level}</span>
            <span className="h-1 w-1 rounded-full bg-amber-300" />
            <span>Abogado demandante</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-cyan-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </button>

      <div className="arcane-panel relative flex min-h-20 items-center justify-between overflow-hidden p-4">
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-amber-300/25 to-transparent" />
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.32em] text-amber-200/80">RPG Civil</p>
          <h1 className="font-display text-2xl uppercase tracking-[0.18em] text-white sm:text-3xl">
            Reino de Bello
          </h1>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Resource icon={Gem} label="Sellos" value={state.seals} tone="text-violet-200" />
          <Resource icon={Medal} label="Reputación" value={`${state.reputation}/100`} tone="text-amber-200" />
          <Resource icon={ShieldAlert} label="Trauma" value={`${state.trauma}/100`} tone="text-rose-200" />
          <Resource icon={Zap} label="Memoria" value={stats.memoria} tone="text-cyan-200" />
        </div>
      </div>

      <div className="arcane-panel hidden grid-cols-5 gap-2 p-2 lg:grid">
        {mainScenes.map((key) => {
          const Icon = sceneLabels[key].icon;
          const disabled = key === "combat" && !state.combat;
          return (
            <button
              className={cn(
                "flex h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-sm border border-white/8 bg-white/[0.025] text-[0.58rem] uppercase tracking-[0.08em] text-slate-400 transition",
                scene === key && "border-amber-300/55 bg-amber-300/12 text-amber-100",
                !disabled && "hover:border-cyan-300/40 hover:text-cyan-100",
                disabled && "opacity-35",
              )}
              disabled={disabled}
              key={key}
              onClick={() => setScene(key)}
            >
              <Icon className="h-4 w-4" />
              {sceneLabels[key].label}
            </button>
          );
        })}
      </div>
    </header>
  );
}

function Resource({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: typeof Gem;
  label: string;
  tone: string;
  value: number | string;
}) {
  return (
    <div className="min-w-24 border-l border-white/10 px-3">
      <div className={cn("flex items-center gap-2 text-sm font-semibold", tone)}>
        <Icon className="h-4 w-4" />
        {value}
      </div>
      <p className="mt-1 text-[0.58rem] uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
  );
}

function PlayerPanel({
  progress,
  state,
  stats,
}: {
  progress: ReturnType<typeof getLevelProgress>;
  state: GameState;
  stats: Record<StatKey, number>;
}) {
  return (
    <aside className="arcane-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Personaje</p>
          <h2 className="font-display mt-1 text-xl uppercase tracking-[0.14em] text-white">Litigante Novato</h2>
        </div>
        <div className="rounded-sm border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-center">
          <p className="font-display text-xl text-amber-100">{progress.level}</p>
          <p className="text-[0.55rem] uppercase tracking-[0.16em] text-amber-200/70">Nivel</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <Meter label="EXP" value={progress.current} max={progress.needed} tone="amber" />
        <Meter label="Reputación" value={state.reputation} max={100} tone="amber" />
        <Meter label="Trauma" value={state.trauma} max={100} tone="rose" />
      </div>

      <div className="mt-5 grid gap-2">
        {statKeys.map((key) => (
          <div className="flex items-center justify-between border-t border-white/8 pt-2 text-sm" key={key}>
            <span className="capitalize text-slate-400">{key}</span>
            <span className="font-mono text-cyan-100">{stats[key]}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function Meter({
  label,
  max,
  tone,
  value,
}: {
  label: string;
  max: number;
  tone: "amber" | "rose" | "cyan" | "emerald";
  value: number;
}) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  const toneClass = {
    amber: "from-amber-400 to-yellow-200",
    rose: "from-rose-500 to-fuchsia-300",
    cyan: "from-cyan-400 to-blue-300",
    emerald: "from-emerald-400 to-teal-200",
  }[tone];
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.16em] text-slate-400">
        <span>{label}</span>
        <span className="font-mono text-slate-300">
          {value} / {max}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={cn("h-full bg-gradient-to-r", toneClass)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function MapScene({
  activeDistrictId,
  progress,
  selectDistrict,
  setScene,
  state,
  stats,
}: {
  activeDistrictId: string;
  progress: ReturnType<typeof getLevelProgress>;
  selectDistrict: (districtId: string) => void;
  setScene: (scene: SceneKey) => void;
  state: GameState;
  stats: Record<StatKey, number>;
}) {
  const district = getDistrict(activeDistrictId) ?? districts[0];
  const districtEncounters = encounters.filter((encounter) => encounter.districtId === "obligaciones");
  const completed = districtEncounters.filter((encounter) => state.completedEncounters.includes(encounter.id)).length;
  const nextEncounter = districtEncounters.find(
    (encounter) => !state.completedEncounters.includes(encounter.id) && isEncounterUnlocked(state, encounter.id),
  );

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-3 lg:grid-cols-[330px_1fr_310px]"
      exit={{ opacity: 0, y: -14 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.32 }}
    >
      <div className="grid content-start gap-3">
        <PlayerPanel progress={progress} state={state} stats={stats} />
        <MissionPanel completed={completed} nextEncounter={nextEncounter?.title ?? "Distrito purificado"} />
        <ActivityPanel activity={state.activity} />
      </div>

      <section className="map-stage arcane-panel relative min-h-[620px] overflow-hidden p-0">
        <div className="absolute inset-0 bg-[url('/assets/reino-de-bello-map.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_45%,transparent_0,rgba(2,5,10,0.18)_38%,rgba(2,5,10,0.8)_100%)]" />
        <div className="absolute left-5 top-5 max-w-lg">
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-amber-200">Mapa de campaña</p>
          <h2 className="font-display mt-1 text-3xl uppercase tracking-[0.14em] text-white">Reino de Bello</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
            Las instituciones civiles se manifiestan como territorios. Cada distrito conserva artículos,
            reliquias y bosses propios.
          </p>
        </div>

        {districts.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeDistrictId;
          const isComplete =
            item.id === "obligaciones" &&
            districtEncounters.every((encounter) => state.completedEncounters.includes(encounter.id));
          return (
            <button
              className={cn(
                "map-node group absolute flex min-w-[180px] items-center gap-3 rounded-sm border bg-slate-950/70 px-3 py-2 text-left backdrop-blur-md transition",
                isActive
                  ? "border-amber-300/70 shadow-[0_0_34px_rgba(245,158,11,0.25)]"
                  : "border-cyan-300/30 hover:border-cyan-200/70 hover:shadow-[0_0_30px_rgba(34,211,238,0.16)]",
                !item.playable && "opacity-75",
              )}
              key={item.id}
              onClick={() => selectDistrict(item.id)}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-sm border",
                  isComplete
                    ? "border-emerald-300/50 bg-emerald-400/10 text-emerald-100"
                    : item.playable
                      ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-100"
                      : "border-slate-300/25 bg-slate-400/5 text-slate-400",
                )}
              >
                {item.playable ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
              </span>
              <span>
                <span className="block font-display text-sm uppercase tracking-[0.12em] text-white">
                  {item.name}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">{item.boss}</span>
              </span>
            </button>
          );
        })}

        <div className="absolute bottom-5 left-5 right-5 grid gap-2 sm:grid-cols-4">
          {[
            ["Parallax", "Capas de biblioteca y lluvia arcana"],
            ["Artículos", `${state.unlockedArticles.length}/${articles.length} reliquias normativas`],
            ["Combate", "Interrogatorio, trauma y reputación"],
            ["Códex", "Grimorio civil interactivo"],
          ].map(([label, value]) => (
            <div className="rounded-sm border border-white/10 bg-black/45 p-3 backdrop-blur-md" key={label}>
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-cyan-200">{label}</p>
              <p className="mt-1 text-xs text-slate-300">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <aside className="grid content-start gap-3">
        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Distrito seleccionado</p>
          <h3 className="font-display mt-2 text-xl uppercase tracking-[0.12em] text-white">{district.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{district.theme}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {district.topics.map((topic) => (
              <span
                className="rounded-sm border border-white/10 bg-white/[0.04] px-2 py-1 text-[0.62rem] uppercase tracking-[0.12em] text-slate-300"
                key={topic}
              >
                {topic}
              </span>
            ))}
          </div>
          <Button className="mt-5 w-full" onClick={() => setScene("district")} variant="primary">
            <Compass className="h-4 w-4" />
            Entrar al distrito
          </Button>
        </div>

        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-amber-200">Próximo combate</p>
          <div className="mt-3 rounded-sm border border-amber-300/25 bg-amber-400/8 p-3">
            <p className="font-display text-lg uppercase tracking-[0.1em] text-white">
              {nextEncounter?.bossName ?? "Distrito purificado"}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {nextEncounter?.subtitle ?? "El Cobrador Eterno quedó registrado en el archivo."}
            </p>
          </div>
          <Button
            className="mt-3 w-full"
            disabled={!nextEncounter}
            onClick={() => nextEncounter && startButton(nextEncounter.id, selectDistrict, setScene)}
            variant="violet"
          >
            <Swords className="h-4 w-4" />
            Preparar combate
          </Button>
        </div>

        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Eventos vivos</p>
          <div className="mt-3 grid gap-2">
            <EventRow icon={Flame} title="Contrato encadenado" value="Rumor en el Trono del Pacto" />
            <EventRow icon={Archive} title="Archivo de Calma" value="1 sello reduce trauma" />
            <EventRow icon={Trophy} title="Cámara final" value="Comisión Examinadora bloqueada" />
          </div>
        </div>
      </aside>
    </motion.div>
  );
}

function startButton(
  encounterId: string,
  selectDistrict: (districtId: string) => void,
  setScene: (scene: SceneKey) => void,
) {
  selectDistrict("obligaciones");
  setScene("district");
  window.setTimeout(() => {
    const button = document.querySelector<HTMLButtonElement>(`[data-encounter="${encounterId}"]`);
    button?.focus();
  }, 80);
}

function MissionPanel({ completed, nextEncounter }: { completed: number; nextEncounter: string }) {
  return (
    <div className="arcane-panel p-4">
      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-violet-200">Misión actual</p>
      <div className="mt-3 rounded-sm border border-violet-300/35 bg-violet-500/10 p-3">
        <div className="flex items-center gap-2 text-violet-100">
          <CircleDot className="h-4 w-4" />
          <p className="font-display uppercase tracking-[0.12em]">Recurso de Obligaciones</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Avanza por el primer distrito y rompe la cadena del Cobrador Eterno.
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{completed}/4 sellos de distrito</span>
          <span className="text-cyan-200">{nextEncounter}</span>
        </div>
      </div>
    </div>
  );
}

function ActivityPanel({ activity }: { activity: CombatLogEntry[] }) {
  return (
    <div className="arcane-panel p-4">
      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Registro</p>
      <div className="mt-3 grid gap-2">
        {activity.slice(0, 5).map((entry) => (
          <p
            className={cn(
              "rounded-sm border border-white/8 bg-white/[0.03] p-2 text-xs leading-5",
              toneClasses[entry.tone],
            )}
            key={entry.id}
          >
            {entry.text}
          </p>
        ))}
      </div>
    </div>
  );
}

function EventRow({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Flame;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-sm border border-white/8 bg-white/[0.035] p-3">
      <Icon className="h-4 w-4 text-amber-200" />
      <div>
        <p className="font-display text-sm uppercase tracking-[0.1em] text-white">{title}</p>
        <p className="mt-0.5 text-xs text-slate-400">{value}</p>
      </div>
    </div>
  );
}

function DistrictScene({
  district,
  setScene,
  startCombat,
  state,
}: {
  district: NonNullable<ReturnType<typeof getDistrict>>;
  setScene: (scene: SceneKey) => void;
  startCombat: (encounterId: string) => void;
  state: GameState;
}) {
  const districtEncounters = encounters.filter((encounter) => encounter.districtId === district.id);
  const completed = districtEncounters.filter((encounter) => state.completedEncounters.includes(encounter.id));

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-3 lg:grid-cols-[360px_1fr_340px]"
      exit={{ opacity: 0, y: -14 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.32 }}
    >
      <aside className="grid content-start gap-3">
        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-amber-200">Distrito</p>
          <h2 className="font-display mt-2 text-2xl uppercase tracking-[0.12em] text-white">{district.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">{district.subtitle}</p>
          <div className="mt-5 grid gap-2">
            {district.topics.map((topic) => (
              <div className="flex items-center gap-2 text-sm text-slate-300" key={topic}>
                <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                <span className="capitalize">{topic}</span>
              </div>
            ))}
          </div>
        </div>
        <ActivityPanel activity={state.activity} />
      </aside>

      <section className="arcane-panel min-h-[620px] overflow-hidden p-0">
        <div className="relative h-full min-h-[620px]">
          <div className="absolute inset-0 bg-[url('/assets/reino-de-bello-map.png')] bg-cover bg-center opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(245,158,11,0.12),rgba(2,5,10,0.88)_68%)]" />
          <div className="relative z-10 flex h-full min-h-[620px] flex-col p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cyan-200">Ruta de instancia</p>
                <h3 className="font-display mt-2 text-3xl uppercase tracking-[0.12em] text-white">
                  {district.playable ? "Obligaciones Vivas" : "Territorio sellado"}
                </h3>
              </div>
              <Button onClick={() => setScene("map")} variant="ghost">
                <Map className="h-4 w-4" />
                Volver
              </Button>
            </div>

            {district.playable ? (
              <div className="mt-8 grid flex-1 gap-4 xl:grid-cols-2">
                {districtEncounters.map((encounter, index) => {
                  const unlocked = isEncounterUnlocked(state, encounter.id);
                  const isDone = state.completedEncounters.includes(encounter.id);
                  const rewardRelic = encounter.rewards.relicId ? getRelic(encounter.rewards.relicId) : null;
                  return (
                    <button
                      className={cn(
                        "group relative overflow-hidden rounded-sm border p-4 text-left transition",
                        encounter.kind === "boss"
                          ? "border-amber-300/40 bg-amber-400/10"
                          : "border-cyan-300/25 bg-cyan-400/8",
                        unlocked && !isDone && "hover:-translate-y-1 hover:border-amber-200/70 hover:shadow-[0_0_42px_rgba(245,158,11,0.18)]",
                        isDone && "border-emerald-300/35 bg-emerald-400/8",
                        !unlocked && "opacity-45",
                      )}
                      data-encounter={encounter.id}
                      disabled={!unlocked}
                      key={encounter.id}
                      onClick={() => (isDone ? undefined : startCombat(encounter.id))}
                    >
                      <div className="absolute right-3 top-3 font-display text-5xl text-white/[0.04]">
                        {index + 1}
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-amber-200">
                            {encounter.kind === "boss" ? "Boss" : "Duelo"}
                          </p>
                          <h4 className="font-display mt-2 text-xl uppercase tracking-[0.1em] text-white">
                            {encounter.title}
                          </h4>
                          <p className="mt-1 text-sm text-cyan-100">{encounter.bossName}</p>
                        </div>
                        {isDone ? (
                          <Trophy className="h-6 w-6 text-emerald-200" />
                        ) : unlocked ? (
                          <ChevronRight className="h-6 w-6 text-amber-200 transition group-hover:translate-x-1" />
                        ) : (
                          <Lock className="h-5 w-5 text-slate-500" />
                        )}
                      </div>
                      <p className="mt-4 min-h-12 text-sm leading-6 text-slate-300">{encounter.subtitle}</p>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-sm border border-white/8 bg-black/25 p-2">
                          <p className="font-mono text-rose-100">{encounter.hp}</p>
                          <p className="mt-1 uppercase tracking-[0.14em] text-slate-500">Vida</p>
                        </div>
                        <div className="rounded-sm border border-white/8 bg-black/25 p-2">
                          <p className="font-mono text-amber-100">+{encounter.rewards.exp}</p>
                          <p className="mt-1 uppercase tracking-[0.14em] text-slate-500">EXP</p>
                        </div>
                        <div className="rounded-sm border border-white/8 bg-black/25 p-2">
                          <p className="truncate font-mono text-cyan-100">{rewardRelic?.rarity ?? "Art."}</p>
                          <p className="mt-1 uppercase tracking-[0.14em] text-slate-500">Botín</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="m-auto grid max-w-2xl place-items-center py-24 text-center">
                <Lock className="h-12 w-12 text-amber-200" />
                <h3 className="font-display mt-5 text-3xl uppercase tracking-[0.14em] text-white">
                  {district.boss}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{district.theme}</p>
                <p className="mt-5 rounded-sm border border-white/10 bg-black/35 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                  Se desbloquea tras purificar Obligaciones
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <aside className="grid content-start gap-3">
        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Progreso</p>
          <div className="mt-4 flex items-center gap-2">
            {districtEncounters.map((encounter) => (
              <div
                className={cn(
                  "h-3 flex-1 rounded-full bg-white/10",
                  state.completedEncounters.includes(encounter.id) && "bg-gradient-to-r from-emerald-400 to-cyan-300",
                )}
                key={encounter.id}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-400">
            {completed.length}/{districtEncounters.length || 4} sellos conquistados
          </p>
        </div>
        <RelicLoadout state={state} />
        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-amber-200">Boss regional</p>
          <h3 className="font-display mt-2 text-xl uppercase tracking-[0.1em] text-white">{district.boss}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Un interrogador que castiga respuestas vagas y premia memoria estructurada.
          </p>
        </div>
      </aside>
    </motion.div>
  );
}

function RelicLoadout({ state }: { state: GameState }) {
  const equipped = state.equippedRelics.map(getRelic).filter(Boolean) as Relic[];
  return (
    <div className="arcane-panel p-4">
      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-violet-200">Reliquias equipadas</p>
      <div className="mt-3 grid gap-2">
        {equipped.length === 0 && <p className="text-sm text-slate-400">Tres ranuras esperan poder civil.</p>}
        {equipped.map((relic) => {
          const Icon = relic.icon;
          return (
            <div
              className={cn("flex items-center gap-3 rounded-sm border bg-white/[0.03] p-3", getRarityClass(relic))}
              key={relic.id}
            >
              <Icon className="h-5 w-5" />
              <div>
                <p className="font-display text-sm uppercase tracking-[0.1em]">{relic.name}</p>
                <p className="text-xs text-slate-400">+{relic.bonus} {relic.stat}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CombatScene({
  abandonCombat,
  activeEncounter,
  activeQuestion,
  combat,
  finishCombat,
  resolveTurn,
  selectAction,
  selectChoice,
  startCombat,
  state,
}: {
  abandonCombat: () => void;
  activeEncounter: ReturnType<typeof getEncounter> | null;
  activeQuestion: NonNullable<ReturnType<typeof getEncounter>>["questions"][number] | null;
  combat: GameState["combat"];
  finishCombat: () => void;
  resolveTurn: () => void;
  selectAction: (action: ActionKey) => void;
  selectChoice: (choiceId: string) => void;
  startCombat: (encounterId: string) => void;
  state: GameState;
}) {
  if (!combat || !activeEncounter || !activeQuestion) {
    return (
      <motion.div className="arcane-panel grid flex-1 place-items-center p-12 text-center">
        <Swords className="h-10 w-10 text-cyan-200" />
        <h2 className="font-display mt-4 text-2xl uppercase tracking-[0.14em] text-white">Sin combate activo</h2>
      </motion.div>
    );
  }

  const selectedChoice = activeQuestion.choices.find((choice) => choice.id === combat.selectedChoiceId);
  const selectedAction = actionMeta[combat.selectedAction];
  const SelectedIcon = selectedAction.icon;
  const article = getArticle(activeQuestion.articleId);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-3 xl:grid-cols-[300px_1fr_320px]"
      exit={{ opacity: 0, y: -14 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.32 }}
    >
      <aside className="grid content-start gap-3">
        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Litigante</p>
          <h3 className="font-display mt-2 text-xl uppercase tracking-[0.12em] text-white">Memoria en estrado</h3>
          <div className="mt-4 grid gap-3">
            <Meter label="HP" max={150} tone="rose" value={combat.playerHp} />
            <Meter label="Foco" max={110} tone="cyan" value={combat.focus} />
            <Meter label="Trauma" max={100} tone="rose" value={state.trauma} />
          </div>
        </div>
        <RelicLoadout state={state} />
        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-amber-200">Artículo activo</p>
          <h4 className="font-display mt-2 text-lg uppercase tracking-[0.12em] text-white">
            Art. {article?.number ?? "???"}
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-300">{article?.title}</p>
          <p className="mt-3 text-xs text-cyan-200">
            Maestría: {state.articleMastery[activeQuestion.articleId] ?? 0}/5
          </p>
        </div>
      </aside>

      <section className="battle-stage arcane-panel relative min-h-[660px] overflow-hidden p-0">
        <div className="absolute inset-0 bg-[url('/assets/cobrador-eterno-battle.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,10,0.12),rgba(2,5,10,0.74)_58%,rgba(2,5,10,0.96))]" />
        <div className="relative z-10 flex min-h-[660px] flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-rose-200">
                {activeEncounter.kind === "boss" ? "Boss activo" : "Interrogatorio"}
              </p>
              <h2 className="font-display mt-1 text-3xl uppercase tracking-[0.14em] text-white">
                {activeEncounter.bossName}
              </h2>
              <p className="mt-1 text-sm text-slate-300">{activeEncounter.title}</p>
            </div>
            <Button onClick={abandonCombat} variant="red">
              <X className="h-4 w-4" />
              Abandonar
            </Button>
          </div>

          <div className="mt-4 max-w-xl">
            <Meter label="Vida del adversario" max={activeEncounter.hp} tone="rose" value={combat.bossHp} />
          </div>

          <div className="mt-auto grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-sm border border-white/10 bg-black/62 p-4 backdrop-blur-md">
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-cyan-200">
                Pregunta {combat.turn}
              </p>
              <blockquote className="mt-3 border-l border-amber-300/50 pl-4 text-lg leading-8 text-slate-100">
                {activeQuestion.bossLine}
              </blockquote>
              <p className="mt-4 text-sm leading-6 text-slate-300">{activeQuestion.prompt}</p>
              {activeQuestion.trap && (
                <p className="mt-3 rounded-sm border border-rose-300/25 bg-rose-500/10 p-3 text-xs text-rose-100">
                  {activeQuestion.trap}
                </p>
              )}

              <div className="mt-5 grid gap-2">
                {activeQuestion.choices.map((choice, index) => (
                  <button
                    className={cn(
                      "group flex items-center gap-3 rounded-sm border border-white/10 bg-white/[0.045] p-3 text-left text-sm text-slate-200 transition hover:border-cyan-300/45 hover:bg-cyan-400/10",
                      combat.selectedChoiceId === choice.id &&
                        "border-amber-300/70 bg-amber-400/12 text-white shadow-[0_0_28px_rgba(245,158,11,0.2)]",
                    )}
                    key={choice.id}
                    onClick={() => selectChoice(choice.id)}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-white/15 bg-black/35 font-mono text-xs text-cyan-100">
                      {index + 1}
                    </span>
                    <span>{choice.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-white/10 bg-black/62 p-4 backdrop-blur-md">
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-amber-200">Acciones</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {actionOrder.map((key) => {
                  const meta = actionMeta[key];
                  const Icon = meta.icon;
                  const focusCost =
                    key === "citar" && state.equippedRelics.includes("pluma-claro")
                      ? Math.max(5, meta.focusCost - 6)
                      : meta.focusCost;
                  return (
                    <button
                      className={cn(
                        "min-h-20 rounded-sm border p-3 text-left transition",
                        actionClasses[key],
                        combat.selectedAction === key &&
                          "scale-[1.02] ring-1 ring-white/50 brightness-125",
                        combat.focus < focusCost && "opacity-35",
                      )}
                      disabled={combat.focus < focusCost}
                      key={key}
                      onClick={() => selectAction(key)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        <span className="font-display text-sm uppercase tracking-[0.12em]">{meta.label}</span>
                      </div>
                      <p className="mt-1 text-xs opacity-75">{meta.short}</p>
                      <p className="mt-2 font-mono text-[0.62rem] opacity-70">FOCO {focusCost}</p>
                    </button>
                  );
                })}
              </div>

              <div className={cn("mt-4 rounded-sm border p-3", actionClasses[combat.selectedAction])}>
                <div className="flex items-center gap-2">
                  <SelectedIcon className="h-4 w-4" />
                  <p className="font-display text-sm uppercase tracking-[0.12em]">{selectedAction.label}</p>
                </div>
                <p className="mt-2 text-xs leading-5 opacity-80">{selectedAction.description}</p>
              </div>

              <Button
                className="mt-4 w-full"
                disabled={!selectedChoice}
                onClick={resolveTurn}
                size="lg"
                variant="primary"
              >
                <Zap className="h-4 w-4" />
                Ejecutar respuesta
              </Button>
            </div>
          </div>

          {combat.status !== "active" && (
            <div className="absolute inset-0 z-20 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl rounded-sm border border-amber-300/45 bg-[#050811]/95 p-6 text-center shadow-[0_0_80px_rgba(245,158,11,0.22)]"
                initial={{ opacity: 0, scale: 0.92 }}
              >
                {combat.status === "won" ? (
                  <>
                    <Trophy className="mx-auto h-12 w-12 text-amber-200" />
                    <h3 className="font-display mt-4 text-3xl uppercase tracking-[0.16em] text-white">
                      Sentencia favorable
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {activeEncounter.bossName} quedó inscrito en el archivo. Nuevos artículos vibran en el Códex.
                    </p>
                    <Button className="mt-6 w-full" onClick={finishCombat} variant="primary">
                      <Archive className="h-4 w-4" />
                      Registrar victoria
                    </Button>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="mx-auto h-12 w-12 text-rose-200" />
                    <h3 className="font-display mt-4 text-3xl uppercase tracking-[0.16em] text-white">
                      Colapso de memoria
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      El interrogatorio permanece abierto. Reordena tus reliquias o vuelve al estrado.
                    </p>
                    <div className="mt-6 grid gap-2 sm:grid-cols-2">
                      <Button onClick={() => startCombat(activeEncounter.id)} variant="red">
                        <RotateCcw className="h-4 w-4" />
                        Reintentar
                      </Button>
                      <Button onClick={finishCombat} variant="ghost">
                        <Compass className="h-4 w-4" />
                        Salir
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <aside className="grid content-start gap-3">
        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Análisis del enemigo</p>
          <div className="mt-3 grid gap-2">
            <InfoLine label="Debilidad" value="Respuestas estructuradas" />
            <InfoLine label="Resistencia" value="Definiciones vagas" />
            <InfoLine label="Patrón" value="Repregunta + trampa" />
            <InfoLine label="Riesgo" value={activeEncounter.kind === "boss" ? "Alto" : "Medio"} />
          </div>
        </div>
        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-violet-200">Registro del combate</p>
          <div className="mt-3 grid max-h-[460px] gap-2 overflow-y-auto pr-1">
            {combat.log.map((entry) => (
              <p
                className={cn(
                  "rounded-sm border border-white/8 bg-white/[0.035] p-2 text-xs leading-5",
                  toneClasses[entry.tone],
                )}
                key={entry.id}
              >
                {entry.text}
              </p>
            ))}
          </div>
        </div>
      </aside>
    </motion.div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-white/8 bg-white/[0.035] p-3">
      <p className="text-[0.62rem] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-200">{value}</p>
    </div>
  );
}

function CasesScene({
  caseDeck,
  caseResult,
  resolveCase,
  selectCase,
  selectedCase,
  selectedCaseId,
  setScene,
  state,
}: {
  caseDeck: LegalCase[];
  caseResult: LegalCase["options"][number] | null;
  resolveCase: (optionId: string) => void;
  selectCase: (caseId: string) => void;
  selectedCase: LegalCase;
  selectedCaseId: string;
  setScene: (scene: SceneKey) => void;
  state: GameState;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-3 lg:grid-cols-[360px_1fr]"
      exit={{ opacity: 0, y: -14 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.32 }}
    >
      <aside className="arcane-panel p-4">
        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-amber-200">Expedientes</p>
        <div className="mt-4 grid gap-2">
          {caseDeck.map((item) => {
            const solved = state.solvedCases.includes(item.id);
            return (
              <button
                className={cn(
                  "rounded-sm border p-3 text-left transition",
                  item.id === selectedCaseId
                    ? "border-amber-300/45 bg-amber-300/12 text-amber-100"
                    : "border-white/8 bg-white/[0.035] text-slate-300 hover:border-cyan-300/35",
                )}
                key={item.id}
                onClick={() => selectCase(item.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-sm uppercase tracking-[0.1em]">{item.title}</p>
                  {solved ? <Medal className="h-4 w-4 text-emerald-200" /> : <Archive className="h-4 w-4" />}
                </div>
                <p className="mt-2 text-[0.62rem] uppercase tracking-[0.18em] text-cyan-200">
                  {item.world} / Dificultad {item.difficulty}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="arcane-panel overflow-hidden p-5">
        <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-cyan-200">Caso jurídico</p>
            <h2 className="font-display mt-2 text-3xl uppercase tracking-[0.12em] text-white">
              {selectedCase.title}
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">{selectedCase.dossier}</p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {selectedCase.facts.map((fact) => (
                <div className="rounded-sm border border-white/10 bg-black/25 p-3 text-sm text-slate-300" key={fact}>
                  {fact}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-sm border border-amber-300/25 bg-amber-300/8 p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-amber-200">Pregunta del caso</p>
              <h3 className="font-display mt-2 text-xl uppercase tracking-[0.08em] text-white">
                {selectedCase.question}
              </h3>
            </div>

            <div className="mt-4 grid gap-3">
              {selectedCase.options.map((option) => {
                const selected = caseResult?.id === option.id;
                return (
                  <button
                    className={cn(
                      "rounded-sm border p-4 text-left text-sm leading-6 transition",
                      !caseResult && "border-white/10 bg-white/[0.035] hover:border-cyan-300/40 hover:text-cyan-100",
                      caseResult &&
                        option.correct &&
                        "border-emerald-300/45 bg-emerald-300/12 text-emerald-100",
                      caseResult &&
                        selected &&
                        !option.correct &&
                        "border-rose-300/55 bg-rose-400/12 text-rose-100",
                      caseResult &&
                        !selected &&
                        !option.correct &&
                        "border-white/8 bg-black/25 text-slate-500",
                    )}
                    disabled={Boolean(caseResult)}
                    key={option.id}
                    onClick={() => resolveCase(option.id)}
                  >
                    <span className="font-display block text-base uppercase tracking-[0.08em]">{option.label}</span>
                    {caseResult && (
                      <span className="mt-2 block text-xs text-slate-300">
                        {getArticle(option.articleId)?.number ?? option.articleId} / {option.concept}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {caseResult && (
              <div
                className={cn(
                  "mt-5 rounded-sm border p-4",
                  caseResult.correct ? "border-emerald-300/35 bg-emerald-300/10" : "border-rose-300/35 bg-rose-400/10",
                )}
              >
                <p className="text-sm leading-7 text-slate-100">{caseResult.feedback}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{selectedCase.resolution}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => selectCase(selectedCase.id)} variant="ghost">
                    <RotateCcw className="h-4 w-4" />
                    Reintentar
                  </Button>
                  <Button onClick={() => setScene("codex")} variant="cyan">
                    <BookOpen className="h-4 w-4" />
                    Códex
                  </Button>
                </div>
              </div>
            )}
          </div>

          <aside className="grid content-start gap-3">
            <InfoLine label="Casos resueltos" value={`${state.solvedCases.length}/${caseDeck.length}`} />
            <InfoLine label="Recompensa" value={`${selectedCase.reward.exp} EXP / ${selectedCase.reward.reputation} reputación`} />
            <div className="rounded-sm border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-violet-200">Artículos que entrenas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCase.reward.articleIds.map((articleId) => (
                  <span className="rounded-sm border border-violet-300/25 bg-violet-300/10 px-2 py-1 text-xs text-violet-100" key={articleId}>
                    {getArticle(articleId)?.number ?? articleId}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </motion.div>
  );
}

function ClassifierScene({
  answers,
  checkClassifier,
  result,
  round,
  roundId,
  selectRound,
  setAnswer,
  setScene,
  state,
}: {
  answers: Record<string, string>;
  checkClassifier: () => void;
  result: { score: number; total: number } | null;
  round: ClassifierRound;
  roundId: string;
  selectRound: (roundId: string) => void;
  setAnswer: (itemId: string, value: string) => void;
  setScene: (scene: SceneKey) => void;
  state: GameState;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-3 xl:grid-cols-[320px_1fr]"
      exit={{ opacity: 0, y: -14 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.32 }}
    >
      <aside className="arcane-panel p-4">
        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Rondas</p>
        <div className="mt-4 grid gap-2">
          {classifierRounds.map((item) => (
            <button
              className={cn(
                "rounded-sm border p-3 text-left transition",
                item.id === roundId
                  ? "border-cyan-300/45 bg-cyan-300/12 text-cyan-100"
                  : "border-white/8 bg-white/[0.035] text-slate-300 hover:border-amber-300/35",
              )}
              key={item.id}
              onClick={() => selectRound(item.id)}
            >
              <p className="font-display text-sm uppercase tracking-[0.1em]">{item.title}</p>
              <p className="mt-2 text-xs text-slate-500">{item.items.length} conceptos</p>
            </button>
          ))}
        </div>
        <div className="mt-4">
          <InfoLine label="Victorias perfectas" value={String(state.classifierWins)} />
        </div>
      </aside>

      <section className="arcane-panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-200">Clasificador jurídico</p>
            <h2 className="font-display mt-2 text-3xl uppercase tracking-[0.12em] text-white">{round.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{round.prompt}</p>
          </div>
          <Button onClick={checkClassifier} variant="primary">
            <CircleDot className="h-4 w-4" />
            Verificar
          </Button>
        </div>

        {result && (
          <div className="mt-5 rounded-sm border border-amber-300/30 bg-amber-300/10 p-4">
            <p className="font-display text-xl uppercase tracking-[0.12em] text-white">
              Resultado {result.score}/{result.total}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {result.score === result.total
                ? "Clasificación perfecta. La Academia registra dominio conceptual."
                : "Corrige las categorías marcadas y vuelve a verificar."}
            </p>
          </div>
        )}

        <div className="mt-5 grid gap-3">
          {round.items.map((item) => {
            const answer = answers[item.id] ?? "";
            const correct = result ? answer === item.answer : null;
            return (
              <div
                className={cn(
                  "grid gap-3 rounded-sm border bg-white/[0.035] p-4 md:grid-cols-[1fr_280px]",
                  result && correct && "border-emerald-300/40 bg-emerald-300/8",
                  result && !correct && "border-rose-300/45 bg-rose-400/8",
                  !result && "border-white/10",
                )}
                key={item.id}
              >
                <div>
                  <p className="font-display text-base uppercase tracking-[0.08em] text-white">{item.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    Art. {getArticle(item.articleId)?.number ?? item.articleId}
                  </p>
                  {result && <p className="mt-3 text-sm leading-6 text-slate-300">{item.explanation}</p>}
                </div>
                <select
                  className="h-11 rounded-sm border border-white/10 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/60"
                  onChange={(event) => setAnswer(item.id, event.target.value)}
                  value={answer}
                >
                  <option value="">Elegir categoría</option>
                  {round.columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => setScene("cases")} variant="violet">
            <Archive className="h-4 w-4" />
            Casos
          </Button>
          <Button onClick={() => setScene("memory")} variant="cyan">
            <Zap className="h-4 w-4" />
            Memoria
          </Button>
        </div>
      </section>
    </motion.div>
  );
}

function MemoryScene({
  card,
  flashcardIndex,
  revealed,
  reviewFlashcard,
  setFlashcardIndex,
  setRevealed,
  setScene,
  state,
}: {
  card: Flashcard;
  flashcardIndex: number;
  revealed: boolean;
  reviewFlashcard: (grade: "again" | "good" | "perfect") => void;
  setFlashcardIndex: Dispatch<SetStateAction<number>>;
  setRevealed: Dispatch<SetStateAction<boolean>>;
  setScene: (scene: SceneKey) => void;
  state: GameState;
}) {
  const reviews = state.reviewedFlashcards[card.id] ?? 0;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-3 lg:grid-cols-[330px_1fr]"
      exit={{ opacity: 0, y: -14 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.32 }}
    >
      <aside className="arcane-panel p-4">
        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Memoria jurídica</p>
        <div className="mt-4 grid gap-3">
          <InfoLine label="Tarjetas repasadas" value={String(getReviewedCount(state))} />
          <InfoLine label="Artículo activo" value={getArticle(card.articleId)?.number ?? card.articleId} />
          <InfoLine label="Repasos de esta carta" value={String(reviews)} />
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => {
              setFlashcardIndex((current) => (current + flashcards.length - 1) % flashcards.length);
              setRevealed(false);
            }}
            variant="ghost"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
          <Button
            onClick={() => {
              setFlashcardIndex((current) => (current + 1) % flashcards.length);
              setRevealed(false);
            }}
            variant="ghost"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      <section className="arcane-panel grid content-center p-5">
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-200">
                Tarjeta {flashcardIndex + 1}/{flashcards.length} / {card.world}
              </p>
              <h2 className="font-display mt-2 text-3xl uppercase tracking-[0.12em] text-white">
                {getArticle(card.articleId)?.title ?? card.articleId}
              </h2>
            </div>
            <Button onClick={() => setScene("codex")} variant="violet">
              <BookOpen className="h-4 w-4" />
              Códex
            </Button>
          </div>

          <div className="mt-6 min-h-[320px] rounded-sm border border-amber-300/30 bg-[linear-gradient(135deg,rgba(245,158,11,0.12),rgba(15,23,42,0.72))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Pregunta</p>
            <h3 className="font-display mt-3 text-3xl uppercase leading-tight tracking-[0.08em] text-white">
              {card.front}
            </h3>
            {revealed ? (
              <div className="mt-6 rounded-sm border border-white/10 bg-black/30 p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.24em] text-emerald-200">Respuesta</p>
                <p className="mt-3 text-lg leading-8 text-slate-100">{card.back}</p>
                <p className="mt-4 rounded-sm border border-violet-300/20 bg-violet-300/10 p-3 text-sm text-violet-100">
                  {card.mnemonic}
                </p>
              </div>
            ) : (
              <Button className="mt-8" onClick={() => setRevealed(true)} variant="primary">
                <Sparkles className="h-4 w-4" />
                Mostrar respuesta
              </Button>
            )}
          </div>

          {revealed && (
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <Button onClick={() => reviewFlashcard("again")} variant="red">
                Repetir
              </Button>
              <Button onClick={() => reviewFlashcard("good")} variant="cyan">
                Correcta
              </Button>
              <Button onClick={() => reviewFlashcard("perfect")} variant="primary">
                Perfecta
              </Button>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}

function AchievementsScene({
  setScene,
  state,
}: {
  setScene: (scene: SceneKey) => void;
  state: GameState;
}) {
  const unlocked = achievements.filter((achievement) => isAchievementUnlocked(achievement, state));

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-3 xl:grid-cols-[1fr_380px]"
      exit={{ opacity: 0, y: -14 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.32 }}
    >
      <section className="arcane-panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-200">Logros y academia</p>
            <h2 className="font-display mt-2 text-3xl uppercase tracking-[0.12em] text-white">
              Progreso del grado
            </h2>
          </div>
          <Button onClick={() => setScene("map")} variant="cyan">
            <Map className="h-4 w-4" />
            Mapa
          </Button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {achievements.map((achievement) => {
            const earned = isAchievementUnlocked(achievement, state);
            return (
              <div
                className={cn(
                  "rounded-sm border p-4",
                  earned ? "border-amber-300/45 bg-amber-300/10" : "border-white/8 bg-white/[0.035] opacity-75",
                )}
                key={achievement.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <Trophy className={cn("h-6 w-6", earned ? "text-amber-200" : "text-slate-500")} />
                  {earned ? <Medal className="h-5 w-5 text-emerald-200" /> : <Lock className="h-5 w-5 text-slate-600" />}
                </div>
                <h3 className="font-display mt-4 text-lg uppercase tracking-[0.1em] text-white">{achievement.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{achievement.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-cyan-200">{achievement.reward}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          <div className="rounded-sm border border-white/10 bg-black/25 p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">NPCs</p>
            <div className="mt-3 grid gap-2">
              {npcs.map((npc) => (
                <div className="rounded-sm border border-white/8 bg-white/[0.035] p-3" key={npc.name}>
                  <p className="font-display text-sm uppercase tracking-[0.1em] text-white">{npc.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-amber-200">{npc.role}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{npc.line}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-sm border border-white/10 bg-black/25 p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-violet-200">Profesores</p>
            <div className="mt-3 grid gap-2">
              {professors.map((professor) => (
                <div className="rounded-sm border border-white/8 bg-white/[0.035] p-3" key={professor.name}>
                  <p className="font-display text-sm uppercase tracking-[0.1em] text-white">{professor.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">{professor.specialty}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{professor.threat}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <aside className="grid content-start gap-3">
        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-amber-200">Resumen</p>
          <div className="mt-3 grid gap-2">
            <InfoLine label="Logros" value={`${unlocked.length}/${achievements.length}`} />
            <InfoLine label="Duelos ganados" value={String(state.completedEncounters.length)} />
            <InfoLine label="Casos" value={String(state.solvedCases.length)} />
            <InfoLine label="Flashcards" value={String(getReviewedCount(state))} />
          </div>
        </div>
        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Futuras expansiones</p>
          <div className="mt-3 grid gap-2">
            {futureExpansions.map((item) => (
              <p className="rounded-sm border border-white/8 bg-white/[0.035] p-3 text-sm leading-6 text-slate-300" key={item}>
                {item}
              </p>
            ))}
          </div>
        </div>
      </aside>
    </motion.div>
  );
}

function InventoryScene({
  equipRelic,
  restAtArchive,
  setScene,
  state,
  stats,
}: {
  equipRelic: (relicId: string) => void;
  restAtArchive: () => void;
  setScene: (scene: SceneKey) => void;
  state: GameState;
  stats: Record<StatKey, number>;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-3 lg:grid-cols-[320px_1fr]"
      exit={{ opacity: 0, y: -14 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.32 }}
    >
      <aside className="grid content-start gap-3">
        <RelicLoadout state={state} />
        <div className="arcane-panel p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-cyan-200">Estadísticas actuales</p>
          <div className="mt-4 grid gap-2">
            {statKeys.map((key) => (
              <div className="flex items-center justify-between border-b border-white/8 pb-2 text-sm" key={key}>
                <span className="capitalize text-slate-400">{key}</span>
                <span className="font-mono text-cyan-100">{stats[key]}</span>
              </div>
            ))}
          </div>
          <Button className="mt-5 w-full" onClick={restAtArchive} variant="cyan">
            <Archive className="h-4 w-4" />
            Archivo de Calma
          </Button>
        </div>
      </aside>

      <section className="arcane-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-violet-200">Inventario</p>
            <h2 className="font-display mt-2 text-3xl uppercase tracking-[0.14em] text-white">Reliquias civiles</h2>
          </div>
          <Button onClick={() => setScene("map")} variant="ghost">
            <Map className="h-4 w-4" />
            Mapa
          </Button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {relics.map((relic) => {
            const Icon = relic.icon;
            const owned = state.relics.includes(relic.id);
            const equipped = state.equippedRelics.includes(relic.id);
            return (
              <button
                className={cn(
                  "group min-h-56 rounded-sm border bg-white/[0.035] p-4 text-left transition",
                  getRarityClass(relic),
                  owned && "hover:-translate-y-1 hover:bg-white/[0.065]",
                  !owned && "opacity-35 grayscale",
                  equipped && "ring-1 ring-amber-200/70",
                )}
                disabled={!owned}
                key={relic.id}
                onClick={() => equipRelic(relic.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-sm border border-current/35 bg-black/30">
                    {owned ? <Icon className="h-7 w-7" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <span className="text-[0.62rem] uppercase tracking-[0.18em]">{relic.rarity}</span>
                </div>
                <h3 className="font-display mt-4 text-xl uppercase tracking-[0.12em] text-white">{relic.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{owned ? relic.description : "Sellada"}</p>
                <p className="mt-4 text-xs leading-5 text-slate-500">{owned ? relic.flavor : "Derrota bosses para abrirla."}</p>
                <p className="mt-5 text-[0.62rem] uppercase tracking-[0.18em] text-cyan-200">
                  {equipped ? "Equipada" : owned ? "Tocar para equipar" : "No descubierta"}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}

function CodexScene({
  selectedArticle,
  selectedArticleId,
  setScene,
  setSelectedArticleId,
  state,
}: {
  selectedArticle: (typeof articles)[number];
  selectedArticleId: string;
  setScene: (scene: SceneKey) => void;
  setSelectedArticleId: (articleId: string) => void;
  state: GameState;
}) {
  const unlocked = state.unlockedArticles.includes(selectedArticle.id);
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-3 lg:grid-cols-[420px_1fr]"
      exit={{ opacity: 0, y: -14 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.32 }}
    >
      <aside className="arcane-panel p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cyan-200">Códex</p>
            <h2 className="font-display mt-2 text-2xl uppercase tracking-[0.14em] text-white">Grimorio de Bello</h2>
          </div>
          <Button onClick={() => setScene("map")} size="icon" variant="ghost" title="Volver al mapa">
            <Map className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-5 grid gap-2">
          {articles.map((article) => {
            const isUnlocked = state.unlockedArticles.includes(article.id);
            return (
              <button
                className={cn(
                  "rounded-sm border p-3 text-left transition",
                  selectedArticleId === article.id
                    ? "border-amber-300/70 bg-amber-300/12"
                    : "border-white/10 bg-white/[0.035] hover:border-cyan-300/40",
                  !isUnlocked && "opacity-45",
                )}
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-lg uppercase tracking-[0.12em] text-white">
                    Art. {isUnlocked ? article.number : "????"}
                  </p>
                  {isUnlocked ? (
                    <span className="font-mono text-xs text-cyan-200">
                      M{state.articleMastery[article.id] ?? 0}
                    </span>
                  ) : (
                    <Lock className="h-4 w-4 text-slate-500" />
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-400">{isUnlocked ? article.title : article.unlockHint}</p>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="arcane-panel relative overflow-hidden p-5">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative z-10">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-amber-200">{selectedArticle.school}</p>
          <h3 className="font-display mt-2 text-4xl uppercase tracking-[0.12em] text-white">
            {unlocked ? `Art. ${selectedArticle.number}` : "Artículo sellado"}
          </h3>
          <p className="mt-2 text-xl text-cyan-100">{unlocked ? selectedArticle.title : selectedArticle.unlockHint}</p>

          <div className="mt-6 rounded-sm border border-amber-300/30 bg-amber-300/8 p-5">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-amber-200">Hechizo normativo</p>
            <p className="font-display mt-3 text-2xl leading-10 text-white">
              {unlocked ? selectedArticle.incantation : "La tinta permanece dormida."}
            </p>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            <CodexColumn title="Requisitos" values={unlocked ? selectedArticle.requirements : ["Derrota su guardián"]} />
            <CodexColumn title="Efectos" values={unlocked ? selectedArticle.effects : ["Aún no revelado"]} />
            <CodexColumn title="Excepciones" values={unlocked ? selectedArticle.exceptions : ["Aún no revelado"]} />
          </div>

          <div className="mt-5 rounded-sm border border-cyan-300/20 bg-cyan-400/8 p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-cyan-200">Preguntas del grimorio</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {(unlocked ? selectedArticle.questions : [selectedArticle.unlockHint]).map((question) => (
                <p className="rounded-sm border border-white/8 bg-black/25 p-3 text-sm text-slate-300" key={question}>
                  {question}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function CodexColumn({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="rounded-sm border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-violet-200">{title}</p>
      <div className="mt-3 grid gap-2">
        {values.map((value) => (
          <p className="flex gap-2 text-sm leading-6 text-slate-300" key={value}>
            <Sparkles className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-200" />
            {value}
          </p>
        ))}
      </div>
    </div>
  );
}

function ProfileScene({
  progress,
  resetRun,
  setScene,
  state,
  stats,
}: {
  progress: ReturnType<typeof getLevelProgress>;
  resetRun: () => void;
  setScene: (scene: SceneKey) => void;
  state: GameState;
  stats: Record<StatKey, number>;
}) {
  const bossEncounters = encounters.filter((encounter) => encounter.kind === "boss");
  const completedBossCount = bossEncounters.filter((encounter) => state.completedEncounters.includes(encounter.id)).length;
  const unlockedAchievements = achievements.filter((achievement) => isAchievementUnlocked(achievement, state)).length;
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-3 lg:grid-cols-[360px_1fr]"
      exit={{ opacity: 0, y: -14 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.32 }}
    >
      <PlayerPanel progress={progress} state={state} stats={stats} />
      <section className="arcane-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cyan-200">Ficha del jugador</p>
            <h2 className="font-display mt-2 text-3xl uppercase tracking-[0.14em] text-white">Litigante Novato</h2>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setScene("codex")} variant="violet">
              <BookOpen className="h-4 w-4" />
              Códex
            </Button>
            <Button onClick={resetRun} variant="red">
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          <ProfileBadge icon={Trophy} label="Bosses" value={`${completedBossCount}/${bossEncounters.length}`} />
          <ProfileBadge icon={Archive} label="Casos" value={`${state.solvedCases.length}/${legalCases.length}`} />
          <ProfileBadge icon={CircleDot} label="Clasificador" value={String(state.classifierWins)} />
          <ProfileBadge icon={BookOpen} label="Artículos" value={`${state.unlockedArticles.length}/${articles.length}`} />
          <ProfileBadge icon={Medal} label="Logros" value={`${unlockedAchievements}/${achievements.length}`} />
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          <div className="rounded-sm border border-white/10 bg-white/[0.035] p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-amber-200">Títulos</p>
            <div className="mt-4 grid gap-2">
              {[
                ["Aspirante del Código", true],
                ["Domador de Fuentes", state.completedEncounters.includes("fuentes-vivas")],
                ["Señor del Pacto", state.completedEncounters.includes("trono-del-pacto")],
                ["Guardia Hipotecario", state.completedEncounters.includes("fortaleza-persecucion")],
                ["Detective Civil", state.solvedCases.length >= 3],
                ["Memoria de Bello", getReviewedCount(state) >= 8],
              ].map(([title, earned]) => (
                <div
                  className={cn(
                    "flex items-center justify-between rounded-sm border p-3 text-sm",
                    earned ? "border-amber-300/25 bg-amber-300/8 text-amber-100" : "border-white/8 bg-black/25 text-slate-500",
                  )}
                  key={String(title)}
                >
                  <span>{title}</span>
                  {earned ? <Medal className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </div>
              ))}
            </div>
          </div>
          <ActivityPanel activity={state.activity} />
        </div>
      </section>
    </motion.div>
  );
}

function ProfileBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-sm border border-white/10 bg-white/[0.035] p-4">
      <Icon className="h-6 w-6 text-cyan-200" />
      <p className="font-display mt-3 text-2xl uppercase tracking-[0.12em] text-white">{value}</p>
      <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">{label}</p>
    </div>
  );
}

function BottomNav({
  scene,
  setScene,
  state,
}: {
  scene: SceneKey;
  setScene: (scene: SceneKey) => void;
  state: GameState;
}) {
  return (
    <nav className="arcane-panel mt-3 grid grid-cols-5 gap-1 p-1 lg:hidden">
      {mainScenes.map((key) => {
        const Icon = sceneLabels[key].icon;
        const disabled = key === "combat" && !state.combat;
        return (
          <button
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 rounded-sm border border-transparent text-[0.6rem] uppercase tracking-[0.1em] text-slate-400",
              scene === key && "border-amber-300/45 bg-amber-300/12 text-amber-100",
              disabled && "opacity-35",
            )}
            disabled={disabled}
            key={key}
            onClick={() => setScene(key)}
          >
            <Icon className="h-4 w-4" />
            {sceneLabels[key].label}
          </button>
        );
      })}
    </nav>
  );
}
