import fs from "fs-extra";
import path from "path";

type GenerateI18nOptions = {
  jsonPath: string;
  // prefix?: string;
  // name: string;
  outPath: string;
};

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [k: string]: JsonValue };

function toCamelCase(input: string): string {
  const s = input
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/-+([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());

  if (!s) return s;
  if (/^[0-9]/.test(s)) return `_${s}`;
  return s;
}

function normalizeEnumKeyFromValue(value: unknown): string {
  const text = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();

  if (!text) return "value";
  const parts = text.split(/\s+/).filter(Boolean);
  const [first, ...rest] = parts;
  const camel =
    first + rest.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return /^[0-9]/.test(camel) ? `_${camel}` : camel;
}

function isPlainObject(v: any): v is JsonObject {
  return v && typeof v === "object" && !Array.isArray(v);
}

function tsPrint(value: any, indent = 0): string {
  const pad = (n: number) => " ".repeat(n);

  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (value === null) return "null";

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value
      .map((v) => `${pad(indent + 4)}${tsPrint(v, indent + 4)}`)
      .join(",\n");
    return `[\n${items},\n${pad(indent)}]`;
  }

  const entries = Object.entries(value);
  if (entries.length === 0) return "{}";

  const lines = entries.map(([k, v]) => {
    const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k)
      ? k
      : JSON.stringify(k);
    return `${pad(indent + 4)}${safeKey}: ${tsPrint(v, indent + 4)},`;
  });

  return `{\n${lines.join("\n")}\n${pad(indent)}}`;
}

/**
 * Gera sempre o caminho completo:
 * - leaf "x": "<base>.<module>.<pathKeys...>"
 * - arrays: considera leaf também
 * - objetos: continua descendo
 */
function buildFullPathTreeFromModule(
  moduleObj: JsonObject,
  moduleKey: string,
  basePrefix?: string,
): any {
  const base = basePrefix ? `${basePrefix}.${moduleKey}` : moduleKey;

  const fullPath = (pathKeys: string[]) =>
    pathKeys.length ? `${base}.${pathKeys.join(".")}` : base;

  const walk = (node: JsonValue, pathKeys: string[]): any => {
    // qualquer valor primitivo/array vira full path (leaf)
    if (
      typeof node === "string" ||
      typeof node === "number" ||
      typeof node === "boolean" ||
      node === null ||
      Array.isArray(node)
    ) {
      return fullPath(pathKeys);
    }

    if (isPlainObject(node)) {
      const out: any = {};

      for (const [rawKey, child] of Object.entries(node)) {
        const nextPath = [...pathKeys, rawKey];

        // enums: se a chave for numérica e estiver abaixo de "enums", nomeia pelo valor
        const isNumericKey = /^\d+$/.test(rawKey);
        const isEnumBranch = pathKeys.length >= 1 && pathKeys[0] === "enums";

        let constKey: string;
        if (isEnumBranch && isNumericKey) {
          constKey = normalizeEnumKeyFromValue(child);
        } else {
          constKey = toCamelCase(rawKey);
        }

        out[constKey] = walk(child, nextPath);
      }

      return out;
    }

    // fallback
    return fullPath(pathKeys);
  };

  return {
    // mantém prefix pra compatibilidade com o jeito atual de consumir
    prefix: base,
    ...walk(moduleObj, []),
  };
}

const handleConstants = async (
  pathAbsolute: string,
  prefix: string,
  output: string,
) => {
  const name = prefix ? `I18N_${prefix.trim().toUpperCase()}` : "I18N_GLOBAL";

  const raw = await fs.readFile(pathAbsolute, "utf-8");
  const json = JSON.parse(raw) as JsonObject;

  const outObj: any = {};

  for (const [moduleKey, moduleValue] of Object.entries(json)) {
    if (!isPlainObject(moduleValue)) continue;

    const moduleConstKey = toCamelCase(moduleKey);
    outObj[moduleConstKey] = buildFullPathTreeFromModule(
      moduleValue,
      moduleKey,
      prefix,
    );
  }

  const content = `export const ${name} = ${tsPrint(outObj, 0)} as const;\n`;

  const outputWithFileName = prefix
    ? `${output}/${prefix}.constants.ts`
    : `${output}/global.constants.ts`;

  const absOut = path.isAbsolute(outputWithFileName)
    ? outputWithFileName
    : path.join(process.cwd(), outputWithFileName);

  await fs.outputFile(absOut, content, "utf-8");
  console.log(`I18N constants generated: ${absOut}`);
};

export async function generateI18n(opts: GenerateI18nOptions) {
  const pathAbsolute = path.isAbsolute(opts.jsonPath)
    ? opts.jsonPath
    : path.join(process.cwd(), opts.jsonPath);

  // const jsonPathSplit = opts.jsonPath.split("/");

  // if (jsonPathSplit[jsonPathSplit.length - 1].includes(".json")) {
  //   const prefix = jsonPathSplit[jsonPathSplit.length - 2];
  //   const output = ;

  //   handleConstants(pathAbsolute, prefix, opts.outPath);
  // } else {
  const dirs = await fs.readdir(pathAbsolute, { withFileTypes: true });

  dirs.forEach(async (dir) => {
    if (dir.name.includes(".json")) {
      const path = `${pathAbsolute}/${dir.name}`;
      await handleConstants(path, "", opts.outPath);
    } else {
      const path = `${pathAbsolute}/${dir.name}/pt-BR.json`;
      console.log(path);
      await handleConstants(path, dir.name, opts.outPath);
    }
  });
  // }
}
