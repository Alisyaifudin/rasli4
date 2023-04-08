import { Info } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { AspectRatio } from "~/components/ui/aspect-ratio";

export default function InfoComponent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Info aria-label="info" className="mr-2 h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-zinc-800">
        <DialogHeader>
          <DialogTitle>CARA BERMAIN</DialogTitle>
        </DialogHeader>
        <div className="text-black dark:text-white">
          <div className="flex flex-col gap-1">
            <p>Tebak RASLI dalam 6 kesempatan. 1 hari ada 1 rasi rahasia.</p>
            <p>
              Setiap tebakan adalah nama rasi bintang yang valid menurut IAU.
              Ketikan jawaban pada petak yang disediakan, lalu tekan JAWAB (atau
              tekan Enter).
            </p>
            <p>
              Setelah menjawab, tebakan akan berubah warna, bergantung seberapa
              dekat rasi tebakan dengan rasi rahasia.
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold">Contoh</p>
            <AspectRatio
              ratio={16 / 9}
              className="bg-slate-50 dark:bg-slate-800"
            >
              <Image
                src="/UrsaMinor.webp"
                alt="Photo by Alvaro Pinot"
                sizes="100%"
                fill
                className="rounded-md object-cover"
              />
            </AspectRatio>
            <ul className="flex flex-col gap-3">
              <li>
                <p className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-red-500 shadow-md dark:bg-zinc-900">
                  PUPPIS
                </p>
                <p className="p-1">
                  Warna merah menunjukkan rasi tebakan terlalu jauh
                </p>
              </li>
              <li>
                <p className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-orange-500 shadow-md dark:bg-zinc-900">
                  LEO
                </p>
                <p className="p-1">
                  Warna jingga menunjukkan rasi tebakan agak jauh
                </p>
              </li>
              <li>
                <p className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-green-500 shadow-md dark:bg-zinc-900">
                  DRACO
                </p>
                <p className="p-1">
                  Warna hijau menunjukkan rasi tebakan sudah dekat
                </p>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
