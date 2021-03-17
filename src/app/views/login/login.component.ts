import { Component, OnInit , Inject } from '@angular/core';
import { Validators, ReactiveFormsModule, AbstractControl, FormBuilder, FormGroup, FormControl , Validator , FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

import { CheckRequiredField } from '../../_helpers/form.helper';
import { AuthService } from '../../_auth/services/auth.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  processing: Boolean = false;
  error: Boolean = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
  ) { }

  ngOnInit() {
    if (this.authService.hasToken()) {
      this.handleLoginSuccess();
    } else {
      this.initForm();
    }
  }

  onSubmitButtonClicked() {
    this.error  = false;
    this.processing  = false;
    this.login();
  }

  private login() {
    this.processing  = true;
    this.authService.login(this.loginForm.value).then(
      data => {
        if (data) {
          this.handleLoginSuccess();
        } else {
          this.cookieService.removeAll();
          this.handleLoginError();
        }
      },
      err => {
        console.log('---- ERROR ---- ');
        console.log(err);
        this.handleLoginError();
      });
  }

  private handleLoginSuccess() {
    this.processing = false;
    this.error  = false;
    this.router.navigate(['dashboard']);
  }

  private handleLoginError() {
    this.processing = false;
    this.error  = true;
  }

  private initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [ Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

}
