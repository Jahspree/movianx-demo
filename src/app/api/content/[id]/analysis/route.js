import { requireCreator } from "../../../../../lib/creator/auth.js";
import { getAnalysis } from "../../../../../lib/creator/contentStore.js";
import { handleApiError, json } from "../../../_creatorResponse.js";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const creator = requireCreator(request);
    const analysis = getAnalysis({ id: params.id, creatorId: creator.id });
    if (!analysis) return json({ error: { message: "Content not found" } }, 404);
    return json({ analysis });
  } catch (error) {
    return handleApiError(error);
  }
}
