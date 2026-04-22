import { Component, inject, ViewChild, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';

import { RequestDataService } from '../reuseables/http-loader/request-data.service';
import { StoreDataService } from '../reuseables/http-loader/store-data.service';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';

import { MatDialog } from '@angular/material/dialog';

import { timeSince, copyContent, loadScript } from '../reuseables/helper';
import { ToastService } from '../reuseables/toast/toast.service';
import { ConfirmationDialogService } from '../reuseables/modals/confirmation-dialog/confirmation-dialog.service';

import { Header2Component } from "../components/header2/header2.component";
import { MomentAgoPipe } from '../reuseables/pipes/moment.pipe';
import { TruncateCenterPipe } from '../reuseables/pipes/truncate-center.pipe';

@Component({
  selector: 'app-payment-confirmation',
  imports: [CommonModule,SpinnerComponent,
    Header2Component,MomentAgoPipe,
    TruncateCenterPipe, RouterLink
  ],
  templateUrl: './payment-confirmation.component.html',
  styleUrl: './payment-confirmation.component.css'
})
export class PaymentConfirmationComponent {


  @ViewChild('viewInfo') viewInfo!: ElementRef<HTMLInputElement>;

  public router = inject(Router)
  private route = inject(ActivatedRoute)
  // public dialog: MatDialog

  window = window
  directory = 'confirmation'
  isLoadingContent=false

  storeData = inject(StoreDataService)
  reqServerData = inject(RequestDataService)
  toast = inject(ToastService)
  reqConfirmation = inject(ConfirmationDialogService)

  configuration ={
    name:{
      'weputaago':'withdraw',
      'tiyeago':'deposit'
    }
  }

  totalAmount = 0
  totalAmountDollar=0
  currencySymbol = ''

  // openDetails = copyContent

  previewVisible = false;
  transaction:any

  currentProof:any

  username:any = 'nouser'
  data:any
  cryptoCoins = ["USD", "TRON"]

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      const req_data = params.get('page') || 'deposit';

      let method = params.get('method');

      this.isLoadingContent = true;

      let postUrl = `agent-confirmation?method=${method}`;

      if (req_data) {
        postUrl += `&page=${req_data}`;
      }

      this.reqServerData.get(postUrl)
        .subscribe(response => {

          this.data = response;

          this.isLoadingContent = false;
          this.directory = response.type;
          this.transaction = response.table;
          this.currencySymbol = response.symbol;
          this.totalAmount = response.total_amount;
          this.totalAmountDollar = response.total_amount_usd;
        });

    });

  }

  TransactionHandler(transaction:any,status:any) {

    this.reqConfirmation.confirmAction(
      ()=>{
        this.reqServerData.post('agent-confirmation/',{action:status,id:transaction.id})
        .subscribe((response)=>{
          this.data  = response

          if (response.status==='success') {
            this.isLoadingContent=false;
            transaction.status = status;
            this.totalAmount-= transaction.init_amount
            this.totalAmountDollar -= transaction.amount
          }


        })
      },
      status,
      "Are you sure you want to continue?"
    )

  }

  openDetails(tra:any,cls:any){
    let element=document.querySelector('.'+cls[0])
    let detailBtn=document.querySelector('.'+cls[1])
    if (element) {
      element.classList.remove('hide')
      detailBtn?.classList.add('hide')
    }
  }

  extraField(tra:any,type:any){

    let  data = tra.extraField//xJSON.parse(tra.extraField)
    if (type==='bank'){
      return data[type].text
    }

    return data[type]
  }

  openPreview(tra:any) {
    this.currentProof=tra.proof
    this.previewVisible = true;
  }

  closePreview() {
    this.previewVisible = false;
  }

  copyContent(text:any,message:any){
    copyContent(this.toast,text,message)
  }

  goToWithdrawal(url: string, params: any) {
    this.router.navigate([url], {
      queryParams: params
    });

  }

}
