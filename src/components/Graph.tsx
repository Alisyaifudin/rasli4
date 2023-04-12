import { BarChart2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import For from "./control-flow/For";
import { openGraph } from "~/store/metaSlice";

export default function GraphComponent() {
  const mode = useAppSelector((state) => state.meta.mode);
  const history = useAppSelector((state) => state.meta[mode].history);
  const open = useAppSelector((state) => state.meta.openGraph);
  const dispatch = useAppDispatch();
  const played = history.stats.reduce((acc, cur) => acc + cur, 0);
  const max = Math.max(...history.stats) || 1;
  const won = played - history.stats[6];

  const handleOpen = (open: boolean) => {
    dispatch(openGraph(open));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <button>
          <BarChart2 aria-label="infographic" className="mr-2 h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-zinc-800">
        <DialogHeader>
          <DialogTitle>Statistik: {mode.toUpperCase()}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1 text-black dark:text-white">
          <div className="grid grid-cols-4 items-center gap-1">
            <p className="text-center text-2xl">{played}</p>
            <p className="text-center text-2xl">{won}</p>
            <p className="text-center text-2xl">{history.currentStreak}</p>
            <p className="text-center text-2xl">{history.maxStreak}</p>
            <p className="text-center">Dimainkan</p>
            <p className="text-center">% Menang</p>
            <p className="text-center">Streak Saat Ini</p>
            <p className="text-center">Streak Maksimum</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold">DISTRIBUSI TEBAKAN</p>
            <div className="flex gap-0 p-4">
              <div className="flex flex-1 flex-col items-end justify-center gap-1 pr-1">
                <For each={history.stats}>
                  {(_, i) => <span key={i}>{i !== 6 ? i + 1 : "L"}</span>}
                </For>
              </div>
              <div className="flex flex-[9] flex-col gap-1">
                <For each={Object.values(history.stats)}>
                  {(value, i) => (
                    <div
                      key={i}
                      style={{ width: `${5 + (value / max) * 95}%` }}
                    >
                      <div className="h-full animate-expand-witdh bg-indigo-500 px-1 text-right">
                        <span className="animate-fade-in">{value}</span>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
