import { CONST } from "~/utils/constant";
import ThemeButton from "~/components/ThemeButton";
import Info from "~/components/Info";
import Setting from "~/components/Setting";
import Graph from "./Graph";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-blue-500 p-2 text-white dark:bg-zinc-900">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex gap-4">
          <Info />
          <ThemeButton />
        </div>
        <div className="flex items-end overflow-hidden text-sm">
          <h1 className="overflow-hidden text-ellipsis text-4xl font-bold ">
            RASLI
          </h1>
          <p className="overflow-hidden text-ellipsis">v{CONST.VERSION}</p>
        </div>
        <div className="flex gap-4">
          <Graph />
          <Setting />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
