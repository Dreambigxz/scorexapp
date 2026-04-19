import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  FormsModule,ReactiveFormsModule } from '@angular/forms';
import { WalletService } from '../../../../reuseables/services/wallet.service';
import { CreatePinComponent } from '../create-pin/create-pin.component';
import { InvoiceComponent } from '../../invoice/invoice.component';

import { TruncateCenterPipe } from '../../../../reuseables/pipes/truncate-center.pipe';

@Component({
  selector: 'app-withdraw-crypto',
  imports: [
      CommonModule,
      FormsModule,ReactiveFormsModule,
      CreatePinComponent,InvoiceComponent,
      TruncateCenterPipe
    ],
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.css', "../../../../wallet/styles/crypto-styles.css"]
})
export class CryptoComponent {

  walletService = inject(WalletService);



}
