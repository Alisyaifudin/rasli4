import fs from "fs";
import { ZodSchema } from "zod";

export default function readJson<T>(
  path: fs.PathOrFileDescriptor,
  schema: ZodSchema<T>
) {
  const obj: unknown = JSON.parse(fs.readFileSync(path, "utf8"));
  const result = schema.safeParse(obj);
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error.message);
}
