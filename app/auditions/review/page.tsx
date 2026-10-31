import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditions } from "../../../db/schema";
import { requireAuditionReviewer } from "../../../lib/audition-access";
import { DISCIPLINES, PRODUCTIONS } from "../../../lib/audition-validation";
import { Arrow, SiteFooter, SiteHeader } from "../../components/site-chrome";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Submission Review | James Brown The Musical", robots: { index: false, follow: false } };
const PAGE_SIZE = 25;

async function ReviewContent({ page }: { page: number }) {
  const reviewer = await requireAuditionReviewer(`/auditions/review${page > 1 ? `?page=${page}` : ""}`);
  if (!reviewer) return <div className="review-empty"><h2>Reviewer access required.</h2><p>This area is available to the production’s authorized reviewer.</p><a className="text-link" href="/auditions">Go to Audition Submissions <Arrow /></a></div>;
  const results = await getDb().select().from(auditions).orderBy(desc(auditions.createdAt), desc(auditions.id)).limit(PAGE_SIZE + 1).offset((page - 1) * PAGE_SIZE);
  const rows = results.slice(0, PAGE_SIZE);
  const labels = (values: string[], options: readonly { value: string; label: string }[]) => values.map(value => options.find(option => option.value === value)?.label ?? value).join(" · ");
  const formatDate = (value: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York" }).format(new Date(value));
  return <>
    <div className="review-summary"><p>Page {page} · {rows.length} {rows.length === 1 ? "submission" : "submissions"}</p><p>Newest first · Times shown in New York time</p></div>
    {rows.length === 0 ? <div className="review-empty"><h2>{page === 1 ? "No submissions yet." : "No more submissions."}</h2><p>{page === 1 ? "Applications will appear here after performers submit their materials." : "Return to the previous page to view earlier results."}</p><a className="text-link" href="/auditions">View the Audition Form <Arrow /></a></div> : <div className="review-list">{rows.map(row => <article className="review-card" key={row.id}>
      <div className="review-card-heading"><div><p className="eyebrow">{labels(row.disciplines, DISCIPLINES)}</p><h2>{[row.firstName, row.middleName, row.lastName].filter(Boolean).join(" ")}</h2><p>{[row.city, row.state, row.country].filter(Boolean).join(", ")}</p></div><time dateTime={row.createdAt}>{formatDate(row.createdAt)}</time></div>
      <div className="review-details"><div><span>Email</span><a href={`mailto:${encodeURIComponent(row.email)}`}>{row.email}</a></div><div><span>Phone</span><p>{row.phone || "Not provided"}</p></div><div className="review-interests"><span>Production interests</span><p>{labels(row.productions, PRODUCTIONS)}</p></div></div>
      {row.experience && <div className="review-experience"><h3>Experience &amp; special skills</h3><p>{row.experience}</p></div>}
      <div className="review-materials"><a className="button button-outline" href={`/api/auditions/${row.id}/materials/headshot`}>Download Headshot <span aria-hidden="true">↓</span></a><a className="button button-outline" href={`/api/auditions/${row.id}/materials/resume`}>Download Résumé <span aria-hidden="true">↓</span></a>{row.videoUrl && <a className="text-link" href={row.videoUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Open Video <span aria-hidden="true">↗</span></a>}</div>
      <details className="review-reference"><summary>Submission reference &amp; consent</summary><p>Reference: <code>{row.id}</code></p><p>{row.consentText}</p><p>Consent recorded {formatDate(row.consentAt)} · {row.consentVersion}</p></details>
    </article>)}</div>}
    {(page > 1 || results.length > PAGE_SIZE) && <nav className="review-pagination" aria-label="Submission pages">{page > 1 && <a className="button button-outline" href={`/auditions/review?page=${page - 1}`}>← Previous</a>}{results.length > PAGE_SIZE && <a className="button button-outline" href={`/auditions/review?page=${page + 1}`}>Next <Arrow /></a>}</nav>}
  </>;
}

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const params = await searchParams;
  const raw = typeof params.page === "string" ? Number(params.page) : 1;
  const page = Number.isSafeInteger(raw) && raw > 0 && raw <= 10000 ? raw : 1;
  return <><SiteHeader active="auditions" /><main id="main" className="section-shell review-page"><div className="review-page-heading"><p className="eyebrow"><span /> Production team</p><h1>Audition <em>submissions.</em></h1><p>Review performer details and download their submitted materials.</p></div><ReviewContent page={page} /></main><SiteFooter /></>;
}
