import type { AnalysisOverview } from "../../types/chat";
import { fetchDeduplicated, getApiUrl } from "./client";

export const AnalysisApi = {
  async getAnalysisOverview(userId: string): Promise<AnalysisOverview> {
    const res = await fetchDeduplicated(getApiUrl(`/analysis/overview?user_id=${encodeURIComponent(userId)}`));
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to retrieve analysis overview.');
    }

    return res.json();
  },
};
