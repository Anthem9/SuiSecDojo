import { Copy, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { donationConfigFromEnv } from "../lib/donation";
import { CONTRACTS } from "../lib/constants";
import { useDojo } from "../app/DojoContext";

const donationConfig = donationConfigFromEnv(import.meta.env);

export function AboutRoute() {
  const { t } = useDojo();
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
        <h1>{t.aboutTitle}</h1>
      </div>
      <p className="section-copy">{t.aboutCopy}</p>
      <div className="about-grid">
        <article className="info-card">
          <h2>{t.projectBoundary}</h2>
          <p>{t.projectBoundaryCopy}</p>
        </article>
        <article className="info-card">
          <h2>{t.currentPackage}</h2>
          <p>{CONTRACTS.PACKAGE_ID || t.packageNotConfigured}</p>
        </article>
        <article className="info-card">
          <h2>{t.roadmap}</h2>
          <p>{t.roadmapCopy}</p>
        </article>
      </div>
      <section className="donation-panel">
        <h2>{t.supportProject}</h2>
        <p className="section-copy">{t.supportProjectCopy}</p>
        <div className="donation-grid">
          {donationConfig.map((item) => (
            <div key={item.asset} className="donation-card">
              <strong>{item.asset}</strong>
              <span>{item.address ?? t.donationMissing}</span>
              <button disabled={!item.enabled || !item.address} type="button" onClick={() => item.address && copyAddress(item.address, item.asset)}>
                <Copy aria-hidden="true" />
                {t.copyAddress}
              </button>
            </div>
          ))}
        </div>
        {copyStatus ? <p className="status-line">{copyStatus}</p> : null}
      </section>
    </section>
  );
}
