# Sprint 1: TypeScript CSV

### Task C: Proposing Enhancement

- #### Step 1: Brainstorm on your own.
1. If fields are given to me that have quotes, newlines, or even random spaces (functionality)
2. If some fields are empty or if the user wants to keep empty data (functionality)
3. Adding support for skipping blank lines and trimming whitespace consistently (extensibility)
4. Ignoring extra rows and keeping a strict file format to ensure consistency (extensibility)

- #### Step 2: Use an LLM to help expand your perspective.
Functionality (GPT)
1. Streaming + Async Iteration
As a developer working with very large CSV files, I want to process rows as they stream in, so that I don’t need to load the entire file into memory.
2. Correct Handling of Quotes, Escapes, and Multi-line Fields
As a user parsing messy real-world CSVs, I want quoted values and embedded commas/newlines to be handled correctly, so that data isn’t corrupted or split incorrectly.
3. Robust Line Ending & Encoding Support
As a developer reading CSVs from different systems, I want support for \n, \r\n, stray \r, and BOM/UTF-16 issues, so that my parser works cross-platform without surprises.
4. Configurable Type Conversion (numbers, booleans, dates)
As a developer, I want to automatically convert fields into the correct types, so that I don’t have to manually cast every string when using the data.

Extensibility (GPT)
1. Schema Validation 
As a developer, I want to validate rows against a schema (e.g., Zod), so that I can catch malformed rows early and give clear error messages with row/col context.
2. Multiple Input Sources
As a developer, I want to pass in strings, Buffers, Blobs, URLs, or streams (not just filenames), so that I can use the parser in both Node and browser apps.
3. Header Normalization & Mapping
As a developer, I want to normalize or rename headers (trim, lowercase, aliasing), so that I can work with consistent object keys across different CSV sources.
4. Error Reporting
As a developer, I want row/column numbers and snippets included in error messages, so that I can debug malformed CSVs without guesswork.

- #### Step 3: use an LLM to help expand your perspective.

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 

    1. Schema Validation with Zod (LLM and Me) FUNCTIONALITY
    User Story:
    As a developer using the CSV parser, I can pass in a Zod schema and each row will be automatically validated and transformed into structured objects that I can access. This ensures that whatever API or app I have only processes valid data. 

    2. Stream + Async Iteration (LLM) FUNCTIONALITY
    User Story:
    As a developer taking in possibly large CSV files, I can iterate over parsed rows as they stream in so that I can process data in constant memory and start work before the entire file finishes reading.

    3. Error Reporting with Context EXTENSIBILITY
    User Story:
    As a developer using the CSV parser, I can receive structured error messages that include row/column locations so that I can quickly pinpoint and fix malformed or broken data. 

    4. Multiple Input Source EXTENSIBILITY
    User Story: 
    As a developer using the CSV parser, I can provide input data from different sources, like streams, so that I can reuse the parser in a wide variety of applications. 


    Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.) 
    My overall thought process:
    At the start, the thing that I was thinking most about how I wanted the parser to handle data that is not "perfect" or ideal. So I thought about how the parser should handle quotes, empty fields, or even different types of objects. The llm 
    had similar suggestions but was much more specific about the type of problems or issues that the parser should be able to handle. Something that I really agreed with when it came to the LLM was error reporting with context. This would be great
    from the developer side as they can see how they can make changes to their data to get the csv parser to work. There were a lot of suggestions the LLM gave as I prompted it more specifically using the technique we learned in class with the agent mode 
    where I got things like Async iteration or dealing with streams which is something I totally didn't think about but was important to think about. 

### Design Choices
I used as any when passing schemas to parseCSV. The TypeScript type inference was too strict when passing in zod schemas so I used as any. I used a union return type to allow for backward compatibility while supporting the new schema validation. Lastly I added a lot fo runtime type guards to ensure that the path coming in is a string and the safeParse can catch early errors during runtime. 

### 1340 Supplement 


- #### 1. Correctness
A CSV parse is correct when it reads and parses data according to the format while also being able to handle edge cases. So it should be able to split rows by line endings, split columns by commas, and trim the white space. Also, using schema validation it shold be able to identify which rows pass validation and have clear error information. 
- #### 2. Random, On-Demand Generation
If there was a function that randomely generated CSV data it would be really helpful for testing. I could use the function to make more edge cases and catch more errors with our parser. Right now I only have 8 tests total which definetly doesn't account for ALL possible bugs. Additionally we could use this function to stress test our schema and ensure that our error messaging is corret. 
- #### 3. Overall experience, Bugs encountered and resolved
#### Errors/Bugs:
Had a lot of issues with my libaries importing for some reason and I fixed it by clearing my cache and repulling my code form a previous commit. I also had issues with the .transform as zod was expecting my output types to match. I just utilized the as any to solve this. I ran into so many red squiggly lines that had to do with type inferences, and I really had to think about what types I'm taking in and transforming them with (especially with zod). 
#### Tests:
Basic  parsing tests: Verify that the parser correctly reads CSV files and returns string arrays when no schema is provided
Schema validation tests: Ensure that when a Zod schema is provided all valid rows are transformed into objects and invalid rows are collected with error information
Runtime type guard tests: Wanted to make sure that the parser throws appropriate TypeErrors for invalid inputs like non-string paths or invalid schemas
Edge case tests: Data type preservation without schemas and correct error reporting with row indices
#### How To…
To Test:
Run npm test to execute all tests
Run npm test basic-parser.test.ts to run only parser tests

And to run:
npm install

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
#### Total estimated time it took to complete project:7
#### Link to GitHub Repo:  https://github.com/cs0320-f25/typescript-csv-joshinator44
