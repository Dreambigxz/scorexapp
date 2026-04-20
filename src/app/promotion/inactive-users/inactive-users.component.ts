import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';


import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';
import { SpinnerComponent } from '../../reuseables/http-loader/spinner.component';
import { StoreDataService } from '../../reuseables/http-loader/store-data.service';
import { RequestDataService } from '../../reuseables/http-loader/request-data.service';
import { Header2Component } from "../../components/header2/header2.component";

@Component({
  selector: 'app-inactive-users',
  imports: [
    CommonModule,CurrencyConverterPipe,
  SpinnerComponent,Header2Component,],
  templateUrl: './inactive-users.component.html',
  styleUrl: './inactive-users.component.css'
})

export class InactiveUsersComponent {

  storeData = inject(StoreDataService)
  reqServerData = inject(RequestDataService)

  directory='pending'

  subUsersContent:any = []

  ngOnInit(): void {

      if (!this.storeData.get('promotionLevel_'+this.directory)) {
          this.reqServerData.get('promotions/?level='+this.directory).subscribe({next: res => {
            console.log(res);

            this.subUsersContent=this.storeData.get('promotionLevel_'+this.directory)

          }})
      }

  }
}
