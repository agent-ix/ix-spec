import { describe, expect, it } from "vitest";

import { packageVersion, resolveVersion } from "../src/cli";

describe("resolveVersion", () => {
  it("returns the baked version verbatim when present", () => {
    // A clean tagged release bakes a bare semver...
    expect(resolveVersion("0.5.2")).toBe("0.5.2");
    // ...and a drifted build bakes a describe string with a suffix.
    expect(resolveVersion("0.5.1-3-gabc123-dirty")).toBe(
      "0.5.1-3-gabc123-dirty",
    );
  });

  it("falls back to package.json when no version is baked in", () => {
    // Under vitest __QUOIN_VERSION__ is "", so packageVersion() takes the
    // fallback path and reads a real string from package.json.
    const version = resolveVersion("");
    expect(typeof version).toBe("string");
    expect(version.length).toBeGreaterThan(0);
    expect(packageVersion()).toBe(version);
  });
});
