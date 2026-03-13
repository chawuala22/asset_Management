import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundListComponent } from './components/fund-list/fund-list.component';
import { BalanceSummaryComponent } from './components/balance-summary/balance-summary.component';
import { FundSubscriptionComponent } from './components/fund-subscription/fund-subscription.component';
import { FundService } from './services/fund.service';
import { Fund } from './models/fund.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FundListComponent, BalanceSummaryComponent, FundSubscriptionComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  // Use computed signal to automatically react to service changes
  balance = computed(() => this.fundService.getCurrentBalanceSignal()());
  selectedFund = signal<Fund | null>(null);

  constructor(private fundService: FundService) {}

  ngOnInit() {
    // Initial load - after this, computed signal will auto-update
  }

  onFundSelected(fund: Fund) {
    this.selectedFund.set(fund);
  }

  closeSubscriptionModal() {
    this.selectedFund.set(null);
  }

  onSubscriptionSuccess(transaction: any) {
    console.log('Subscription successful:', transaction);
    // No need to manually load - computed signal updates automatically
  }

  resetData() {
    if (
      confirm(
        '¿Estás seguro de que deseas reiniciar todos los datos? Esta acción no se puede deshacer.',
      )
    ) {
      this.fundService.resetToInitialState();
      // No need to manually load - computed signal updates automatically
    }
  }

  onSubscriptionCancelled(fund: Fund) {
    // The balance and transactions are automatically updated via computed signals
    // No additional action needed, but we could show a confirmation message
    console.log('Suscripción cancelada para:', fund.name);
  }
}
