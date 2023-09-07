import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { Router } from '@angular/router'
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  private rank: number;
  constructor(private router: Router, private renderer: Renderer2, private httpBackend: HttpService) {
    this.rank = 0;
  }

  @ViewChild('matchHistoryList') matchHistoryListElement: ElementRef;
  @ViewChild('leaderboardList') leaderboardListElement: ElementRef;
  @ViewChild('profilePic') profilePicElement: ElementRef;
  @ViewChild('login') loginElement: ElementRef;
  @ViewChild('statsWin') statsWinElement: ElementRef;
  @ViewChild('statsLose') statsLoseElement: ElementRef;
  @ViewChild('statsElo') statsEloElement: ElementRef;
  ngOnInit() {

    this.httpBackend.getProfile().subscribe(
      (response: any) => {
        if(this.statsWinElement)
        {
          this.statsWinElement.nativeElement.textContent = response.win;
        }
        if(this.statsLoseElement)
        {
          this.statsLoseElement.nativeElement.textContent = response.lose;
        }
        if(this.statsEloElement)
        {
          this.statsEloElement.nativeElement.textContent = response.elo;
        }
        if (this.loginElement) {
          this.loginElement.nativeElement.textContent = response.username;
        }
        if (this.profilePicElement) {
          this.profilePicElement.nativeElement.src = response.img;
        }

      },
      (error) => {
        console.error('no data', error);
      }
    );
  }
  ngAfterViewInit()
  {
    this.addGameToHistory(/*p1Img, p2Img, p1Score, p2Score, result*/);
    this.addGameToHistory(/*p1Img, p2Img, p1Score, p2Score, result*/);
    this.addGameToHistory(/*p1Img, p2Img, p1Score, p2Score, result*/);
    this.addGameToHistory(/*p1Img, p2Img, p1Score, p2Score, result*/);
    this.addGameToHistory(/*p1Img, p2Img, p1Score, p2Score, result*/);
    this.addGameToHistory(/*p1Img, p2Img, p1Score, p2Score, result*/);
    this.addGameToHistory(/*p1Img, p2Img, p1Score, p2Score, result*/);
    this.addPlayerToLeaderboard(/*playerImg, playerName, eloPoints*/);
    this.addPlayerToLeaderboard(/*playerImg, playerName, eloPoints*/);
    this.addPlayerToLeaderboard(/*playerImg, playerName, eloPoints*/);
    this.addPlayerToLeaderboard(/*playerImg, playerName, eloPoints*/);
    this.addPlayerToLeaderboard(/*playerImg, playerName, eloPoints*/);
    this.addPlayerToLeaderboard(/*playerImg, playerName, eloPoints*/);
    this.addPlayerToLeaderboard(/*playerImg, playerName, eloPoints*/);
    this.addPlayerToLeaderboard(/*playerImg, playerName, eloPoints*/);
    this.addPlayerToLeaderboard(/*playerImg, playerName, eloPoints*/);
    this.addPlayerToLeaderboard(/*playerImg, playerName, eloPoints*/);
    this.addPlayerToLeaderboard(/*playerImg, playerName, eloPoints*/);
  }

  /*ajoute une partie a la liste de parties, passer en parametre la data de la partie(score, qui a gagne et photos des joueurs)*/
  // faire des verifs selon les parametres pour mettre les bons noms de classe (win, lose, score-win, score-lose), pour que les couleurs et l'alignement soit bon
  addGameToHistory(/*p1Img, p2Img, p1Score, p2Score, result*/)
  {
    const newListItem = this.renderer.createElement('li');
    this.renderer.addClass(newListItem, 'match-history-list-elem');

    // Création de l'élément img 1
    const imgElement1 = this.renderer.createElement('img');
    this.renderer.addClass(imgElement1, 'match-history-small-img');
    this.renderer.setAttribute(imgElement1, 'src', 'assets/images/blevrel.jpeg');//p1Img a la place

    // Création de la div center-content 1
    const centerContentDiv1 = this.renderer.createElement('div');
    this.renderer.addClass(centerContentDiv1, 'center-content');

    const scoreElement1 = this.renderer.createElement('p');
    this.renderer.addClass(scoreElement1, 'score-win');
    const scoreText1 = this.renderer.createText('8');//p1Score a la place
    this.renderer.appendChild(scoreElement1, scoreText1);

    const hyphenElement = this.renderer.createElement('p');
    this.renderer.addClass(hyphenElement, 'hyphen');
    const hyphenText = this.renderer.createText(' - ');
    this.renderer.appendChild(hyphenElement, hyphenText);

    const scoreElement2 = this.renderer.createElement('p');
    this.renderer.addClass(scoreElement2, 'score-lose');
    const scoreText2 = this.renderer.createText('2');//p2Score a la place
    this.renderer.appendChild(scoreElement2, scoreText2);

    this.renderer.appendChild(centerContentDiv1, scoreElement1);
    this.renderer.appendChild(centerContentDiv1, hyphenElement);
    this.renderer.appendChild(centerContentDiv1, scoreElement2);

    // Création de l'élément img 2
    const imgElement2 = this.renderer.createElement('img');
    this.renderer.addClass(imgElement2, 'match-history-small-img');
    this.renderer.setAttribute(imgElement2, 'src', 'assets/images/blevrel.jpeg');//p2Img a la place

    // Création de la div center-content 2
    const centerContentDiv2 = this.renderer.createElement('div');
    this.renderer.addClass(centerContentDiv2, 'center-content');

    const winOrLoseElement = this.renderer.createElement('p');
    this.renderer.addClass(winOrLoseElement, 'win');
    const winOrLoseText = this.renderer.createText('WIN');//result a la place
    this.renderer.appendChild(winOrLoseElement, winOrLoseText);

    this.renderer.appendChild(centerContentDiv2, winOrLoseElement);

    this.renderer.appendChild(newListItem, imgElement1);
    this.renderer.appendChild(newListItem, centerContentDiv1);
    this.renderer.appendChild(newListItem, imgElement2);
    this.renderer.appendChild(newListItem, centerContentDiv2);

    this.renderer.appendChild(this.matchHistoryListElement.nativeElement, newListItem);
    console.log(newListItem);
  }

  /*meme chose que addGameToHistory*/
  /*Trier par ordre du classement des points*/
  addPlayerToLeaderboard(/*playerName, eloPoints*/)
  {
    ++this.rank;
    const newListItem = this.renderer.createElement('li');
    this.renderer.addClass(newListItem, 'leaderboard-list-elem');

    // Création de la div center-content 1
    const centerContentDiv = this.renderer.createElement('div');
    this.renderer.addClass(centerContentDiv, 'center-content');

    const rankElement = this.renderer.createElement('p');
    this.renderer.addClass(rankElement, 'rank');
    const rankText = this.renderer.createText(this.rank.toString());
    this.renderer.appendChild(rankElement, rankText);

    const loginElement = this.renderer.createElement('p');
    this.renderer.addClass(loginElement, 'login');
    const loginText = this.renderer.createText('login:');//playerName a la place
    this.renderer.appendChild(loginElement, loginText);

    const eloElement = this.renderer.createElement('p');
    this.renderer.addClass(eloElement, 'elo');
    const eloText = this.renderer.createText('100' + 'pts');//eloPoints a la place
    this.renderer.appendChild(eloElement, eloText);

    this.renderer.appendChild(centerContentDiv, rankElement);
    this.renderer.appendChild(centerContentDiv, loginElement);
    this.renderer.appendChild(centerContentDiv, eloElement);

    this.renderer.appendChild(newListItem, centerContentDiv);

    this.renderer.appendChild(this.leaderboardListElement.nativeElement, newListItem);
    console.log(newListItem);
  }

  navToProfileConfig() {
    this.router.navigate(['/profileConfig']);
  }
}
