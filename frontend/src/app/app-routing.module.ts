import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginHandlerComponent } from './components/login-handler/login-handler.component';
import { HttpService } from './http.service';
import { ChatComponent } from './components/chat/chat.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { GameComponent } from './components/game/game.component';

const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: 'home', component: HomepageComponent, title: 'Home' },
  { path: 'login-handler', component: LoginHandlerComponent, title: 'Login-Handler' },
  { path: 'lobby', component: LobbyComponent, title: 'lobby'},
  { path: 'chat', component: ChatComponent, title: 'chat'},
  { path: 'game/:id', component: GameComponent, title:'game'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [HttpService]
})
export class AppRoutingModule { }
