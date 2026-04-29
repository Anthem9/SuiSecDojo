import { Copy, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { donationConfigFromEnv } from "../lib/donation";
import { CONTRACTS } from "../lib/constants";

const donationConfig = donationConfigFromEnv(import.meta.env);

export function AboutRoute() {
  const [copyStatus, setCopyStatus] = useState("");

  async function copyAddress(address: string, asset: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopyStatus(`${asset} donation address copied.`);
    } catch {
      setCopyStatus("Copy failed: browser denied clipboard permission. Select the address and copy manually.");
    }
  }

  return (
    <section className="page-section about-page">
      <div className="section-heading">
        <HeartHandshake aria-hidden="true" />
        <h1>About SuiSec Dojo</h1>
      </div>
      <p className="section-copy">
        SuiSec Dojo is a testnet security training ground for Sui Move developers. It combines interactive vulnerable
        challenge packages, Walrus-hosted education content, incident pattern writeups, and a testnet-only security passport.
      </p>
      <div className="about-grid">
        <article className="info-card">
          <h2>Project Boundary</h2>
          <p>
            Vulnerable challenge code is deployed only on testnet/devnet. Content is defensive and educational: simplified
            models, root causes, fixes, and audit checklists.
          </p>
        </article>
        <article className="info-card">
          <h2>Current Package</h2>
          <p>{CONTRACTS.PACKAGE_ID || "Package not configured"}</p>
        </article>
        <article className="info-card">
          <h2>Roadmap</h2>
          <p>
            Next work expands the challenge set, deepens incident history, and reserves structure for future gated hints or
            answers without adding a backend in this phase.
          </p>
        </article>
      </div>
      <section className="donation-panel">
        <h2>Support the Project</h2>
        <p className="section-copy">
          Donations help cover testnet/mainnet deployment costs and public education work. No donation is required to use the dojo.
        </p>
        <div className="donation-grid">
          {donationConfig.map((item) => (
            <div key={item.asset} className="donation-card">
              <strong>{item.asset}</strong>
              <span>{item.address ?? "Donation address not configured yet"}</span>
              <button disabled={!item.enabled || !item.address} type="button" onClick={() => item.address && copyAddress(item.address, item.asset)}>
                <Copy aria-hidden="true" />
                Copy Address
              </button>
            </div>
          ))}
        </div>
        {copyStatus ? <p className="status-line">{copyStatus}</p> : null}
      </section>
    </section>
  );
}
