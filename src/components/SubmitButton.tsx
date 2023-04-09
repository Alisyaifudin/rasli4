import { type Mode, reset } from "~/store/metaSlice";
import Show from "~/components/control-flow/Show";
import Skeleton from "~/components/aux/Skeleton";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import { Button } from "./ui/button";
import { api } from "~/utils/api";

interface SubmitButtonProps {
  mounted: boolean;
  answer: string;
}

function SubmitButton({ answer, mounted }: SubmitButtonProps) {
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
        when={mode === "comfy"}
        fallback={<Comfy mode={mode} answer={answer} />}
      >
        <Unlimited mode={mode} answer={answer} />
      </Show>
    </Show>
  );
}

interface ButtonProps {
  mode: Mode;
  answer: string;
}

function Comfy({ mode, answer }: ButtonProps) {
  const done = useAppSelector((state) => state.meta[mode].done);
  return (
    <div className="flex gap-1">
      <Button type="submit" disabled={done || !answer.length} variant="outline">
        Jawab
      </Button>
    </div>
  );
}

function Unlimited({ answer, mode }: ButtonProps) {
  const utils = api.useContext();
  const done = useAppSelector((state) => state.meta[mode].done);
  const dispatch = useAppDispatch();

  const handleNext = () => {
    dispatch(reset(mode));
    utils.puzzle.getPuzzle.invalidate();
  };
  return (
    <div className="flex gap-1">
      <Show
        when={done}
        fallback={
          <Button onClick={handleNext} type="button" variant="outline">
            Selanjutnya
          </Button>
        }
      >
        <Button type="submit" disabled={!answer.length} variant="outline">
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
