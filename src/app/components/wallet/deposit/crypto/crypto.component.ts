import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  FormsModule } from '@angular/forms';
import { WalletService } from '../../../../reuseables/services/wallet.service';
import { TruncateCenterPipe } from '../../../../reuseables/pipes/truncate-center.pipe';

@Component({
  selector: 'app-crypto',
  imports: [
    CommonModule, FormsModule,
    TruncateCenterPipe

  ],
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.css', "../../../../wallet/styles/crypto-styles.css"]
})
export class CryptoComponent {

  walletService = inject(WalletService);

  get payAddress(){

    return this.walletService.storeData.get('pay_address')
  }

}
