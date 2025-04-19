import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
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
import { RouterModule } from '@angular/router';
import { ProductionService } from '../../services/production.service';
import { WellService } from '../../services/well.service';
import { Production } from '../../models/production.model';
import { Well } from '../../models/well.model';

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
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss']
})
export class ProductionComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  productions: Production[] = [];
  wells: Well[] = [];
  filterForm!: FormGroup;
  isLoading = true;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['date', 'well_id', 'oil_production', 'gas_production', 'water_production'];

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
    // Initial setup of sorting and pagination
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      // Set up custom sorting for date and numeric columns
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'date': 
            return new Date(item.date).getTime();
          case 'oil_production':
          case 'gas_production':
          case 'water_production':
            return Number(item[property]);
          default: 
            return item[property];
        }
      };
      
      // Set default sort to date descending
      this.sort.sort({
        id: 'date',
        start: 'desc',
        disableClear: false
      });
    });
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
            this.dataSource = new MatTableDataSource(this.productions);
            
            // Re-apply sorting and pagination after data changes
            setTimeout(() => {
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              
              // Set up custom sorting for date and numeric columns
              this.dataSource.sortingDataAccessor = (item, property) => {
                switch(property) {
                  case 'date': 
                    return new Date(item.date).getTime();
                  case 'oil_production':
                  case 'gas_production':
                  case 'water_production':
                    return Number(item[property]);
                  default: 
                    return item[property];
                }
              };
            });
            
            this.isLoading = false;
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
        this.dataSource = new MatTableDataSource(this.productions);
        
        // Re-apply sorting and pagination after filtering
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          
          // Set up custom sorting for date and numeric columns
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch(property) {
              case 'date': 
                return new Date(item.date).getTime();
              case 'oil_production':
              case 'gas_production':
              case 'water_production':
                return Number(item[property]);
              default: 
                return item[property];
            }
          };
        });
        
        this.isLoading = false;
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
}
