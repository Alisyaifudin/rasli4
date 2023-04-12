import React, { useEffect } from "react";
import Show from "~/components/control-flow/Show";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import { type Mode, finishGame, submitAnswer } from "~/store/metaSlice";
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
  const puzzle = useAppSelector((state) => state.meta[mode].puzzle);
  const num = useAppSelector((state) => state.meta[mode].num);
  const seed = useAppSelector((state) => state.meta.seed);
  // local state
  const [error, setError] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [won, setWon] = React.useState(false);
  //   toast
  const { toast } = useToast();
  //   trpc hooks
  // const unlimitedPuzzle = api.puzzle.getPuzzle.useQuery(seed);
  const mutation = api.guess.submit.useMutation({
    onSuccess: (data) => {
      if (data.correct) {
        toast({ title: "Benar", variant: "success" });
        setError("Keren 🥳");
        setWon(true);
        dispatch(finishGame({ mode, result: data.message }));
        dispatch(
          submitAnswer({ answer: { name: answer, closeness: -1 }, mode })
        );
        setAnswer("");
        return;
      }
      if (data.code === "NOT_FOUND") {
        toast({ title: "Rasi tidak ada", variant: "destructive" });
        setWon(false);
        setError("Rasi tidak ada");
      } else if (data.code === "INCORRECT") {
        toast({ title: "Salah", variant: "destructive" });
        setAnswer("");
        dispatch(
          submitAnswer({
            answer: { name: answer, closeness: data.closeness },
            mode,
          })
        );
        if (num < 5) {
          setError("Rasi tidak cocok");
        } else {
          setError("Gagal 😭");
          dispatch(finishGame({ mode, result: data.message }));
        }
        setWon(false);
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
  // useEffect
  useEffect(() => {
    setError("");
    setAnswer("");
  }, [mode, puzzle]);
  // handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 20) return;
    setAnswer(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mutation.isLoading) return;
    if (answers.map((a) => a.name).includes(answer)) {
      setWon(false);
      setError("Rasi sudah dicoba");
      return;
    }
    if (puzzle && mode === "comfy") {
      mutation.mutate({ puzzle: puzzle, guess: answer });
    }
    if (puzzle && mode === "unlimited") {
      mutation.mutate({
        puzzle: puzzle,
        guess: answer,
        seed,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
      <Show when={!!error.length}>
        <p
          className={`text-sm font-semibold ${
            won ? "text-green-500" : "text-red-500"
          }`}
        >
          {error}
        </p>
      </Show>
      <Input
        disabled={done}
        type="text"
        value={answer}
        onChange={handleChange}
        autoFocus
      />
      <SubmitButton
        isSubmitting={mutation.isLoading}
        mounted={mounted}
        answer={answer}
      />
    </form>
  );
}

export default Answer;
