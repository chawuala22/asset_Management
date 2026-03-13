import { Component, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fund } from '../../models/fund.model';
import { FundService } from '../../services/fund.service';
import { formatCurrency } from '../../utils/currency.utils';

@Component({
  selector: 'app-fund-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fund-list.component.html',
  styleUrls: ['./fund-list.component.scss']
})
export class FundListComponent implements OnInit {
  funds = signal<Fund[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  fundSelected = output<Fund>();

  constructor(private fundService: FundService) {}

  ngOnInit() {
    this.loadFunds();
  }

  loadFunds() {
    this.loading.set(true);
    this.error.set(null);

    this.fundService.getFunds().subscribe({
      next: (funds) => {
        this.funds.set(funds);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los fondos');
        this.loading.set(false);
        console.error('Error loading funds:', err);
      }
    });
  }

  subscribeToFund(fund: Fund) {
    this.fundSelected.emit(fund);
  }

  formatCurrency(amount: number): string {
    return formatCurrency(amount);
  }

  getCategoryColor(category: string): string {
    return category === 'FPV' ? '#4CAF50' : '#2196F3';
  }
}
