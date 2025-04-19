# Oil Production Analytics Platform

A full-stack web application for visualizing and analyzing oil production data.

## Project Overview

This application provides an interactive platform for analyzing oil production data with the following features:
- Data visualization through charts and tables
- Interactive map for well locations
- Filtering capabilities based on various parameters
- RESTful API for data retrieval

## Technology Stack

### Frontend
- Angular 17
- Material Angular for UI components
- Chart.js for data visualization
- Leaflet for interactive maps

### Backend
- Python with FastAPI
- SQLite database
- Docker for containerization

## Project Structure

```
slb-demo/
├── apps/
│   ├── frontend/         # Angular application
│   └── backend/          # FastAPI application
│       ├── app/
│       │   ├── database/ # Database setup and connections
│       │   ├── models/   # Data models
│       │   ├── routers/  # API endpoints
│       │   └── services/ # Business logic
├── shared/               # Shared configurations and utilities
├── docker-compose.yml    # Docker Compose configuration
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js and npm (for local development)
- Python 3.9+ (for local development)

### Running with Docker
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd slb-demo
   ```

2. Start the application using Docker Compose
   ```bash
   docker-compose up
   ```

3. Access the application
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

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
   ng serve
   ```

## Features

### Data Visualization
- Line charts for oil production trends over time
- Interactive tables for detailed data analysis
- Map visualization for well locations

### Data Filtering
- Filter by date range
- Filter by well name
- Filter by region

## API Documentation

The API documentation is available at `/docs` when the backend server is running.

## License

[MIT License](LICENSE)
