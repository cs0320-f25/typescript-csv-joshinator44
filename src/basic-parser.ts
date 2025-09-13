import * as fs from "fs";
import * as readline from "readline";
import type { ZodType } from "zod";

/**
 * This is a JSDoc comment. Similar to JavaDoc, it documents a public-facing
 * function for others to use. Most modern editors will show the comment when 
 * mousing over this function name. Try it in run-parser.ts!
 * 
 * File I/O in TypeScript is "asynchronous", meaning that we can't just
 * read the file and return its contents. You'll learn more about this 
 * in class. For now, just leave the "async" and "await" where they are. 
 * You shouldn't need to alter them.
 * 
 * @param path The path to the file being loaded.
 * @param schema Optional Zod schema to validate and transform each row.
 * @returns a "promise" to produce a 2-d array of cell values, or an object with validated data and errors
 */
export async function parseCSV<T>(path: string, schema?: ZodType<T>): 
Promise<string[][] | { data: T[]; errors: { rowIndex: number; raw: string[]; message: string }[] }
> {
  // runtime guard for the path argument
  if (typeof path !== "string") {
    throw new TypeError("parseCSV: 'path' must be a string file path");
  }

  // This initial block of code reads from a file in Node.js. The "rl"
  // value can be iterated over in a "for" loop. 
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });
  
  // Create an empty array to hold the results
  let result: string[][] = []
  
  // We add the "await" here because file I/O is asynchronous. 
  // We need to force TypeScript to _wait_ for a row before moving on. 
  // More on this in class soon!
  for await (const line of rl) {
    const values = line.split(",").map((v) => v.trim());
    result.push(values)
  }

  // if the caller passes undefined in place of a schema, fall back to previous behavior
  if (!schema) {
    return result;
  }

  // runtime sanity check for the provided schema
  if (typeof (schema as any)?.safeParse !== "function") {
    throw new TypeError("parseCSV: 'schema' must be a Zod schema (with .safeParse)");
  }

  // validate and transform each CSV row via the given schema
  const data: T[] = [];
  const errors: { rowIndex: number; raw: string[]; message: string }[] = [];

  for (let i = 0; i < result.length; i++) {
    const rawRow = result[i];
    const parsed = schema.safeParse(rawRow);
    
    if (parsed.success) {
      data.push(parsed.data);
    } else {
      errors.push({
        rowIndex: i,
        raw: rawRow,
        message: parsed.error.message,
      });
    }
  }

  // return both successful and failed rows
  return { data, errors };
}