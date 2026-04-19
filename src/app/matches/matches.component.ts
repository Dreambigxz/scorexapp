import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchService } from '../reuseables/services/match.service';
import { CurrencyConverterPipe } from '../reuseables/pipes/currency-converter.pipe';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { Header2Component } from "../components/header2/header2.component";
import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";

import { TimeFormatPipe } from '../reuseables/pipes/time-format.pipe';
import { CountdownPipe } from '../reuseables/pipes/countdown.pipe';
import { TruncateCenterPipe } from '../reuseables/pipes/truncate-center.pipe';

import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule,FormsModule, FormBuilder } from '@angular/forms';
import { QuickNotificationsComponent } from "../components/quick-notifications/quick-notifications.component";
import { filter } from 'rxjs/operators';

import { AuthService } from '../reuseables/auth/auth.service';

@Component({
  selector: 'app-matches',
  imports: [
    CommonModule,CurrencyConverterPipe,
    SpinnerComponent,Header2Component, MenuBottomComponent,
    TimeFormatPipe,TruncateCenterPipe,FormsModule,CountdownPipe,
    QuickNotificationsComponent
  ],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css', '/../../matches-style2.css']
})
export class MatchesComponent {

  matchService = inject(MatchService);
  router = inject(Router);

  notStarted:any=[]

  marketMode: 'safe' | 'risk' = 'risk';


  ngOnInit(): void {
    this.getSoccer()
    this.router.events.pipe(filter((event:any) => event instanceof NavigationEnd)).subscribe((event: any) => {
      if (event.urlAfterRedirects==='/') {
        this.getSoccer()
      }
    });
  }

  toggleMarket(e: any) {
    this.marketMode = e.target.checked ? 'safe' : 'risk';
  }

  getSoccer(){
    if (!localStorage.getItem("token")) {this.router.navigate(['login']); return}
    if (!this.matchService.storeData.get('soccer')) {
      this.matchService.reqServerData.get('soccer/?showSpinner').subscribe({
        next: (res) => {

          console.log({res});

          this.setData()}
      });
    }else{this.setData()}
  }

  async setData(){
    this.matchService.setFixtures()
    this.matchService.notStarted(this.matchService.storeData.store['soccer']);
    this.matchService.loadBonusMatches()
    this.matchService.companyGame()
  }
}
