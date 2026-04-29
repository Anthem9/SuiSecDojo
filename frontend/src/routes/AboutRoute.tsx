import { Copy, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { contactConfigFromEnv, donationConfigFromEnv } from "../lib/donation";
import { CONTRACTS, PAID_ACCESS } from "../lib/constants";
import { useDojo } from "../app/DojoContext";
import { mistPriceLabel, paidAccessConfigFromEnv } from "../lib/paidAccess";

const donationConfig = donationConfigFromEnv(import.meta.env);
const contactConfig = contactConfigFromEnv(import.meta.env);
const paidAccessConfig = paidAccessConfigFromEnv({
  VITE_PAID_ACCESS_NETWORK: PAID_ACCESS.NETWORK,
  VITE_PAID_ACCESS_PACKAGE_ID: PAID_ACCESS.PACKAGE_ID,
  VITE_PAID_ACCESS_CONFIG_ID: PAID_ACCESS.CONFIG_ID,
  VITE_PAID_ANSWER_PRICE_MIST: PAID_ACCESS.ANSWER_PRICE_MIST,
  VITE_PAID_BADGE_PRICE_MIST: PAID_ACCESS.BADGE_PRICE_MIST,
});

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
        <article className="info-card">
          <h2>{t.answerRevenueTitle}</h2>
          <p>{t.answerRevenueCopy}</p>
        </article>
      </div>
      <section className="donation-panel">
        <h2>{t.paidAccessTitle}</h2>
        <p className="section-copy">{t.paidAccessCopy}</p>
        <div className="donation-grid">
          <div className="donation-card">
            <strong>{t.paidAnswer}</strong>
            <span>
              {paidAccessConfig.enabled
                ? `${paidAccessConfig.network} / ${mistPriceLabel(paidAccessConfig.answerPriceMist)}`
                : t.paidUnavailable}
            </span>
            <button disabled type="button">
              {t.paidAnswer}
            </button>
          </div>
          <div className="donation-card">
            <strong>{t.paidBadge}</strong>
            <span>
              {paidAccessConfig.enabled ? `${paidAccessConfig.network} / ${mistPriceLabel(paidAccessConfig.badgePriceMist)}` : t.paidUnavailable}
            </span>
            <button disabled type="button">
              {t.paidBadge}
            </button>
          </div>
        </div>
      </section>
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
