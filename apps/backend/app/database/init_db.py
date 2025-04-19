from sqlalchemy.orm import Session
from datetime import date, timedelta
import random
import os

from ..models.models import Well, Production
from .database import SessionLocal

def initialize_database():
    """Initialize the database with sample data if it's empty."""
    db = SessionLocal()
    
    # Check if data already exists
    well_count = db.query(Well).count()
    if well_count > 0:
        db.close()
        return
    
    # Sample well data
    wells = [
        Well(
            name="Well-A1",
            region="North Region",
            latitude=29.7604,
            longitude=-95.3698,
            status="Active"
        ),
        Well(
            name="Well-B2",
            region="South Region",
            latitude=32.7767,
            longitude=-96.7970,
            status="Active"
        ),
        Well(
            name="Well-C3",
            region="East Region",
            latitude=30.2672,
            longitude=-97.7431,
            status="Inactive"
        ),
        Well(
            name="Well-D4",
            region="West Region",
            latitude=31.7619,
            longitude=-106.4850,
            status="Active"
        ),
        Well(
            name="Well-E5",
            region="North Region",
            latitude=29.4241,
            longitude=-98.4936,
            status="Abandoned"
        ),
        Well(
            name="Well-F6",
            region="South Region",
            latitude=35.0844,
            longitude=-106.6504,
            status="Active"
        ),
        Well(
            name="Well-G7",
            region="East Region",
            latitude=33.4484,
            longitude=-112.0740,
            status="Active"
        ),
        Well(
            name="Well-H8",
            region="West Region",
            latitude=36.1699,
            longitude=-115.1398,
            status="Inactive"
        ),
    ]
    
    db.add_all(wells)
    db.commit()
    
    # Generate production data for the past 365 days
    today = date.today()
    start_date = today - timedelta(days=365)
    
    # Create production data for each well
    for well in wells:
        # Base production values that will trend over time
        base_oil = random.uniform(100, 500)
        base_gas = random.uniform(1000, 5000)
        base_water = random.uniform(50, 200)
        
        # Trend factors (decline or increase)
        oil_trend = random.uniform(-0.3, 0.1)  # Mostly declining
        gas_trend = random.uniform(-0.2, 0.2)  # Mixed trend
        water_trend = random.uniform(0, 0.4)   # Mostly increasing
        
        for day in range(365):
            current_date = start_date + timedelta(days=day)
            
            # Apply trend and some randomness
            day_factor = day / 365.0
            randomness = random.uniform(0.8, 1.2)
            
            oil_production = max(0, base_oil * (1 + oil_trend * day_factor) * randomness)
            gas_production = max(0, base_gas * (1 + gas_trend * day_factor) * randomness)
            water_production = max(0, base_water * (1 + water_trend * day_factor) * randomness)
            
            # Skip some days randomly to simulate missing data
            if random.random() > 0.05:  # 5% chance to skip a day
                production = Production(
                    well_id=well.id,
                    date=current_date,
                    oil_production=oil_production,
                    gas_production=gas_production,
                    water_production=water_production
                )
                db.add(production)
        
    db.commit()
    db.close()
