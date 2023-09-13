import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpService {
    constructor(private http: HttpClient){}

    sendAuthorizationCode(code: string): Observable<Boolean> {
        return this.http.post<boolean>("http://localhost:3000/auth/signin", {code});
    }
    getjwt(code: string): Observable<any> {
        return this.http.post<any>("http://localhost:3000/auth/login", {code});
    }
    getProfile(): Observable<any> {
        return this.http.get<any>("http://localhost:3000/user/profile");
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
    createFriendRequest(username: string): Observable<any>
    {
     return this.http.post<any>("http://localhost:3000/friendRequest/createFR", { username });
    }
    getUsernameWithId(id: number): Observable<any>
    {
      return this.http.post<any>("http://localhost:3000/friendRequest/usernameWithId", { id })
    }
    getIdWithUsername(username: string): Observable<any>
    {
     return this.http.post<any>("http://localhost:3000/friendRequest/idWithUsername", { username })
    }
    acceptFriendRequest(senderId: number): Observable<any>
    {
      return this.http.post<any>("http://localhost:3000/friendRequest/acceptFR", { senderId })
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

    getLeaderBoard(): Observable<any> {
      return this.http.get<any>("http://localhost:3000/user/leaderboard")
    }
}
