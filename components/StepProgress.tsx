import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <View style={styles.container}>
      {/* Current Step Header */}
      <View style={styles.currentStepHeader}>
        <Text style={styles.currentStepText}>Schritt {currentStep} von {totalSteps}</Text>
        <Text style={styles.currentStepTitle}>{steps[currentStep - 1]}</Text>
      </View>
      
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${(currentStep / totalSteps) * 100}%` }
            ]} 
          />
        </View>
        
        {/* Step Dots */}
        <View style={styles.dotsContainer}>
          {steps.map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <View
                key={stepNumber}
                style={[
                  styles.stepDot,
                  isCompleted && styles.stepDotCompleted,
                  isCurrent && styles.stepDotCurrent,
                ]}
              >
                {isCompleted && (
                  <Check size={8} color={COLORS.white} />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.l,
    paddingHorizontal: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  currentStepHeader: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  currentStepText: {
    ...FONTS.caption,
    color: COLORS.modernGreen,
    fontWeight: '600' as const,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  currentStepTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: '700' as const,
    fontSize: 18,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: SPACING.m,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.modernGreen,
    borderRadius: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.m,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotCompleted: {
    backgroundColor: COLORS.modernGreen,
  },
  stepDotCurrent: {
    backgroundColor: COLORS.modernGreen,
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowColor: COLORS.modernGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default StepProgress;