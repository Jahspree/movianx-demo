import { requireCreator } from "../../../lib/creator/auth.js";
import { listContent } from "../../../lib/creator/contentStore.js";
import { handleApiError, json } from "../_creatorResponse.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const creator = requireCreator(request);
    return json({ content: listContent({ creatorId: creator.id }) });
  } catch (error) {
    return handleApiError(error);
  }
}
