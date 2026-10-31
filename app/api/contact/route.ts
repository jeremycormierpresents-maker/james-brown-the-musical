import { handleForm } from "../../../lib/form-handler";
export async function POST(request: Request) { return handleForm(request, "contact"); }
