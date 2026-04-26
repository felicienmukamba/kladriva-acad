"use client"

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CertificatePDF } from './CertificatePDF';
import { Button } from '@/components/ui/button';
import { Award, Loader2, Download } from 'lucide-react';

interface CertificateDownloadProps {
  data: {
    userName: string;
    courseName: string;
    date: Date;
    certificateCode: string;
  }
}

export function CertificateDownload({ data }: CertificateDownloadProps) {
  return (
    <div className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl border border-primary/10 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6">
        <Award className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">Claim Your Certificate</h3>
      <p className="text-slate-500 mb-8 max-w-xs">
        Congratulations! You have successfully completed this program. Download your official certificate of achievement.
      </p>

      <PDFDownloadLink 
        document={<CertificatePDF data={data} />} 
        fileName={`Certificate-${data.courseName.replace(/\s+/g, '-')}.pdf`}
      >
        {({ blob, url, loading, error }) => (
          <Button 
            disabled={loading} 
            className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Preparing...</>
            ) : (
              <><Download className="w-4 h-4" /> Download PDF</>
            )}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
