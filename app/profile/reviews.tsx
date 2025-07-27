import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Star, TrendingUp } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import Card from '@/components/Card';
import RatingStars from '@/components/RatingStars';

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: '1',
    customerName: 'Max Muster',
    rating: 5,
    comment: 'Sehr professionelle Arbeit! Pünktlich, sauber und das Ergebnis ist hervorragend. Kann ich nur weiterempfehlen.',
    date: '2025-06-15',
    projectTitle: 'Wohnzimmer streichen',
  },
  {
    id: '2',
    customerName: 'Anna Schmidt',
    rating: 4,
    comment: 'Gute Arbeit, aber etwas teurer als erwartet. Trotzdem bin ich mit dem Ergebnis zufrieden.',
    date: '2025-05-02',
    projectTitle: 'Badezimmer fliesen',
  },
  {
    id: '3',
    customerName: 'Peter Meier',
    rating: 5,
    comment: 'Absolut zuverlässig und kompetent. Hat mein Badezimmer in Rekordzeit renoviert und dabei sehr sauber gearbeitet. Jederzeit wieder!',
    date: '2025-04-18',
    projectTitle: 'Badezimmer renovieren',
  },
  {
    id: '4',
    customerName: 'Lisa Weber',
    rating: 5,
    comment: 'Fantastische Arbeit! Sehr freundlich und hat alle meine Wünsche berücksichtigt.',
    date: '2025-03-25',
    projectTitle: 'Küche streichen',
  },
  {
    id: '5',
    customerName: 'Thomas Müller',
    rating: 4,
    comment: 'Solide Arbeit, gutes Preis-Leistungs-Verhältnis. Würde wieder beauftragen.',
    date: '2025-03-10',
    projectTitle: 'Gartenarbeit',
  },
];

export default function ReviewsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const averageRating = MOCK_REVIEWS.reduce((sum, review) => sum + review.rating, 0) / MOCK_REVIEWS.length;
  const totalReviews = MOCK_REVIEWS.length;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = MOCK_REVIEWS.filter(review => review.rating === rating).length;
    const percentage = (count / totalReviews) * 100;
    return { rating, count, percentage };
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const renderReview = ({ item }: { item: typeof MOCK_REVIEWS[0] }) => (
    <Card style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{item.customerName}</Text>
          <Text style={styles.reviewDate}>{formatDate(item.date)}</Text>
        </View>
        <RatingStars rating={item.rating} size={16} />
      </View>
      
      <Text style={styles.projectTitle}>{item.projectTitle}</Text>
      <Text style={styles.reviewText}>{item.comment}</Text>
    </Card>
  );
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Bewertungen',
          headerBackTitle: 'Zurück',
        }} 
      />
      
      <ScrollView style={styles.container}>
        <Card style={styles.summaryCard}>
          <View style={styles.ratingOverview}>
            <View style={styles.averageRating}>
              <Text style={styles.averageRatingNumber}>{averageRating.toFixed(1)}</Text>
              <RatingStars rating={averageRating} size={24} />
              <Text style={styles.totalReviews}>{totalReviews} Bewertungen</Text>
            </View>
            
            <View style={styles.ratingDistribution}>
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <View key={rating} style={styles.ratingRow}>
                  <Text style={styles.ratingLabel}>{rating}</Text>
                  <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
                  <View style={styles.ratingBar}>
                    <View 
                      style={[
                        styles.ratingBarFill, 
                        { width: `${percentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.ratingCount}>{count}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>
        
        <Card style={styles.statsCard}>
          <View style={styles.statItem}>
            <TrendingUp size={24} color={COLORS.success} />
            <View style={styles.statContent}>
              <Text style={styles.statValue}>+12%</Text>
              <Text style={styles.statLabel}>Bewertungen diesen Monat</Text>
            </View>
          </View>
        </Card>
        
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Alle Bewertungen</Text>
          
          <FlatList
            data={MOCK_REVIEWS}
            renderItem={renderReview}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  summaryCard: {
    margin: SPACING.m,
    padding: SPACING.l,
  },
  ratingOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  averageRating: {
    alignItems: 'center',
    flex: 1,
  },
  averageRatingNumber: {
    ...FONTS.h1,
    fontSize: 48,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  totalReviews: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  ratingDistribution: {
    flex: 1,
    marginLeft: SPACING.l,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingLabel: {
    ...FONTS.body2,
    color: COLORS.text,
    width: 12,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: COLORS.warning,
  },
  ratingCount: {
    ...FONTS.body2,
    color: COLORS.textLight,
    width: 20,
    textAlign: 'right',
  },
  statsCard: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
    padding: SPACING.m,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    marginLeft: SPACING.m,
  },
  statValue: {
    ...FONTS.h3,
    color: COLORS.success,
  },
  statLabel: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  reviewsSection: {
    padding: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  reviewCard: {
    marginBottom: SPACING.m,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    ...FONTS.body1,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  reviewDate: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  projectTitle: {
    ...FONTS.body2,
    color: COLORS.primary,
    marginBottom: SPACING.s,
  },
  reviewText: {
    ...FONTS.body1,
    color: COLORS.text,
    lineHeight: 22,
  },
});