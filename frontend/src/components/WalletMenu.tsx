import { ConnectModal, useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { ChevronDown, LogOut, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDojo } from "../app/DojoContext";
import { shortAddress } from "../lib/profile";

export function WalletMenu() {
  const account = useCurrentAccount();
  const disconnect = useDisconnectWallet();
  const { t } = useDojo();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  if (!account) {
    return <ConnectModal trigger={<ConnectTrigger label={t.connectWallet} />} />;
  }

  return (
    <div className="wallet-menu" ref={menuRef}>
      <button className="wallet-button" type="button" onClick={() => setOpen((current) => !current)}>
        <Wallet aria-hidden="true" />
        {shortAddress(account.address)}
        <ChevronDown aria-hidden="true" />
      </button>
      {open ? (
        <div className="wallet-dropdown">
          <strong>{shortAddress(account.address)}</strong>
          <span>{account.address}</span>
          <button
            type="button"
            onClick={() => {
              disconnect.mutate();
              setOpen(false);
            }}
          >
            <LogOut aria-hidden="true" />
            {t.disconnectWallet}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ConnectTrigger({ label }: { label: string }) {
  return (
    <button className="wallet-button" type="button">
      <Wallet aria-hidden="true" />
      {label}
    </button>
  );
}
