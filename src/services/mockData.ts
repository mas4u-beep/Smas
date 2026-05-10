import { BusinessInsight, MarketplaceItem, NewsUpdate, DocumentStatus, Notification, Professional, Report } from '../types';

export const mockInsights: BusinessInsight[] = [
  { month: '2025-11', income: 45000, expenses: 12000, taxEstimation: 4500, netProfit: 28500 },
  { month: '2025-12', income: 52000, expenses: 15000, taxEstimation: 5200, netProfit: 31800 },
  { month: '2026-01', income: 38000, expenses: 11000, taxEstimation: 3800, netProfit: 23200 },
  { month: '2026-02', income: 61000, expenses: 18000, taxEstimation: 6100, netProfit: 36900 },
  { month: '2026-03', income: 48000, expenses: 14000, taxEstimation: 4800, netProfit: 29200 },
  { month: '2026-04', income: 55000, expenses: 16000, taxEstimation: 5500, netProfit: 33500 },
];

export const mockMarketplace: MarketplaceItem[] = [
  {
    id: '1',
    title: 'ייעוץ משפטי מקצועי',
    description: 'קבלו 20% הנחה על סקירה משפטית ראשונה לחוזים עסקיים.',
    category: 'משפטי',
    discount: '20%',
    providerName: 'כהן ושות׳'
  },
  {
    id: '2',
    title: 'חבילת ציוד משרדי',
    description: 'חבילה בלעדית למשתמשי mas4u: כולל דיו למדפסת, נייר וארגוניות.',
    category: 'לוגיסטיקה',
    price: '₪299',
    providerName: 'אופיס-פרו'
  },
  {
    id: '3',
    title: 'ביקורת אבטחת ענן',
    description: 'ודאו שהנתונים העסקיים שלכם מוגנים. דוח ביקורת מלא עם המלצות.',
    category: 'טכנולוגיה',
    discount: '₪500 הנחה',
    providerName: 'CyberShield'
  }
];

export const mockNews: NewsUpdate[] = [
  {
    id: '1',
    title: 'תקנות מס חדשות 2026',
    summary: 'עדכונים חשובים בנושא דיווחי מע"מ לעסקים קטנים בישראל.',
    date: '2026-05-01'
  },
  {
    id: '2',
    title: 'עדכון AI ב-mas4u',
    summary: 'מנוע ה-OCR שלנו מהיר יותר ב-40%. נסו להעלות מספר קבלות בבת אחת.',
    date: '2026-04-25'
  }
];

export const initialDocuments = [
  {
    id: 'doc_1',
    userId: 'user_1',
    firmId: 'firm_1',
    status: DocumentStatus.COMPLETED,
    fileName: 'invoice_amazon.pdf',
    fileUrl: '',
    uploadDate: Date.now() - 86400000 * 2,
    extractedData: {
      vendorName: 'Amazon Web Services',
      date: '2026-05-01',
      totalAmount: 450.50,
      currency: 'USD',
      category: 'שירותי ענן'
    }
  },
  {
    id: 'doc_2',
    userId: 'user_1',
    firmId: 'firm_1',
    status: DocumentStatus.COMPLETED,
    fileName: 'receipt_gas.jpg',
    fileUrl: '',
    uploadDate: Date.now() - 86400000 * 5,
    extractedData: {
      vendorName: 'תחנת דלק פז',
      date: '2026-04-28',
      totalAmount: 220.00,
      currency: 'ILS',
      category: 'נסיעות'
    }
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'deadline',
    title: 'מועד דיווח מע"מ',
    message: 'הדיווח החודשי למע"מ מסתיים בעוד יומיים. ודאו שכל החשבוניות הועלו.',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    read: false,
    actionUrl: 'documents'
  },
  {
    id: '2',
    type: 'missing_doc',
    title: 'מסמך חסר - דלק פז',
    message: 'העלאתם קבלה לא ברורה על סך 220 ש"ח. אנא העלו שוב.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    read: false,
    actionUrl: 'documents'
  }
];

export const mockProfessionals: Professional[] = [
  {
    id: 'p1',
    name: 'ישראל ישראלי',
    specialty: 'רואה חשבון',
    phone: '050-1234567',
    area: 'תל אביב והמרכז',
    rating: 4.9
  },
  {
    id: 'p2',
    name: 'שרה כהן',
    specialty: 'יועצת מס',
    phone: '052-7654321',
    area: 'ירושלים',
    rating: 4.8
  },
  {
    id: 'p3',
    name: 'אבי לוי',
    specialty: 'עורך דין עסקי',
    phone: '054-9988776',
    area: 'חיפה והצפון',
    rating: 4.7
  }
];

export const mockReports: Report[] = [
  {
    id: 'r1',
    title: 'דוח רווח והפסד - רבעון 1 2026',
    type: 'profit_loss',
    date: '2026-04-01',
    fileUrl: '#',
    period: 'Q1 2026'
  },
  {
    id: 'r2',
    title: 'דוח שנתי 2025 חתום',
    type: 'annual',
    date: '2026-03-15',
    fileUrl: '#',
    period: '2025'
  },
  {
    id: 'r3',
    title: 'דיווח מע"מ - מרץ 2026',
    type: 'monthly',
    date: '2026-04-10',
    fileUrl: '#',
    period: '03/2026'
  }
];
