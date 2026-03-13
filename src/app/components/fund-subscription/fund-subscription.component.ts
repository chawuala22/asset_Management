import { Component, signal, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Fund, SubscriptionRequest, NotificationMethod } from '../../models/fund.model';
import { FundService } from '../../services/fund.service';
import { formatCurrency } from '../../utils/currency.utils';

@Component({
  selector: 'app-fund-subscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fund-subscription.component.html',
  styleUrls: ['./fund-subscription.component.scss']
})
export class FundSubscriptionComponent {
  fund = input<Fund | null>(null);
  userBalance = input<number>(500000);
  close = output<void>();
  subscriptionSuccess = output<any>();

  subscriptionForm: FormGroup;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private fundService: FundService
  ) {
    this.subscriptionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      notificationMethod: ['email', Validators.required],
      notificationValue: ['', [Validators.required, Validators.email]]
    });

    // Reset form when fund changes
    effect(() => {
      const fund = this.fund();
      if (fund) {
        this.resetForm();
        this.subscriptionForm.patchValue({
          amount: fund.minimumAmount
        });
      }
    });
  }

  ngOnInit() {
    // Form is already initialized in constructor effect
  }

  private resetForm() {
    this.subscriptionForm.reset({
      amount: '',
      notificationMethod: 'email',
      notificationValue: ''
    });
    
    // Reset validators to email (default)
    const notificationValueControl = this.subscriptionForm.get('notificationValue');
    notificationValueControl?.setValidators([Validators.required, Validators.email]);
    notificationValueControl?.updateValueAndValidity();
    
    this.error.set(null);
    this.loading.set(false);
  }

  onNotificationMethodChange() {
    const method = this.subscriptionForm.get('notificationMethod')?.value;
    const notificationValueControl = this.subscriptionForm.get('notificationValue');
    
    // Clear the current value when method changes
    notificationValueControl?.setValue('');
    
    // Update validators based on new method
    if (method === 'email') {
      notificationValueControl?.setValidators([Validators.required, Validators.email]);
    } else {
      notificationValueControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')]);
    }
    
    // Force validation update
    notificationValueControl?.updateValueAndValidity();
  }

  getNotificationMethodLabel(): string {
    const method = this.subscriptionForm.get('notificationMethod')?.value;
    return method === 'email' ? 'Correo electrónico' : 'Número de teléfono';
  }

  getNotificationMethodPlaceholder(): string {
    const method = this.subscriptionForm.get('notificationMethod')?.value;
    return method === 'email' ? 'correo@ejemplo.com' : '3001234567';
  }

  formatCurrency(amount: number): string {
    return formatCurrency(amount);
  }

  getMaxAmount(): number {
    return this.userBalance();
  }

  getMinimumAmount(): number {
    return this.fund()?.minimumAmount || 0;
  }

  isAmountValid(): boolean {
    const amount = this.subscriptionForm.get('amount')?.value;
    return amount >= this.getMinimumAmount() && amount <= this.getMaxAmount();
  }

  getAmountError(): string {
    const amount = this.subscriptionForm.get('amount')?.value;
    
    if (amount < this.getMinimumAmount()) {
      return `💰 Monto mínimo requerido es ${this.formatCurrency(this.getMinimumAmount())}. Te faltan ${this.formatCurrency(this.getMinimumAmount() - amount)}.`;
    }
    
    if (amount > this.getMaxAmount()) {
      return `❌ Saldo insuficiente. Tu saldo actual es ${this.formatCurrency(this.getMaxAmount())} y necesitas ${this.formatCurrency(amount - this.getMaxAmount())} más.`;
    }
    
    return '';
  }

  hasInsufficientBalance(): boolean {
    const amount = this.subscriptionForm.get('amount')?.value;
    return amount > this.getMaxAmount();
  }

  hasInsufficientAmount(): boolean {
    const amount = this.subscriptionForm.get('amount')?.value;
    return amount < this.getMinimumAmount();
  }

  onSubmit() {
    if (this.subscriptionForm.invalid || !this.fund()) {
      return;
    }

    const amount = this.subscriptionForm.get('amount')?.value;
    
    if (!this.isAmountValid()) {
      this.error.set(this.getAmountError());
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const notificationMethod: NotificationMethod = {
      type: this.subscriptionForm.get('notificationMethod')?.value,
      value: this.subscriptionForm.get('notificationValue')?.value
    };

    const subscriptionRequest: SubscriptionRequest = {
      fundId: this.fund()!.id,
      amount: amount,
      notificationMethod: notificationMethod
    };

    this.fundService.subscribeToFund(subscriptionRequest).subscribe({
      next: (transaction) => {
        this.loading.set(false);
        this.subscriptionSuccess.emit(transaction);
        this.resetForm(); // Reset form after successful subscription
        this.close.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al procesar la suscripción');
        console.error('Subscription error:', err);
      }
    });
  }

  onClose() {
    this.resetForm(); // Reset form when closing modal
    this.close.emit();
  }
}
