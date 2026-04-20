import { Component,inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { QuickNavService } from '../../reuseables/services/quick-nav.service';

@Component({
  selector: 'app-referral-management',
  imports: [CommonModule],
  templateUrl: './referral-management.component.html',
  styleUrl: './referral-management.component.css'
})
export class ReferralManagementComponent {

  quickNav = inject(QuickNavService)

  

}
