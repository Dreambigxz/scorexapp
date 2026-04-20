import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderService } from './loader.service';
import { Observable, of} from 'rxjs';

// <div class="spinner"></div>
// <div *ngIf="isLoading | async" class="spinner-overlay"> <div class="spinner"></div> </div>
@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading | async" class="spinner-overlay">

      <div class="spinner-wrapper">

        <!-- Spinner -->
        <div class="spinner-ring"></div>

        <!-- Brand -->
        <div class="brand">
          <span class="text">score</span><span class="x">X</span>
        </div>

      </div>

    </div>
  `,
  styles: [`

    .spinner-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(1, 7, 33, 0.35);
      z-index: 1000;
      backdrop-filter: blur(2px);
    }

    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
    }

    /* 🔄 Slow Premium Spinner */
    .spinner-ring {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 4px solid rgba(255, 190, 27, 0.15);
      border-top: 4px solid #ffbe1b;
      animation: spinSlow 1.6s linear infinite;
    }

    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* 🧾 Brand text */
    .brand {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #fff;
    }

    .brand .text {
      color: #ccc;
    }

    .brand .x {
      color: #ffbe1b;
      font-weight: 700;
    }

    @media (max-width: 480px) {
      .spinner-ring {
        width: 55px;
        height: 55px;
      }
    }

  `]
})
export class SpinnerComponent {
  isLoading: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading = this.loaderService.loading$;
  }
}
