import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
// crate empty array string with length 6
const answers_raw = Array.from({ length: 6 }, () => "");
const answerSchema = z.array(z.string().min(1).max(20)).length(6);
const modeSchema = z.enum(["comfy", "unlimited"]);

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [answers, setAnswers] = useState(answers_raw);
  const [mode, setMode] = useState<"comfy" | "unlimited">("comfy");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mode_raw = localStorage.getItem("mode");
    const parsedMode = modeSchema.safeParse(mode_raw);
    // if mode is not valid, set it to comfy
    if (!parsedMode.success) {
      localStorage.setItem("mode", "comfy");
    } else {
      setMode(parsedMode.data);
    }
    const answers_raw = localStorage.getItem("answers");
    const parsedAnswers = answerSchema.safeParse(answers_raw);
    if (!parsedAnswers.success) return;
    setAnswers(parsedAnswers.data);
  }, []);

  return (
    <>
      <div className="m-2 mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
        <h2 className="text-2xl font-bold">{hello.data?.greeting}</h2>
        <img src="testing.webp" className="w-[50%] max-w-lg" />
        <div className="mx-auto w-[100%] max-w-[200px]">
          <ul>
            {answers.map((answer, i) => (
              <li
                className="h-8 border-b  border-b-slate-400 text-center leading-3 dark:border-b-zinc-600"
                key={i}
              >
                <p>{answer}</p>
              </li>
            ))}
          </ul>
          {/* {answers.map((answer, i) => (
            <div key={i}>
              <p>&nbsp;</p>
              <hr className=" border-black/30 dark:border-white/30" />
            </div>
          ))} */}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("UWU");
          }}
          className="flex flex-col items-center gap-2"
        >
          <Input />
          <div className="flex gap-1">
            <Button variant="outline">Jawab</Button>
            <Button variant="ghost">Lewati</Button>
            {/* <Button>skip</Button> */}
          </div>
          {/* <TextField onChange={handleChange} label={t("TYPE_HERE")}>
            {input}
          </TextField>
          <div className="flex gap-2">
            <ButtonOutlined type="submit">{t("SUBMIT")}</ButtonOutlined>
            {mode === "unlimited" &&
              (done ? (
                <ButtonOutlined type="button">{t("NEXT")}</ButtonOutlined>
              ) : (
                <ButtonOutlined type="button">{t("SKIP")}</ButtonOutlined>
              ))}
          </div> */}
        </form>
      </div>
    </>
  );
};

export default Home;
