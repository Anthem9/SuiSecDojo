// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { ConnectTrigger } from "./WalletMenu";

Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { value: true, configurable: true });

describe("ConnectTrigger", () => {
  it("forwards injected button props from the wallet connect modal", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    const onClick = vi.fn();

    act(() => {
      root.render(<ConnectTrigger label="Connect Wallet" aria-label="open wallet selector" onClick={onClick} />);
    });

    host.querySelector("button")?.click();
    expect(onClick).toHaveBeenCalledTimes(1);

    act(() => root.unmount());
    host.remove();
  });
});
