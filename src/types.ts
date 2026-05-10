/**
 * mas4u Financial Platform Types
 */

export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  businessName?: string;
  businessType?: string;
  role: UserRole;
  onboardingCompleted: boolean;
  createdAt: number;
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface FinancialDocument {
  id: string;
  userId: string;
  status: DocumentStatus;
  fileName: string;
  fileUrl?: string;
  uploadDate: number;
  fileSize?: number;
  
  // Extracted data (OCR)
  extractedData?: {
    vendorName?: string;
    date?: string;
    totalAmount?: number;
    currency?: string;
    taxAmount?: number;
    invoiceNumber?: string;
    category?: string;
  };
  
  error?: string;
}

export interface BusinessInsight {
  month: string; // YYYY-MM
  income: number;
  expenses: number;
  taxEstimation: number;
  netProfit: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price?: string;
  discount?: string;
  providerName: string;
}

export interface NewsUpdate {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl?: string;
}

export interface Notification {
  id: string;
  type: 'deadline' | 'missing_doc' | 'info' | 'system' | 'chat';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  area: string;
  rating: number;
  imageUrl?: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'monthly' | 'annual' | 'profit_loss';
  date: string;
  fileUrl: string;
  period: string;
}

export interface OnboardingState {
  isCompleted: boolean;
  step: number;
  data: Partial<UserProfile>;
}
