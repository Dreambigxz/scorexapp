import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WalletService } from '../../../../reuseables/services/wallet.service';
import { InvoiceComponent } from '../../invoice/invoice.component';
import { CreatePinComponent } from '../create-pin/create-pin.component';

@Component({
  selector: 'app-withdraw-local',
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    InvoiceComponent,CreatePinComponent
  ],
  templateUrl: './local.component.html',
  styleUrl: './local.component.css'
})
export class LocalComponent {

  walletService = inject(WalletService);
  transactionPin:any
  editing=false

  makeFlag(code:any){
    return `https://flagsapi.com/${code.slice(0,2)}/flat/64.png`
  }

  get locaBank(){
    return this.walletService.quickNav.storeData.get("local_banks")[0]
  }

  createPin(){

    const data  = {
      processor:"create_pin",
      pin:this.transactionPin,
    }

    this.walletService.reqServerData.post('wallet/', data).subscribe()
  }
  creeateDeposit(){

    const data  = {
      'processor':'create_deposit',
      'amount':this.walletService.localAmount,
      'method':this.walletService.selectedData.code
    }

    console.log("creating deposit>>", data);

    this.walletService.reqServerData.post('wallet/', data).subscribe((res)=>{
      console.log({res});

    })

  }

}
