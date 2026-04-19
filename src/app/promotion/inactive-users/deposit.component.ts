import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';
import { SpinnerComponent } from '../../reuseables/http-loader/spinner.component';
import { StoreDataService } from '../../reuseables/http-loader/store-data.service';
import { RequestDataService } from '../../reuseables/http-loader/request-data.service';
import { Header2Component } from "../../components/header2/header2.component";

import { WalletService } from '../../reuseables/services/wallet.service';
import { TimeFormatPipe } from '../../reuseables/pipes/time-format.pipe';
import { CountdownPipe } from '../../reuseables/pipes/countdown.pipe';
import { TruncateCenterPipe } from '../../reuseables/pipes/truncate-center.pipe';

import { FormHandlerService } from '../../reuseables/http-loader/form-handler.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-deposit',
  imports: [
      Header2Component,CommonModule,FormsModule,
      ReactiveFormsModule, QRCodeComponent,CurrencyConverterPipe,
      SpinnerComponent,TruncateCenterPipe, TimeFormatPipe,CountdownPipe
    ],
  templateUrl: './deposit.component.html',
  // styleUrl: './deposit.component.css'
  styleUrls: ['./deposit.component.css', "../wallet-styles.component.css"]

})
export class DepositComponent {

  storeData = inject(StoreDataService)
  reqServerData = inject(RequestDataService)
  formHandler = inject(FormHandlerService)
  walletService = inject(WalletService);

  amount : any;

  pendingPayment:any = []
  defaultImage = 'assets/upload.png'; // Put your placeholder image in assets

  ngOnInit(){
      this.storeData.store['pageDetails']='wallet'
      if (!this.storeData.get('deposit')) {this.reqServerData.get('wallet?dir=start_deposit').subscribe((res)=>{
        console.log({res});

        this.walletService.setPaymentMode("", "", true);
      })}

  }

}
