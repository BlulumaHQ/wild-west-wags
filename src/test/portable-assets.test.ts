import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const originals = {
  "capdt.webp": 32356,
  "dogsafe-certified.webp": 23302,
  "good-dog-academy-graduate.webp": 26774,
  "kt-15.webp": 156326,
  "kt-18.webp": 1163374,
  "kt-22.webp": 340358,
  "kt-22b.webp": 484260,
  "kt-30.webp": 591366,
  "kt-32.webp": 576354,
  "kt-36.webp": 163032,
  "kt-41.webp": 227540,
  "kt-41b.webp": 317674,
  "kt-8.webp": 474686,
  "profur-insured.webp": 32514,
  "wild-west-wags-wordmark-green.webp": 5786,
};

function filesIn(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const file = join(directory, name);
    return statSync(file).isDirectory() ? filesIn(file) : [file];
  });
}

describe("Portable production images", () => {
  for (const [name, size] of Object.entries(originals)) {
    it(`ships the original ${name} as a real static WebP`, () => {
      const bytes = readFileSync(join(root, "public/assets", name));
      expect(bytes.length).toBe(size);
      expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
      expect(bytes.toString("ascii", 8, 12)).toBe("WEBP");
    });
  }

  it("has no Lovable-only image dependencies in runtime source", () => {
    const source = filesIn(join(root, "src")).filter((file) =>
      /\.(tsx?|css|json)$/.test(file) && !file.includes("/test/") && !/\.(test|spec)\./.test(file),
    );
    for (const file of source) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/\.asset\.json|\/__l5e\//);
    }
  });

  it("resolves every static image reference to a committed original", () => {
    const source = filesIn(join(root, "src")).filter((file) => /\.(tsx?|css)$/.test(file) && !file.includes("/test/"));
    const references = source.flatMap((file) => [...readFileSync(file, "utf8").matchAll(/\/assets\/([\w.-]+\.webp)/g)].map((match) => match[1]));
    expect(new Set(references).size).toBe(14);
    for (const name of references) {
      if (name === undefined) throw new Error("Static image reference has no filename");
      expect(Object.keys(originals)).toContain(name);
      expect(statSync(join(root, "public/assets", name)).isFile()).toBe(true);
    }
  });
});