import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EmployeeComponent } from './employee/employee.component';
import { AddComponent } from './employee/add/add.component';
import { DetailComponent } from './employee/detail/detail.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: '', component: EmployeeComponent },
  { path: '', component: AddComponent },
  { path: 'employee/:username', component: DetailComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
