export interface Fund {
  id: number;
  name: string;
  minimumAmount: number;
  category: 'FPV' | 'FIC';
}

export interface Transaction {
  id: string;
  fundId: number;
  fundName: string;
  type: 'subscription' | 'cancellation';
  amount: number;
  date: Date;
  notificationMethod: 'email' | 'sms';
}

export interface UserBalance {
  current: number;
  initial: number;
}

export interface NotificationMethod {
  type: 'email' | 'sms';
  value: string;
}

export interface SubscriptionRequest {
  fundId: number;
  amount: number;
  notificationMethod: NotificationMethod;
}
