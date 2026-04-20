import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreDataService } from '../../reuseables/http-loader/store-data.service';
import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';
import { AuthService } from '../../reuseables/auth/auth.service';
import { QuickNavService } from '../../reuseables/services/quick-nav.service';

@Component({
  selector: 'app-header',
  imports: [CurrencyConverterPipe, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  storeData = inject(StoreDataService)
  authService = inject(AuthService)
  quickNav = inject(QuickNavService)

  checkIn(){

    if (!this.storeData.store['checked_in']) {
      console.log("check  in user");

      this.quickNav.reqServerData.get("main?check_in=check_in")
      .subscribe((res)=>{
        console.log({res});

      })


    }
  }


}
