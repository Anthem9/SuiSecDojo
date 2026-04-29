import { Copy, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { contactConfigFromEnv, donationConfigFromEnv } from "../lib/donation";
import { CONTRACTS } from "../lib/constants";
import { useDojo } from "../app/DojoContext";

const donationConfig = donationConfigFromEnv(import.meta.env);
const contactConfig = contactConfigFromEnv(import.meta.env);

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
          <div className="donation-card">
            <strong>{donationConfig.label}</strong>
            <span>{donationConfig.address ?? t.donationMissing}</span>
            <button
              disabled={!donationConfig.enabled || !donationConfig.address}
              type="button"
              onClick={() => donationConfig.address && copyAddress(donationConfig.address, donationConfig.label)}
            >
              <Copy aria-hidden="true" />
              {t.copyAddress}
            </button>
          </div>
        </div>
        {copyStatus ? <p className="status-line">{copyStatus}</p> : null}
      </section>
      <section className="donation-panel">
        <h2>{t.contactTitle}</h2>
        <p className="section-copy">{t.contactCopy}</p>
        <div className="contact-list">
          {contactConfig.some((item) => item.enabled) ? (
            contactConfig
              .filter((item) => item.enabled)
              .map((item) => (
                <a key={item.label} href={item.href} rel="noreferrer" target={item.href?.startsWith("http") ? "_blank" : undefined}>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </a>
              ))
          ) : (
            <p className="empty-state">{t.contactMissing}</p>
          )}
        </div>
      </section>
    </section>
  );
}
