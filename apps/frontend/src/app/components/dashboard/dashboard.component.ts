import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { WellService } from '../../services/well.service';
import { ProductionService } from '../../services/production.service';
import { Well } from '../../models/well.model';
import { Production } from '../../models/production.model';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('productionChart') productionChart!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  wells: Well[] = [];
  productions: Production[] = [];
  filterForm!: FormGroup;
  isLoading = true;
  chart: any;

  // Table configuration
  displayedColumns: string[] = ['date', 'well_id', 'oil_production', 'gas_production', 'water_production'];
  dataSource: any;

  constructor(
    private wellService: WellService,
    private productionService: ProductionService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Chart will be initialized after data is loaded
  }

  initFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      startDate: [null],
      endDate: [null],
      wellName: [''],
      region: ['']
    });
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load wells
    this.wellService.getWells().subscribe({
      next: (wells) => {
        this.wells = wells;
        
        // Load production data
        this.productionService.getProductions().subscribe({
          next: (productions) => {
            this.productions = productions;
            this.dataSource = this.productions.slice(0, 10); // Show only the first 10 records initially
            this.isLoading = false;
            this.initChart();
          },
          error: (error) => {
            console.error('Error loading production data:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading wells:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const filter = {
      start_date: this.filterForm.value.startDate ? this.formatDate(this.filterForm.value.startDate) : undefined,
      end_date: this.filterForm.value.endDate ? this.formatDate(this.filterForm.value.endDate) : undefined,
      well_name: this.filterForm.value.wellName || undefined,
      region: this.filterForm.value.region || undefined
    };

    this.isLoading = true;
    this.productionService.filterProduction(filter).subscribe({
      next: (productions) => {
        this.productions = productions;
        this.dataSource = this.productions.slice(0, 10);
        this.isLoading = false;
        this.updateChart();
      },
      error: (error) => {
        console.error('Error filtering production data:', error);
        this.isLoading = false;
      }
    });
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.loadData();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  initChart(): void {
    if (this.productionChart && this.productions.length > 0) {
      // Process data for chart
      const dates = this.processChartData().dates;
      const oilProduction = this.processChartData().oilProduction;

      // Create chart
      const ctx = this.productionChart.nativeElement.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Oil Production (barrels)',
              data: oilProduction,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Oil Production Trend'
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Production (barrels)'
              },
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  updateChart(): void {
    if (this.chart && this.productions.length > 0) {
      const chartData = this.processChartData();
      this.chart.data.labels = chartData.dates;
      this.chart.data.datasets[0].data = chartData.oilProduction;
      this.chart.update();
    } else if (this.productions.length > 0) {
      this.initChart();
    }
  }

  processChartData() {
    // Sort productions by date
    const sortedProductions = [...this.productions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group by date and sum oil production
    const productionByDate = sortedProductions.reduce((acc: any, curr) => {
      const date = curr.date.split('T')[0]; // Remove time part if present
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += curr.oil_production;
      return acc;
    }, {});

    // Extract dates and oil production values
    const dates = Object.keys(productionByDate);
    const oilProduction = Object.values(productionByDate);

    return { dates, oilProduction };
  }

  navigateToWells(): void {
    this.router.navigate(['/wells']);
  }

  navigateToMap(): void {
    this.router.navigate(['/map']);
  }
}
