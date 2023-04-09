import Image from "next/image";
import Show from "~/components/control-flow/Show";
import Skeleton from "~/components/aux/Skeleton";
import { type Mode } from "~/store/metaSlice";

interface PuzzleProps {
  mounted: boolean;
  mode: Mode;
}

function Puzzle({ mounted }: PuzzleProps) {
  return (
    <div className="relative flex aspect-square w-full xs:w-[50%] ">
      <Show
        when={mounted}
        fallback={
          <Skeleton>
            <div className="h-full w-full rounded-full bg-slate-300 dark:bg-zinc-800" />
          </Skeleton>
        }
      >
        <Image
          src="/testing.webp"
          alt="Rasi"
          sizes="100%"
          fill
          className="rounded-full"
        />
      </Show>
    </div>
  );
}

export default Puzzle;
