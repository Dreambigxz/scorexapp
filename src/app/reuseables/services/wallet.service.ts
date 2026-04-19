import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { inject } from '@angular/core';

import { StoreDataService } from '../http-loader/store-data.service'; // ✅ adjust path as needed
import { FormHandlerService } from '../http-loader/form-handler.service';
import { ConfirmationDialogService } from '../modals/confirmation-dialog/confirmation-dialog.service';
import { RequestDataService } from '../http-loader/request-data.service';
import { ToastService } from '../toast/toast.service';

import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router, NavigationEnd,NavigationStart,ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { QuickNavService } from '../services/quick-nav.service';


import {  copyContent} from '../helper';

// export type PaymentChannel = 'USD' | 'USDT' | 'TRON' | 'BANK';
export type PaymentChannelGrp = 'local'|'crypto'
type FormPageGroup = 'deposit'|'withdraw'  | 'set_new_pin'
type CryptoKey = 'USD' | 'TRON';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  // Hold current payment method
  private paymentMethod$ = new BehaviorSubject<PaymentChannelGrp>('local');
  private reqConfirmation = inject(ConfirmationDialogService);

  reqServerData = inject(RequestDataService);
  storeData = inject(StoreDataService);

  fb = inject(FormBuilder);
  toast = inject(ToastService)
  quickNav = inject(QuickNavService)


  private formHandler = inject(FormHandlerService);

  page : any = "deposit"

  formView: Record<PaymentChannelGrp, any> = {
    'crypto':{
        'withdraw':this.fb.group({
          amount: ['', [Validators.required, Validators.min]],

          origin:[""],
          saved_method_id: [''],
          payment_method:[""]

        }),
        payment_info:this.fb.group({
          account_number: ['', [Validators.required]],
          pin: ['', [Validators.required]],

        }),
        step:1
    },

    'local':{
      'withdraw':this.fb.group({
        amount: ['', [Validators.required, Validators.min]],
        origin:[""],
        saved_method_id: [''],
        payment_method:[""]

      }),

      'payment_info':this.fb.group({
        account_number: ['', [Validators.required]],
        account_holder: ['', [Validators.required]],
        bank: ['', [Validators.required]],
        pin: ['', [Validators.required]],
      }),

      step:1

    },
  }

  cryptos = [
    { value: 'USD', label: 'USDT (TRC20)', img: 'assets/img/card/usdt.svg' },
    { value: 'TRON', label: 'TRX', img: 'assets/img/card/tron.svg' },
    // { value: 'ETH', label: 'Ethereum (ETH)', img: 'assets/img/card/eth.svg' }
  ];
  cryptoMap: Record<CryptoKey, { value: string; label: string; img: string }> = {
    USD: { value: 'USD', label: 'USDT (TRC20)', img: 'assets/img/card/usdt.svg' },
    TRON: { value: 'TRON', label: 'TRX', img: 'assets/img/card/tron.svg' }
  };

  getCryptoLabel(code: string, value:any=null): string {
    return this.cryptoMap[code as keyof typeof this.cryptoMap]?.label || '';
  }

  cryptoCoins = ["TRON", "USD", "USDT"]

   activeChannel$ = new BehaviorSubject<'crypto' | 'local'>('crypto');
   activeChannelObs$ = this.activeChannel$.asObservable();

  selectedNetwork = 'BEP20';

  selectedLocaLMethod: any
  selectedCryptoMethod : any = "USD"

  selectedData :any
  editingAddress = false

  // amounts>><<<
  localAmount : any

  showCryptoTab = true;
  showLocalTab = true;

  constructor(private router: Router,  private route :ActivatedRoute) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (!event.urlAfterRedirects.includes('records')) {
          this.page = this.route.snapshot.queryParamMap.get('page')
        }
      });
  }

  selectNetwork(network: string) {
    this.selectedNetwork = network;
  }

  // DISPLAY ALL LOCAL CURRENCY OR JUST SELECTED
  getVisibleCurrencies(slice:any=[2]) {

    const isCryptoSelect = slice.length === 1
    const currencies = this.quickNav.storeData.store['init_currencies']?.slice(...slice);

    if (!this.selectedLocaLMethod) {
      return currencies; // show all before selection
    }

     this.selectedData =  currencies.filter(
      (curr:any) => curr.code === this.selectedLocaLMethod
    )[0];

    this.minimumPayment

    return [this.selectedData]

  }

  getVisibleCrptoNetwork(slice:any=[0, 3]) {

    const isCryptoSelect = slice.length === 1
    const currencies = this.quickNav.storeData.store['init_currencies']?.slice(...slice);

     this.selectedData =  currencies.filter(
      (curr:any) => curr.code === this.selectedCryptoMethod
    )[0];

    // this.minimumPayment

    return currencies//[this.selectedData]

  }

  get minimumPayment(){

    const code  = this.selectedData.code
    const index_by =  'minimum_'+this.page
    const settings = this.storeData.get('wallet').settings

    // console.log({index_by, settings}, this.selectedData);

    let minimum;
    if (code==='TRON') {
      minimum =this.convertUsdToTrx(settings[index_by] ,this.selectedData.rate)
    }else{
      minimum =settings[index_by] * this.selectedData.rate
    }
    // console.log({minimum,code, index_by});

    return minimum

  }

  setSelectedCurrency(code:string){

    let[getSelectedData,minimumPayment] = [this.storeData.get('wallet').init_currencies.filter((c:any)=>c.code===code),0]

    console.log({getSelectedData});

    if (getSelectedData) {
      // selectedCurrency=getSelectedData
      if (code==='TRON') {
        minimumPayment=this.convertUsdToTrx(this.storeData.get('wallet').settings['minimum_'+this.page] ,getSelectedData.rate)
      }else{
        minimumPayment=this.storeData.get('wallet').settings['minimum_'+this.page] * getSelectedData.rate
      }
    }

    return  {getSelectedData,minimumPayment}
    // else{
    //   this.selectedCurrency="";
    //   this.minimumPayment=0
    // }
    // console.log({initialized_currency:this.initialized_currency});
    // console.log({selectedCurrency:this.selectedCurrency});

  }

  convertUsdToTrx(usd: number, rate: number = 0.322407): number {
    return +(usd / rate).toFixed(2);
  }

  cancelPayment(type:any, callback:any=null){

    this.reqConfirmation.confirmAction(()=>{
      this.reqServerData.get(`wallet?dir=delete_${type}&showSpinner`).subscribe({
        next:(res)=>{

          this.initializeCurrency()
        }
      })
    }, 'Cancel', `remove ${type} ?` )
  }

  initializeCurrency(){

    const  wallet = this.storeData.get('wallet')
    const payment =  this.storeData.get(this.page)[0]

    let  payment_method  = wallet.payment_method
    if (!payment_method&&payment) {
      payment_method = payment.method
    }

    if (payment_method) {

      const isCrypto = this.cryptoCoins.includes(payment_method);

      this.setActiveChannel(isCrypto ? 'crypto' : 'local');

      // Hide the other tab
      this.showCryptoTab = isCrypto;
      this.showLocalTab = !isCrypto;

      // this.setSelectedCurrency(payment_method)
      !isCrypto?this.selectedLocaLMethod = payment_method:0;
    }else{
      this.showCryptoTab = true;
      this.showLocalTab = true;
    }

  }

  setActiveChannel(channel: 'crypto' | 'local') {
    this.activeChannel$.next(channel);
  }

  get activeChannel() {
    return this.activeChannel$.value;
  }

  handleSubmit(form:any,processor:any){


    form.patchValue({ payment_method: this.selectedData.code });
    form.patchValue({ origin: window.location.origin });

    this.formHandler.submitForm(form, processor, 'wallet/?showSpinner', true,  (res) => {

        // console.log({res});
        this.editingAddress=false


    })
  }

}
