import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  imports: [
  	CommonModule,
  	AccountRoutingModule,
  	HttpClientModule
  ],
  declarations: [ AccountComponent ]
})
export class AccountModule { }
