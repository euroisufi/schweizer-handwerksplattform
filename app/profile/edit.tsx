import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Camera, Save } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, userType, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [description, setDescription] = useState((user as any)?.description || '');
  const [profileImage, setProfileImage] = useState((user as any)?.logo || null);
  
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };
  
  const handleSave = () => {
    const updatedData: any = {
      name,
      email,
      phone,
    };
    
    if (userType === 'business') {
      updatedData.description = description;
    }
    
    if (profileImage) {
      updatedData.logo = profileImage;
    }
    
    updateUser(updatedData);
    
    Alert.alert(
      'Profil gespeichert',
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
          title: 'Profil bearbeiten',
          headerBackTitle: 'Zurück',
        }} 
      />
      
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.imageSection}>
            <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>{name.charAt(0)}</Text>
                </View>
              )}
              <View style={styles.cameraButton}>
                <Camera size={16} color={COLORS.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.imageHint}>Tippen Sie, um ein Foto hinzuzufügen</Text>
          </View>
          
          <Input
            label="Name"
            placeholder="Ihr Name"
            value={name}
            onChangeText={setName}
          />
          
          <Input
            label="E-Mail"
            placeholder="Ihre E-Mail-Adresse"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Telefon"
            placeholder="Ihre Telefonnummer"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          
          {userType === 'business' && (
            <Input
              label="Beschreibung"
              placeholder="Beschreiben Sie Ihr Unternehmen..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              inputStyle={styles.textArea}
            />
          )}
          
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
  imageSection: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: SPACING.s,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...FONTS.h1,
    fontSize: 48,
    color: COLORS.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  imageHint: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  saveButton: {
    marginTop: SPACING.m,
  },
});