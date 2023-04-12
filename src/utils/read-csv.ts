import csv from "csvtojson";
import { type ZodObject, type ZodString, z, type ZodOptional } from "zod";

export default async function readCsv<
  T extends Record<string, ZodString | ZodOptional<ZodString>>
>(path: string, delimiter: string, schema: ZodObject<T>) {
  const jsonArray: unknown = await csv({ delimiter }).fromFile(path);
  const result = z.array(schema).safeParse(jsonArray);
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error.message);
}
