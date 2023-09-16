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
import { FriendsMenuTemporaryComponent } from './components/friends-menu-temporary/friends-menu-temporary.component';
import { FriendProfileComponent } from './components/friend-profile/friend-profile.component';

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
    FriendsMenuTemporaryComponent,
    FriendProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSlideToggleModule,
    FormsModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
