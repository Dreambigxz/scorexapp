import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';
import { SpinnerComponent } from '../../reuseables/http-loader/spinner.component';
import { Header2Component } from "../../components/header2/header2.component";

import { StoreDataService } from '../../reuseables/http-loader/store-data.service';
import { RequestDataService } from '../../reuseables/http-loader/request-data.service';

import { TruncateCenterPipe } from '../../reuseables/pipes/truncate-center.pipe';
import { WalletService } from '../../reuseables/services/wallet.service';

import { QuickNavService } from '../../reuseables/services/quick-nav.service';

import { MenuBottomComponent } from "../../components/menu-bottom/menu-bottom.component";
import { RouterLink, Router, RouterOutlet } from '@angular/router';

import { ToastService } from '../../reuseables/toast/toast.service';

interface GenerationData {
  count: number;
  amount: number;
  last_updated?: string | null;
}

interface AffiliateData {
  total: { generation_1: number; generation_2: number; generation_3: number };
  active: { generation_1: number; generation_2: number; generation_3: number };
  reset_c: boolean;
  referral: { generation_1: GenerationData; generation_2: GenerationData; generation_3: GenerationData };
  rebate: { generation_1: GenerationData; generation_2: GenerationData; generation_3: GenerationData };
  deposit: { generation_1: GenerationData; generation_2: GenerationData; generation_3: GenerationData };
  withdraw: { generation_1: GenerationData; generation_2: GenerationData; generation_3: GenerationData };
  RefCode: string;
  settings: { percent: { referral: number[]; rebate: number[] } };
  cashed_commissions: number;
  uncashed: number;
  last_cashed_at: string | null;
}

@Component({
  selector: 'app-earnings',
  imports: [
    CommonModule,CurrencyConverterPipe,
    SpinnerComponent,Header2Component,
    TruncateCenterPipe,MenuBottomComponent
  ],
  templateUrl: './earnings.component.html',
  styleUrl: './earnings.component.css'
})
export class EarningsComponent {


  quickNav = inject(QuickNavService)

  tabs = ['Referral', 'Rebate', 'Deposit', 'Withdraw', 'Commission'];
  usersTab = [ "Generation1", "Generation2", "Generation3"]

  activeTab = 'earnings';
  subEarningTab = 'Referral';
  subUsersTab = 'Generation1';

  activeMainTab = "Earnings"

  subTab:any

  subUsersContent:any=[]
  refLink:any

  walletData:any

  ngOnInit(){
      if (!this.quickNav.storeData.get('refDir')) {this.quickNav.reqServerData.get("promotions/").subscribe(
        (res)=>{
          console.log({res});

          this.makeRefLink()
          this.walletData=this.quickNav.storeData.get('wallet')
        }
      )}
    else{
      this.makeRefLink()
    }
  }

  MainTablistener(tab:any){
    this.activeTab=tab
    if (tab==="users"&&!this.quickNav.storeData.get('promotionLevel_1')) {
      this.loadUsers("Generation1")
    }
  }

  loadUsers(tab:any, generation:any=null){


    generation = generation || tab[tab.length-1]
    this.subUsersTab=tab
    if (!this.quickNav.storeData.get('promotionLevel_'+generation)) {
          this.quickNav.reqServerData.get('promotions/?level='+generation).subscribe({next: res => {

            this.subUsersContent = this.quickNav.storeData.get('promotionLevel_'+generation)
          }})
      }else{
        this.subUsersContent = this.quickNav.storeData.get('promotionLevel_'+generation)
      }

      console.log(
        this.quickNav.storeData.store
      );


  }

  makeRefLink() {
    const RefCode = this.quickNav.storeData.get('refDir')['RefCode'];
    this.refLink = `${window.location.origin}/register?uplinner=${RefCode}`;
  }


}
