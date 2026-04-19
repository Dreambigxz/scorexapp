import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Header2Component } from "../components/header2/header2.component";
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';

import { WalletService } from '../reuseables/services/wallet.service';

import { DepositComponent } from "./deposit/deposit.component";
import { WithdrawComponent } from "./withdraw/withdraw.component";
import { TransactionComponent } from "./transaction/transaction.component";

@Component({
  selector: 'app-wallet',
  imports: [
    Header2Component,CommonModule,
    SpinnerComponent,
    DepositComponent,WithdrawComponent,
    TransactionComponent
  ],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent {

  walletService = inject(WalletService)


}
