import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';

import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Building, FileText, CheckCircle, ArrowLeft, Hammer } from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import Logo from '@/components/Logo';

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { register, isLoading } = useAuth();
  
  const [userType, setUserType] = useState<'customer' | 'business'>(
    (params.userType as 'customer' | 'business') || 'customer'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  
  // Business specific fields
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [description, setDescription] = useState('');
  
  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName || (userType === 'customer' && !gender)) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Fehler', 'Die Passwörter stimmen nicht überein.');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Fehler', 'Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }
    
    if (userType === 'business' && (!companyName || !address || !city || !postalCode)) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Geschäftsfelder aus.');
      return;
    }
    
    try {
      const userData = {
        email,
        password,
        firstName,
        lastName,
        phone,
        userType,
        ...(userType === 'customer' && { gender }),
        ...(userType === 'business' && {
          companyName,
          address,
          city,
          postalCode,
          description,
        }),
      };
      
      await register(userData);
      
      const successMessage = 'Ihr Konto wurde erfolgreich erstellt!';
      
      Alert.alert('Erfolg', successMessage, [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error) {
      Alert.alert('Fehler', 'Bei der Registrierung ist ein Fehler aufgetreten.');
    }
  };
  
  const customerFeatures = [
    'Projekte kostenlos erstellen',
    'Angebote von Handwerkern erhalten',
    'Bewertungen und Profile einsehen',
    'Direkter Kontakt zu Handwerkern',
    'Projektmanagement-Tools',
  ];
  
  const businessFeatures = [
    'Professionelles Unternehmensprofil',
    'Auf Kundenprojekte bieten',
    'Fotogalerie für Referenzen',
    'Bewertungssystem',
    'Premium-Features verfügbar',
    'Erweiterte Suchfilter',
    'Prioritäts-Support',
  ];
  
  const userTypeInfo = {
    customer: {
      icon: User,
      title: 'Registrierung als Privatkunde',
      subtitle: 'Erstellen Sie Ihr Kundenkonto',
      backgroundColor: COLORS.secondary
    },
    business: {
      icon: Hammer,
      title: 'Registrierung als Handwerker',
      subtitle: 'Erstellen Sie Ihr Unternehmensprofil',
      backgroundColor: COLORS.primary
    }
  };

  const currentUserType = userTypeInfo[userType];
  const IconComponent = currentUserType.icon;

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      
      <View style={[styles.gradient, { backgroundColor: currentUserType.backgroundColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Logo size="medium" />
            </View>
            
            <View style={styles.userTypeIndicator}>
              <View style={styles.userTypeIcon}>
                <IconComponent size={24} color={COLORS.white} />
              </View>
              <Text style={styles.userTypeTitle}>{currentUserType.title}</Text>
              <Text style={styles.userTypeSubtitle}>{currentUserType.subtitle}</Text>
            </View>
          </View>
          
          <View style={styles.formCard}>
            
            <View style={styles.userTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'customer' && styles.userTypeButtonSelected,
                ]}
                onPress={() => setUserType('customer')}
              >
                <User size={20} color={userType === 'customer' ? COLORS.white : COLORS.textLight} />
                <Text
                  style={[
                    styles.userTypeText,
                    userType === 'customer' && styles.userTypeTextSelected,
                  ]}
                >
                  Privatkunde
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'business' && styles.userTypeButtonSelected,
                ]}
                onPress={() => setUserType('business')}
              >
                <Hammer size={20} color={userType === 'business' ? COLORS.white : COLORS.textLight} />
                <Text
                  style={[
                    styles.userTypeText,
                    userType === 'business' && styles.userTypeTextSelected,
                  ]}
                >
                  Handwerker
                </Text>
              </TouchableOpacity>
            </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Persönliche Daten</Text>
          
          <Input
            label="Vorname *"
            placeholder="Ihr Vorname"
            value={firstName}
            onChangeText={setFirstName}
            leftIcon={<User size={20} color={COLORS.gray[400]} />}
          />
          
          <Input
            label="Nachname *"
            placeholder="Ihr Nachname"
            value={lastName}
            onChangeText={setLastName}
            leftIcon={<User size={20} color={COLORS.gray[400]} />}
          />
          
          <Input
            label="E-Mail *"
            placeholder="Ihre E-Mail-Adresse"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={COLORS.gray[400]} />}
          />
          
          <Input
            label="Telefon"
            placeholder="Ihre Telefonnummer"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={COLORS.gray[400]} />}
          />
          
          {userType === 'customer' && (
            <View style={styles.genderSection}>
              <Text style={styles.genderLabel}>Anrede *</Text>
              <View style={styles.genderSelector}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'male' && styles.genderButtonSelected,
                  ]}
                  onPress={() => setGender('male')}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === 'male' && styles.genderTextSelected,
                    ]}
                  >
                    Herr
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'female' && styles.genderButtonSelected,
                  ]}
                  onPress={() => setGender('female')}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === 'female' && styles.genderTextSelected,
                    ]}
                  >
                    Frau
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
        {userType === 'business' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Geschäftsdaten</Text>
            
            <Input
              label="Firmenname *"
              placeholder="Name Ihres Unternehmens"
              value={companyName}
              onChangeText={setCompanyName}
              leftIcon={<Building size={20} color={COLORS.gray[400]} />}
            />
            
            <Input
              label="Adresse *"
              placeholder="Straße und Hausnummer"
              value={address}
              onChangeText={setAddress}
              leftIcon={<MapPin size={20} color={COLORS.gray[400]} />}
            />
            
            <View style={styles.row}>
              <Input
                label="PLZ *"
                placeholder="PLZ"
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="numeric"
                style={styles.halfInput}
              />
              
              <Input
                label="Ort *"
                placeholder="Stadt"
                value={city}
                onChangeText={setCity}
                style={styles.halfInput}
              />
            </View>
            
            <Input
              label="Beschreibung"
              placeholder="Beschreiben Sie Ihr Unternehmen..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              leftIcon={<FileText size={20} color={COLORS.gray[400]} />}
            />
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passwort</Text>
          
          <Input
            label="Passwort *"
            placeholder="Mindestens 6 Zeichen"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon={<Lock size={20} color={COLORS.gray[400]} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={COLORS.gray[400]} />
                ) : (
                  <Eye size={20} color={COLORS.gray[400]} />
                )}
              </TouchableOpacity>
            }
          />
          
          <Input
            label="Passwort bestätigen *"
            placeholder="Passwort wiederholen"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            leftIcon={<Lock size={20} color={COLORS.gray[400]} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <EyeOff size={20} color={COLORS.gray[400]} />
                ) : (
                  <Eye size={20} color={COLORS.gray[400]} />
                )}
              </TouchableOpacity>
            }
          />
        </View>
        
            <Button
              title="Konto erstellen"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Bereits ein Konto?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginText}>Anmelden</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>
              {userType === 'customer' ? 'Als Privatkunde erhalten Sie:' : 'Als Handwerker erhalten Sie:'}
            </Text>
            
            <View style={styles.featuresList}>
              {(userType === 'customer' ? customerFeatures : businessFeatures).map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <CheckCircle size={16} color={COLORS.white} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: SPACING.l,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.l,
  },
  logoContainer: {
    marginBottom: SPACING.l,
  },
  userTypeIndicator: {
    alignItems: 'center',
  },
  userTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  userTypeTitle: {
    ...FONTS.h2,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  userTypeSubtitle: {
    ...FONTS.body1,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: SPACING.l,
    paddingTop: SPACING.xl,
    minHeight: '70%',
  },
  userTypeSelector: {
    flexDirection: 'row',
    marginBottom: SPACING.l,
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: SPACING.xs,
  },
  userTypeButtonSelected: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.small,
  },
  userTypeText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    fontWeight: '500' as const,
  },
  userTypeTextSelected: {
    color: COLORS.white,
    fontWeight: '600' as const,
  },
  section: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  registerButton: {
    marginTop: SPACING.l,
    borderRadius: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.l,
    paddingTop: SPACING.l,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  footerText: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  loginText: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  featuresCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    margin: SPACING.l,
    marginTop: SPACING.s,
    padding: SPACING.l,
    marginBottom: 100,
  },
  featuresTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  featuresList: {
    gap: SPACING.s,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  featureText: {
    ...FONTS.body2,
    color: COLORS.white,
    flex: 1,
    opacity: 0.9,
  },
  pendingProjectInfo: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  pendingProjectTitle: {
    ...FONTS.body1,
    color: COLORS.white,
    fontWeight: '600' as const,
    marginBottom: SPACING.xs,
  },
  pendingProjectText: {
    ...FONTS.body2,
    color: COLORS.white,
    lineHeight: 18,
  },
  genderSection: {
    marginBottom: SPACING.m,
  },
  genderLabel: {
    ...FONTS.body2,
    color: COLORS.text,
    marginBottom: SPACING.s,
    fontWeight: '500' as const,
  },
  genderSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    padding: 4,
  },
  genderButton: {
    flex: 1,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  genderButtonSelected: {
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  genderText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    fontWeight: '500' as const,
  },
  genderTextSelected: {
    color: COLORS.white,
    fontWeight: '600' as const,
  },
});