import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  employee: any;
  queryParams: any = {};

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const nav = history.state;
    this.employee = nav.employee;
    this.queryParams = this.route.snapshot.queryParams;

    if (!this.employee) {
      alert('No employee data found!');
      this.router.navigate(['/']);
    }
  }

  formatSalary(salary: number): string {
    return (
      'Rp. ' +
      salary
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')
        .replace('.', ',')
    );
  }

  back() {
    this.router.navigate(['/home'], { queryParams: this.queryParams });
  }
}
