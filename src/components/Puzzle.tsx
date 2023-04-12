import Show from "~/components/control-flow/Show";
import Skeleton from "~/components/aux/Skeleton";
import { addPuzzle, type Mode, reset } from "~/store/metaSlice";
import { api } from "~/utils/api";
import { useEffect, useRef } from "react";
import { draw } from "~/utils/draw";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
interface PuzzleProps {
  mounted: boolean;
  mode: Mode;
}

function Puzzle({ mounted }: PuzzleProps) {
  const dispatch = useAppDispatch();
  const seed = useAppSelector((state) => state.meta.seed);
  const mode = useAppSelector((state) => state.meta.mode);
  const done = useAppSelector((state) => state.meta[mode].done);
  const puzzle = useAppSelector((state) => state.meta[mode].puzzle);
  const getPuzzle = api.puzzle.getPuzzle.useQuery(
    {
      seed,
      mode,
    },
    {
      onSuccess: (data) => {
        if (data.name === null) return;
        if (mode === "comfy" && puzzle !== data.name) {
          dispatch(reset(mode));
        }
        dispatch(addPuzzle({ puzzle: data.name, mode }));
      },
    }
  );
  const isLoading = getPuzzle.isLoading;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current || !mounted) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    if (!getPuzzle?.data) return;
    const stars = getPuzzle.data.stars;
    const radius = getPuzzle.data.radius;
    const lines = done ? getPuzzle.data.lines : [];
    //Our draw come here
    draw(context, stars, radius, lines);
  }, [canvasRef, getPuzzle, done, mode, mounted]);

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
