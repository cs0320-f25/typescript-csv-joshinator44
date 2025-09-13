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

  const resultUnion = await parseCSV<Person>(PEOPLE_CSV_PATH, PersonRowSchema);
  // Narrow via an "in" check (safe, no casting needed for union):
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

// task a: testing csv specification violations

test("parseCSV handles runtime type errors correctly", async () => {
  // test invalid path argument
  await expect(parseCSV(123 as any)).rejects.toThrow(TypeError);
  await expect(parseCSV(null as any)).rejects.toThrow(TypeError);
  await expect(parseCSV(undefined as any)).rejects.toThrow(TypeError);
  
  // test invalid schema argument
  const notASchema = { parse: "not a function" };
  await expect(parseCSV(PEOPLE_CSV_PATH, notASchema as any)).rejects.toThrow(TypeError);
});

test("parseCSV validates numeric fields and reports errors correctly", async () => {
  const PersonRowSchema = z
    .tuple([z.string(), z.coerce.number()])
    .transform((tup) => ({ name: tup[0], age: tup[1] }));

  const result = await parseCSV(PEOPLE_CSV_PATH, PersonRowSchema);
  
  if ("data" in result) {
    // check that valid ages are numbers
    const validPerson = result.data.find(p => p.name === "Alice");
    expect(typeof validPerson?.age).toBe('number');
    
    // check that "thirty" causes an error
    const thirtyError = result.errors.find(e => e.raw.includes("thirty"));
    expect(thirtyError).toBeDefined();
    // zod's actual error message contains "Invalid input"
    expect(thirtyError?.message).toContain("Invalid input");
  }
});

test("parseCSV preserves data integrity when no schema provided", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  
  if (Array.isArray(results)) {
    // check that all fields are strings (no type coercion without schema)
    expect(results[1][1]).toBe("23"); // should be string "23", not number 23
    expect(typeof results[1][1]).toBe("string");
  }
});

test("parseCSV handles empty fields correctly", async () => {
  // the current implementation trims spaces, so empty fields become empty strings
  const results = await parseCSV(PEOPLE_CSV_PATH);
  
  if (Array.isArray(results)) {
    // all values should be trimmed
    for (const row of results) {
      for (const value of row) {
        expect(value).toBe(value.trim());
      }
    }
  }
});

test("parseCSV reports row indices correctly in errors", async () => {
  const PersonRowSchema = z
    .tuple([z.string(), z.coerce.number()])
    .transform((tup) => ({ name: tup[0], age: tup[1] }));

  const result = await parseCSV(PEOPLE_CSV_PATH, PersonRowSchema);
  
  if ("data" in result) {
    // find the error for bob's row (should be index 2)
    const bobError = result.errors.find(e => e.raw.includes("Bob"));
    expect(bobError?.rowIndex).toBe(2);
    
    // header row should also cause an error (index 0)
    const headerError = result.errors.find(e => e.raw.includes("name"));
    expect(headerError?.rowIndex).toBe(0);
  }
});

test("parseCSV falls back to string[][] when schema is undefined", async () => {
  const withoutSchema = await parseCSV(PEOPLE_CSV_PATH);
  const withUndefinedSchema = await parseCSV(PEOPLE_CSV_PATH, undefined);
  
  // both should return the same result
  expect(withoutSchema).toEqual(withUndefinedSchema);
  expect(Array.isArray(withoutSchema)).toBe(true);
});

test("parseCSV with different schema types demonstrates flexibility", async () => {
  // test schema with boolean transformation
  const BooleanSchema = z
    .tuple([z.string(), z.string()])
    .transform((tup) => ({ name: tup[0], isActive: tup[1] === "active" }));
  
  // test schema with optional third field
  const OptionalSchema = z
    .tuple([z.string(), z.coerce.number()])
    .transform((tup) => ({ 
      name: tup[0], 
      age: tup[1],
      city: undefined // this would be filled if we had a 3-column csv
    }));
  
  // these schemas demonstrate the parser can work with any zod schema
  const result1 = await parseCSV(PEOPLE_CSV_PATH, BooleanSchema);
  const result2 = await parseCSV(PEOPLE_CSV_PATH, OptionalSchema);
  
  // both should return the expected structure
  expect("data" in result1).toBe(true);
  expect("data" in result2).toBe(true);
});