import { Production } from "./production.model";

export interface Well {
  id: number;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  status: string;
}

export interface WellWithProduction extends Well {
  productions: Production[];
}
