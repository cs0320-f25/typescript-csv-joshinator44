# Sprint 1: TypeScript CSV

### Task C: Proposing Enhancement

- #### Step 1: Brainstorm on your own.
1. If fields are given to me that have quotes, newlines, or even random spaces (functionality)
2. If some fields are empty and the parser throws errors (functionality)
3. Adding support for skipping blank lines and trimming whitespace consistently (extensibility)
4. Ignoring extra rows and keeping a strict file format to ensure consistency

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
4. Error Reporting with Context
As a developer, I want row/column numbers and snippets included in error messages, so that I can debug malformed CSVs without guesswork.

- #### Step 3: use an LLM to help expand your perspective.

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 
    1. Correct handling of quotes, escapes, and multi line fields (LLM & Me Functionality): 

    Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.) 

### Design Choices

### 1340 Supplement

- #### 1. Correctness

- #### 2. Random, On-Demand Generation

- #### 3. Overall experience, Bugs encountered and resolved
#### Errors/Bugs:
#### Tests:
#### How To…

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
#### Total estimated time it took to complete project:
#### Link to GitHub Repo:  
