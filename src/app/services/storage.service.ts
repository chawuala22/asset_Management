import { Injectable } from '@angular/core';
import { Transaction, UserBalance } from '../models/fund.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly BALANCE_KEY = 'fund_balance';
  private readonly TRANSACTIONS_KEY = 'fund_transactions';

  constructor() {}

  // Balance Management
  saveBalance(balance: UserBalance): void {
    try {
      localStorage.setItem(this.BALANCE_KEY, JSON.stringify(balance));
    } catch (error) {
      console.error('Error saving balance to localStorage:', error);
    }
  }

  getBalance(): UserBalance | null {
    try {
      const stored = localStorage.getItem(this.BALANCE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading balance from localStorage:', error);
      return null;
    }
  }

  clearBalance(): void {
    try {
      localStorage.removeItem(this.BALANCE_KEY);
    } catch (error) {
      console.error('Error clearing balance from localStorage:', error);
    }
  }

  // Transactions Management
  saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions to localStorage:', error);
    }
  }

  getTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(this.TRANSACTIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading transactions from localStorage:', error);
      return [];
    }
  }

  addTransaction(transaction: Transaction): void {
    try {
      const transactions = this.getTransactions();
      transactions.push(transaction);
      this.saveTransactions(transactions);
    } catch (error) {
      console.error('Error adding transaction to localStorage:', error);
    }
  }

  clearTransactions(): void {
    try {
      localStorage.removeItem(this.TRANSACTIONS_KEY);
    } catch (error) {
      console.error('Error clearing transactions from localStorage:', error);
    }
  }

  // Utility Methods
  clearAllData(): void {
    this.clearBalance();
    this.clearTransactions();
  }

  hasStoredData(): boolean {
    return this.getBalance() !== null || this.getTransactions().length > 0;
  }

  // Reset to initial state (for testing purposes)
  resetToInitialState(): void {
    this.clearAllData();
    const initialBalance: UserBalance = {
      current: 500000,
      initial: 500000
    };
    this.saveBalance(initialBalance);
  }
}
