import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from "../components/header/header.component";
import { SliderComponent } from "../components/main/slider/slider.component";
import { UpcommingComponent } from "../components/main/upcomming/upcomming.component";
import { MatchesComponent } from "../matches/matches.component";
import { SecuredComponent } from "../components/main/secured/secured.component";

import { RequestDataService } from '../reuseables/http-loader/request-data.service';
import { StoreDataService } from '../reuseables/http-loader/store-data.service';

import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";
import { QuickNotificationsComponent } from "../components/quick-notifications/quick-notifications.component";
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { QuickNavService } from '../reuseables/services/quick-nav.service';
import { TruncateCenterPipe } from '../reuseables/pipes/truncate-center.pipe';
import { CurrencyConverterPipe } from '../reuseables/pipes/currency-converter.pipe';

import { NotificationModalComponent } from '../shared/notification-modal/notification-modal.component';

import { MatDialog } from '@angular/material/dialog';

import { BindAccountComponent } from "../components/modal/bind-account/bind-account.component";
import { WalletCardComponent } from "../components/main/wallet-card/wallet-card.component";

@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent, SliderComponent,
     UpcommingComponent, MatchesComponent,
      MenuBottomComponent,
     CommonModule,
     QuickNotificationsComponent,
     SpinnerComponent,SecuredComponent,
     TruncateCenterPipe, CurrencyConverterPipe,
     BindAccountComponent,WalletCardComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  storeData = inject(StoreDataService)
  reqServerData = inject(RequestDataService)

  quickNav = inject(QuickNavService)

  match = {
    league: 'Premier League',
    startDate: '2025-11-20T18:30:00',
    home: { name: 'Manchester United', logo: 'assets/manu.png' },
    away: { name: 'Chelsea', logo: 'assets/chelsea.png' }
    }

    // new

    balance = 24500;




}
