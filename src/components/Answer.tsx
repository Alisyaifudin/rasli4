import React, { useEffect } from "react";
import Show from "~/components/control-flow/Show";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import {
  type Mode,
  finishGame,
  setResultMode,
  submitAnswer,
} from "~/store/metaSlice";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { useToast } from "~/hooks/use-toast";
import SubmitButton from "~/components/SubmitButton";

interface AnswerProps {
  mounted: boolean;
  mode: Mode;
}
function Answer({ mounted, mode }: AnswerProps) {
  // dispatcher
  const dispatch = useAppDispatch();
  // selector
  const done = useAppSelector((state) => state.meta[mode].done);
  const answers = useAppSelector((state) => state.meta[mode].answers);
  const dailyPuzzle = useAppSelector((state) => state.meta[mode].puzzle);
  const seed = useAppSelector((state) => state.meta.unlimited.seed);
  // local state
  const [error, setError] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  // useEffect
  useEffect(() => {
    setError("");
    setAnswer("");
  }, [mode]);
  //   toast
  const { toast } = useToast();
  //   trpc hooks
  const unlimitedPuzzle = api.puzzle.getPuzzle.useQuery(seed);
  const mutation = api.guess.submit.useMutation({
    onSuccess: (data) => {
      if (data.correct) {
        toast({
          title: "Benar",
          variant: "success",
        });
        setError("");
        dispatch(finishGame(mode));
        dispatch(submitAnswer({ answer, mode }));
        dispatch(setResultMode({ result: data.message, mode }));
        setAnswer("");
        return;
      }
      if (data.code === "NOT_FOUND") {
        toast({
          title: "Rasi tidak ada",
          variant: "destructive",
        });
        setError(data.message);
      } else if (data.code === "INCORRECT") {
        toast({
          title: "Salah",
          variant: "destructive",
        });
        setError(data.message);
        setAnswer("");
        dispatch(submitAnswer({ answer, mode }));
      }
    },
    onError: (err) => {
      console.log(err);
      toast({
        title: "Server bermasalah",
        variant: "destructive",
      });
    },
  });
  // handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 20) return;
    setAnswer(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answers.includes(answer)) {
      setError("Rasi sudah dicoba");
      return;
    }
    if (dailyPuzzle && mode === "comfy") {
      mutation.mutate({ puzzle: dailyPuzzle, guess: answer });
    }
    if (unlimitedPuzzle.data?.name && mode === "unlimited") {
      mutation.mutate({
        puzzle: unlimitedPuzzle.data.name,
        guess: answer,
        seed,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
      <Show when={!!error.length}>
        <p className="text-sm font-semibold text-red-500">{error}</p>
      </Show>
      <Input
        disabled={done}
        type="text"
        value={answer}
        onChange={handleChange}
      />
      <SubmitButton mounted={mounted} answer={answer} />
    </form>
  );
}

export default Answer;
