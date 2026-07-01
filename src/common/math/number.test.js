import { expect, test } from "vitest";
import { formatInt, parseInt } from "./number.js";

test("parseInt base62", () => {
  expect(parseInt("1", 62)).toBe(1);
});

test("formatInt base62", () => {
  expect(formatInt(1, 62)).toBe("1");
});
