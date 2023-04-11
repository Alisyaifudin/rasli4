import React from "react";
import { type Mode } from "~/store/metaSlice";
import Show from "~/components/control-flow/Show";
import Skeleton from "~/components/aux/Skeleton";
import For from "~/components/control-flow/For";
import { useAppSelector } from "~/hooks/redux";

interface GuessProps {
  mounted: boolean;
  mode: Mode;
}

function Guess({ mounted, mode }: GuessProps) {
  const answers = useAppSelector((state) => state.meta[mode].answers);
  return (
    <div className="mx-auto w-[100%] max-w-[200px]">
      <ul>
        <For each={answers} fallback={<div>Something went wrong...</div>}>
          {(answer, i) => (
            <li
              key={i}
              className="flex h-8 items-end justify-center border-b border-b-slate-400 pb-1 dark:border-b-zinc-600"
            >
              <Show
                when={mounted}
                fallback={
                  <Skeleton>
                    <div className="h-4 w-3/4 rounded-sm bg-slate-300 dark:bg-zinc-800" />
                  </Skeleton>
                }
              >
                <p
                  className={
                    answer.closeness === -1
                      ? "text-green-500"
                      : answer.closeness < 3
                      ? "text-cyan-500"
                      : answer.closeness < 5
                      ? "text-orange-500"
                      : "text-red-500"
                  }
                >
                  {answer.name}
                </p>
              </Show>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}

export default Guess;
