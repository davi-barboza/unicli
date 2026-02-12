import fs from "fs-extra";
import path from "path";

type GenerateI18nOptions = {
  jsonPath: string;
  prefix?: string; // agora opcional
  name: string;
  outPath: string;
};

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [k: string]: JsonValue };

function toCamelCase(input: string): string {
  // suporta kebab-case, snake_case e espaços
  const s = input
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/-+([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());

  // garante que começa com letra/_
  if (!s) return s;
  if (/^[0-9]/.test(s)) return `_${s}`;
  return s;
}

function normalizeEnumKeyFromValue(value: unknown): string {
  // "DIARIO" -> "diario", "SÍ" -> "si", "Guardar Cambios" -> "guardarCambios"
  const text = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();

  if (!text) return "value";
  // camelCase a partir de palavras
  const parts = text.split(/\s+/).filter(Boolean);
  const [first, ...rest] = parts;
  const camel =
    first + rest.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return /^[0-9]/.test(camel) ? `_${camel}` : camel;
}

function isPlainObject(v: any): v is JsonObject {
  return v && typeof v === "object" && !Array.isArray(v);
}

function shouldIgnorePath(pathKeys: string[], moduleKey: string): boolean {
  // ignora exatamente grid.title, exceto em commons
  const n = pathKeys.length;
  const isGridTitle =
    n >= 2 && pathKeys[n - 2] === "grid" && pathKeys[n - 1] === "title";
  return moduleKey !== "commons" && isGridTitle;
}

function isCommonsGrid(pathKeys: string[], moduleKey: string): boolean {
  return (
    moduleKey === "commons" && pathKeys.length === 1 && pathKeys[0] === "grid"
  );
}

function isUnderCommonsGrid(pathKeys: string[], moduleKey: string): boolean {
  return (
    moduleKey === "commons" && pathKeys.length > 1 && pathKeys[0] === "grid"
  );
}

function isInsideCommonsGrid(moduleKey: string, pathKeys: string[]): boolean {
  // qualquer coisa abaixo de commons.grid (inclusive title/columns/columns.code etc.)
  return (
    moduleKey === "commons" && pathKeys.length >= 1 && pathKeys[0] === "grid"
  );
}

function isInsideAnyGrid(pathKeys: string[]): boolean {
  return pathKeys.includes("grid");
}

// function isInsideGrid(pathKeys: string[]): boolean {
//   // true se "grid" aparece em qualquer ponto do caminho
//   // ex: ["grid","columns","codigo"] => true
//   // ex: ["form","grid","columns","codigo"] => true (se existir)
//   return pathKeys.includes("grid");
// }

function buildConstantTreeFromModule(
  moduleObj: JsonObject,
  moduleKey: string,
  addNestedPrefixes: boolean,
): any {
  const walk = (node: JsonValue, pathKeys: string[]): any => {
    if (typeof node === "string") {
      // ✅ exceção: em commons.grid queremos path completo tipo "grid.title"
      if (isInsideCommonsGrid(moduleKey, pathKeys)) {
        return pathKeys.join(".");
      }

      // ✅ regra geral: qualquer coisa dentro de grid vira leaf-only
      if (isInsideAnyGrid(pathKeys)) {
        return pathKeys[pathKeys.length - 1];
      }

      // padrão
      return pathKeys.join(".");
    }

    if (Array.isArray(node)) {
      return pathKeys.join(".");
    }

    if (isPlainObject(node)) {
      const out: any = {};

      // ✅ prefix interno somente no modo "GLOBAL" (quando addNestedPrefixes = true)
      // - nunca na raiz do módulo
      // - commons.grid => prefix "grid"
      // - nada abaixo de commons.grid recebe prefix
      if (
        addNestedPrefixes &&
        pathKeys.length > 0 &&
        !isUnderCommonsGrid(pathKeys, moduleKey)
      ) {
        if (isCommonsGrid(pathKeys, moduleKey)) {
          out.prefix = "grid";
        } else {
          out.prefix = `${moduleKey}.${pathKeys.join(".")}`;
        }
      }

      for (const [rawKey, child] of Object.entries(node)) {
        const nextPath = [...pathKeys, rawKey];

        // ✅ grid.title: ignora fora de commons; em commons mantém
        if (shouldIgnorePath(nextPath, moduleKey)) continue;

        // enums: se a chave for numérica, nomeia pelo valor
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

    return pathKeys.join(".");
  };

  return walk(moduleObj, []);
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

  // objeto
  const entries = Object.entries(value);
  if (entries.length === 0) return "{}";

  const lines = entries.map(([k, v]) => {
    // k já está camelCase (ou _prefix), então podemos usar como identificador
    // se quiser ser ultra seguro: usar JSON.stringify(k) quando não bater regex
    const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k)
      ? k
      : JSON.stringify(k);
    return `${pad(indent + 4)}${safeKey}: ${tsPrint(v, indent + 4)},`;
  });

  return `{\n${lines.join("\n")}\n${pad(indent)}}`;
}

export async function generateI18nConstants(opts: GenerateI18nOptions) {
  const absJson = path.isAbsolute(opts.jsonPath)
    ? opts.jsonPath
    : path.join(process.cwd(), opts.jsonPath);

  const raw = await fs.readFile(absJson, "utf-8");
  const json = JSON.parse(raw) as JsonObject;

  // ✅ se tem opts.prefix => modo "cadastros" (sem prefix interno)
  // ✅ se NÃO tem => modo "global" (com prefix interno)
  const addNestedPrefixes = !opts.prefix;

  const outObj: any = {};
  for (const [moduleKey, moduleValue] of Object.entries(json)) {
    if (!isPlainObject(moduleValue)) continue;

    const moduleConstKey = toCamelCase(moduleKey);
    outObj[moduleConstKey] = {
      prefix: opts.prefix ? `${opts.prefix}.${moduleKey}` : moduleKey,
      ...buildConstantTreeFromModule(moduleValue, moduleKey, addNestedPrefixes),
    };
  }

  const content = `export const ${opts.name} = ${tsPrint(outObj, 0)} as const;\n`;

  const absOut = path.isAbsolute(opts.outPath)
    ? opts.outPath
    : path.join(process.cwd(), opts.outPath);

  await fs.outputFile(absOut, content, "utf-8");
  console.log(`I18N constants generated: ${absOut}`);
}
