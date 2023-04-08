import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ModeProps {
  mode: "comfy" | "unlimited";
  onChange: (mode: "comfy" | "unlimited") => void;
}

function ModeTab({ mode, onChange }: ModeProps) {
  const handleChange = (value: string) => {
    if (["comfy", "unlimited"].includes(value)) {
      onChange(value as "comfy" | "unlimited");
    }
  };
  return (
    <Tabs onValueChange={handleChange} value={mode} className="w-[400px]">
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
