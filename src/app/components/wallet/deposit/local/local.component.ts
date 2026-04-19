import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  FormsModule } from '@angular/forms';
import { WalletService } from '../../../../reuseables/services/wallet.service';
import { InvoiceComponent } from './invoice/invoice.component';

@Component({
  selector: 'app-local',
  imports: [CommonModule, FormsModule, InvoiceComponent],
  templateUrl: './local.component.html',
  styleUrl: './local.component.css'
})
export class LocalComponent {

  walletService = inject(WalletService);

  makeFlag(code:any){
    return `https://flagsapi.com/${code.slice(0,2)}/flat/64.png`
  }

  get locaBank(){
    return this.walletService.quickNav.storeData.get("local_banks")[0]
  }

  creeateDeposit(){

    const data  = {
      'processor':'create_deposit',
      'amount':this.walletService.localAmount,
      'method':this.walletService.selectedData.code
    }

    this.walletService.reqServerData.post('wallet/', data).subscribe((res)=>{
      this.walletService.initializeCurrency()
    })

  }

}
