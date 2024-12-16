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
import { TransactionService } from '../../services/transaction.service';

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
    private snackBar: MatSnackBar,
    private transactionService: TransactionService
  ) { }

  ngOnInit() {
    this.loading = true;

    this.transactionService.getTransactions(localStorage.getItem('email') || '')
      .subscribe(
        transactions => {
          this.originalData = transactions;
          this.dataSource = new MatTableDataSource(transactions);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
        }
      );

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
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
        switch (selectedDateRange) {
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
      data: { email: localStorage.getItem('email') || '' }
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
        email: localStorage.getItem('email') || '',
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
      this.transactionService.deleteTransaction(entryId, localStorage.getItem('email') || '')
        .subscribe(() => {
          this.originalData = this.originalData.filter(e => e._id !== entryId);

          this.snackBar.open('Entry deleted successfully', 'Close', {
            duration: 3000
          });

          this.applyFilters();
        });


    }
  }
}