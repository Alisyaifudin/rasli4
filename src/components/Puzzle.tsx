import Show from "~/components/control-flow/Show";
import Skeleton from "~/components/aux/Skeleton";
import { setPuzzle, type Mode, setRotation } from "~/store/metaSlice";
import { api } from "~/utils/api";
import React, { useEffect, useRef, useState } from "react";
import { draw } from "~/utils/draw";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import { puzzleSchema } from "~/layouts/Layout";
interface PuzzleProps {
  mounted: boolean;
  mode: Mode;
}

function Puzzle({ mounted }: PuzzleProps) {
  const dispatch = useAppDispatch();
  const seed = useAppSelector((state) => state.meta.seed);
  const mode = useAppSelector((state) => state.meta.mode);
  const done = useAppSelector((state) => state.meta[mode].done);
  const rot = useAppSelector((state) => state.meta.rotation);
  const dailyPuzzle = api.puzzle.getDailyPuzzle.useQuery(rot, {
    onSuccess: (data) => {
      if (data.name === null) return;
      const puzzle_raw = localStorage.getItem("puzzle");
      const parsedPuzzle = puzzleSchema.safeParse(puzzle_raw);
      if (parsedPuzzle.success) {
        localStorage.setItem(
          "puzzle",
          JSON.stringify({ ...parsedPuzzle.data, comfy: data.name })
        );
        if (parsedPuzzle.data[mode] !== data.name) {
          const rot = (Math.random() * 4).toString();
          dispatch(setRotation(rot));
          localStorage.setItem("rotation", rot);
        }
      } else {
        localStorage.setItem(
          "puzzle",
          JSON.stringify({ comfy: data.name, unlimited: "" })
        );
      }
      dispatch(setPuzzle({ puzzle: data.name, mode: "comfy" }));
    },
  });
  const unlimitedPuzzle = api.puzzle.getPuzzle.useQuery(
    { seed, rot },
    {
      onSuccess: (data) => {
        if (data.name === null) return;
        const puzzle_raw = localStorage.getItem("puzzle");
        const parsedPuzzle = puzzleSchema.safeParse(puzzle_raw);
        if (parsedPuzzle.success) {
          localStorage.setItem(
            "puzzle",
            JSON.stringify({ ...parsedPuzzle.data, unlimited: data.name })
          );
        } else {
          localStorage.setItem(
            "puzzle",
            JSON.stringify({ comfy: "", unlimited: data.name })
          );
        }
        dispatch(setPuzzle({ puzzle: data.name, mode: "unlimited" }));
      },
    }
  );
  const isLoading = dailyPuzzle.isLoading || unlimitedPuzzle.isLoading;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current || !mounted) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    if (mode === "comfy") {
      if (!dailyPuzzle?.data) return;
      const stars = dailyPuzzle.data.stars;
      const radius = dailyPuzzle.data.radius;
      const lines = done ? dailyPuzzle.data.lines : [];
      //Our draw come here
      draw(context, stars, radius, lines);
    } else {
      if (!unlimitedPuzzle?.data || unlimitedPuzzle.data.name === null) return;
      const stars = unlimitedPuzzle.data.stars;
      const radius = unlimitedPuzzle.data.radius;
      const lines = done ? unlimitedPuzzle.data.lines : [];
      //Our draw come here
      draw(context, stars, radius, lines);
    }
  }, [canvasRef, dailyPuzzle, done, mode, mounted, unlimitedPuzzle]);

  return (
    <>
      <div className="flex aspect-square w-full xs:w-[50%] ">
        <Show
          when={mounted && !isLoading}
          fallback={
            <Skeleton>
              <div className="h-full w-full rounded-full bg-slate-300 dark:bg-zinc-800" />
            </Skeleton>
          }
        >
          <canvas
            className="block w-full rounded-full"
            width="300"
            height="300"
            ref={canvasRef}
            id="canvas"
          ></canvas>
        </Show>
      </div>
    </>
  );
}

export default Puzzle;
