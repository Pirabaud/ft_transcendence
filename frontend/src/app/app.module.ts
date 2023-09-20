import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

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
import { ProfileConfigComponent } from './components/profile-config/profile-config.component';
import { FriendsMenuTemporaryComponent } from './components/friends-menu-temporary/friends-menu-temporary.component';
import { FriendProfileComponent } from './components/friend-profile/friend-profile.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

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
    ProfileConfigComponent,
    FriendsMenuTemporaryComponent,
    FriendProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
