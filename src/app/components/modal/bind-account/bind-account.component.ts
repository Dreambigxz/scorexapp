import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelegramService } from '../../../reuseables/services/telegram-binder.service';
import { QuickNavService } from '../../../reuseables/services/quick-nav.service';

@Component({
  selector: 'app-bind-account',
  imports: [CommonModule],
  templateUrl: './bind-account.component.html',
  styleUrl: './bind-account.component.css'
})
export class BindAccountComponent {

  telegramService = inject(TelegramService)
  quickNav = inject(QuickNavService)

  showTelegramModal = false;
  link_reward = 0.50
  forced_close= false

  ngOnInit() {


    if (this.quickNav.storeData.store['forced_close']) return;

    const hasBound = this.quickNav.storeData.store['bindedTg'];
    if (!hasBound) {
      setTimeout(() => {
        this.showTelegramModal = true;
      }, 1500);
    }
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

  }

  closeModal(forced_close:boolean=false) {
    this.showTelegramModal = false;
    this.quickNav.storeData.store["forced_close"] = forced_close
  }

  bindTelegram(){
    this.telegramService.connect()

  }

  handleVisibilityChange = () => {
    if (!document.hidden&&this.showTelegramModal) {

      this.quickNav.reqServerData.get('check-if-binded')
      .subscribe((res)=>{
        if (res.main.bindedTg) {
          this.closeModal()
        }

      })


    }

  };

}
