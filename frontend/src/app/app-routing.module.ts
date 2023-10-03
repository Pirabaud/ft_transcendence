import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthGoogleGuard } from './authGoogle.guard';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginHandlerComponent } from './components/login-handler/login-handler.component';
import { HttpService } from './http.service';
import { ChatComponent } from './components/chat/chat.component';
import { ChatLobbyComponent } from './components/chat/chat-lobby/chat-lobby.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { GameComponent } from './components/game/game.component';
import {ProfileComponent} from "./components/profile/profile.component";
import { TwoFactorComponent } from './components/two-factor/two-factor.component';
import { TwoFactorFirstCoComponent } from './components/two-factor-first-co/two-factor-first-co.component';
import { GoogleAuthenticatorComponent } from './components/google-authenticator/google-authenticator.component';
import {ProfileConfigComponent} from "./components/profile-config/profile-config.component";
import {FriendsMenuTemporaryComponent} from "./components/friends-menu-temporary/friends-menu-temporary.component";
import {FriendProfileComponent} from "./components/friend-profile/friend-profile.component";
import {NavbarComponent} from "./components/navbar/navbar.component";

const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'login-handler', component: LoginHandlerComponent, title: 'Login-Handler' },
  { path: 'home', component: HomepageComponent, canActivate: [AuthGuard], title: 'Home' },
  { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard], title: 'Lobby'},
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard], title: 'Chat'},
  { path: 'chat-lobby', component: ChatLobbyComponent, canActivate: [AuthGuard], title: 'Chat-lobby'},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], title: 'Profile'},
  { path: 'game/:id', component: GameComponent, canActivate: [AuthGuard], title:'Game'},
  { path: 'two-factor', component: TwoFactorComponent, canActivate: [AuthGuard], title: 'Two-Factor' },
  { path: 'two-factor-first-co', component: TwoFactorFirstCoComponent, canActivate: [AuthGuard], title: 'Two-Factor' },
  { path: 'google', component: GoogleAuthenticatorComponent, canActivate: [AuthGoogleGuard], title: 'Google Authenticator' },
  { path: 'profileConfig', component: ProfileConfigComponent, canActivate: [AuthGuard], title:'Configure your profile'},
  { path: 'dsa', component: FriendsMenuTemporaryComponent, canActivate: [AuthGuard], title:'temp'},
  { path: 'friendProfile/:id', component: FriendProfileComponent, canActivate: [AuthGuard], title:'Profile'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [HttpService, AuthGuard, AuthGoogleGuard]
})
export class AppRoutingModule { }
