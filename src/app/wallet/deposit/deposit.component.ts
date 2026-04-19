import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';

import { WalletService } from '../../reuseables/services/wallet.service';
import { TimeFormatPipe } from '../../reuseables/pipes/time-format.pipe';
import { CountdownPipe } from '../../reuseables/pipes/countdown.pipe';
import { TruncateCenterPipe } from '../../reuseables/pipes/truncate-center.pipe';

import { FormHandlerService } from '../../reuseables/http-loader/form-handler.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { QuickNavService } from '../../reuseables/services/quick-nav.service';

import { CryptoComponent } from "../../components/wallet/deposit/crypto/crypto.component";
import { LocalComponent } from "../../components/wallet/deposit/local/local.component";

@Component({
  selector: 'app-deposit',
  imports: [
      CommonModule,FormsModule,
      ReactiveFormsModule, QRCodeComponent,CurrencyConverterPipe,
      TruncateCenterPipe, TimeFormatPipe,CountdownPipe,
      CryptoComponent, LocalComponent
    ],
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css', "../wallet-styles.component.css"]

})
export class DepositComponent {

  quickNav = inject(QuickNavService)
  walletService = inject(WalletService);


  ngOnInit(){

        // this.walletService.page = 'deposit'
      this.quickNav.storeData.store['pageDetails']='wallet'
      if (!this.quickNav.storeData.get("deposit")) {
        this.quickNav.reqServerData.get('wallet?dir=start_deposit').subscribe((res)=>{
          this.walletService.initializeCurrency()

      })}

      this.walletService.page='deposit'
  }



}
