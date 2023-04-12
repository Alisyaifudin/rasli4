import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { z } from "zod";

// schema
export const modeSchema = z.enum(["comfy", "unlimited"]);
export const answerSchema = z
  .array(
    z.object({
      name: z.string().max(20),
      closeness: z.number().min(-1),
    })
  )
  .length(6);
export const doneSchema = z.boolean();
export const historySchema = z.object({
  played: z.number().min(0),
  won: z.number().min(0),
  currentStreak: z.number().min(0),
  maxStreak: z.number().min(0),
});

// Define a type for the slice state
export type Mode = z.infer<typeof modeSchema>;
type Answers = z.infer<typeof answerSchema>;

export const stateShema = z.object({
  answers: answerSchema,
  num: z.number().min(0),
  done: z.boolean(),
  history: historySchema,
  puzzle: z.string(),
  result: z.string(),
});

type State = z.infer<typeof stateShema>;

export const metaSchema = z.object({
  mode: modeSchema,
  comfy: stateShema,
  unlimited: stateShema,
  seed: z.string(),
  mounted: z.boolean(),
});

export type MetaState = z.infer<typeof metaSchema>;

// Define the initial state using that type
const initialValue = {
  answers: Array.from({ length: 6 }, () => ({
    name: "",
    closeness: 0,
  })),
  puzzle: "",
  result: "Misteri",
  num: 0,
  done: false,
  history: {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
  },
};

const initialState: MetaState = {
  mode: "comfy",
  comfy: initialValue,
  unlimited: initialValue,
  seed: "",
  mounted: false,
};

export const counterSlice = createSlice({
  name: "meta",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    switchMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
      updateMeta("mode", action.payload);
    },
    submitAnswer: (
      state,
      action: PayloadAction<{ answer: Answers[0]; mode: Mode }>
    ) => {
      const { answer, mode } = action.payload;
      state[mode].answers[state[mode].num] = answer;
      updateState(mode, "answers", state[mode].answers);
      state[mode].num += 1;
      updateState(mode, "num", state[mode].num);
      if (state[mode].num > 5) {
        state[mode].done = true;
        updateState(mode, "done", true);
      }
    },
    finishGame: (
      state,
      action: PayloadAction<{ mode: Mode; result: string }>
    ) => {
      const { mode, result } = action.payload;
      state[mode].done = true;
      updateState(mode, "done", true);
      state[mode].result = result;
      updateState(mode, "result", result);
    },
    reset: (state, action: PayloadAction<Mode>) => {
      const mode = action.payload;
      const newstate = resetState(mode);
      state[mode] = newstate;
      if (mode === "unlimited") {
        const seed = Math.random().toString();
        state.seed = seed;
        updateMeta("seed", seed);
      }
    },
    mount: (state) => {
      state.mounted = true;
    },
    initialize: (st, action: PayloadAction<{ mode: Mode; state: State }>) => {
      const { mode, state } = action.payload;
      st[mode] = state;
    },
    addSeed: (state, action: PayloadAction<string>) => {
      state.seed = action.payload;
      updateMeta("seed", action.payload);
    },
    addPuzzle: (
      state,
      action: PayloadAction<{ mode: Mode; puzzle: string }>
    ) => {
      const { mode, puzzle } = action.payload;
      state[mode].puzzle = puzzle;
      updateState(mode, "puzzle", puzzle);
    },
  },
});

export const {
  switchMode,
  submitAnswer,
  finishGame,
  reset,
  mount,
  initialize,
  addSeed,
  addPuzzle,
} = counterSlice.actions;

export default counterSlice.reducer;

function updateMeta<T extends Exclude<keyof MetaState, "comfy" | "unlimited">>(
  key: T,
  value: MetaState[T]
) {
  localStorage.setItem(
    key,
    typeof value === "boolean" ? JSON.stringify(value) : value
  );
}

function updateState<T extends keyof State>(
  mode: Mode,
  key: T,
  value: State[T]
) {
  const local = localStorage.getItem(mode);
  if (local !== null) {
    const json: unknown = JSON.parse(local);
    const parsed = stateShema.safeParse(json);
    if (parsed.success) {
      const state = parsed.data;
      state[key] = value;
      localStorage.setItem(mode, JSON.stringify(state));
      return;
    }
  }
  localStorage.setItem(mode, JSON.stringify(initialValue));
}

function resetState(mode: Mode) {
  const local = localStorage.getItem(mode);
  if (local !== null) {
    const json: unknown = JSON.parse(local);
    const parsed = stateShema.safeParse(json);
    if (parsed.success) {
      const history = parsed.data.history;
      const newstate = { ...initialValue, history };
      localStorage.setItem(mode, JSON.stringify(newstate));
      return newstate;
    }
  }
  localStorage.setItem(mode, JSON.stringify(initialValue));
  return initialValue;
}
