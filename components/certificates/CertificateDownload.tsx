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
    <PDFDownloadLink 
      document={<CertificatePDF data={data} />} 
      fileName={`Kladriva-Certificate-${data.courseName.replace(/\s+/g, '-')}.pdf`}
      className="w-full"
    >
      {({ loading }) => (
        <Button 
          disabled={loading} 
          className="w-full bg-[#1d1d1f] hover:bg-black text-white font-medium h-12 px-8 rounded-full gap-2"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Preparing...</>
          ) : (
            <><Download className="w-4 h-4" /> Download PDF</>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
