import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './comps/navbar/navbar.component';
import { HomeComponent } from './comps/home/home.component';
import { LoginComponent } from './comps/auth/login/login.component';
import { RegisterComponent } from './comps/auth/register/register.component';
import { ImagesComponent } from './comps/images/images.component';

import { HttpClientModule } from "@angular/common/http";
import { BottomDirective } from './directives/bottom.directive';
import { SearchComponent } from './comps/search/search.component';
import { NotFoundComponent } from './comps/not-found/not-found.component';
import { SearchInputComponent } from './comps/forms/search-input/search-input.component';
import { ImageComponent } from './comps/images/image/image.component';
import { AuthService } from './services/auth.service';
import { UserComponent } from './comps/user/user.component';
import { ModalComponent } from './comps/images/modal/modal.component';
import { ImageService } from './services/image.service';
import { UploadComponent } from './comps/upload/upload.component';
import { SettingsComponent } from './comps/settings/settings.component';
import { ResetComponent } from './comps/reset/reset.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ImagesComponent,
    BottomDirective,
    SearchComponent,
    NotFoundComponent,
    SearchInputComponent,
    ImageComponent,
    UserComponent,
    ModalComponent,
    UploadComponent,
    SettingsComponent,
    ResetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, ImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
