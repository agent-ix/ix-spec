import { execFileSync } from "node:child_process";

test("build-tools help exits successfully", () => {
  const output = execFileSync("node", ["scripts/build-tools.js", "--help"], {
    encoding: "utf8",
  });
  expect(output).toContain("Build Tools");
});
