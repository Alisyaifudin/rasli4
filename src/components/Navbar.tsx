import { BarChart2 } from "lucide-react";
import { CONST } from "~/utils/constant";
import ThemeButton from "~/components/ThemeButton";
import Info from "~/components/Info";
import Setting from "~/components/Setting";
import { z } from "zod";
import { useEffect, useState } from "react";

const modeSchema = z.enum(["comfy", "unlimited"]);

function Navbar() {
  // check if window is available
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
  }, []);
  const handleModeChange = (mode: "comfy" | "unlimited") => {
    localStorage.setItem("mode", mode);
    setMode(mode);
  };

  return (
    <nav className="sticky top-0 bg-blue-500 p-2 text-white dark:bg-zinc-900">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex gap-4">
          <Info />
          <ThemeButton />
        </div>
        <div className="flex items-end overflow-hidden text-sm">
          <h1 className="overflow-hidden text-ellipsis text-4xl font-extrabold ">
            RASLI
          </h1>
          <p className="overflow-hidden text-ellipsis">{CONST.VERSION}</p>
        </div>
        <div className="flex gap-4">
          <button>
            <BarChart2 aria-label="infographic" className="mr-2 h-6 w-6" />
          </button>
          <Setting mode={mode} onModeChange={handleModeChange} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
