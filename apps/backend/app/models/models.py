from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship

from ..database.database import Base

class Well(Base):
    __tablename__ = "wells"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    region = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String)  # Active, Inactive, Abandoned, etc.
    
    # Relationship with Production
    productions = relationship("Production", back_populates="well")

class Production(Base):
    __tablename__ = "productions"

    id = Column(Integer, primary_key=True, index=True)
    well_id = Column(Integer, ForeignKey("wells.id"))
    date = Column(Date, index=True)
    oil_production = Column(Float)  # in barrels
    gas_production = Column(Float)  # in cubic feet
    water_production = Column(Float)  # in barrels
    
    # Relationship with Well
    well = relationship("Well", back_populates="productions")
