import { handleAudition } from "../../../lib/audition-handler";

export async function POST(request: Request) {
  return handleAudition(request);
}
