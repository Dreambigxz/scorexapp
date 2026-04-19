import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickNavService } from '../../../reuseables/services/quick-nav.service';
import { CurrencyConverterPipe } from '../../../reuseables/pipes/currency-converter.pipe';
import { AppDownloadManager } from '../../../reuseables/services/app-download-manager.service';


@Component({
  selector: 'app-wallet-card',
  imports: [
    CommonModule,
     CurrencyConverterPipe,

   ],
  templateUrl: './wallet-card.component.html',
  styleUrl: './wallet-card.component.css'
})
export class WalletCardComponent {

  quickNav = inject(QuickNavService)
  appManager = inject(AppDownloadManager)

  actions = [
    { label: 'Deposit', icon: '↑' },
    { label: 'Withdraw', icon: '↓' },
    { label: 'Bonus', icon: '🎁' },
    { label: 'App', icon: '📥' }
  ];

  loading = false;


  refresh() {

    this.loading = true;
    this.quickNav.reqServerData.get('main')
    .subscribe((res)=>{
      this.loading=false;
    })
  }


}
