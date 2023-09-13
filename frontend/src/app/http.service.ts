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
    uploadFile(fileName: string): Observable<any> {
      return this.http.post<any>("http://localhost:3000/database/fileUpload", { fileName });
    }
    saveNewUsername(username: string): Observable<any>
    {
      return this.http.post<any>("http://localhost:3000/user/saveUsername", { username })
    }
    /*return the list of all the profiles in the database*/
    checkDoubleUsername(username: string): Observable<any>
    {
      return this.http.post<any>("http://localhost:3000/database/doubleUsername", { username });
    }
    fetchDbUsers(): Observable<any> {
      return this.http.get<any>("http://localhost:3000/database/users");
    }

    getMatchesHistory(): Observable<any> {
      return this.http.get<any>("http://localhost:3000/matches/history");
    }

    getLeaderBoard(): Observable<any> {
      return this.http.get<any>("http://localhost:3000/user/leaderboard")
    }
}
