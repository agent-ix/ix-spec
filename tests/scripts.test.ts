import { execFileSync } from "node:child_process";

import { main, packageVersion } from "../src/cli";

test("build-tools help exits successfully", () => {
  const output = execFileSync("node", ["scripts/build-tools.js", "--help"], {
    encoding: "utf8",
  });
  expect(output).toContain("Build Tools");
});

test("catalog help explains the installed module dir and default set", async () => {
  const output: string[] = [];
  const spy = vi.spyOn(console, "log").mockImplementation((message) => {
    output.push(String(message));
  });
  try {
    await main(["catalog", "--help"]);
  } finally {
    spy.mockRestore();
  }
  const text = output.join("\n");
  expect(text).toContain("~/.ix/filament/modules");
  expect(text).toContain("spec-artifacts-iso");
  expect(text).toContain("spec-objects-security");
});

test("write help explains authoring packs", async () => {
  const output: string[] = [];
  const spy = vi.spyOn(console, "log").mockImplementation((message) => {
    output.push(String(message));
  });
  try {
    await main(["write", "--help"]);
  } finally {
    spy.mockRestore();
  }
  const text = output.join("\n");
  expect(text).toContain("authoring pack");
  expect(text).toContain("quoin write <repo_dir> --types");
});

test("version flag prints package version", async () => {
  const output: string[] = [];
  const spy = vi.spyOn(console, "log").mockImplementation((message) => {
    output.push(String(message));
  });
  try {
    await main(["--version"]);
    await main(["version"]);
  } finally {
    spy.mockRestore();
  }
  expect(output).toEqual([packageVersion(), packageVersion()]);
});
