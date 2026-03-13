import { Component, signal, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBalance, Transaction } from '../../models/fund.model';
import { FundService } from '../../services/fund.service';
import { formatCurrency } from '../../utils/currency.utils';

@Component({
  selector: 'app-balance-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-summary.component.html',
  styleUrls: ['./balance-summary.component.scss']
})
export class BalanceSummaryComponent {
  balance = input<UserBalance>({ current: 500000, initial: 500000 });
  
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Use computed signal to automatically react to service changes
  transactions = computed(() => this.fundService.getTransactionsSignal()());

  constructor(private fundService: FundService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  private loadTransactions() {
    this.loading.set(true);
    this.error.set(null);

    // Initial load - after this, computed signal will auto-update
    setTimeout(() => {
      this.loading.set(false);
    }, 300);
  }

  formatCurrency(amount: number): string {
    return formatCurrency(amount);
  }

  getTransactionTypeLabel(type: 'subscription' | 'cancellation'): string {
    return type === 'subscription' ? 'Suscripción' : 'Cancelación';
  }

  getTransactionTypeColor(type: 'subscription' | 'cancellation'): string {
    return type === 'subscription' ? '#27ae60' : '#e74c3c';
  }

  getNotificationMethodLabel(method: 'email' | 'sms'): string {
    return method === 'email' ? 'Email' : 'SMS';
  }

  getTotalInvested(): number {
    const transactionList = this.transactions();
    const subscriptions = transactionList.filter(t => t.type === 'subscription');
    const cancellations = transactionList.filter(t => t.type === 'cancellation');
    
    const totalSubscribed = subscriptions.reduce((sum, t) => sum + t.amount, 0);
    const totalCancelled = cancellations.reduce((sum, t) => sum + t.amount, 0);
    
    return totalSubscribed - totalCancelled;
  }

  refreshTransactions() {
    this.loadTransactions();
  }
}
