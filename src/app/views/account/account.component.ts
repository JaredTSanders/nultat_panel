import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_auth/services/auth.service'
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'account.component.html',
})

export class AccountComponent implements OnInit{
    constructor(private http: HttpClient, private authService: AuthService) {}
    public userData; 
    public userEmail;
    public userFName;
    public userLName; 
    public userStatus; 
    public userAccountStanding; 
    public expirationTime; 
    public userAccountType; 
    public httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
        withCredentials: true, 
        observe: 'response' as 'response'
      }

    getCurrentUser(){
        const data = this.http.get(environment['apiBaseUrl']  + '/api/user/me', this.httpOptions).toPromise().then(
            res => {
                this.userData = res;
                this.userEmail = res['body']['data']['email'];
                this.userFName = res['body']['data']['first_name']
                this.userLName = res['body']['data']['last_name']
                this.userStatus = res['body']['data']['Status']
                this.userAccountStanding = res['body']['data']['standing']
                this.userAccountType = res['body']['data']['account_type']
            }
        );
    }

    ngOnInit(){
        if(this.userData == null){
            this.getCurrentUser();
        }
        // this.authService.refreshToken();
    }
}
