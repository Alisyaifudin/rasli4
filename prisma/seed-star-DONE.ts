import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import readCsv from "./utils/read-csv";
import bvToRGB from "./utils/bv-to-rgb";

const colorSchema = z.object({
  bv: z.string(),
  T: z.string(),
  hex: z.string(),
  des: z.string(),
  r: z.string(),
  g: z.string(),
  b: z.string(),
});

const starSchema = z.object({
  ra: z.string(),
  dec: z.string(),
  Name: z.string().optional(),
  HD: z.string(),
  Vmag: z.string(),
  bv: z.string().optional(),
});

(async () => {
  const prisma = new PrismaClient();

  const stars = await readCsv(
    "/home/alisyaifudin/Program/JS/rasli4/prisma/asu.tsv",
    ",",
    starSchema
  );
  const samples = stars.map((s) => ({
    ra: parseFloat(s.ra),
    dec: parseFloat(s.dec),
    name: s.Name?.replace(/\s+/g, " ") ?? null,
    HD: parseInt(s.HD),
    Vmag: parseFloat(s.Vmag),
    bv: s.bv ? parseFloat(s.bv) : null,
  }));

  const colors_raw = await readCsv(
    "/home/alisyaifudin/Program/JS/rasli4/prisma/col.tsv",
    "\t",
    colorSchema
  );
  const colors = colors_raw.map((c) => ({
    bv: parseFloat(c.bv),
    T: parseFloat(c.T),
    hex: c.hex,
    des: parseInt(c.des),
    r: parseInt(c.r),
    g: parseInt(c.g),
    b: parseInt(c.b),
  }));
  const rgb = bvToRGB(
    samples.map((s) => s.bv),
    colors
  );
  const combine = samples.map((s, i) => ({ ...s, hex: rgb[i] ?? null }));
  // console.log(combine);
  const res = await prisma.star.createMany({
    data: combine,
  });
  // console.log(res);
})();
