/* eslint-disable */

import { request } from "umi";
import type { I18n } from "./data.d";

export async function querySources(): Promise<I18n.Source[]> {
  return request("/api/i18n/sources");
}
