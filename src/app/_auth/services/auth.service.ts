import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError, of, BehaviorSubject } from 'rxjs';
import { map, mergeMap, switchMap, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserModel } from '../models/user.model';
import { DatePipe } from '@angular/common';
import { fakeAsync } from '@angular/core/testing';
import { v4 as uuid } from 'uuid';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = new BehaviorSubject(false);
  role: string = null;
  onLogin  = new Subject<any>(); // deprecated
  onLogout  = new Subject<any>(); // deprecated

  private token: string  = null;
  private userData: UserModel = null;
  private loginStatus: boolean = false; 
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
    withCredentials: true, 
    observe: 'response' as 'response'
  }

  constructor(
    private http: HttpClient, private cookieService: CookieService,
  ) {
    // try and find out if there was a localstorage token was set
    this.resolveToken();
  }

  validateTokenOnServer() {
    return this.http.get(environment['apiBaseUrl'] + '/api/auth/validate-token')
      .pipe(
        map(data => {
            return data['user'] ? data['user'] : false;
          }
        ),
        tap((status) => { if (status) { this.userData  = status['user']; } }),
        tap((status) => { if (!status) { this.isLoggedIn.next(false); } }),
        catchError(err => {
          return of(false);
        }),
      );
  }

  // check if cookie token was set
  // if so, set the token in the service
  // and set the login status
  resolveToken(): boolean {
    // this.token = localStorage.getItem('token');
    this.token = this.cookieService.get('session_token');
    if(this.token == null){
      this.isLoggedIn.next(false);
    }
    else{
      this.isLoggedIn.next(this.token ?  true : false);
      return this.token ? true : false;
    }   
  }

  getToken(): boolean {
    if (this.cookieService.get('JSESSION')) {
      return true; 
    }
    return false; 
    // if(this.cookieService.get('session_token') == null){
    //   console.log("can't get token")
    //   return null;
    // }
    // return this.cookieService.get('session_token');
  }

  getLoginStatus(): boolean {
    
    return this.loginStatus; 
  }

  hasToken(): boolean  {
    return this.getToken();
  }

  async logout() {
    return this.http.get(environment['apiBaseUrl'] + '/api/user/logout').toPromise().then(
      () => {
        
        // clear any current data
        this.clearData();
        this.isLoggedIn.next(false);
        return true;
      },
      (err) => {
        return false;
      }
    );
  }

  async login({ username , password }): Promise<any>  {
    // clear some data
    this.clearData();
    // create the payload data for the api request
    const loginData  = {
      'email' : username,
      'password' : password
    };

    const data  = await this.http.post(environment['apiBaseUrl'] + '/api/user/login' , loginData, this.httpOptions).toPromise();
    console.log(data)
    // this part only gets executed when the promise is resolved
    if (data != null) {
       var currentDate = new Date();
      var expiration = new Date(currentDate.getTime()+5*60000);
      this.cookieService.put('JSESSION', uuid(), {secure: true, sameSite: "lax", expires: expiration})
      this.isLoggedIn.next(true);
      this.loginStatus = true;
      return true;
    } else {
      return false;
    }
  }

  refreshToken() {
    if(this.cookieService.get('JSESSION') == null){
      return
    }
    var refresh; 
    var currentDate = new Date();
    var expiration = new Date(currentDate.getTime()+5*60000);
    this.cookieService.remove('JSESSION')
    this.cookieService.put('JSESSION', uuid(), {secure: true, sameSite: "strict", expires: expiration});
    this.isLoggedIn.next(true);
  }

  clearData() {
    this.userData  = null;
    this.token  = null;
    localStorage.clear();
    this.cookieService.removeAll();
  }

  getUserData(): UserModel {
    return this.userData;
  }

  getUserRole() {
    const data = this.http.get(environment['apiBaseUrl'] + '/api/user/me').toPromise().then(
      res => this.role = data['account']['role']
    )
  }

  private setDataAfterLogin(data) {
    // this.token  = data['token'];
    // this.cookieService.get
    // store some user data in the service
    // this.userData  = data['email'];

    // store some data in local storage (webbrowser)
    // localStorage.setItem('token' , this.token);
    // localStorage.setItem('usermeta' , JSON.stringify(this.userData));
  }
}