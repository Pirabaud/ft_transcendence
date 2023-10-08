import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LoginHandlerComponent } from './components/login-handler/login-handler.component';
import { JwtInterceptor } from './http.interceptor';
import { GameComponent } from './components/game/game.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatLobbyComponent } from './components/chat/chat-lobby/chat-lobby.component';
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

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { CreateRoomComponent } from './components/chat/room_service/create-room/create-room.component';
import { JoinRoomComponent } from './components/chat/room_service/join-room/join-room.component';
import { KickComponent } from './components/chat/room_service/kick/kick.component';
import { BanComponent } from './components/chat/room_service/ban/ban.component';
import { MuteComponent } from './components/chat/room_service/mute/mute.component';
import { SetPasswordComponent } from './components/chat/room_service/set-password/set-password.component';

import { ClassicGameComponent } from './components/chat/user_service/classic-game/classic-game.component';
import { PortalGameComponent } from './components/chat/user_service/portal-game/portal-game.component';
import { AddAdminComponent } from './components/chat/room_service/add-admin/add-admin.component';
import { RemoveAdminComponent } from './components/chat/room_service/remove-admin/remove-admin.component';
import { UnbanComponent } from './components/chat/room_service/unban/unban.component';
import { UnmuteComponent } from './components/chat/room_service/unmute/unmute.component';

const config: SocketIoConfig = {url: 'http://localhost:3000/', options: {}};

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
    ChatLobbyComponent,
    CreateRoomComponent,
    JoinRoomComponent,
    KickComponent,
    BanComponent,
    MuteComponent,
    SetPasswordComponent,
    InvalidComponent,
    ClassicGameComponent,
    PortalGameComponent,
    AddAdminComponent,
    RemoveAdminComponent,
    UnbanComponent,
    UnmuteComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatSelectModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    // RouterModule.forRoot([]),
    FormsModule,
    MaterialModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
