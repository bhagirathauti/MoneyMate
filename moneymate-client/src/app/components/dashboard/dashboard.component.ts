import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewEntryDialogComponent } from '../new-entry-dialog/new-entry-dialog.component';
import { Transaction } from '../../models/transaction.model';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { EditEntryDialogComponent } from '../edit-entry-dialog/edit-entry-dialog.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    MatIcon, MatPaginator, MatSort, MatProgressSpinner, 
    MatCard, MatCardContent, MatTableModule, CommonModule, 
    MatButton, ReactiveFormsModule, MatFormFieldModule, 
    MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatInputModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['category', 'amount', 'date', 'description', 'actions'];
  
  dataSource!: MatTableDataSource<Transaction>;
  loading = false;
  errorMessage = '';

  private originalData: Transaction[] = [];

  filterForm = new FormGroup({
    category: new FormControl(''),
    dateRange: new FormControl('')
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  categories = [
    'Groceries', 'Utilities', 'Entertainment', 
    'Dining', 'Transportation', 'Other'
  ];

  dateRangeOptions = [
    { value: 'last_day', label: 'Last 24 Hours' },
    { value: 'last_week', label: 'Last 7 Days' },
    { value: 'last_month', label: 'Last 30 Days' }
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const ELEMENT_DATA: Transaction[] = [
      {_id: '1', category: 'Groceries', amount: 54.75, date: new Date('2024-12-15'), description: 'Weekly grocery shopping'},
      {_id: '2', category: 'Utilities', amount: 120.50, date: new Date('2024-01-10'), description: 'Electricity bill'},
      {_id: '3', category: 'Entertainment', amount: 35.20, date: new Date('2024-01-20'), description: 'Movie night'},
      {_id: '4', category: 'Dining', amount: 45.60, date: new Date('2024-01-22'), description: 'Restaurant dinner'},
      {_id: '5', category: 'Transportation', amount: 25.30, date: new Date('2024-01-05'), description: 'Uber ride'},
      {_id: '6', category: 'Groceries', amount: 42.15, date: new Date('2024-01-25'), description: 'Grocery run'}
    ];
    
    this.originalData = ELEMENT_DATA;
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    let filteredData = [...this.originalData];

    const selectedCategory = this.filterForm.get('category')?.value;
    if (selectedCategory) {
      filteredData = filteredData.filter(transaction => 
        transaction.category === selectedCategory
      );
    }

    const selectedDateRange = this.filterForm.get('dateRange')?.value;
    if (selectedDateRange) {
      const now = new Date();
      filteredData = filteredData.filter(transaction => {
        switch(selectedDateRange) {
          case 'last_day':
            return this.isWithinLastDay(transaction.date, now);
          case 'last_week':
            return this.isWithinLastWeek(transaction.date, now);
          case 'last_month':
            return this.isWithinLastMonth(transaction.date, now);
          default:
            return true;
        }
      });
    }

    this.dataSource.data = filteredData;
  }

  isWithinLastDay(transactionDate: Date, currentDate: Date): boolean {
    const oneDayAgo = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
    return transactionDate >= oneDayAgo;
  }

  isWithinLastWeek(transactionDate: Date, currentDate: Date): boolean {
    const oneWeekAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
    return transactionDate >= oneWeekAgo;
  }

  isWithinLastMonth(transactionDate: Date, currentDate: Date): boolean {
    const oneMonthAgo = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
    return transactionDate >= oneMonthAgo;
  }

  
  addEntry() {
    const dialogRef = this.dialog.open(NewEntryDialogComponent, {
      width: '500px',
      data: { email: 'user@example.com' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Entry added successfully', 'Close', { 
          duration: 3000 
        });
        this.originalData = [...this.originalData, result];
        this.applyFilters(); 
      }
    });
  }

  editEntry(entry: any) {
    const dialogRef = this.dialog.open(EditEntryDialogComponent, {
      width: '500px',
      data: { 
        email: 'user@example.com',
        entry: entry
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.originalData.findIndex(e => e._id === result._id);
        if (index !== -1) {
          const updatedData = [...this.originalData];
          updatedData[index] = result;
          this.originalData = updatedData;
          
          this.snackBar.open('Entry updated successfully', 'Close', { 
            duration: 3000 
          });
          
          this.applyFilters(); 
        }
      }
    });
  }

  deleteEntry(entryId: string) {
    const confirmDelete = confirm('Are you sure you want to delete this entry?');
    if (confirmDelete) {
      this.originalData = this.originalData.filter(e => e._id !== entryId);
      
      this.snackBar.open('Entry deleted successfully', 'Close', { 
        duration: 3000 
      });

      this.applyFilters(); 
    }
  }
}