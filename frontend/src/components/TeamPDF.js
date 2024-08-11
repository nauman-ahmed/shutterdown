import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { backgroundColor: '#ffffff' },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  // Add more styles for different elements
});

const TeamPDF = ({ teamData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>ABOUT OUR TEAM</Text>
        {teamData.map((member, index) => (
          <View key={index} style={styles.section}>
            <Text>Name: {member.name}</Text>
            <Text>Position: {member.position}</Text>
            {/* Add more details */}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default TeamPDF;
