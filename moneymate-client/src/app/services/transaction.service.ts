import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `http://localhost:5000/api/transaction`;

  constructor(private http: HttpClient) {}

  addTransaction(email: string, category: string, amount: number, description: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-transaction`, { email, category, amount, description }).pipe(
      catchError(this.handleError)
    );
  }

  getTransactions(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-transactions/${email}`).pipe(
      catchError(this.handleError)
    );
  }

  editTransaction(id: string, category: string, amount: number, description: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/edit-transaction/${id}`, { category, amount, description }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTransaction(id: string, email: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-transaction/${id}`, {
      body: { email }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      console.error(error);
      errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}