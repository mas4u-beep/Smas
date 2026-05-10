import { useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, onSnapshot, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { useAuth } from './AuthContext';
import { Notification } from '../types';

export function useNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const checkMissingDocs = async () => {
      const now = new Date();
      const month = now.toLocaleString('he-IL', { month: 'long' });
      const year = now.getFullYear().toString();

      // Check if user has uploaded documents for this month
      const q = query(
        collection(db, 'documents'),
        where('userId', '==', user.uid),
        where('month', '==', month),
        where('year', '==', year)
      );

      const snapshot = await getDocs(q);
      
      // If no docs and it's past the 10th of the month, or some other logic
      if (snapshot.empty && now.getDate() > 5) {
        // Check if notification already exists
        const notifQ = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          where('type', '==', 'missing_doc'),
          where('title', '==', `חסרים מסמכים לחודש ${month}`)
        );
        
        const notifSnapshot = await getDocs(notifQ);
        if (notifSnapshot.empty) {
          await addDoc(collection(db, 'notifications'), {
            userId: user.uid,
            type: 'missing_doc',
            title: `חסרים מסמכים לחודש ${month}`,
            message: 'טרם העלאתם מסמכים לחודש הנוכחי. אנא הקפידו להעלות את כל החשבוניות בזמן.',
            timestamp: Date.now(),
            read: false,
            actionUrl: 'documents'
          });
        }
      }
    };

    checkMissingDocs();
  }, [user]);
}
