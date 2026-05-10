import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File as FileIcon, Loader2, Search, Download, Trash2, Eye, X, Filter, SortAsc, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard, Button, Badge, cn } from './UI';
import { DocumentStatus, FinancialDocument } from '../types';
import { geminiService } from '../services/geminiService';
import imageCompression from 'browser-image-compression';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';

export const DocumentCenter: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = React.useState<FinancialDocument[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>({});
  const [selectedDoc, setSelectedDoc] = React.useState<FinancialDocument | null>(null);
  
  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<'date' | 'name'>('date');

  React.useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'documents'),
      where('userId', '==', user.uid),
      orderBy('uploadDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate?.toMillis() || Date.now()
      })) as FinancialDocument[];
      setDocuments(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'documents');
    });

    return unsubscribe;
  }, [user]);

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    if (!user) return;
    setIsUploading(true);
    
    for (const file of acceptedFiles) {
      const tempId = Math.random().toString(36).substr(2, 9);
      setUploadProgress(prev => ({ ...prev, [tempId]: 10 }));

      try {
        let processedFile = file;
        
        // Client-side compression for images
        if (file.type.startsWith('image/')) {
          setUploadProgress(prev => ({ ...prev, [tempId]: 30 }));
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
          };
          processedFile = await imageCompression(file, options);
          setUploadProgress(prev => ({ ...prev, [tempId]: 60 }));
        }

        // 1. Initial Document Record
        const docData = {
          userId: user.uid,
          status: DocumentStatus.PROCESSING,
          fileName: file.name,
          fileSize: processedFile.size,
          uploadDate: serverTimestamp(),
          month: new Date().toLocaleString('he-IL', { month: 'long' }),
          year: new Date().getFullYear().toString()
        };
        
        const docRef = await addDoc(collection(db, 'documents'), docData);

        // 2. Base64 for Gemini
        const reader = new FileReader();
        reader.onload = async () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          try {
            const extracted = await geminiService.extractDocumentData(base64Data, file.type);
            
            // Update Firestore with extracted data (in real app would use updateDoc)
            // For now, we simulate by adding another doc or just updating the state
          } catch (e) {
            console.error("Gemini extraction failed", e);
          }
        };
        reader.readAsDataURL(processedFile);
        
        setUploadProgress(prev => {
          const newState = { ...prev };
          delete newState[tempId];
          return newState;
        });
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
    
    setIsUploading(false);
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'documents', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `documents/${id}`);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    }
  } as any);

  const filteredDocs = documents
    .filter(d => 
      d.fileName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'all' || d.status === statusFilter)
    )
    .sort((a, b) => {
      if (sortBy === 'date') return b.uploadDate - a.uploadDate;
      return a.fileName.localeCompare(b.fileName);
    });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right" dir="rtl">
      <div>
        <h1 className="text-4xl font-serif font-bold mb-2">מרכז מסמכים</h1>
        <p className="text-white/60">נהלו והעלו את החשבוניות והקבלות שלכם לעיבוד אוטומטי.</p>
      </div>

      {/* Upload Zone */}
      <div 
        {...getRootProps()} 
        className={cn(
          "relative group cursor-pointer",
          "border-2 border-dashed rounded-3xl p-12 transition-all duration-300",
          isDragActive ? "border-gold bg-gold/5 scale-[0.99]" : "border-white/10 hover:border-white/20 bg-white/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div 
            animate={isDragActive ? { y: -10, scale: 1.1 } : {}}
            className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors"
          >
            <Upload className={cn("w-10 h-10 transition-colors", isDragActive ? "text-gold" : "text-white/40 group-hover:text-gold")} />
          </motion.div>
          <h3 className="text-2xl font-semibold mb-2">גררו מסמכים לכאן</h3>
          <p className="text-white/40 max-w-sm">תומך בקבצי JPEG, PNG ו-PDF. דחיסה אוטומטית לקבצים גדולים.</p>
          
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-6 w-full max-w-xs space-y-2">
              {Object.entries(uploadProgress).map(([id, progress]) => (
                <div key={id} className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gold uppercase tracking-widest font-bold">
                    <span>מעלה...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gold"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="חיפוש לפי שם קובץ..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
            <Filter size={16} className="text-white/30" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm text-white/60"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="completed">הושלם</option>
              <option value="processing">בעיבוד</option>
              <option value="error">שגיאה</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
            <SortAsc size={16} className="text-white/30" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none focus:outline-none text-sm text-white/60"
            >
              <option value="date">תאריך העלאה</option>
              <option value="name">שם קובץ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredDocs.map((doc) => (
            <motion.div
              key={doc.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedDoc(doc)}
            >
              <GlassCard className="p-4 flex flex-col md:flex-row items-center gap-6 hover:bg-white/10 cursor-pointer transition-colors group">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-gold transition-colors">
                  <FileIcon size={24} />
                </div>
                
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-semibold text-lg">{doc.fileName}</span>
                    {doc.status === DocumentStatus.COMPLETED && <Badge variant="success">מעובד</Badge>}
                    {doc.status === DocumentStatus.PROCESSING && (
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-medium">
                        <Loader2 size={14} className="animate-spin" /> מעבד נתונים ב-AI...
                      </div>
                    )}
                    {doc.status === DocumentStatus.ERROR && <Badge variant="error">שגיאה</Badge>}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-white/40">
                    <span className="flex items-center gap-2"><Clock size={14} /> {new Date(doc.uploadDate).toLocaleDateString('he-IL')}</span>
                    {doc.extractedData && (
                      <>
                        <span className="text-white/60 font-medium">
                          {doc.extractedData.vendorName}
                        </span>
                        <span className="text-gold font-bold font-mono">
                          {doc.extractedData.currency} {doc.extractedData.totalAmount}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="p-2"><Eye size={18} /></Button>
                  <Button variant="ghost" size="sm" className="p-2"><Download size={18} /></Button>
                  <Button variant="ghost" size="sm" className="p-2 text-red-400 hover:bg-red-500/10" onClick={(e) => handleDelete(doc.id, e)}><Trash2 size={18} /></Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredDocs.length === 0 && (
          <div className="py-20 text-center text-white/20">
            לא נמצאו מסמכים התואמים לחיפוש
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy/80 backdrop-blur-md"
              onClick={() => setSelectedDoc(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-navy-light border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[80vh]"
            >
              <div className="flex-1 bg-black/40 flex items-center justify-center p-8">
                {selectedDoc.fileName.endsWith('.pdf') ? (
                  <div className="text-center text-white/40">
                    <FileIcon size={80} className="mx-auto mb-4" />
                    <p>קובץ PDF אינו נתמך לתצוגה מקדימה בדפדפן זה</p>
                  </div>
                ) : (
                  <img 
                    src={selectedDoc.fileUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000'} 
                    alt={selectedDoc.fileName}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                )}
              </div>
              
              <div className="w-full md:w-80 p-8 border-r border-white/10 space-y-8 overflow-y-auto">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold font-serif">{selectedDoc.fileName}</h3>
                  <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">נתונים שחולצו (AI)</p>
                    {selectedDoc.extractedData ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/40">ספק:</span>
                          <span className="font-bold">{selectedDoc.extractedData.vendorName}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/40">סכום כולל:</span>
                          <span className="text-gold font-bold font-mono">{selectedDoc.extractedData.currency} {selectedDoc.extractedData.totalAmount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/40">מע"מ:</span>
                          <span className="font-mono">{selectedDoc.extractedData.taxAmount || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/40">תאריך:</span>
                          <span>{selectedDoc.extractedData.date}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-white/20 italic">הנתונים עדיין בתהליך עיבוד...</p>
                    )}
                  </div>

                  <div className="pt-6 space-y-3">
                    <Button variant="primary" className="w-full"><Download size={18} /> הורדה</Button>
                    <Button variant="secondary" className="w-full text-red-400 hover:bg-red-500/10 border-red-500/20" onClick={(e) => {
                      handleDelete(selectedDoc.id, e);
                      setSelectedDoc(null);
                    }}>
                      <Trash2 size={18} /> מחיקה
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
