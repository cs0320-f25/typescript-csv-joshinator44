import { parseCSV } from "./basic-parser";
import { z } from "zod";

/*
  Example of how to run the parser outside of a test suite.
*/

const DATA_FILE = "./data/people.csv"; // update with your actual file name

// define schemas for task c
const PersonRowSchema = z
  .tuple([z.string(), z.coerce.number()])
  .transform((tup) => ({ name: tup[0], age: tup[1] }));
type Person = z.infer<typeof PersonRowSchema>;

async function main() {
  // Because the parseCSV function needs to "await" data, we need to do the same here.
  const results = await parseCSV(DATA_FILE);
  
  console.log("without schema");
  // Notice the difference between "of" and "in". One iterates over the entries,
  // another iterates over the indexes only.
  if (Array.isArray(results)) {
    for (const record of results) {
      console.log(record);
    }
    
    console.log("\nindex values using in");
    for (const record in results) {
      console.log(record);
    }
  }
  
 
  console.log("\n with schema");
  const validatedResults = await parseCSV<Person>(DATA_FILE, PersonRowSchema as any);
  
  if ("data" in validatedResults) {
    console.log("Valid rows:");
    for (const person of validatedResults.data) {
      console.log(person);
    }
    
    if (validatedResults.errors.length > 0) {
      console.log("\nInvalid rows:");
      for (const error of validatedResults.errors) {
        console.log(`Row ${error.rowIndex}: ${error.raw.join(", ")} - ${error.message}`);
      }
    }
  }
}

main();