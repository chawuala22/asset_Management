import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Fund, Transaction, UserBalance, SubscriptionRequest } from '../models/fund.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FundService {
  private readonly INITIAL_BALANCE = 500000;
  private balance = signal<UserBalance>({
    current: this.INITIAL_BALANCE,
    initial: this.INITIAL_BALANCE
  });
  
  private transactions = signal<Transaction[]>([]);
  
  private mockFunds: Fund[] = [
    {
      id: 1,
      name: 'FPV_BTG_PACTUAL_RECAUDADORA',
      minimumAmount: 75000,
      category: 'FPV'
    },
    {
      id: 2,
      name: 'FPV_BTG_PACTUAL_ECOPETROL',
      minimumAmount: 125000,
      category: 'FPV'
    },
    {
      id: 3,
      name: 'DEUDAPRIVADA',
      minimumAmount: 50000,
      category: 'FIC'
    },
    {
      id: 4,
      name: 'FDO-ACCIONES',
      minimumAmount: 250000,
      category: 'FIC'
    },
    {
      id: 5,
      name: 'FPV_BTG_PACTUAL_DINAMICA',
      minimumAmount: 100000,
      category: 'FPV'
    }
  ];

  constructor(private storageService: StorageService) {
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    // Load balance from storage or use initial
    const storedBalance = this.storageService.getBalance();
    if (storedBalance) {
      this.balance.set(storedBalance);
    } else {
      const initialBalance = { current: this.INITIAL_BALANCE, initial: this.INITIAL_BALANCE };
      this.balance.set(initialBalance);
      this.storageService.saveBalance(initialBalance);
    }

    // Load transactions from storage
    const storedTransactions = this.storageService.getTransactions();
    this.transactions.set(storedTransactions);
  }

  getFunds(): Observable<Fund[]> {
    return of(this.mockFunds).pipe(delay(500));
  }

  getFundById(id: number): Observable<Fund | undefined> {
    return of(this.mockFunds.find(fund => fund.id === id)).pipe(delay(300));
  }

  getBalance(): Observable<UserBalance> {
    return of(this.balance()).pipe(delay(200));
  }

  getTransactions(): Observable<Transaction[]> {
    return of(this.transactions()).pipe(delay(300));
  }

  subscribeToFund(request: SubscriptionRequest): Observable<Transaction> {
    const fund = this.mockFunds.find(f => f.id === request.fundId);
    
    if (!fund) {
      return throwError(() => new Error('Fondo no encontrado'));
    }

    if (request.amount < fund.minimumAmount) {
      return throwError(() => new Error(`El monto mínimo es ${fund.minimumAmount.toLocaleString('es-CO')} COP`));
    }

    const currentBalance = this.balance().current;
    if (currentBalance < request.amount) {
      return throwError(() => new Error('Saldo insuficiente'));
    }

    const transaction: Transaction = {
      id: this.generateTransactionId(),
      fundId: request.fundId,
      fundName: fund.name,
      type: 'subscription',
      amount: request.amount,
      date: new Date(),
      notificationMethod: request.notificationMethod.type
    };

    this.transactions.update(transactions => [...transactions, transaction]);
    this.balance.update(balance => ({
      ...balance,
      current: balance.current - request.amount
    }));

    // Save to localStorage
    this.storageService.saveTransactions(this.transactions());
    this.storageService.saveBalance(this.balance());

    return of(transaction).pipe(delay(800));
  }

  cancelSubscription(fundId: number, notificationMethod: 'email' | 'sms'): Observable<Transaction> {
    const subscription = this.transactions().find(
      t => t.fundId === fundId && t.type === 'subscription'
    );

    if (!subscription) {
      return throwError(() => new Error('No se encontró una suscripción para este fondo'));
    }

    const transaction: Transaction = {
      id: this.generateTransactionId(),
      fundId: fundId,
      fundName: subscription.fundName,
      type: 'cancellation',
      amount: subscription.amount,
      date: new Date(),
      notificationMethod: notificationMethod
    };

    this.transactions.update(transactions => [...transactions, transaction]);
    this.balance.update(balance => ({
      ...balance,
      current: balance.current + subscription.amount
    }));

    // Save to localStorage
    this.storageService.saveTransactions(this.transactions());
    this.storageService.saveBalance(this.balance());

    return of(transaction).pipe(delay(800));
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getCurrentBalanceSignal() {
    return this.balance;
  }

  getTransactionsSignal() {
    return this.transactions;
  }

  // Reset all data to initial state
  resetToInitialState(): void {
    this.storageService.resetToInitialState();
    this.initializeFromStorage();
  }
}
