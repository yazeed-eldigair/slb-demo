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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { ProductionService } from '../../services/production.service';
import { WellService } from '../../services/well.service';
import { Production } from '../../models/production.model';
import { Well } from '../../models/well.model';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-production',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss']
})
export class ProductionComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('productionChart') productionChart: any;

  productions: Production[] = [];
  wells: Well[] = [];
  filterForm!: FormGroup;
  isLoading = true;
  chart: any;

  // Table configuration
  displayedColumns: string[] = ['date', 'well_id', 'oil_production', 'gas_production', 'water_production'];
  dataSource: any;

  constructor(
    private productionService: ProductionService,
    private wellService: WellService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.productionChart && this.productions.length > 0) {
      this.initChart();
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
    
    // Load wells for the filter dropdown
    this.wellService.getWells().subscribe({
      next: (wells) => {
        this.wells = wells;
        
        // Load production data
        this.productionService.getProductions().subscribe({
          next: (productions) => {
            this.productions = productions;
            this.dataSource = this.productions;
            
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
            
            if (this.sort) {
              this.dataSource.sort = this.sort;
            }
            
            this.isLoading = false;
            
            if (this.productionChart) {
              this.initChart();
            }
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
        this.dataSource = this.productions;
        
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        
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
    if (!this.productionChart || !this.productionChart.nativeElement) {
      return;
    }

    const ctx = this.productionChart.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    // Process data for chart
    const chartData = this.processChartData();

    // Create chart using Chart.js
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.dates,
        datasets: [
          {
            label: 'Oil Production (barrels)',
            data: chartData.oilProduction,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
            fill: true
          },
          {
            label: 'Gas Production (cubic feet)',
            data: chartData.gasProduction,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1,
            fill: true
          },
          {
            label: 'Water Production (barrels)',
            data: chartData.waterProduction,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
            text: 'Production Trends'
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
              text: 'Production'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  updateChart(): void {
    if (this.chart) {
      const chartData = this.processChartData();
      this.chart.data.labels = chartData.dates;
      this.chart.data.datasets[0].data = chartData.oilProduction;
      this.chart.data.datasets[1].data = chartData.gasProduction;
      this.chart.data.datasets[2].data = chartData.waterProduction;
      this.chart.update();
    } else {
      this.initChart();
    }
  }

  processChartData() {
    // Group by date
    const productionByDate: any = {};
    
    this.productions.forEach(prod => {
      const date = typeof prod.date === 'string' ? prod.date.split('T')[0] : prod.date;
      
      if (!productionByDate[date]) {
        productionByDate[date] = {
          oil: 0,
          gas: 0,
          water: 0,
          count: 0
        };
      }
      
      productionByDate[date].oil += prod.oil_production;
      productionByDate[date].gas += prod.gas_production;
      productionByDate[date].water += prod.water_production;
      productionByDate[date].count += 1;
    });
    
    // Sort dates
    const sortedDates = Object.keys(productionByDate).sort();
    
    // Calculate averages
    const oilProduction = sortedDates.map(date => productionByDate[date].oil);
    const gasProduction = sortedDates.map(date => productionByDate[date].gas);
    const waterProduction = sortedDates.map(date => productionByDate[date].water);
    
    return {
      dates: sortedDates,
      oilProduction,
      gasProduction,
      waterProduction
    };
  }
}
