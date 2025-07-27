import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MapPin, Save, Building, Phone, Globe, Mail } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import { CANTONS } from '@/mocks/cantons';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';


export default function BusinessProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  
  const [companyName, setCompanyName] = useState((user as any)?.companyName || '');
  const [description, setDescription] = useState((user as any)?.description || '');
  const [address, setAddress] = useState((user as any)?.address || '');
  const [city, setCity] = useState((user as any)?.city || '');
  const [postalCode, setPostalCode] = useState((user as any)?.postalCode || '');
  const [canton, setCanton] = useState((user as any)?.canton || '');
  const [phone, setPhone] = useState((user as any)?.phone || '');
  const [website, setWebsite] = useState((user as any)?.website || '');
  const [email, setEmail] = useState((user as any)?.email || '');
  const [taxNumber, setTaxNumber] = useState((user as any)?.taxNumber || '');
  const [registrationNumber, setRegistrationNumber] = useState((user as any)?.registrationNumber || '');
  

  
  const handleSave = () => {
    const updatedData = {
      companyName,
      description,
      address,
      city,
      postalCode,
      canton,
      phone,
      website,
      email,
      taxNumber,
      registrationNumber,
    };
    
    updateUser(updatedData);
    
    Alert.alert(
      'Unternehmensprofil gespeichert',
      'Ihre Änderungen wurden erfolgreich gespeichert.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Unternehmensprofil',
          headerBackTitle: 'Zurück',
        }} 
      />
      
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Grundinformationen</Text>
          
          <Input
            label="Firmenname"
            placeholder="Name Ihres Unternehmens"
            value={companyName}
            onChangeText={setCompanyName}
            leftIcon={<Building size={20} color={COLORS.gray[400]} />}
          />
          
          <Input
            label="Unternehmensbeschreibung"
            placeholder="Beschreiben Sie Ihr Unternehmen und Ihre Dienstleistungen..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            inputStyle={styles.textArea}
          />
          
          <Text style={styles.sectionTitle}>Kontaktinformationen</Text>
          
          <Input
            label="E-Mail"
            placeholder="kontakt@unternehmen.ch"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={20} color={COLORS.gray[400]} />}
            keyboardType="email-address"
          />
          
          <Input
            label="Telefon"
            placeholder="+41 XX XXX XX XX"
            value={phone}
            onChangeText={setPhone}
            leftIcon={<Phone size={20} color={COLORS.gray[400]} />}
            keyboardType="phone-pad"
          />
          
          <Input
            label="Website"
            placeholder="www.unternehmen.ch"
            value={website}
            onChangeText={setWebsite}
            leftIcon={<Globe size={20} color={COLORS.gray[400]} />}
            keyboardType="url"
          />
          
          <Text style={styles.sectionTitle}>Firmenadresse</Text>
          
          <Input
            label="Straße und Hausnummer"
            placeholder="Musterstraße 123"
            value={address}
            onChangeText={setAddress}
            leftIcon={<MapPin size={20} color={COLORS.gray[400]} />}
          />
          
          <View style={styles.addressRow}>
            <Input
              label="PLZ"
              placeholder="8000"
              value={postalCode}
              onChangeText={setPostalCode}
              keyboardType="numeric"
              style={styles.postalCodeInput}
            />
            
            <Input
              label="Ort"
              placeholder="Zürich"
              value={city}
              onChangeText={setCity}
              style={styles.cityInput}
            />
          </View>
          
          <Input
            label="Kanton"
            placeholder="Wählen Sie Ihren Kanton"
            value={canton}
            onChangeText={setCanton}
          />
          
          <Text style={styles.sectionTitle}>Rechtliche Informationen</Text>
          
          <Input
            label="Handelsregisternummer (optional)"
            placeholder="CHE-123.456.789"
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
          />
          
          <Input
            label="Steuernummer (optional)"
            placeholder="123.456.789"
            value={taxNumber}
            onChangeText={setTaxNumber}
          />
          
          <Button 
            title="Änderungen speichern" 
            onPress={handleSave}
            icon={<Save size={16} color={COLORS.white} />}
            style={styles.saveButton}
          />
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m,
  },
  card: {
    padding: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.s,
    marginTop: SPACING.m,
  },
  sectionSubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginBottom: SPACING.m,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  addressRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  postalCodeInput: {
    flex: 1,
  },
  cityInput: {
    flex: 2,
  },
  saveButton: {
    marginTop: SPACING.m,
  },
});