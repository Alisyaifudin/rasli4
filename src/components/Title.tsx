import Show from "~/components/control-flow/Show";
import Skeleton from "~/components/aux/Skeleton";
import { useAppSelector } from "~/hooks/redux";
import { type Mode } from "~/store/metaSlice";

interface TitleProps {
  mounted: boolean;
  mode: Mode;
}

function Title({ mounted, mode }: TitleProps) {
  const result = useAppSelector((state) => state.meta[mode].result);
  return (
    <h2 className="text-2xl font-bold">
      <Show
        when={mounted}
        fallback={
          <Skeleton>
            <div className="h-8 w-32 rounded-lg bg-slate-300 dark:bg-zinc-800" />
          </Skeleton>
        }
      >
        {result}
      </Show>
    </h2>
  );
}

export default Title;
