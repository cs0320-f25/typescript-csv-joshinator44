import * as path from "path";
import { z } from "zod";
import { parseCSV } from "../src/basic-parser";


const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");

test("parseCSV (no schema) returns string[][]", async () => {
  const resultsUnion = await parseCSV(PEOPLE_CSV_PATH);
  const results = resultsUnion as string[][]; // cast for indexing in this test

  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]);
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV (no schema) yields only arrays", async () => {
  const resultsUnion = await parseCSV(PEOPLE_CSV_PATH);
  const results = resultsUnion as string[][];
  for (const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

test("parseCSV with schema: validates & transforms; collects errors", async () => {
  const PersonRowSchema = z
    .tuple([z.string(), z.coerce.number()])
    .transform((tup) => ({ name: tup[0], age: tup[1] }));
  type Person = z.infer<typeof PersonRowSchema>;

  const resultUnion = await parseCSV<Person>(PEOPLE_CSV_PATH, PersonRowSchema as any);
  
  if ("data" in resultUnion) {
    const { data, errors } = resultUnion;

    // Has transformed objects for known good rows
    expect(data).toEqual(
      expect.arrayContaining([
        { name: "Alice", age: 23 },
        { name: "Charlie", age: 25 },
        { name: "Nim", age: 22 },
      ])
    );

    // Has at least one error (header and/or Bob)
    expect(errors.length).toBeGreaterThanOrEqual(1);

    // One error should mention "thirty"
    expect(errors.some((e) => e.raw.includes("thirty"))).toBe(true);
  } else {
    throw new Error("Expected schema mode to return { data, errors }.");
  }
});



test("parseCSV handles runtime type errors correctly", async () => {
  
  await expect(parseCSV(123 as any)).rejects.toThrow(TypeError);
  await expect(parseCSV(null as any)).rejects.toThrow(TypeError);

  
    
  const notASchema = { parse: "not a function" };
  await expect(parseCSV(PEOPLE_CSV_PATH, notASchema as any)).rejects.toThrow(TypeError);
});

test("parseCSV preserves data types without schema", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  
  if (Array.isArray(results)) {
    expect(results[1][1]).toBe("23");
    expect(typeof results[1][1]).toBe("string");
  }
});

test("parseCSV trims whitespace from values", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  
  if (Array.isArray(results)) {
    for (const row of results) {
      for (const value of row) {
        expect(value).toBe(value.trim());
      }
    }
  }
});

test("parseCSV reports error row indices correctly", async () => {
  const schema = z
    .tuple([z.string(), z.coerce.number()])
    .transform((tup) => ({ name: tup[0], age: tup[1] }));

  const result = await parseCSV(PEOPLE_CSV_PATH, schema as any);
  
  if ("data" in result) {
    for (const error of result.errors) {
      expect(typeof error.rowIndex).toBe('number');
      expect(error.rowIndex).toBeGreaterThanOrEqual(0);
    }
  }
});

test("parseCSV schema parameter is optional", async () => {
  const withoutSchema = await parseCSV(PEOPLE_CSV_PATH);
  const withUndefinedSchema = await parseCSV(PEOPLE_CSV_PATH, undefined);
  

  expect(withoutSchema).toEqual(withUndefinedSchema);
  expect(Array.isArray(withoutSchema)).toBe(true);
});










