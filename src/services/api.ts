import { AuthApi } from "./api/auth";
import { AnalysisApi } from "./api/analysis";
import { ChatApi } from "./api/chat";
import { DocumentApi } from "./api/documents";

export const ApiService = {
  ...AuthApi,
  ...AnalysisApi,
  ...ChatApi,
  ...DocumentApi,
};
