import { BarChart2 } from "lucide-react";
import { CONST } from "~/utils/constant";
import ThemeButton from "~/components/ThemeButton";
import Info from "~/components/Info";
import Setting from "~/components/Setting";

function Navbar() {
  return (
    <nav className="sticky z-50 top-0 bg-blue-500 p-2 text-white dark:bg-zinc-900">
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
          <Setting/>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
