import { ConnectButton } from "@mysten/dapp-kit";
import { Languages, Shield, Wallet } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useDojo } from "../app/DojoContext";
import { navItems } from "../lib/navigation";

export function AppShell() {
  const { locale, setLocale, t } = useDojo();

  return (
    <main className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/">
          <Shield aria-hidden="true" />
          <span>SuiSec Dojo</span>
        </NavLink>
        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map((item) =>
            item.external ? (
              <a key={item.id} href={item.path} rel="noreferrer" target="_blank">
                {t[item.labelKey]}
              </a>
            ) : (
              <NavLink key={item.id} to={item.path}>
                {t[item.labelKey]}
              </NavLink>
            ),
          )}
        </nav>
        <div className="topbar-actions">
          <div className="locale-switch" aria-label="Language switch">
            <Languages aria-hidden="true" />
            {(["zh", "en"] as const).map((item) => (
              <button key={item} className={locale === item ? "active" : ""} type="button" onClick={() => setLocale(item)}>
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <ConnectButton className="wallet-button" connectText={<WalletLabel label={t.connectWallet} />} />
        </div>
      </header>
      <Outlet />
    </main>
  );
}

function WalletLabel({ label }: { label: string }) {
  return (
    <>
      <Wallet aria-hidden="true" />
      {label}
    </>
  );
}
