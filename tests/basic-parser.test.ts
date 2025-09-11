import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");

test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

// Quoted fields containing commas
test("handles commas inside quoted fields", () => {
  const input = `"last, first",age\n"Nic, Huang",19`;
  const result = parseCSV(input);
  expect(result).toEqual([
    ["last, first", "age"],
    ["Nic, Huang", "19"],
  ]);
});

// Quoted fields containing newlines
test("handles quoted fields with newlines", () => {
  const input = `"name","bio"\n"Josh","Line1\nLine2"`;
  const result = parseCSV(input);
  expect(result).toEqual([
    ["name", "bio"],
    ["Josh", "Line1\nLine2"],
  ]);
});

// Empty fields should be preserved
test("handles empty fields", () => {
  const input = "name,age,city\nVivian,,Providence";
  const result = parseCSV(input);
  expect(result).toEqual([
    ["name", "age", "city"],
    ["Vivian", "", "Providence"],
  ]);
});




