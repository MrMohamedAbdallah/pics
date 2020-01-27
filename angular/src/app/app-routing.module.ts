import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './comps/home/home.component';
import { LoginComponent } from './comps/auth/login/login.component';
import { RegisterComponent } from './comps/auth/register/register.component';
import { NotFoundComponent } from './comps/not-found/not-found.component';
import { SearchComponent } from './comps/search/search.component';
import { UserComponent } from './comps/user/user.component';
import { IsAuthGuard } from './guards/is-auth.guard';
import { IsNotAuthGuard } from './guards/is-not-auth.guard';


const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent, canActivate: [IsNotAuthGuard]},
  {path: "register", component: RegisterComponent, canActivate: [IsNotAuthGuard]},
  {path: "search/:query", component: SearchComponent},
  {path: "user/:id", component: UserComponent},
  {path: "404", component: NotFoundComponent},
  {path: "**", redirectTo: "404"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
