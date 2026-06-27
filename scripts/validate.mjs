// Validates every example in examples/ against its AVERT JSON Schema in schemas/.
// Mapping is by filename prefix: <schema-name>.*.json -> <schema-name>.schema.json
// Exit 0 when all examples validate; exit 1 (with ajv errors) on the first failure set.
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const schemasDir = join(root, "schemas");
const examplesDir = join(root, "examples");

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

// Compile every schema, keyed by base name (minus ".schema.json").
const validators = new Map();
for (const file of readdirSync(schemasDir).sort()) {
  if (!file.endsWith(".schema.json")) continue;
  const name = file.replace(/\.schema\.json$/, "");
  const schema = JSON.parse(readFileSync(join(schemasDir, file), "utf8"));
  validators.set(name, ajv.compile(schema));
}

// Resolve an example file to its schema by longest matching name prefix.
function schemaNameFor(exampleFile) {
  const base = exampleFile.replace(/\.json$/, "");
  let best = null;
  for (const name of validators.keys()) {
    if (base === name || base.startsWith(`${name}.`)) {
      if (best === null || name.length > best.length) best = name;
    }
  }
  return best;
}

let failed = false;
const exampleFiles = readdirSync(examplesDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

if (exampleFiles.length === 0) {
  console.error("No examples found in examples/ — nothing to validate.");
  process.exit(1);
}

for (const file of exampleFiles) {
  const name = schemaNameFor(file);
  if (name === null) {
    console.error(`❌ ${file} — no matching schema in schemas/`);
    failed = true;
    continue;
  }
  const validate = validators.get(name);
  const data = JSON.parse(readFileSync(join(examplesDir, file), "utf8"));
  if (validate(data)) {
    console.log(`✅ ${file} -> ${name}.schema.json`);
  } else {
    console.error(`❌ ${file} -> ${name}.schema.json`);
    console.error(JSON.stringify(validate.errors, null, 2));
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
