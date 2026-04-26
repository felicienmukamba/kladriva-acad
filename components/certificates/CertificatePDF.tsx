import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register a professional font if needed, but standard ones work too.

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  container: {
    border: '10pt solid #0056d2',
    height: '100%',
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  innerBorder: {
    border: '2pt solid #0056d2',
    position: 'absolute',
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  },
  header: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0056d2',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subHeader: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 40,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  presentedTo: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 10,
    textAlign: 'center',
  },
  userName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 30,
    textAlign: 'center',
    borderBottom: '2pt solid #e2e8f0',
    minWidth: 300,
    paddingBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
    textAlign: 'center',
    maxWidth: 500,
    lineHeight: 1.6,
  },
  courseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0056d2',
    marginBottom: 40,
    textAlign: 'center',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1pt solid #e2e8f0',
  },
  signatureBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signature: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 5,
    color: '#0f172a',
  },
  signerRole: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
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
    color: '#0f172a',
  },
  dateLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  code: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: '#94a3b8',
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
        <View style={styles.innerBorder} />
        
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
