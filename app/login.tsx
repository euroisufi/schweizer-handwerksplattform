import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';

import { Apple, Chrome, Lock, User, Hammer, CheckCircle, ArrowLeft, Mail, Eye, EyeOff } from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Logo from '@/components/Logo';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login, isLoading, loginError, switchUserType } = useAuth();
  
  const [userType, setUserType] = useState<'customer' | 'business'>(
    (params.userType as 'customer' | 'business') || 'customer'
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleEmailLogin = () => {
    setShowEmailForm(true);
  };

  const handlePasswordLogin = async () => {
    if (!email || !password) {
      Alert.alert('Fehler', 'Bitte geben Sie E-Mail und Passwort ein.');
      return;
    }
    
    if (!acceptedTerms) {
      Alert.alert('Fehler', 'Bitte akzeptieren Sie die Nutzungsbedingungen.');
      return;
    }
    
    try {
      // Use the actual login function with email and password
      await login(email, password);
      
      router.replace('/');
    } catch (error) {
      // Error is already handled by the auth store
      console.log('Login failed:', error);
    }
  };

  const handleDemoLogin = () => {
    // Demo login as Hans Müller
    switchUserType(userType);
    
    router.replace('/');
  };

  const handleAppleLogin = () => {
    if (!acceptedTerms) {
      Alert.alert('Fehler', 'Bitte akzeptieren Sie die Nutzungsbedingungen.');
      return;
    }
    
    // For demo purposes, we'll just switch to the selected user type
    switchUserType(userType);
    
    router.replace('/');
  };

  const handleGoogleLogin = () => {
    if (!acceptedTerms) {
      Alert.alert('Fehler', 'Bitte akzeptieren Sie die Nutzungsbedingungen.');
      return;
    }
    
    // For demo purposes, we'll just switch to the selected user type
    switchUserType(userType);
    
    router.replace('/');
  };
  
  const userTypeInfo = {
    customer: {
      icon: User,
      title: 'Anmeldung als Privatkunde',
      subtitle: 'Finden Sie den perfekten Handwerker',
      benefits: [
        'Kostenlos Projekte erstellen und veröffentlichen',
        'Qualifizierte Handwerker in Ihrer Nähe finden',
        'Detaillierte Profile und Bewertungen einsehen',
        'Direkte Kommunikation mit Handwerkern',
        'Transparente Preisvergleiche erhalten',
        'Sichere Abwicklung über die Plattform',
        'Projektfortschritt verfolgen und dokumentieren',
        'Garantie und Qualitätssicherung',
        'Kostenlose Beratung und Support',
        'Zeitersparnis durch effiziente Vermittlung'
      ],
      backgroundColor: COLORS.secondary,
      buttonColor: COLORS.secondary
    },
    business: {
      icon: Hammer,
      title: 'Anmeldung als Handwerker',
      subtitle: 'Erweitern Sie Ihr Geschäft',
      benefits: [
        'Neue Kunden ohne Akquiseaufwand gewinnen',
        'Professionelles Firmenprofil mit Galerie erstellen',
        'Direkter Kundenkontakt - kein Bieten auf Projekte nötig',
        'Premium-Abo für erweiterte Funktionen verfügbar',
        'Unbegrenzte Projektanfragen bearbeiten',
        'Bewertungssystem für Vertrauensaufbau',
        'Flexible Arbeitszeiten und Projektauswahl',
        'Sichere Zahlungsabwicklung garantiert',
        'Marketing-Tools für bessere Sichtbarkeit',
        'Detaillierte Kundenprofile und Projekthistorie',
        'Mobile App für unterwegs verfügbar',
        'Kostenloser Support und Schulungen'
      ],
      backgroundColor: COLORS.primary,
      buttonColor: COLORS.primary
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
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
          
          <View style={styles.loginCard}>
            
            {/* User Type Selector */}
            <View style={styles.userTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'customer' && {
                    backgroundColor: COLORS.secondary,
                    ...SHADOWS.small,
                  }
                ]}
                onPress={() => setUserType('customer')}
              >
                <User size={20} color={userType === 'customer' ? COLORS.white : COLORS.textLight} />
                <Text style={[
                  styles.userTypeText,
                  userType === 'customer' && styles.userTypeTextSelected
                ]}>Privatkunde</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'business' && {
                    backgroundColor: COLORS.primary,
                    ...SHADOWS.small,
                  }
                ]}
                onPress={() => setUserType('business')}
              >
                <Hammer size={20} color={userType === 'business' ? COLORS.white : COLORS.textLight} />
                <Text style={[
                  styles.userTypeText,
                  userType === 'business' && styles.userTypeTextSelected
                ]}>Handwerker</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.loginTitle}>Willkommen zurück!</Text>
            <Text style={styles.loginSubtitle}>Melden Sie sich an, um fortzufahren</Text>
            
            {!showEmailForm ? (
              <View style={styles.buttonsContainer}>
                <Button
                  title="Mit E-Mail anmelden"
                  onPress={handleEmailLogin}
                  style={[styles.button, {
                    backgroundColor: currentUserType.buttonColor,
                  }]}
                  textStyle={styles.buttonText}
                  leftIcon={<Mail size={20} color={COLORS.white} />}
                />
                
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>oder</Text>
                  <View style={styles.dividerLine} />
                </View>
                
                <Button
                  title="Mit Apple fortfahren"
                  onPress={handleAppleLogin}
                  variant="outline"
                  style={[styles.button, styles.socialButton]}
                  textStyle={styles.socialButtonText}
                  leftIcon={<Apple size={20} color={COLORS.text} />}
                />
                
                <Button
                  title="Mit Google fortfahren"
                  onPress={handleGoogleLogin}
                  variant="outline"
                  style={[styles.button, styles.socialButton]}
                  textStyle={styles.socialButtonText}
                  leftIcon={<Chrome size={20} color={COLORS.text} />}
                />
              </View>
            ) : (
              <View style={styles.emailFormContainer}>
                <TouchableOpacity 
                  style={styles.backToOptionsButton}
                  onPress={() => setShowEmailForm(false)}
                >
                  <ArrowLeft size={20} color={COLORS.textLight} />
                  <Text style={styles.backToOptionsText}>Zurück zu den Optionen</Text>
                </TouchableOpacity>
                
                <View style={styles.inputContainer}>
                  <Input
                    placeholder="E-Mail-Adresse"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={<Mail size={20} color={COLORS.textLight} />}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Input
                    placeholder="Passwort"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    leftIcon={<Lock size={20} color={COLORS.textLight} />}
                    rightIcon={
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <EyeOff size={20} color={COLORS.textLight} />
                        ) : (
                          <Eye size={20} color={COLORS.textLight} />
                        )}
                      </TouchableOpacity>
                    }
                  />
                </View>
                
                <View style={styles.termsContainerInline}>
                  <TouchableOpacity
                    style={styles.checkboxContainerInline}
                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                  >
                    <View style={[styles.checkboxInline, acceptedTerms && styles.checkboxCheckedInline]}>
                      {acceptedTerms && <Text style={styles.checkmarkInline}>✓</Text>}
                    </View>
                    <Text style={styles.termsTextInline}>
                      Ich akzeptiere die{' '}
                      <Text style={styles.linkTextInline}>AGB</Text>
                      {' '}und{' '}
                      <Text style={styles.linkTextInline}>Datenschutz</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <Button
                  title="Anmelden"
                  onPress={handlePasswordLogin}
                  style={[styles.button, {
                    backgroundColor: currentUserType.buttonColor,
                  }]}
                  textStyle={styles.buttonText}
                />
              </View>
            )}
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerPrompt}>Noch kein Konto?</Text>
              <TouchableOpacity onPress={() => router.push({ pathname: '/register', params: { userType } })}>
                <Text style={[styles.registerLink, { color: currentUserType.buttonColor }]}>Jetzt registrieren</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.demoContainer}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Demo</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <Button
                title="Mit Demo-Account anmelden"
                onPress={handleDemoLogin}
                variant="outline"
                style={[styles.button, styles.demoButton]}
                textStyle={styles.demoButtonText}
              />
            </View>
            
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>
                {userType === 'customer' ? 'Als Privatkunde erhalten Sie:' : 'Als Handwerker erhalten Sie:'}
              </Text>
              
              <View style={styles.benefitsList}>
                {currentUserType.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <CheckCircle size={16} color={currentUserType.buttonColor} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          

          
          <View style={{ height: 100 }} />
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
  loginCard: {
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
    backgroundColor: COLORS.primary,
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
  loginTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  loginSubtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  buttonsContainer: {
    gap: SPACING.m,
  },
  button: {
    borderRadius: 16,
    paddingVertical: SPACING.m + 2,
  },

  socialButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray[200],
    borderWidth: 1,
  },
  buttonText: {
    ...FONTS.body1,
    color: COLORS.white,
    fontWeight: '600' as const,
  },
  socialButtonText: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '500' as const,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.s,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray[200],
  },
  dividerText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginHorizontal: SPACING.m,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.l,
  },
  registerPrompt: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  registerLink: {
    ...FONTS.body2,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  benefitsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginTop: SPACING.l,
    padding: SPACING.l,
    ...SHADOWS.small,
  },
  benefitsTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  benefitsList: {
    gap: SPACING.s,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  benefitText: {
    ...FONTS.body2,
    color: COLORS.text,
    flex: 1,
  },
  termsContainer: {
    marginHorizontal: SPACING.l,
    marginBottom: SPACING.l,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: SPACING.s,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  checkmark: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold' as const,
  },
  termsText: {
    ...FONTS.body2,
    color: COLORS.white,
    flex: 1,
    lineHeight: 18,
    opacity: 0.9,
  },
  linkText: {
    color: COLORS.white,
    textDecorationLine: 'underline' as const,
    fontWeight: '600' as const,
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
  emailFormContainer: {
    gap: SPACING.m,
  },
  backToOptionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.s,
  },
  backToOptionsText: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  inputContainer: {
    marginBottom: SPACING.s,
  },
  termsContainerInline: {
    marginBottom: SPACING.m,
  },
  checkboxContainerInline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxInline: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    marginRight: SPACING.s,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCheckedInline: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmarkInline: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold' as const,
  },
  termsTextInline: {
    ...FONTS.body2,
    color: COLORS.text,
    flex: 1,
    lineHeight: 18,
  },
  linkTextInline: {
    color: COLORS.primary,
    textDecorationLine: 'underline' as const,
    fontWeight: '600' as const,
  },
  demoContainer: {
    marginTop: SPACING.l,
  },
  demoButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray[300],
    borderWidth: 1,
  },
  demoButtonText: {
    ...FONTS.body1,
    color: COLORS.textLight,
    fontWeight: '500' as const,
  },

});