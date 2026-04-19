import { Routes } from '@angular/router';
import { MainComponent  } from "./main/main.component";
import { BetinfoComponent  } from "./betinfo/betinfo.component";
import { BethistoryComponent} from "./bethistory/bethistory.component";
// import { WithdrawComponent} from "./wallet/withdraw/withdraw.component";
// import { DepositComponent} from "./wallet/deposit/deposit.component";
import { TransactionComponent} from "./wallet/transaction/transaction.component";
import { EarningsComponent} from "./promotion/earnings/earnings.component";
import { UsersComponent} from "./promotion/users/users.component";
import { RewardsComponent} from "./promotion/rewards/rewards.component";
import { InactiveUsersComponent} from "./promotion/inactive-users/inactive-users.component";
import { ProfileComponent} from "./profile/profile.component";
import { MatchesComponent} from "./matches/matches.component";
import {  NotificationsComponent} from "./notifications/notifications.component";

import { LoginComponent} from "./auth/login/login.component";
import { RegisterComponent} from "./auth/register/register.component";
import { ResetComponent} from "./auth/reset/reset.component";

import {CreditAgentComponent} from './credit-agent/credit-agent.component'
import {PaymentConfirmationComponent} from './payment-confirmation/payment-confirmation.component'
import { AgentManagementComponent } from "./admin/agent-management/agent-management.component";

import { WalletComponent } from "./wallet/wallet.component";

import { authGuard } from './reuseables/auth/auth.guard';

export const routes: Routes = [

    {
      path: '',
      component: MainComponent,
      title: 'Main',
      canActivate: [authGuard]
    },

    {
      path: 'betinfo/:id',
      component: BetinfoComponent,
      title: 'Bet-Info',
      canActivate: [authGuard]
    },
    {
      path: 'notifications',
      component: NotificationsComponent,
      title: 'Notifications',
      canActivate: [authGuard]
    },

    {
      path: 'tickets',
      component: BethistoryComponent,
      title: 'Bet-History',
      canActivate: [authGuard]
    },

    
    {
      path: 'wallet',
      component: WalletComponent,
      title: 'wallet',
      canActivate: [authGuard]
    },

    {
      path: 'promotions/earnings',
      component: EarningsComponent,
      title: 'Earnings',
      canActivate: [authGuard]
    },
    {
      path: 'promotions/rewards',
      component: RewardsComponent,
      title: 'Rewards',
      canActivate: [authGuard]
    },
    {
      path: 'promotions/inactive-users',
      component: InactiveUsersComponent,
      title: 'Inactive',
      canActivate: [authGuard]
    },
    {
      path: 'promotions/users/:level',
      component: UsersComponent,
      title: 'Inactive',
      canActivate: [authGuard]
    },
    {
      path: 'account',
      component: ProfileComponent,
      title: 'Account',
      canActivate: [authGuard]
    },
    {
      path: 'matches',
      component: MatchesComponent,
      title: 'Matches',
      canActivate: [authGuard]
    },
    {
      path: 'confirm-payment',
      component: PaymentConfirmationComponent,
      title: 'Confirmation',
      canActivate: [authGuard]

    },
    {
      path: 'agent-management',
      component: AgentManagementComponent,
      title: 'Agent-management',
      canActivate: [authGuard]

    },
  {
    path: 'credit-agent',
    component: CreditAgentComponent,
    title: 'Credit-Agent',
    canActivate: [authGuard]

    },
    {
      path: 'login',
      component: LoginComponent,
      title: 'Login',
    },
    {
      path: 'register',
      component: RegisterComponent,
      title: 'Register',
    },
    {
      path: 'reset-password',
      component: ResetComponent,
      title: 'Reset',
    },

];
