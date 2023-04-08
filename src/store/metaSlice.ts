import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

// schema
export const modeSchema = z.enum(["comfy", "unlimited"]);
export const answerSchema = z.array(z.string().max(20)).length(6);
export const doneSchema = z.boolean();
export const historySchema = z.object({
  played: z.number().min(0),
  won: z.number().min(0),
  currentStreak: z.number().min(0),
  maxStreak: z.number().min(0),
});

// Define a type for the slice state
export type Mode = z.infer<typeof modeSchema>;
type History = z.infer<typeof historySchema>;
type Done = z.infer<typeof doneSchema>;
type Answers = z.infer<typeof answerSchema>;

interface State {
  answers: Answers;
  num: number;
  done: Done;
  history: History;
  puzzle: string;
  error: string;
  result: string;
}

interface MetaState {
  mode: Mode;
  comfy: State;
  unlimited: State & { seed: string };
}

// Define the initial state using that type
const initialValue = {
  answers: Array(6).fill(""),
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
  error: "",
};

const initialState: MetaState = {
  mode: "comfy",
  comfy: initialValue,
  unlimited: { ...initialValue, seed: "" },
};

export const counterSlice = createSlice({
  name: "meta",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<Mode>) => {
      state[state.mode].error = "";
      state.mode = action.payload;
      localStorage.setItem("mode", action.payload);
    },
    setAnswers: (
      state,
      action: PayloadAction<{ comfy: string[]; unlimited: string[] }>
    ) => {
      state.comfy.answers = action.payload.comfy;
      state.unlimited.answers = action.payload.unlimited;
      localStorage.setItem(
        "answers",
        JSON.stringify({
          comfy: state.comfy.answers,
          unlimited: state.unlimited.answers,
        })
      );
      let num = action.payload.comfy.filter((a) => a !== "").length;
      state.comfy.num = num;
      num = action.payload.unlimited.filter((a) => a !== "").length;
      state.unlimited.num = num;
    },
    submitAnswer: (
      state,
      action: PayloadAction<{ answer: string; mode: Mode }>
    ) => {
      const { answer, mode } = action.payload;
      state[mode].answers[state[mode].num] = answer;
      localStorage.setItem(
        "answers",
        JSON.stringify({
          comfy: state.comfy.answers,
          unlimited: state.unlimited.answers,
        })
      );
      state[mode].num += 1;
      if (state[mode].num > 5) {
        state[mode].done = true;
        localStorage.setItem(
          "done",
          JSON.stringify({
            comfy: state.comfy.done,
            unlimited: state.unlimited.done,
          })
        );
      }
    },
    setHistory: (
      state,
      action: PayloadAction<{ comfy: History; unlimited: History }>
    ) => {
      state.comfy.history = action.payload.comfy;
      state.unlimited.history = action.payload.unlimited;
      localStorage.setItem(
        "history",
        JSON.stringify({
          comfy: state.comfy.history,
          unlimited: state.unlimited.history,
        })
      );
    },
    setDone: (
      state,
      action: PayloadAction<{ comfy: boolean; unlimited: boolean }>
    ) => {
      state.comfy.done = action.payload.comfy;
      state.unlimited.done = action.payload.unlimited;
      localStorage.setItem(
        "done",
        JSON.stringify({
          comfy: state.comfy.done,
          unlimited: state.unlimited.done,
        })
      );
    },
    finishGame: (state, action: PayloadAction<Mode>) => {
      state[action.payload].done = true;
      localStorage.setItem(
        "done",
        JSON.stringify({
          comfy: state.comfy.done,
          unlimited: state.unlimited.done,
        })
      );
    },
    setPuzzle: (
      state,
      action: PayloadAction<{ puzzle: string; mode: Mode }>
    ) => {
      const { puzzle, mode } = action.payload;
      state[mode].puzzle = puzzle;
      localStorage.setItem(
        "puzzle",
        JSON.stringify({
          comfy: state.comfy.puzzle,
          unlimited: state.unlimited.puzzle,
        })
      );
    },
    setError: (state, action: PayloadAction<{ error: string; mode: Mode }>) => {
      const { error, mode } = action.payload;
      state[mode].error = error;
    },
    setSeed: (state, action: PayloadAction<string>) => {
      state.unlimited.seed = action.payload;
      localStorage.setItem("seed", action.payload);
    },
    setResult: (
      state,
      action: PayloadAction<{ comfy: string; unlimited: string }>
    ) => {
      state.comfy.result = action.payload.comfy;
      state.unlimited.result = action.payload.unlimited;
      localStorage.setItem(
        "result",
        JSON.stringify({
          comfy: state.comfy.result,
          unlimited: state.unlimited.result,
        })
      );
    },
    setResultMode: (
      state,
      action: PayloadAction<{ result: string; mode: Mode }>
    ) => {
      const { result, mode } = action.payload;
      state[mode].result = result;
      localStorage.setItem(
        "result",
        JSON.stringify({
          comfy: state.comfy.result,
          unlimited: state.unlimited.result,
        })
      );
    },
    reset: (state, action: PayloadAction<Mode>) => {
      const mode = action.payload;
      state[mode].answers = Array(6).fill("");
      localStorage.setItem(
        "answers",
        JSON.stringify({
          comfy: state.comfy.answers,
          unlimited: state.unlimited.answers,
        })
      );
      state[mode].num = 0;
      state[mode].done = false;
      localStorage.setItem(
        "done",
        JSON.stringify({
          comfy: state.comfy.done,
          unlimited: state.unlimited.done,
        })
      );
      state[mode].error = "";
      state[mode].puzzle = "";
      localStorage.setItem(
        "puzzle",
        JSON.stringify({
          comfy: state.comfy.puzzle,
          unlimited: state.unlimited.puzzle,
        })
      );
      state[mode].result = "Misteri";
      localStorage.setItem(
        "result",
        JSON.stringify({
          comfy: state.comfy.result,
          unlimited: state.unlimited.result,
        })
      );
      if (mode === "unlimited") {
        const seed = Math.random().toString();
        state[mode].seed = seed;
        localStorage.setItem("seed", seed);
      }
    },
  },
});

export const {
  setMode,
  submitAnswer,
  setAnswers,
  setHistory,
  setDone,
  setPuzzle,
  finishGame,
  setError,
  setSeed,
  setResult,
  setResultMode,
  reset,
} = counterSlice.actions;

export default counterSlice.reducer;