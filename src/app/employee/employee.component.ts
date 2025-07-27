import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface Employee {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: number;
  status: string;
  group: string;
  description: Date;
}

@Component({
  selector: 'app-employee',
  standalone: false,
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  allEmployees: any[] = [];
  page = 1;
  pageSize = 10;
  pageSizes = [5, 10, 20, 50];
  totalPages = 1;

  sortColumn = 'username';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchUsername = '';
  searchFirstName = '';
  

  notification = '';
  notificationType: 'edit' | 'delete' | '' = '';
  notificationTimeout: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.generateDummyData(100);
    this.applyFilters();

    this.route.queryParams.subscribe((params) => {
      this.searchUsername = params['name'] || '';
      this.searchFirstName = params['first'] || '';
    });
  }

  goToDetail(emp: any) {
    this.router.navigate(['/employee', emp.username], {
      queryParams: { name: this.searchUsername, firstname: this.searchFirstName },
      state: { employee: emp },
    });
  }

  generateDummyData(count: number) {
    const statuses = ['Active', 'Inactive'];
    const groups = ['Admin', 'User', 'Manager'];
    for (let i = 1; i <= count; i++) {
      this.employees.push({
        username: `user${i}`,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        email: `user${i}@example.com`,
        birthDate: new Date(1990, i % 12, (i % 28) + 1),
        basicSalary: 3000000 + i * 100,
        status: statuses[i % statuses.length],
        group: groups[i % groups.length],
        description: new Date(),
      });
    }
  }

  applyFilters() {
    let filtered = this.employees.filter(
      (e) =>
        e.username.toLowerCase().includes(this.searchUsername.toLowerCase()) &&
        e.firstName.toLowerCase().includes(this.searchFirstName.toLowerCase())
    );

    filtered.sort((a, b) => {
      let valA = (a as any)[this.sortColumn];
      let valB = (b as any)[this.sortColumn];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredEmployees = filtered;
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    if (this.page > this.totalPages) this.page = this.totalPages || 1;
  }

  changePage(page: number) {
    if (page < 1) return;
    if (page > this.totalPages) return;
    this.page = page;
  }

  changeSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  onSearchChange() {
    this.page = 1;
    this.applyFilters();
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.page = 1;
    this.applyFilters();
  }

  onEdit(employee: Employee) {
    this.showNotification(`Edit clicked for ${employee.username}`, 'edit');
  }

  onDelete(employee: Employee) {
    this.showNotification(`Delete clicked for ${employee.username}`, 'delete');
  }

  showNotification(message: string, type: 'edit' | 'delete') {
    this.notification = message;
    this.notificationType = type;
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => {
      this.notification = '';
      this.notificationType = '';
    }, 3000);
  }

  get pagedEmployees() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }
}
