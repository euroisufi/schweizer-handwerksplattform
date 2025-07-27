import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Camera, Plus, X, Save } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function GalleryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [images, setImages] = useState<string[]>((user as any)?.gallery || []);
  
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    Alert.alert(
      'Bild entfernen',
      'Möchten Sie dieses Bild wirklich aus Ihrer Galerie entfernen?',
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Entfernen',
          onPress: () => {
            const newImages = [...images];
            newImages.splice(index, 1);
            setImages(newImages);
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleSave = () => {
    Alert.alert(
      'Galerie gespeichert',
      'Ihre Fotogalerie wurde erfolgreich aktualisiert.',
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
          title: 'Fotogalerie',
          headerBackTitle: 'Zurück',
        }} 
      />
      
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Ihre Fotogalerie</Text>
          <Text style={styles.subtitle}>
            Zeigen Sie Ihre besten Arbeiten und beeindrucken Sie potenzielle Kunden.
          </Text>
          
          <TouchableOpacity 
            style={styles.addImageButton}
            onPress={handlePickImage}
          >
            <Camera size={24} color={COLORS.primary} />
            <Text style={styles.addImageText}>Foto hinzufügen</Text>
          </TouchableOpacity>
          
          <View style={styles.imagesContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <X size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          {images.length === 0 && (
            <View style={styles.emptyState}>
              <Camera size={48} color={COLORS.gray[400]} />
              <Text style={styles.emptyStateText}>
                Noch keine Bilder in Ihrer Galerie
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Fügen Sie Fotos Ihrer besten Arbeiten hinzu, um Kunden zu überzeugen.
              </Text>
            </View>
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
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    marginBottom: SPACING.l,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderStyle: 'dashed',
  },
  addImageText: {
    ...FONTS.body1,
    color: COLORS.primary,
    marginLeft: SPACING.s,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.m,
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 4/3,
    margin: '1%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateText: {
    ...FONTS.h3,
    color: COLORS.textLight,
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  emptyStateSubtext: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: SPACING.m,
  },
});