import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Company {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://api.placeholder.com/v1/companies';

  getCompanies(): Observable<Company[]> {
    // Mock implementation
    const companies: Company[] = [
      { id: '1', name: 'Empresa Demo A' },
      { id: '2', name: 'Empresa Demo B' },
      { id: '3', name: 'Empresa Demo C' }
    ];
    return of(companies).pipe(delay(500));
  }
}
