import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import { setMode } from "~/store/metaSlice";

function ModeTab() {
  const mode = useAppSelector((state) => state.meta.mode);
  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    if (["comfy", "unlimited"].includes(value)) {
      const val = value as "comfy" | "unlimited";
      dispatch(setMode(val));
    }
  };
  return (
    <Tabs
      onValueChange={handleChange}
      value={mode}
      className="w-full sm:w-[400px]"
    >
      <TabsList>
        <TabsTrigger value="comfy">Comfy</TabsTrigger>
        <TabsTrigger value="unlimited">Unlimited</TabsTrigger>
      </TabsList>
      <TabsContent value="comfy">
        <p className="text-sm text-slate-500 dark:text-slate-200">
          RASLI yang tersedia berbeda-beda tiap harinya. Kamu bisa bermain
          dengan `comfy` satu rasi per hari.
        </p>
      </TabsContent>
      <TabsContent value="unlimited">
        <p className="text-sm text-slate-500 dark:text-slate-200">
          Mode bermain terus menerus. Kamu bisa bermain dengan `unlimited` tanpa
          menunggu hari berikutnya.
        </p>
      </TabsContent>
    </Tabs>
  );
}

export default ModeTab;
