import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { WellService } from '../../services/well.service';
import { Well } from '../../models/well.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  wells: Well[] = [];
  filteredWells: Well[] = [];
  isLoading = true;
  map!: L.Map;
  markers: any[] = [];
  selectedRegion = '';
  
  // Map center (UAE)
  defaultCenter: L.LatLngExpression = [24.4539, 54.3773]; // Abu Dhabi coordinates
  defaultZoom = 8;

  constructor(private wellService: WellService) { }

  ngOnInit(): void {
    this.loadWells();
  }

  ngAfterViewInit(): void {
    // Initialize map after view is ready
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  loadWells(): void {
    this.isLoading = true;
    this.wellService.getWells().subscribe({
      next: (wells) => {
        this.wells = wells;
        this.filteredWells = wells;
        this.isLoading = false;
        
        // Add markers if map is already initialized
        if (this.map) {
          this.addMarkers();
        }
      },
      error: (error) => {
        console.error('Error loading wells:', error);
        this.isLoading = false;
      }
    });
  }

  initMap(): void {
    // Create Leaflet map
    this.map = L.map('map').setView(this.defaultCenter, this.defaultZoom);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add markers if wells are already loaded
    if (this.wells.length > 0) {
      this.addMarkers();
    }
  }

  addMarkers(): void {
    // Clear existing markers
    this.clearMarkers();

    // Add markers for each well
    this.filteredWells.forEach(well => {
      // Create marker
      const marker = L.marker([well.latitude, well.longitude])
        .addTo(this.map)
        .bindPopup(`
          <strong>${well.name}</strong><br>
          Region: ${well.region}<br>
          Status: ${well.status}<br>
          Coordinates: ${well.latitude.toFixed(4)}, ${well.longitude.toFixed(4)}
        `);

      // Store marker for later removal
      this.markers.push(marker);
    });

    // Fit map to markers if there are any
    if (this.filteredWells.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  clearMarkers(): void {
    // Remove all markers from map
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    
    // Clear markers array
    this.markers = [];
  }

  filterByRegion(): void {
    if (this.selectedRegion) {
      this.filteredWells = this.wells.filter(well => well.region === this.selectedRegion);
    } else {
      this.filteredWells = [...this.wells];
    }
    
    // Update markers
    this.addMarkers();
  }

  resetFilter(): void {
    this.selectedRegion = '';
    this.filteredWells = [...this.wells];
    this.addMarkers();
  }

  zoomToWell(well: Well): void {
    this.map.setView([well.latitude, well.longitude], 10);
    
    // Find and open popup for this well
    this.markers.forEach(marker => {
      const latLng = marker.getLatLng();
      if (latLng.lat === well.latitude && latLng.lng === well.longitude) {
        marker.openPopup();
      }
    });
  }

  centerMap(): void {
    this.map.setView(this.defaultCenter, this.defaultZoom);
  }
}
