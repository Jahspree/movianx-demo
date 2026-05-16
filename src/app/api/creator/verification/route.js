import { getCreatorFromRequest } from "../../../../lib/creator/auth.js";
import { getCreatorVerificationSummary } from "../../../../lib/creator/intakeStore.js";
import { json } from "../../_creatorResponse.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const creator = getCreatorFromRequest(request);
  const summary = getCreatorVerificationSummary(creator?.email);
  return json({
    creator: creator ? {
      id: creator.id,
      displayName: creator.displayName,
      email: creator.email,
      role: creator.role,
    } : null,
    verification: summary,
  });
}
