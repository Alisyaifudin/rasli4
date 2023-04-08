import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { CONST } from "~/utils/constant";
import ModeTab from "./ModeTab";

interface SettingProps {
  mode: "comfy" | "unlimited";
  onModeChange: (mode: "comfy" | "unlimited") => void;
}

export default function SettingComponent({ mode, onModeChange }: SettingProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Settings aria-label="settings" className="mr-2 h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-zinc-800">
        <DialogHeader>
          <DialogTitle>Pengaturan</DialogTitle>
        </DialogHeader>
        <div className="text-black dark:text-white">
          <div className="flex flex-col gap-2">
            <ModeTab mode={mode} onChange={onModeChange} />
            <p>
              RASLI adalah game menebak rasi bintang, terinspirasi dari game
              wordle.
            </p>
            <p>Ini adalah RASLI versi {CONST.VERSION}</p>
          </div>
          <div className="flex justify-around p-4 text-lg">
            <p>Masukan?</p>
            <a
              className="underline"
              href="mailto:muhammad.ali.syaifudin@hotmail.com"
            >
              Email
            </a>
          </div>
          <div className="flex justify-between text-[0.7rem] text-black/70 dark:text-white/70">
            <p>© 2022 Muhammad Ali Syaifudin</p>
            <a className="underline" href="https://bit.ly/HadiahTerimaKasih">
              Terimakasih!
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
