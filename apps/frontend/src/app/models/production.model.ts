export interface Production {
  id: number;
  well_id: number;
  date: string;
  oil_production: number;
  gas_production: number;
  water_production: number;
}

export interface ProductionFilter {
  start_date?: string;
  end_date?: string;
  well_name?: string;
  region?: string;
}
