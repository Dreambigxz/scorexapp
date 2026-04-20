import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickNavService } from '../reuseables/services/quick-nav.service';

import { MarketService } from '../reuseables/services/market.service';
import { BaseChartDirective } from 'ng2-charts';

import { RouterModule,Router } from '@angular/router';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';

import { AiIconComponent } from "../ai-icon/ai-icon.component";
@Component({
  selector: 'app-market',
  imports:[CommonModule,SpinnerComponent,
      BaseChartDirective, RouterModule,AiIconComponent
    ],
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  markets: any[] = [];

  constructor(
    private marketService: MarketService,
    public quickNav: QuickNavService,
    private router: Router
  ) {}

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { point: { radius: 0 } },
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  };

  ngOnInit() {
    this.marketService.getMarketData().subscribe((data:any) => {
    console.log({data});
    this.markets = data.map((c:any) => ({
       pair: c.symbol.toUpperCase() + '/USDT',
       price: c.current_price,
       change: c.price_change_percentage_24h,
        image:c.image,
        sparkline: c.sparkline_in_7d?.price || [] }
      ));

    });
  }
}
