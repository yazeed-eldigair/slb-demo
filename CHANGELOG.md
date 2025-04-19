# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with monorepo structure
- README.md with project documentation
- Docker and Docker Compose configuration
- Backend structure with FastAPI
- Frontend structure with Angular and Material UI
- SQLite database integration
- Basic API endpoints for oil production data
- Data visualization components with Chart.js
- Interactive map for well locations
- Comprehensive .gitignore file for Python and Angular projects
- Architecture diagram documenting system design
- Added favicon to the frontend application

## [0.1.0] - 2025-04-19

### Added
- Set up project structure with monorepo architecture
- Created backend with FastAPI framework
- Implemented SQLite database with SQLAlchemy ORM
- Added sample data generation for wells and production data
- Created RESTful API endpoints for wells and production data
- Implemented data filtering capabilities in the API
- Set up Angular frontend structure with Material UI components
- Added Chart.js integration for data visualization
- Created Docker and Docker Compose configuration for containerization

### Fixed
- Updated FastAPI application to use modern lifespan event handlers instead of deprecated on_event
