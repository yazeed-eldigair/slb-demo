from pydantic import BaseModel
from datetime import date
from typing import List, Optional

# Well schemas
class WellBase(BaseModel):
    name: str
    region: str
    latitude: float
    longitude: float
    status: str

class WellCreate(WellBase):
    pass

class Well(WellBase):
    id: int

    class Config:
        orm_mode = True

# Production schemas
class ProductionBase(BaseModel):
    date: date
    oil_production: float
    gas_production: float
    water_production: float

class ProductionCreate(ProductionBase):
    well_id: int

class Production(ProductionBase):
    id: int
    well_id: int

    class Config:
        orm_mode = True

# Combined schemas for nested responses
class WellWithProduction(Well):
    productions: List[Production] = []

class ProductionWithWell(Production):
    well: Well

# Filter schemas
class ProductionFilter(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    well_name: Optional[str] = None
    region: Optional[str] = None
