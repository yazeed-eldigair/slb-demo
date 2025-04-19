import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { WellService } from '../../services/well.service';
import { Well } from '../../models/well.model';

@Component({
  selector: 'app-wells',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './wells.component.html',
  styleUrls: ['./wells.component.scss']
})
export class WellsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  wells: Well[] = [];
  filteredWells: Well[] = [];
  isLoading = true;
  regionFilter = new FormControl('');
  statusFilter = new FormControl('');

  // Table configuration
  displayedColumns: string[] = ['id', 'name', 'region', 'status', 'coordinates'];
  dataSource: any;

  // Available regions and statuses
  regions: string[] = [];
  statuses: string[] = [];

  constructor(private wellService: WellService) { }

  ngOnInit(): void {
    this.loadWells();

    // Subscribe to filter changes
    this.regionFilter.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.statusFilter.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadWells(): void {
    this.isLoading = true;
    this.wellService.getWells().subscribe({
      next: (wells) => {
        this.wells = wells;
        this.filteredWells = wells;
        this.dataSource = this.filteredWells;
        
        // Extract unique regions and statuses for filters
        this.regions = [...new Set(wells.map(well => well.region))];
        this.statuses = [...new Set(wells.map(well => well.status))];
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading wells:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.wells];
    
    // Apply region filter
    if (this.regionFilter.value) {
      filtered = filtered.filter(well => well.region === this.regionFilter.value);
    }
    
    // Apply status filter
    if (this.statusFilter.value) {
      filtered = filtered.filter(well => well.status === this.statusFilter.value);
    }
    
    this.filteredWells = filtered;
    this.dataSource = this.filteredWells;
  }

  resetFilters(): void {
    this.regionFilter.setValue('');
    this.statusFilter.setValue('');
    this.filteredWells = this.wells;
    this.dataSource = this.filteredWells;
  }

  applyTextFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.applyTextFilterValue(filterValue);
  }

  applyTextFilterValue(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();
    
    if (!filterValue) {
      this.applyFilters(); // Just apply the dropdown filters
      return;
    }
    
    // Apply text filter on top of dropdown filters
    this.filteredWells = this.filteredWells.filter(well => 
      well.name.toLowerCase().includes(filterValue) ||
      well.region.toLowerCase().includes(filterValue) ||
      well.status.toLowerCase().includes(filterValue)
    );
    
    this.dataSource = this.filteredWells;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Inactive':
        return 'orange';
      case 'Abandoned':
        return 'red';
      default:
        return 'gray';
    }
  }

  formatCoordinates(latitude: number, longitude: number): string {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}
