import { Component , inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickNavService } from '../../../reuseables/services/quick-nav.service';

@Component({
  selector: 'app-join-channel',
  imports: [CommonModule],
  templateUrl: './join-channel.component.html',
  styleUrl: './join-channel.component.css'
})

export class JoinChannelComponent {

  showTelegramModal = false;
  quickNav = inject(QuickNavService)


  ngOnInit() {
    const joined = localStorage.getItem('tg_joined');

    if (!joined) {
      setTimeout(() => {
        this.showTelegramModal = true;
      }, 1500); // slight delay feels premium
    }
  }

  /* JOIN */
  joinTelegram() {
    window.open('https://t.me/official_scorex', '_blank');

    localStorage.setItem('tg_joined', 'true');
    this.showTelegramModal = false;
  }

  /* CLOSE */
  closeTelegramModal() {
    localStorage.setItem('tg_joined', 'true'); // prevent showing again
    this.showTelegramModal = false;
  }

}
