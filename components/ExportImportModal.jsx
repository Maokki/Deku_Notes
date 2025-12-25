import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Modal } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

export default function ExportImportModal({ visible, onClose, onExport, onImport }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  // ------------------ EXPORT ------------------
  const handleExport = async () => {
    setExporting(true);
    try {
      // Call the parent's export function to get the data
      await onExport();
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data.');
    } finally {
      setExporting(false);
    }
  };

  // ------------------ IMPORT ------------------
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error('File picker error:', error);
      Alert.alert('Error', 'Failed to pick file.');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    setImporting(true);

    try {
      // Use legacy API to read the file
      const fileContent = await FileSystem.readAsStringAsync(selectedFile.uri);
      const data = JSON.parse(fileContent);
      
      // Call the parent's import function
      onImport(data);
      
      Alert.alert('Success', 'Data imported successfully!');
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Error', 'Failed to import data. Please check if the file is a valid JSON format.');
    } finally {
      setImporting(false);
    }
  };

  const clearFile = () => setSelectedFile(null);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Export / Import Data</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Export Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Export Your Data</Text>
            <Text style={styles.description}>
              Export all your categories and items as a JSON file
            </Text>
            <TouchableOpacity 
              style={[styles.btn, exporting && { opacity: 0.6 }]} 
              onPress={handleExport}
              disabled={exporting}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>
                {exporting ? 'Exporting...' : 'Export Data'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Import Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Import Data</Text>
            <Text style={styles.description}>
              Import data from a previously exported JSON file
            </Text>
            <TouchableOpacity style={styles.btn} onPress={pickFile}>
              <Ionicons name="folder-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>Choose JSON File</Text>
            </TouchableOpacity>

            {selectedFile && (
              <View style={styles.selectedFile}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {selectedFile.name}
                </Text>
                <TouchableOpacity onPress={clearFile}>
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            )}

            {selectedFile && (
              <TouchableOpacity
                style={[styles.btn, styles.importBtn, importing && { opacity: 0.6 }]}
                onPress={handleImport}
                disabled={importing}
              >
                <Ionicons name="cloud-download-outline" size={20} color="#fff" />
                <Text style={styles.btnText}>
                  {importing ? 'Importing...' : 'Import Data'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#333',
  },
  section: { 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontWeight: '600', 
    marginBottom: 4,
    fontSize: 16,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B0082',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 8,
  },
  importBtn: {
    backgroundColor: '#4CAF50',
  },
  btnText: { 
    color: '#fff', 
    marginLeft: 8, 
    fontWeight: '600',
    fontSize: 14,
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    justifyContent: 'space-between',
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});