import { FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { incidents, getIncidentBySlug } from "../data/incidents";
import { useDojo } from "../app/DojoContext";
import type { IncidentMetadata } from "../types";

export function IncidentsRoute() {
  const { locale, t } = useDojo();

  return (
    <section className="page-section">
      <div className="section-heading">
        <FileText aria-hidden="true" />
        <h1>{t.incidentLibraryTitle}</h1>
      </div>
      <p className="safety-notice">{t.safetyNotice}</p>
      <div className="incident-timeline">
        {incidents.map((incident) => (
          <Link key={incident.slug} className="incident-timeline-item" to={`/incidents/${incident.slug}`}>
            <time dateTime={incident.date}>{incident.date}</time>
            <div>
              <span>{localizedIncident(incident, locale, "category")}</span>
              <strong>{localizedIncident(incident, locale, "title")}</strong>
              <dl className="incident-facts">
                <div>
                  <dt>{t.affectedProtocol}</dt>
                  <dd>{localizedIncident(incident, locale, "affectedProtocol")}</dd>
                </div>
                <div>
                  <dt>{t.impact}</dt>
                  <dd>{localizedIncident(incident, locale, "impact")}</dd>
                </div>
              </dl>
              <p>{localizedIncident(incident, locale, "summary")}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function IncidentDetailRoute() {
  const { slug = "" } = useParams();
  const { locale, t } = useDojo();
  const incident = getIncidentBySlug(slug);

  if (!incident) {
    return (
      <section className="page-section">
        <h1>{t.incidentNotFound}</h1>
        <Link className="back-link" to="/incidents">
          {t.backToIncidents}
        </Link>
      </section>
    );
  }

  return (
    <section className="page-section">
      <Link className="back-link" to="/incidents">
        {t.backToIncidents}
      </Link>
      <article className="detail-panel">
        <span className="difficulty">{localizedIncident(incident, locale, "category")}</span>
        <h1>{localizedIncident(incident, locale, "title")}</h1>
        <p>{localizedIncident(incident, locale, "summary")}</p>
        <dl className="incident-detail-facts">
          <div>
            <dt>{t.date}</dt>
            <dd>{incident.date}</dd>
          </div>
          <div>
            <dt>{t.affectedProtocol}</dt>
            <dd>{localizedIncident(incident, locale, "affectedProtocol")}</dd>
          </div>
          <div>
            <dt>{t.impact}</dt>
            <dd>{localizedIncident(incident, locale, "impact")}</dd>
          </div>
          <div>
            <dt>{t.status}</dt>
            <dd>{localizedIncident(incident, locale, "status")}</dd>
          </div>
          <div>
            <dt>{t.relatedChallenges}</dt>
            <dd>{incident.relatedChallengeIds.join(", ")}</dd>
          </div>
        </dl>
        <MarkdownRenderer locale={locale} sourceUrl={incident.sourceUrl} />
        <section className="reference-list">
          <h2>{t.references}</h2>
          <ul>
            {incident.references.map((reference) => (
              <li key={reference.url}>
                <a href={reference.url} rel="noreferrer" target="_blank">
                  {reference.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </section>
  );
}

function localizedIncident(
  incident: IncidentMetadata,
  locale: "en" | "zh",
  key: "title" | "summary" | "category" | "affectedProtocol" | "impact" | "status",
): string {
  if (locale !== "zh") return incident[key];
  const zhKey = `${key}Zh` as keyof IncidentMetadata;
  const localized = incident[zhKey];
  return typeof localized === "string" && localized.length > 0 ? localized : incident[key];
}
