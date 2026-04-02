import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RelationshipMatch, MatchDynamic, MatchRecommendation } from '../types/astro';

interface MatchCardProps {
  match: RelationshipMatch;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { score, dynamics, recommendations } = match;

  const renderProgressBar = (value: number, label: string) => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>{value}/100</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${value}%` }]} />
        </View>
      </View>
    );
  };

  const renderDynamic = (dyn: MatchDynamic) => {
    return (
      <View key={dyn.id} style={styles.dynamicCard}>
        <Text style={styles.dynamicType}>{dyn.type.toUpperCase()}</Text>
        <Text style={styles.dynamicTitle}>{dyn.title}</Text>
        
        <Text style={styles.sectionHeading}>⚙️ Mechanizm:</Text>
        <Text style={styles.bodyText}>{dyn.mechanism}</Text>
        
        <Text style={styles.sectionHeading}>🌪️ Potencjalne starcie:</Text>
        <Text style={styles.bodyText}>{dyn.consequence}</Text>
      </View>
    );
  };

  const renderRecommendation = (rec: MatchRecommendation, index: number) => {
    return (
      <View key={index} style={styles.recommendationCard}>
        <Text style={styles.recTarget}>Dla: {rec.target === 'personA' ? 'Ciebie' : rec.target === 'personB' ? 'Jego/Jej' : 'Obojga'}</Text>
        <Text style={styles.recTitle}>👉 {rec.text}</Text>
        <Text style={styles.bodyText}>{rec.rationale}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Astro Match</Text>
        <View style={styles.totalScoreBubble}>
          <Text style={styles.totalScoreText}>{score.total}</Text>
          <Text style={styles.totalScoreDesc}>WYNIK</Text>
        </View>
      </View>

      <View style={styles.scoresSection}>
        {renderProgressBar(score.communication, 'Komunikacja')}
        {renderProgressBar(score.emotional, 'Stabilność Emocjonalna')}
        {renderProgressBar(score.growth, 'Potencjał Wzrostu')}
      </View>

      <Text style={styles.mainSectionTitle}>Wasza Dynamika</Text>
      {dynamics.map(renderDynamic)}

      <Text style={styles.mainSectionTitle}>Praktyki & Rozwiązania</Text>
      {recommendations.map(renderRecommendation)}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Ciemny, premium granat
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  totalScoreBubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#60A5FA',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  totalScoreText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
  },
  totalScoreDesc: {
    fontSize: 12,
    color: '#DBEAFE',
    fontWeight: '600',
  },
  scoresSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  progressValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#60A5FA',
    borderRadius: 4,
  },
  mainSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 16,
    marginTop: 8,
  },
  dynamicCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  dynamicType: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  dynamicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  sectionHeading: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  bodyText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
  },
  recommendationCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  recTarget: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  recTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  }
});