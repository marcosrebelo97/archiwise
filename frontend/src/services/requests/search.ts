import api from "../api";

import type { RegisterSearch } from "@/types/project";


export const createSearch = async (search: RegisterSearch) => {
  const res = await api.post('/searches', search);

  return res;
}
