import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register a professional font if needed, but standard ones work too.

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  container: {
    border: '1pt solid #d2d2d7',
    borderRadius: 16,
    height: '100%',
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#fcfcfc',
  },
  header: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subHeader: {
    fontSize: 14,
    color: '#86868b',
    marginBottom: 40,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  presentedTo: {
    fontSize: 14,
    color: '#86868b',
    marginBottom: 10,
    textAlign: 'center',
  },
  userName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 30,
    textAlign: 'center',
    minWidth: 300,
    paddingBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#86868b',
    marginBottom: 10,
    textAlign: 'center',
    maxWidth: 500,
    lineHeight: 1.6,
  },
  courseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 40,
    textAlign: 'center',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 60,
    paddingTop: 20,
    borderTop: '1pt solid #d2d2d7',
  },
  signatureBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signature: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 5,
    color: '#1d1d1f',
  },
  signerRole: {
    fontSize: 10,
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dateBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1d1d1f',
  },
  dateLabel: {
    fontSize: 10,
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  code: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: '#86868b',
  },
  brand: {
    position: 'absolute',
    top: 40,
    left: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1d1d1f',
    letterSpacing: 2,
    textTransform: 'uppercase',
  }
});

interface CertificateData {
  userName: string;
  courseName: string;
  date: Date;
  certificateCode: string;
}

export const CertificatePDF = ({ data }: { data: CertificateData }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.brand}>KLADRIVA</Text>
        
        <Text style={styles.header}>Certificate</Text>
        <Text style={styles.subHeader}>of Achievement</Text>
        
        <Text style={styles.presentedTo}>This certificate is proudly presented to</Text>
        <Text style={styles.userName}>{data.userName}</Text>
        
        <Text style={styles.description}>
          for successfully completing the professional program in
        </Text>
        <Text style={styles.courseName}>{data.courseName}</Text>
        
        <Text style={styles.description}>
          demonstrating exceptional dedication, skill mastery, and professional excellence
          at Kladriva Academy.
        </Text>

        <View style={styles.footer}>
          <View style={styles.dateBlock}>
            <Text style={styles.date}>{format(data.date, 'MMMM dd, yyyy')}</Text>
            <Text style={styles.dateLabel}>Date Issued</Text>
          </View>
          
          <View style={styles.signatureBlock}>
            <Text style={styles.signature}>Jean de Dieu</Text>
            <Text style={styles.signerRole}>Academic Director</Text>
          </View>
        </View>

        <Text style={styles.code}>Verification ID: {data.certificateCode}</Text>
      </View>
    </Page>
  </Document>
);
