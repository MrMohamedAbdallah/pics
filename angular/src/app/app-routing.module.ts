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
import { UploadComponent } from './comps/upload/upload.component';
import { SettingsComponent } from './comps/settings/settings.component';
import { ResetComponent } from './comps/reset/reset.component';


const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent, canActivate: [IsNotAuthGuard]},
  {path: "register", component: RegisterComponent, canActivate: [IsNotAuthGuard]},
  {path: "search/:query", component: SearchComponent},
  {path: "user/:id", component: UserComponent},
  {path: "upload", component: UploadComponent, canActivate: [IsAuthGuard]},
  {path: "settings", component: SettingsComponent, canActivate: [IsAuthGuard]},
  {path: "change-password", component: ResetComponent, canActivate: [IsAuthGuard]},
  {path: "404", component: NotFoundComponent},
  {path: "**", redirectTo: "404"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
