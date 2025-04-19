import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('productionChart') productionChart!: ElementRef;
  @ViewChild('regionPieChart') regionPieChart!: ElementRef;

  wells: Well[] = [];
  productions: any[] = [];
  filterForm!: FormGroup;
  isLoading = false;
  chart: any;
  pieChart: any;

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
    // If data is already loaded, initialize the charts
    if (this.productions.length > 0) {
      setTimeout(() => {
        if (this.productionChart) {
          this.initChart();
        }
        if (this.regionPieChart) {
          this.initPieChart();
        }
      }, 300);
    }
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
            this.isLoading = false;
            
            // Initialize charts with a delay to ensure the view is ready
            setTimeout(() => {
              if (this.productionChart) {
                this.initChart();
              }
              if (this.regionPieChart) {
                this.initPieChart();
              }
            }, 300);
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
        this.isLoading = false;
        
        // Destroy existing chart and create a new one with filtered data
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }
        
        // Add a delay to ensure the DOM is ready before initializing the charts
        setTimeout(() => {
          if (this.productionChart) {
            this.initChart();
          }
          if (this.regionPieChart) {
            this.initPieChart();
          }
        }, 300);
      },
      error: (error) => {
        console.error('Error filtering production data:', error);
        this.isLoading = false;
      }
    });
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.isLoading = true;
    
    // Destroy existing chart
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    
    // Load data again
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
      const chartData = this.processChartData();
      const dates = chartData.dates;
      const oilProduction = chartData.oilProduction;
      
      // Destroy existing chart if it exists
      if (this.chart) {
        this.chart.destroy();
      }

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

  initPieChart(): void {
    if (this.regionPieChart && this.productions.length > 0) {
      // Process data for pie chart
      const pieData = this.processPieChartData();
      const regions = pieData.regions;
      const productionValues = pieData.productionValues;
      const backgroundColors = pieData.backgroundColors;
      
      // Destroy existing pie chart if it exists
      if (this.pieChart) {
        this.pieChart.destroy();
      }

      // Create pie chart
      const ctx = this.regionPieChart.nativeElement.getContext('2d');
      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: regions,
          datasets: [{
            data: productionValues,
            backgroundColor: backgroundColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw as number;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value.toFixed(2)} barrels (${percentage}%)`;
                }
              }
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
    
    if (this.pieChart && this.productions.length > 0) {
      const pieData = this.processPieChartData();
      this.pieChart.data.labels = pieData.regions;
      this.pieChart.data.datasets[0].data = pieData.productionValues;
      this.pieChart.update();
    } else if (this.productions.length > 0 && this.regionPieChart) {
      this.initPieChart();
    }
  }

  processChartData() {
    // Check if we have production data
    if (!this.productions || this.productions.length === 0) {
      return { dates: [], oilProduction: [] };
    }

    // Sort productions by date
    const sortedProductions = [...this.productions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group by date and sum oil production
    const productionByDate = sortedProductions.reduce((acc: any, curr) => {
      // Ensure date is properly formatted
      const date = typeof curr.date === 'string' ? curr.date.split('T')[0] : '';
      if (!date) return acc;
      
      if (!acc[date]) {
        acc[date] = 0;
      }
      // Ensure oil_production is a number
      const oilProduction = typeof curr.oil_production === 'number' ? curr.oil_production : 0;
      acc[date] += oilProduction;
      return acc;
    }, {});

    // Extract dates and oil production values
    const dates = Object.keys(productionByDate);
    const oilProduction = Object.values(productionByDate) as number[];

    // If we have too many dates, sample them to make the chart more readable
    if (dates.length > 30) {
      const step = Math.floor(dates.length / 30);
      const sampledDates = [];
      const sampledProduction = [];
      
      for (let i = 0; i < dates.length; i += step) {
        sampledDates.push(dates[i]);
        sampledProduction.push(oilProduction[i]);
      }
      
      return { dates: sampledDates, oilProduction: sampledProduction };
    }

    return { dates, oilProduction };
  }
  
  processPieChartData() {
    // Check if we have production data
    if (!this.productions || this.productions.length === 0) {
      return { regions: [], productionValues: [], backgroundColors: [] };
    }

    // Group productions by region and sum oil production
    const productionByRegion: {[key: string]: number} = {};
    
    // First, get all well IDs and their regions
    const wellRegions: {[key: number]: string} = {};
    this.wells.forEach(well => {
      wellRegions[well.id] = well.region;
    });
    
    // Group by region and sum oil production
    this.productions.forEach(prod => {
      const region = wellRegions[prod.well_id] || 'Unknown';
      if (!productionByRegion[region]) {
        productionByRegion[region] = 0;
      }
      productionByRegion[region] += prod.oil_production;
    });
    
    // Extract regions and production values
    const regions = Object.keys(productionByRegion);
    const productionValues = Object.values(productionByRegion) as number[];
    
    // Generate colors for each region
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',   // Red
      'rgba(54, 162, 235, 0.7)',   // Blue
      'rgba(255, 206, 86, 0.7)',   // Yellow
      'rgba(75, 192, 192, 0.7)',   // Green
      'rgba(153, 102, 255, 0.7)',  // Purple
      'rgba(255, 159, 64, 0.7)',   // Orange
      'rgba(199, 199, 199, 0.7)'   // Gray
    ];
    
    return { regions, productionValues, backgroundColors };
  }

  navigateToWells(): void {
    this.router.navigate(['/wells']);
  }

  navigateToMap(): void {
    this.router.navigate(['/map']);
  }
}
