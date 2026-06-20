import { describe, expect, it, vi } from "vitest";

// `quoin update` delegates to ix-cli-core's runSelfUpdate. Mock the whole
// module so we assert the delegation contract (package name, flags) without
// touching the network or npm. configureRuntimeContext is also imported by
// main(), so it must be present as a no-op.
// vi.mock is hoisted above module init, so the spy must be created inside
// vi.hoisted (also hoisted) rather than referencing a plain top-level const.
const { runSelfUpdate } = vi.hoisted(() => ({
  runSelfUpdate: vi.fn(async () => ({ updated: false, latest: "9.9.9" })),
}));
vi.mock("@agent-ix/ix-cli-core", () => ({
  configureRuntimeContext: () => {},
  runSelfUpdate,
}));

import { main, packageVersion } from "../src/cli";

describe("quoin update", () => {
  it("delegates to runSelfUpdate with quoin's package coordinates", async () => {
    await main(["update"]);
    expect(runSelfUpdate).toHaveBeenCalledTimes(1);
    expect(runSelfUpdate).toHaveBeenCalledWith({
      packageName: "@agent-ix/quoin",
      currentVersion: packageVersion(),
      header: "quoin update",
      registry: undefined,
      check: false,
    });
  });

  it("passes --check through", async () => {
    runSelfUpdate.mockClear();
    await main(["update", "--check"]);
    expect(runSelfUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ check: true }),
    );
  });

  it("passes a custom --registry through", async () => {
    runSelfUpdate.mockClear();
    await main(["update", "--registry", "http://npm.ix/"]);
    expect(runSelfUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ registry: "http://npm.ix/" }),
    );
  });
});
