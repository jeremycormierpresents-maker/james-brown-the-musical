import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../../../db";
import { auditions } from "../../../../../../db/schema";
import { getAuditionReviewer } from "../../../../../../lib/audition-access";
import { AUDITION_ID_PATTERN } from "../../../../../../lib/audition-validation";

export const dynamic = "force-dynamic";

const privateHeaders = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" };

export async function GET(_request: Request, context: { params: Promise<{ id: string; kind: string }> }) {
  if (!await getAuditionReviewer()) return Response.json({ error: "Reviewer access is required." }, { status: 403, headers: privateHeaders });
  const { id, kind } = await context.params;
  if (!AUDITION_ID_PATTERN.test(id) || !["headshot", "resume"].includes(kind)) return Response.json({ error: "Material not found." }, { status: 404, headers: privateHeaders });
  try {
    const row = await getDb().select().from(auditions).where(eq(auditions.id, id.toLowerCase())).get();
    if (!row || !env.BUCKET) return Response.json({ error: "Material not found." }, { status: 404, headers: privateHeaders });
    const headshot = kind === "headshot";
    const material = await env.BUCKET.get(headshot ? row.headshotKey : row.resumeKey);
    if (!material) return Response.json({ error: "Material not found." }, { status: 404, headers: privateHeaders });
    return new Response(material.body, { headers: {
      ...privateHeaders,
      "Content-Type": headshot ? row.headshotType : row.resumeType,
      "Content-Length": String(material.size),
      "Content-Disposition": `attachment; filename="${headshot ? row.headshotName : row.resumeName}"`,
      "Content-Security-Policy": "default-src 'none'; sandbox",
    } });
  } catch {
    return Response.json({ error: "This material is temporarily unavailable." }, { status: 503, headers: privateHeaders });
  }
}
