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
    getQRcode(): Observable<any> {
        return this.http.get<any>("http://localhost:3000/user/getQRcode");
    }
    postGoogle(Google: any): Observable<any> {
        return this.http.post<any>("http://localhost:3000/user/changeGoogle", Google);
    }
}
