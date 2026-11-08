import { describe, it, expect } from "vitest";
import { deepMergeSpec } from "./merge";

describe("deepMergeSpec", () => {
  it.each([
    ["missing", {}],
    ["null", { a: null }],
    ["string", { a: "old" }],
    ["number", { a: 1 }],
    ["boolean", { a: false }],
    ["array", { a: [1, 2] }],
  ])("applies nested null deletions when replacing a %s value", (_, base) => {
    const patch = { a: { removed: null, nested: { removed: null, kept: 1 } } };
    const baseCopy = structuredClone(base);
    const patchCopy = structuredClone(patch);

    expect(deepMergeSpec(base, patch)).toEqual({ a: { nested: { kept: 1 } } });
    expect(base).toEqual(baseCopy);
    expect(patch).toEqual(patchCopy);
  });

  it("retains an empty object after deleting its only patched member", () => {
    expect(deepMergeSpec({}, { a: { removed: null } })).toEqual({ a: {} });
  });

  it("preserves null values inside replacement arrays", () => {
    expect(deepMergeSpec({ a: {} }, { a: [null, { kept: null }] })).toEqual({
      a: [null, { kept: null }],
    });
  });
});
