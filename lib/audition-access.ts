import { env } from "cloudflare:workers";
import { getChatGPTUser, requireChatGPTUser, type ChatGPTUser } from "../app/chatgpt-auth";

// A reviewer must have a trusted Sites identity whose verified email is on this
// explicit allowlist. A generic signed-in visitor is never a reviewer.
const REVIEWER_EMAILS = new Set(["jc@jcormierpresents.com"]);

// Identity headers are only trustworthy behind the Sites host, which strips any
// visitor-supplied copies. Elsewhere (e.g. a plain Cloudflare Workers deploy)
// they can be forged, so reviewer access stays locked unless the deployment
// explicitly opts in with REVIEWER_IDENTITY="sites".
function identityHeadersTrusted() {
  return (env as { REVIEWER_IDENTITY?: string }).REVIEWER_IDENTITY === "sites";
}

export function isAuditionReviewer(user: ChatGPTUser | null): user is ChatGPTUser {
  return !!user?.userId && REVIEWER_EMAILS.has(user.email.trim().toLowerCase());
}

export async function getAuditionReviewer(): Promise<ChatGPTUser | null> {
  if (!identityHeadersTrusted()) return null;
  const user = await getChatGPTUser();
  return isAuditionReviewer(user) ? user : null;
}

// This helper signs anonymous visitors in; callers still handle null as a
// permission-denied state for an authenticated non-reviewer.
export async function requireAuditionReviewer(returnTo = "/auditions/review"): Promise<ChatGPTUser | null> {
  if (!identityHeadersTrusted()) return null;
  const user = await requireChatGPTUser(returnTo);
  return isAuditionReviewer(user) ? user : null;
}
