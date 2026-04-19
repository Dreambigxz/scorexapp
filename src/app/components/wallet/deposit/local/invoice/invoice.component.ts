import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormsModule } from '@angular/forms';

import { StoreDataService } from '../../../../../reuseables/http-loader/store-data.service';
import { RequestDataService } from '../../../../../reuseables/http-loader/request-data.service';
import { WalletService } from '../../../../../reuseables/services/wallet.service';


@Component({
  selector: 'app-invoice',
  imports: [CommonModule,FormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {

  constructor(
    public storeData: StoreDataService,
    public walletService: WalletService
  ){}

  sendersName:any
  selectedFile:any
  copied = false;
  activeTab = 0;


  copyAccount(account: string) {
    if (!account) return;

    navigator.clipboard.writeText(account).then(() => {
      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Optional: preview
      // const reader = new FileReader();
      // reader.onload = () => {
      //   this.previewUrl = reader.result as string;
      //
      // };
      // reader.readAsDataURL(this.selectedFile);
      //
      // this.paymentCompleted("payment_receipt")
    }
  }

  setSelectedFile(formData:any): void {
    if (!this.selectedFile) return;
    formData.append('image', this.selectedFile); // key must match Django's expected field name
  }

  submitProof(processor:any){

    const formData = new FormData();

    formData.append('origin', window.location.origin)
    formData.append('transaction_id', this.sendersName)
    formData.append('processor', processor)
    this.selectedFile?this.setSelectedFile(formData):0;
      this.walletService.reqServerData.post("upload/",formData).subscribe(
        {
          next: res => {
            console.log({res});
            // this.setDepositView(res.success)

          }
        }
      )
  }



}
