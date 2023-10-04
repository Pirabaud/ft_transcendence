import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpService {
    constructor(private http: HttpClient){}

    getjwt(code: string): Observable<any> {
        return this.http.post<any>("http://localhost:3000/auth/login", {code});
    }
    getProfile(): Observable<any> {
        return this.http.get<any>("http://localhost:3000/user/profile");
    }
    setTfaTrue(): Observable<any> {
       return this.http.get<any>("http://localhost:3000/user/setTfaTrue");
    }
    setTfaFalse(): Observable<any> {
        return this.http.get<any>("http://localhost:3000/user/setTfaFalse");
     }
    getTfaStatus(): Observable<Boolean> {
        return this.http.get<boolean>("http://localhost:3000/user/getTfa");
    }
    generate2fa(): Observable<any> {
        return this.http.get<any>("http://localhost:3000/auth/generateTfa");
    }
    postGoogle(Google: any): Observable<any> {
        return this.http.post<any>("http://localhost:3000/user/changeGoogle", Google);
    }
    getQRcode(): Observable<any> {
        return this.http.get<any>("http://localhost:3000/user/getQRcode");
    }
    getSecret(): Observable<any> {
        return this.http.get<any>("http://localhost:3000/user/getSecret");
    }
    verify2fa(obj: any): Observable<any> {
        return this.http.post<any>("http://localhost:3000/auth/verify-2fa", obj);
    }
    getProfileById(id: string): Observable<any> {
    return this.http.post<any>("http://localhost:3000/user/profileById", { id });
    }
    getFriendRequests(): Observable<any> {
        return this.http.get<any>("http://localhost:3000/friendRequest/friendRequests");
    }
    uploadFile(url: string): Observable<any> {
      return this.http.post<any>("http://localhost:3000/user/changePic", { url });
    }
    saveNewUsername(username: string): Observable<any>
    {
      return this.http.post<any>("http://localhost:3000/user/saveUsername", { username })
    }
    checkDoubleUsername(username: string): Observable<any>
    {
      return this.http.post<any>("http://localhost:3000/user/doubleUsername", { username });
    }
    checkUserExists(username: string): Observable<any>
    {
     return this.http.post<any>("http://localhost:3000/user/userExists", { username });
    }
    checkIdExists(id: string): Observable<any>
    {
     return this.http.post<any>("http://localhost:3000/user/idExists", { id });
    }

    checkValidUrl(url: string): Observable<any>
    {
        return this.http.get('http://localhost:3000/proxy?url=' + url);
    }
    createFriendRequest(username: string): Observable<any>
    {
     return this.http.post<any>("http://localhost:3000/friendRequest/createFR", { username });
    }
    getUsernameWithId(id: number): Observable<any>
    {
      return this.http.post<any>("http://localhost:3000/friendRequest/usernameWithId", { id });
    }
    getIdWithUsername(username: string): Observable<any>
    {
     return this.http.post<any>("http://localhost:3000/friendRequest/idWithUsername", { username });
    }
    updateUserStatus(status: string): Observable<any>
    {
      return this.http.post<any>("http://localhost:3000/user/updateStatus", { status });
    }
    getUserStatus()
    {
      return this.http.get<{status: string}>("http://localhost:3000/user/updateStatus");
    }
    acceptFriendRequest(senderId: number): Observable<any>
    {
      return this.http.post<any>("http://localhost:3000/friendRequest/acceptFR", { senderId });
    }
    refuseFriendRequest(senderId: number): Observable<any>
    {
     return this.http.post<any>("http://localhost:3000/friendRequest/refuseFR", { senderId })
    }
    removeFriend(id: string): Observable<any>
    {
      return this.http.post<any>("http://localhost:3000/user/removeFriend", { id })
    }
    getMatchesHistory(): Observable<any> {
      return this.http.get<any>("http://localhost:3000/matches/history");
    }
    getMatchesHistoryById(id: string): Observable<any> {
        return this.http.post<any>("http://localhost:3000/matches/historyById", { id });
    }
    getLeaderBoard(): Observable<any> {
      return this.http.get<any>("http://localhost:3000/user/leaderboard");
    }
    getGameStatus(): Observable<{gameStatus: number}> {
      return this.http.get<{gameStatus: number}>("http://localhost:3000/user/gameStatus");
    }
    setGameStatus(status: number): Observable<any> {
      return this.http.post<any>("http://localhost:3000/user/gameStatus", { status });
    }
    getCurrentGameId(): Observable<{currentGameId: string}> {
      return this.http.get<{currentGameId: string}>("http://localhost:3000/user/currentGameId");
    }
    setCurrentGameId(gameId: string): Observable<any> {
      return this.http.post<any>("http://localhost:3000/user/currentGameId", { gameId });
    }
    getCurrentOpponentId(): Observable<{currentOpponentId: string}> {
      return this.http.get<{currentOpponentId: string}>("http://localhost:3000/user/currentOpponentId");
    }
    setCurrentOpponentId(gameId: string): Observable<any> {
      return this.http.post<any>("http://localhost:3000/user/currentOpponentId", { gameId });
    }
    getUsername(): Observable<any> {
      return this.http.get<any>("http://localhost:3000/user/getUsername");
    }
}
