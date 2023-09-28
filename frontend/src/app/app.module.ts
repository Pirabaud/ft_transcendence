import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LoginHandlerComponent } from './components/login-handler/login-handler.component';
import { JwtInterceptor } from './http.interceptor';
import { GameComponent } from './components/game/game.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { ChatComponent } from './components/chat/chat.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { TwoFactorComponent } from './components/two-factor/two-factor.component';
import { GoogleAuthenticatorComponent } from './components/google-authenticator/google-authenticator.component';
import { ProfileConfigComponent } from './components/profile-config/profile-config.component';
import { FriendsMenuComponent } from './components/friends-menu/friends-menu.component';
import { FriendProfileComponent } from './components/friend-profile/friend-profile.component'
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { TwoFactorFirstCoComponent } from './components/two-factor-first-co/two-factor-first-co.component';
import {MaterialModule} from "./material/material.module";
import { InvalidComponent } from './components/invalid/invalid.component';

@NgModule({
  declarations: [
    AppComponent,
    AppComponent,
    GameComponent,
    LobbyComponent,
    ChatComponent,
    NavbarComponent,
    ProfileComponent,
    HomepageComponent,
    LoginComponent,
    LoginHandlerComponent,
    TwoFactorComponent,
    GoogleAuthenticatorComponent,
    ProfileConfigComponent,
    FriendsMenuComponent,
    FriendProfileComponent,
    TwoFactorFirstCoComponent,
    InvalidComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSlideToggleModule,
    FormsModule,
    MaterialModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
