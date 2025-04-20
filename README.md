# [DEMO] Oil Production Dashboard

A monorepo for interactive visualization of UAE's oil production data using Angular Material and Chart.js for the frontend and FastAPI for the backend.


## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running with Docker](#running-with-docker)
  - [Local Development](#local-development)
- [Project Structure](#project-structure)
- [Project Overview](#project-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)

## Getting Started

### Prerequisites
- Docker and Docker Compose (for containerized deployment)
- Node.js 18+ and npm (for local frontend development)
- Python 3.9+ (for local backend development)

### Running with Docker

The easiest way to run the application is using Docker Compose:

1. Start the application using Docker Compose
   ```bash
   docker-compose up --build
   ```

2. Access the application
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8000

### Local Development

#### Backend
1. Navigate to the backend directory
   ```bash
   cd apps/backend
   ```

2. Create and activate a virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Run the development server
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend
1. Navigate to the frontend directory
   ```bash
   cd apps/frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run start
   ```

## Project Structure

```
slb-demo/
├── apps/
│   ├── frontend/         # Angular application
│   └── backend/          # FastAPI application
├── docker-compose.yml    # Docker Compose configuration
└── README.md             # Project documentation
```

## System Architecture

### Architecture Diagram
[![](https://mermaid.ink/img/pako:eNqFUttq4zAQ_RUxD0sLiXHq-PpQSGIKKbuwS_cCrfswidVEjS0ZWWZ3G_LvO7KdrUNbMk86M0dnzoy0h7XKOSSw0Vht2fd5JhlF3ay6RAaLQnBpMugKNuZa_a65fsjgF18dUQaPHYPLPJNvVG60koZK7GImN02B-nKo-GNJYn2BwH8tG1_QcC2waDlHwD4gL7aoze0dMduT81yzn6JusBAvaISS9Rmbc1zvWpc3WJvZ1-WJS8Ik3FfYrKoKsW5VTyykcyLdffssDGcpGlxhzc90XconTaq6WZtG82HLVJEfu-nuwD71GbZQZaXeF-4fhI3H13Y9sltwC8l3h-0ANpH2733Cet34Sbrf7fBCb2bsDFoNc9QGRvS1RA4JjcdHUHJdooWwt_QMzJaXNEZCxxz1zg5_oDsVynulyuM1rZrNFpInLGpCTZWTxVQgLfCVQivgeqEaaSCZeK0EJHv4A0k0cYIo9L0g9KeRF_vRCP5CEnhO4EfxVeC7nufFQTA9jOClbeo6UTiNKcLYn7ix6waHf6Do8PE?type=png)](https://mermaid.live/edit#pako:eNqFUttq4zAQ_RUxD0sLiXHq-PpQSGIKKbuwS_cCrfswidVEjS0ZWWZ3G_LvO7KdrUNbMk86M0dnzoy0h7XKOSSw0Vht2fd5JhlF3ay6RAaLQnBpMugKNuZa_a65fsjgF18dUQaPHYPLPJNvVG60koZK7GImN02B-nKo-GNJYn2BwH8tG1_QcC2waDlHwD4gL7aoze0dMduT81yzn6JusBAvaISS9Rmbc1zvWpc3WJvZ1-WJS8Ik3FfYrKoKsW5VTyykcyLdffssDGcpGlxhzc90XconTaq6WZtG82HLVJEfu-nuwD71GbZQZaXeF-4fhI3H13Y9sltwC8l3h-0ANpH2733Cet34Sbrf7fBCb2bsDFoNc9QGRvS1RA4JjcdHUHJdooWwt_QMzJaXNEZCxxz1zg5_oDsVynulyuM1rZrNFpInLGpCTZWTxVQgLfCVQivgeqEaaSCZeK0EJHv4A0k0cYIo9L0g9KeRF_vRCP5CEnhO4EfxVeC7nufFQTA9jOClbeo6UTiNKcLYn7ix6waHf6Do8PE)

### Component Descriptions

#### Frontend (Angular)

1. **Angular UI**: The main frontend application built with Angular 17.
   - Provides user interface for data visualization and interaction
   - Includes dashboard, wells listing, production data views, and map visualization

2. **Material Angular UI**: UI component library providing consistent design elements.
   - Used for all UI components as per project requirements
   - Provides responsive design for various screen sizes

3. **Chart.js Visualizations**: Library for creating interactive charts.
   - Used for all data visualizations as per project requirements
   - Includes line charts for oil production trends and pie charts for regional distribution

#### Backend (FastAPI)

1. **FastAPI Application**: Main backend application.
   - Provides RESTful API endpoints for wells and production data
   - Handles data processing and business logic
   - Manages database operations through service layer

2. **API Routes**:
   - **/api/wells**: Endpoints for well data
     - GET /api/wells/: List all wells
     - GET /api/wells/{well_id}: Get specific well details
   - **/api/production**: Endpoints for production data
     - GET /api/production/: List all production records
     - GET /api/production/{production_id}: Get specific production record
     - POST /api/production/filter/: Filter production data by date, well, or region

3. **Services & Data Models**:
   - **Models**: SQLAlchemy ORM models for Well and Production data
   - **Services**: Business logic for data processing and database operations
   - **Database Initialization**: Sample data generation for testing

4. **SQLite Database**: Persistent data storage.
   - Stores well information and production data
