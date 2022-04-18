import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User, UserResp } from '@app/models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userSubject: BehaviorSubject<UserResp>;
    public user: Observable<UserResp>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<UserResp>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): UserResp {
        return this.userSubject.value;
    }

    login(username, password) {
        return this.http.post<UserResp>(`${environment.apiUrl}/login`, { email:username, password:password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                console.log("user", user)
                this.userSubject.next(user);
                return user;
            }));
    }

    addUser(name, contact, email, address, company, password) {
        return this.http.post<UserResp>(`${environment.apiUrl}/add_user`, { name:name, email:email, contact:contact, address:address, company:company, password:password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }
}