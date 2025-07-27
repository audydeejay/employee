import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Employee {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  basicSalary: number;
  status: string;
  group: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private data: Employee[] = [];

  constructor() {
    this.generateDummy();
  }

  private generateDummy() {
    for (let i = 1; i <= 100; i++) {
      this.data.push({
        username: `user${i}`,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        email: `user${i}@example.com`,
        birthDate: new Date(
          1980 + (i % 40),
          i % 12,
          (i % 28) + 1
        ).toISOString(),
        basicSalary: parseFloat((3000 + i * 10).toFixed(2)),
        status: i % 2 === 0 ? 'Active' : 'Inactive',
        group: ['A', 'B', 'C'][i % 3],
        description: `Joined at ${new Date().toISOString()}`,
      });
    }
  }

  fetch(params: {
    page: number;
    pageSize: number;
    sortField?: keyof Employee;
    sortDirection?: 'asc' | 'desc';
    filter?: { username?: string; firstName?: string };
  }): Observable<{ items: Employee[]; total: number }> {
    let filtered = [...this.data];
    const f = params.filter;
    if (f) {
      if (f?.username)
        filtered = filtered.filter((e) =>
          e.username.toLowerCase().includes(f.username!.toLowerCase())
        );
      if (f?.firstName)
        filtered = filtered.filter((e) =>
          e.firstName.toLowerCase().includes(f.firstName!.toLowerCase())
        );
    }
    if (params.sortField) {
      filtered.sort((a, b) => {
        const fa = (a[params.sortField!] ?? '').toString().toLowerCase();
        const fb = (b[params.sortField!] ?? '').toString().toLowerCase();
        if (fa < fb) return params.sortDirection === 'asc' ? -1 : 1;
        if (fa > fb) return params.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    const total = filtered.length;
    const start = (params.page - 1) * params.pageSize;
    const items = filtered.slice(start, start + params.pageSize);
    return of({ items, total });
  }
}
