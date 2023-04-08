import { type NextPage } from "next";
import { useState } from "react";
import { api } from "~/utils/api";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import { useToast } from "~/hooks/use-toast";
import {
  finishGame,
  reset,
  setDone,
  setError,
  setResult,
  setResultMode,
  setSeed,
  submitAnswer,
} from "~/store/metaSlice";

const Home: NextPage = () => {
  const utils = api.useContext();
  const mode = useAppSelector((state) => state.meta.mode);
  const answers = useAppSelector((state) => state.meta[mode].answers);
  const done = useAppSelector((state) => state.meta[mode].done);
  const dailyPuzzle = useAppSelector((state) => state.meta[mode].puzzle);
  const error = useAppSelector((state) => state.meta[mode].error);
  const seed = useAppSelector((state) => state.meta.unlimited.seed);
  const result = useAppSelector((state) => state.meta[mode].result);
  const dispatch = useAppDispatch();
  const unlimitedPuzzle = api.puzzle.getPuzzle.useQuery(seed);
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();
  const mutation = api.guess.submit.useMutation({
    onSuccess: (data) => {
      if (data.correct) {
        toast({
          title: "Benar",
          variant: "success",
        });
        dispatch(setError({ error: "", mode }));
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
        dispatch(setError({ error: data.message, mode }));
      } else if (data.code === "INCORRECT") {
        toast({
          title: "Salah",
          variant: "destructive",
        });
        dispatch(setError({ error: data.message, mode }));
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 20) return;
    setAnswer(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answers.includes(answer)) {
      dispatch(setError({ error: "Rasi sudah dicoba", mode }));
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
  const handleNext = () => {
    dispatch(reset(mode));
    utils.puzzle.getPuzzle.invalidate();
  };

  return (
    <>
      <div className="m-2 mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
        <h2 className="text-2xl font-bold">{result}</h2>
        <img src="testing.webp" className="w-[50%] max-w-lg" />
        <div className="mx-auto w-[100%] max-w-[200px]">
          <ul>
            {answers.map((answer, i) => (
              <li
                className="flex h-8 items-end justify-center border-b border-b-slate-400 pb-1 dark:border-b-zinc-600"
                key={i}
              >
                <p>{answer}</p>
              </li>
            ))}
          </ul>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-2"
        >
          {error && (
            <p className="text-sm font-semibold text-red-500">{error}</p>
          )}
          <Input
            disabled={done}
            type="text"
            value={answer}
            onChange={handleChange}
          />
          {mode === "comfy" ? (
            <div className="flex gap-1">
              <Button
                type="submit"
                disabled={done || !answer.length}
                variant="outline"
              >
                Jawab
              </Button>
            </div>
          ) : (
            <div className="flex gap-1">
              {done ? (
                <Button onClick={handleNext} type="button" variant="outline">
                  Selanjutnya
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!answer.length}
                  variant="outline"
                >
                  Jawab
                </Button>
              )}
              <Button disabled={done} onClick={handleNext} type="button" variant="ghost">
                Lewati
              </Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Home;
