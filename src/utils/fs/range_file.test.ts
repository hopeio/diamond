import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { expect, test } from "vitest";
import { range } from "./range_file.js";

test("range walks files recursively", () => {
  const root = mkdtempSync(join(tmpdir(), "diamond-range-"));
  mkdirSync(join(root, "sub"));
  writeFileSync(join(root, "a.txt"), "");
  writeFileSync(join(root, "sub", "b.txt"), "");
  const paths: string[] = [];
  range(root, (_dir, _name, path) => paths.push(path));
  expect(paths).toContain(join(root, "a.txt"));
  expect(paths).toContain(join(root, "sub", "b.txt"));
  rmSync(root, { recursive: true, force: true });
});
