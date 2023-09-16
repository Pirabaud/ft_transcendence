import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginHandlerComponent } from './components/login-handler/login-handler.component';
import { HttpService } from './http.service';
import { ChatComponent } from './components/chat/chat.component';
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
  { path: 'home', component: HomepageComponent, title: 'Home' },
  { path: 'login-handler', component: LoginHandlerComponent, title: 'Login-Handler' },
  { path: 'lobby', component: LobbyComponent, title: 'Lobby'},
  { path: 'chat', component: ChatComponent, title: 'Chat'},
  { path: 'profile', component: ProfileComponent, title: 'Profile'},
  { path: 'game/:id', component: GameComponent, title:'Game'},
  { path: 'two-factor', component: TwoFactorComponent, title: 'Two-Factor' },
  { path: 'two-factor-first-co', component: TwoFactorFirstCoComponent, title: 'Two-Factor' },
  { path: 'google', component: GoogleAuthenticatorComponent, title: 'Google Authenticator' },
  { path: 'profileConfig', component: ProfileConfigComponent, title:'Configure your profile'},
  { path: 'dsa', component: FriendsMenuTemporaryComponent, title:'temp'},
  { path: 'friendProfile/:id', component: FriendProfileComponent, title:'Profile'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [HttpService]
})
export class AppRoutingModule { }
