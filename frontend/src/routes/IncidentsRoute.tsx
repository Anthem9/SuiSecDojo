import { FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { incidents, getIncidentBySlug } from "../data/incidents";
import { useDojo } from "../app/DojoContext";

export function IncidentsRoute() {
  return (
    <section className="page-section">
      <div className="section-heading">
        <FileText aria-hidden="true" />
        <h1>Incident Library</h1>
      </div>
      <p className="safety-notice">
        These notes describe simplified defensive patterns. They do not reproduce complete production exploits or target live
        protocols.
      </p>
      <div className="incident-grid">
        {incidents.map((incident) => (
          <Link key={incident.slug} className="incident-card" to={`/incidents/${incident.slug}`}>
            <span>{incident.category}</span>
            <strong>{incident.title}</strong>
            <p>{incident.summary}</p>
            <small>Related challenges: {incident.relatedChallengeIds.join(", ")}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function IncidentDetailRoute() {
  const { slug = "" } = useParams();
  const { locale } = useDojo();
  const incident = getIncidentBySlug(slug);

  if (!incident) {
    return (
      <section className="page-section">
        <h1>Incident not found</h1>
        <Link className="back-link" to="/incidents">
          Back to incidents
        </Link>
      </section>
    );
  }

  return (
    <section className="page-section">
      <Link className="back-link" to="/incidents">
        Back to incidents
      </Link>
      <article className="detail-panel">
        <span className="difficulty">{incident.category}</span>
        <h1>{incident.title}</h1>
        <p>{incident.summary}</p>
        <MarkdownRenderer locale={locale} sourceUrl={incident.sourceUrl} />
      </article>
    </section>
  );
}
