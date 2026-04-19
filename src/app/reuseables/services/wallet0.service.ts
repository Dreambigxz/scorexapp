import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { inject } from '@angular/core';

import { StoreDataService } from '../http-loader/store-data.service'; // ✅ adjust path as needed
import { FormHandlerService } from '../http-loader/form-handler.service';
import { ConfirmationDialogService } from '../modals/confirmation-dialog/confirmation-dialog.service';
import { RequestDataService } from '../http-loader/request-data.service';
import { ToastService } from '../toast/toast.service';

import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router, NavigationEnd,NavigationStart, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { QuickNavService } from '../services/quick-nav.service';


import {  copyContent} from '../helper';

export type PaymentMethod = 'USD' | 'USDT' | 'TRON' | 'BANK';
export type PaymentMethodGrp = 'Local'|'Crypto'
type FormPageGroup = 'deposit'|'withdraw'  | 'set_new_pin'

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  // Hold current payment method
  private paymentMethod$ = new BehaviorSubject<PaymentMethod>('USD');
  private storeData = inject(StoreDataService);
  private reqConfirmation = inject(ConfirmationDialogService);
  private reqServerData = inject(RequestDataService);

  fb = inject(FormBuilder);
  toast = inject(ToastService)
  quickNav = inject(QuickNavService)


  private formHandler = inject(FormHandlerService);

  cryptoCoins = ["TRON", "USD", "USDT"]
  initCurrencies: any = []
  selectedCurrency:any
  minimumPayment=0
  page:any

  previewUrl: string | null = null;
  selectedFile: File | null = null;
  localDepositSendersName:any
  activeForm: 'Crypto' | 'Local' = 'Crypto'; // default

  SelectedBank:any;

  selectedMode: PaymentMethod = 'USD';
  methodView: Record<PaymentMethodGrp, any> = {
    'Crypto':{
      'form':this.fb.group({
        payment_method: ['', [Validators.required]],
        amount: ['', [Validators.required, Validators.min]],
        account_number: ['', [Validators.required]],
        account_holder: [''],
        bank: [''],
        verification_code: [''],
        origin:[""],
        saved_method_id: ['']

      }),
      step:1
    },
    'Local':{
      'form':this.fb.group({
        payment_method: ['', [Validators.required]],
        amount: ['', [Validators.required, Validators.min]],
        account_number: ['', [Validators.required]],
        account_holder: ['', [Validators.required]],
        bank: ['', [Validators.required]],
        verification_code: [''],
        origin:[""],
        saved_method_id: ['']
      }),
      step:1

    },
  }

  formView: Record<FormPageGroup, any> = {
    deposit:this.fb.group({
      amount:['',[Validators.required]],
      payment_method:["", [Validators.required]],

    }),
    withdraw:0,
    set_new_pin:this.fb.group({
      pin:["", [Validators.required]],

    }),
  }

  bindingTg=false
  isCountingDown = false;
  countdown = 60;
  timer: any;

  initializedMode=[]
  initialized_currency:any
  init_payment_method:any
  init_local=false

  // SelectedCrypto:any
  SelectedCryptoImg="assets/img/card/usdt.svg"
  SelectedCrypto : "USD" | "TRON" | "BANK" | "" = ""

  SelectedLocal:any

  cryptos = [
    { value: 'USD', label: 'USDT (TRC20)', img: 'assets/img/card/usdt.svg' },
    { value: 'TRON', label: 'TRX', img: 'assets/img/card/tron.svg' },
    // { value: 'ETH', label: 'Ethereum (ETH)', img: 'assets/img/card/eth.svg' }
  ];

  dropdownOpen = false;
  sendSendersName=false


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  fixedMethod(paymentMethod:any){

      const form = this.methodView[this.activeForm]?.form;

      // let method_setting = ['USD', 'TRON']
      if (!this.cryptoCoins.includes(paymentMethod)){
        this.selectLocal(this.selectedCurrency,form)
        return
      }

        const crypto = this.cryptos.find(c => c.value === paymentMethod);

        this.SelectedCryptoImg = `assets/img/card/${paymentMethod.toLowerCase()}.svg`
        this.SelectedCrypto = paymentMethod
        if (paymentMethod==='USD') {
          this.SelectedCryptoImg = `assets/img/card/usdt.svg`
        }

        this.selectCrypto(crypto,form)

  }

  selectCrypto(crypto: any, form:any) {
    this.SelectedCrypto = crypto.label;
    this.SelectedCryptoImg = crypto.img;
    this.onCryptoSelect(crypto.value);
    this.dropdownOpen = false;
    // form.patchValue({ payment_method: crypto.value });
    this.init_payment_method = crypto.value
    this.unvalidateForm(form)

  }

  selectLocal(local:any,form:any){
    // this.onCryptoSelect(crypto.value);
    this.SelectedBank=local.name
    this.dropdownOpen = false;

    this.setSelectedCurrency(local.code.toUpperCase())
    // form.patchValue({ payment_method: local.code });
    this.init_payment_method = local.code
    this.init_local = true

    this.unvalidateForm(form)

    console.log({init_local:this.init_local});


  }

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        if (!event.urlAfterRedirects.includes('records')) {
          this.initPaymentMethod();
        }

      });
  }

  unvalidateForm(forms:any){

      const form = this.methodView[this.activeForm]?.form;

      const amount = form.get('amount')
      const account_number = form.get('account_number')
      const pin = form.get("verification_code")

      // console.log("unvalidating>>", {account_number,amount,form});
      amount?.setValidators([Validators.required, Validators.min(1)]);

      if (!this.storeData.get('wallet')?.saved_add) {
        // console.log('clearing amount validators >><<');

        amount?.clearValidators();
        amount?.setErrors(null);
      }else{

        pin.clearValidators();
        pin?.setErrors(null);
        // amount.clearValidators()
      }


  }

  /** Initialize the user's payment method from localStorage or default */
  initPaymentMethod(): void {
    const saved = localStorage.getItem('payment_method') as PaymentMethod | null;
    const mode = saved || 'USD';
    this.paymentMethod$.next(mode);
    this.selectedMode=mode;
    this.page = location.pathname.replaceAll("/wallet/","")
     this.storeData.get('wallet')&&this.storeData.get(this.page)?[
       this.setPaymentMode("","",true)
     ]:0;
  }

  /** Set and persist payment method */
  setPaymentMode(mode: any | null = null,method: any | null = null, initializing=false) {


    method=this.storeData.get('hasMethod')?.code

    if (!method&&mode==="CRYPTO") {

      method = this.selectCryptoDefault()
    }


    let hasPaymentMethod = method
    const pageData = this.storeData.get(this.page)

    if (pageData[0]||hasPaymentMethod) {
      this.initialized_currency=true
      hasPaymentMethod=true
    }


    if (!mode) {
      mode = this.storeData.get('hasMethod')?.code || pageData[0]?.method || this.selectedMode
      if (!['TRON',"USD"].includes(mode)) {
        mode="BANK"
      }
    }
    if (!method) {method=mode}

    this.initCurrencies=this.storeData.get('wallet').init_currencies
    this.paymentMethod$.next(mode);
    localStorage.setItem('payment_method', method);
    this.selectedMode=mode
    this.setSelectedCurrency(method)

    if (this.page==='withdraw') {
      if (mode==="BANK") {this.activeForm="Local"}else{this.activeForm="Crypto"}
      this.methodView[this.activeForm].form.patchValue({payment_method:method})
    }else{
      this.formView['deposit'].patchValue({payment_method:method});
      initializing?this.setDepositView(false):0;
    }

    return hasPaymentMethod

  }

  selectCryptoDefault(){

    if (this.page==='withdraw') return

    this.SelectedCrypto='USD'
    this.SelectedCryptoImg="assets/img/card/usdt.svg"
    return 'USD'
  }

  /** Get current value */
  getPaymentMethod(): PaymentMethod {
    return this.paymentMethod$.value;
  }

  /** Observable for reactive components */
  getPaymentMethod$() {
    return this.paymentMethod$.asObservable();
  }

  onCurrencySelect(event:Event){
    let selected = event.target as HTMLInputElement;
    this.setSelectedCurrency(selected.value.toUpperCase())
  }

  onCryptoSelect(selected:any){
    this.setSelectedCurrency(selected.toUpperCase())
  }

  setSelectedCurrency(code:string){

    let[getSelectedData] = this.initCurrencies.filter((c:any)=>c.code===code)

    if (getSelectedData) {
      this.selectedCurrency=getSelectedData
      if (code==='TRON') {
        this.minimumPayment=this.convertUsdToTrx(this.storeData.get('wallet').settings['minimum_'+this.page] ,getSelectedData.rate)
      }else{
        this.minimumPayment=this.storeData.get('wallet').settings['minimum_'+this.page] * getSelectedData.rate
      }
    }else{
      this.selectedCurrency="";
      this.minimumPayment=0
    }
    // console.log({initialized_currency:this.initialized_currency});
    // console.log({selectedCurrency:this.selectedCurrency});


  }

  convertUsdToTrx(usd: number, rate: number = 0.322407): number {
    return +(usd / rate).toFixed(2);
  }

  handleSubmit(form:any,processor:any){

    // console.log({processor, form});

    form.patchValue({ payment_method: this.init_payment_method });

    this.formHandler.submitForm(form, processor, 'wallet/?showSpinner', true,  (res) => {
      if (res.payment_link) {
        //open a new tab url
        window.open(res.payment_link, '_blank'); // opens in a new tab
      }

      // console.log({res});
      if (processor==='set_trasanction_pin'&&res.success) {
        this.quickNav.closeModal()
        !this.initialized_currency?this.quickNav.openModal("selectPaymentMethod"):0
        // this.quickNav.openModal("selectPaymentMethod")
      }if (processor==='create_withdraw') {
        this.unvalidateForm(form)
      }


    })
  }

  cancelPayment(type:any, callback:any=null){

    this.reqConfirmation.confirmAction(()=>{
      this.reqServerData.get(`wallet?dir=delete_${type}&showSpinner`).subscribe({
        next:(res)=>{
            callback?callback():0;
        }
      })
    }, 'Cancel', `remove ${type} ?` )
  }

  paymentMode(method:any='USD'){

    let mode="bank"
    if (this.cryptoCoins.includes(method)) {
      mode='crypto'
    }
    return mode

  }

  copyContent(text:any){
    copyContent(this.toast,text)
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Optional: preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;

      };
      reader.readAsDataURL(this.selectedFile);

      this.paymentCompleted("payment_receipt")
    }
  }

  setSelectedFile(formData:any): void {
    if (!this.selectedFile) return;
    formData.append('image', this.selectedFile); // key must match Django's expected field name
  }

  paymentCompleted(processor='payment_completed'){

    const formData = new FormData();

    formData.append('origin', window.location.origin)
    formData.append('senders_name', this.localDepositSendersName)
    // formData.append('processor', "payment_receipt")
    formData.append('processor', processor)
    processor==='payment_receipt'?this.setSelectedFile(formData):0;
      this.reqServerData.post("upload/",formData).subscribe(
        {
          next: res => {
            console.log({res});
            this.setDepositView(res.success)

          }
        }
      )
  }

  // set DepositView
  setDepositView(status:any){
    const pendingDeposit= this.storeData.get('deposit')
    if (pendingDeposit.length&&pendingDeposit[0]?.proof) {
      this.previewUrl=pendingDeposit[0].proof
    }
    // if (status){
      this.sendSendersName=false
    // }
  }

  // send withdrawal (OTP) code
  sendCode(method: 'email' | 'telegram' ='email') {

    console.log({method});

    let Continue = ()=>{
    if (method==='telegram'&&!this.storeData.get('bindedTg')) {
        this.bindingTg=true
        // this.telegram.connect()
        return
    }
    this.reqServerData.post("wallet/?showSpinner",{processor:'verification_code',method}).subscribe({next: res => {
      this.startCountdown(60); // 60 seconds timer
    }})
  }

  if (this.bindingTg) {
    this.bindingTg=false
    this.reqServerData.get("main").subscribe({next: res => Continue()})
  }else{Continue()}




  }

  startCountdown(seconds:number=60): void {
    // Example: trigger your backend API to send the OTP here
    // this.walletService.sendOtp();

    this.isCountingDown = true;
    this.countdown = seconds;

    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.isCountingDown = false;
      }
    }, 1000);
  }

  onSavedMethodSelect(event: Event) {
    const id = (event.target as HTMLSelectElement).value;
    const method = this.storeData.store['wallet']['saved_add'][id]
      // .find((m: any) => m.id == id);

      // console.log(meth);



    if (!method) return;

    const form = this.methodView[this.activeForm].form;

    form.patchValue({
      account_number: method.account_number,
      account_holder: method.account_holder || '',
      bank: method.bank || '',

      saved_method_id:id
      // payment_method: method.payment_method,
      // origin: 'saved'
    });


  }


}
