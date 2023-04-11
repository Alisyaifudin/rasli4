import { type Mode, reset, setRotation } from "~/store/metaSlice";
import Show from "~/components/control-flow/Show";
import Skeleton from "~/components/aux/Skeleton";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import { Button } from "./ui/button";
import { api } from "~/utils/api";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  mounted: boolean;
  answer: string;
  isSubmitting: boolean;
}

function SubmitButton({ answer, mounted, isSubmitting }: SubmitButtonProps) {
  const mode = useAppSelector((state) => state.meta.mode);
  return (
    <Show
      when={mounted}
      fallback={
        <Skeleton>
          <div className="h-10 w-24 rounded-md bg-slate-300 dark:bg-zinc-800" />
        </Skeleton>
      }
    >
      <Show
        when={mode === "unlimited"}
        fallback={
          <Comfy isSubmitting={isSubmitting} mode={mode} answer={answer} />
        }
      >
        <Unlimited isSubmitting={isSubmitting} mode={mode} answer={answer} />
      </Show>
    </Show>
  );
}

interface ButtonProps {
  mode: Mode;
  answer: string;
  isSubmitting: boolean;
}

function Comfy({ mode, answer, isSubmitting }: ButtonProps) {
  const done = useAppSelector((state) => state.meta[mode].done);
  return (
    <div className="flex gap-1">
      <Button type="submit" disabled={done || !answer.length} variant="outline">
        <Show when={isSubmitting}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </Show>
        Jawab
      </Button>
    </div>
  );
}

function Unlimited({ answer, mode, isSubmitting }: ButtonProps) {
  const utils = api.useContext();
  const done = useAppSelector((state) => state.meta[mode].done);
  const dispatch = useAppDispatch();

  const handleNext = () => {
    dispatch(reset(mode));
    utils.puzzle.getPuzzle.invalidate();
    const rot = Math.floor(Math.random() * 4).toString();
    dispatch(setRotation(rot))
    localStorage.setItem("rotation", rot);
  };
  return (
    <div className="flex gap-1">
      <Show
        when={!done}
        fallback={
          <Button onClick={handleNext} type="button" variant="outline">
            Selanjutnya
          </Button>
        }
      >
        <Button type="submit" disabled={!answer.length} variant="outline">
          <Show when={isSubmitting}>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </Show>
          Jawab
        </Button>
      </Show>
      <Button
        disabled={done}
        onClick={handleNext}
        type="button"
        variant="ghost"
      >
        Lewati
      </Button>
    </div>
  );
}

export default SubmitButton;
