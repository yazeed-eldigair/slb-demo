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
    
    # Sample well data for UAE regions
    wells = [
        Well(
            name="Well-AD1",
            region="Abu Dhabi",
            latitude=24.4539,
            longitude=54.3773,
            status="Active"
        ),
        Well(
            name="Well-DXB2",
            region="Dubai",
            latitude=25.2048,
            longitude=55.2708,
            status="Active"
        ),
        Well(
            name="Well-SHJ3",
            region="Sharjah",
            latitude=25.3463,
            longitude=55.4209,
            status="Inactive"
        ),
        Well(
            name="Well-AJM4",
            region="Ajman",
            latitude=25.4111,
            longitude=55.4354,
            status="Active"
        ),
        Well(
            name="Well-RAK5",
            region="Ras Al Khaimah",
            latitude=25.7895,
            longitude=55.9432,
            status="Abandoned"
        ),
        Well(
            name="Well-FUJ6",
            region="Fujairah",
            latitude=25.1288,
            longitude=56.3265,
            status="Active"
        ),
        Well(
            name="Well-UAQ7",
            region="Umm Al Quwain",
            latitude=25.5647,
            longitude=55.5554,
            status="Active"
        ),
        Well(
            name="Well-AD8",
            region="Abu Dhabi",
            latitude=24.1302,
            longitude=54.4332,
            status="Inactive"
        ),
    ]
    
    db.add_all(wells)
    db.commit()
    
    # Generate production data for the past 30 days only
    today = date.today()
    start_date = today - timedelta(days=30)
    
    # Create production data for each well
    for well in wells:
        # Base production values
        base_oil = random.uniform(100, 500)
        base_gas = random.uniform(1000, 5000)
        base_water = random.uniform(50, 200)
        
        # Generate data for each day
        for day in range(30):
            current_date = start_date + timedelta(days=day)
            
            # Add some daily variation
            daily_variation = random.uniform(0.8, 1.2)
            
            # Calculate production values with simple variation
            oil_production = base_oil * daily_variation
            gas_production = base_gas * daily_variation
            water_production = base_water * daily_variation
            
            # Create production record for each day
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
