import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_MARGIN = 8;
const ITEM_SIZE = CARD_WIDTH + CARD_MARGIN * 2;
const SPACER = (width - CARD_WIDTH - CARD_MARGIN) / 2;

const data = [
  {
    id: '1',
    title: 'Carbon Emissions Saved',
    description: 'Your efforts have reduced CO2 impact, equivalent to planting 50 trees.',
    funded: 680,
    goal: 1000,
    supporters: 120,
    unit: 'kg',
    metricLabel: 'days tracked',
    image: 'https://media.istockphoto.com/id/1379073342/vector/3d-isometric-flat-vector-conceptual-illustration-of-greenhouse-effect.jpg?s=612x612&w=0&k=20&c=zFnBCDPhHCAX5rF4JN7QezDYkyzpz9MkhWsD5aAld0A=',
  },
  {
    id: '2',
    title: 'Public Transport Usage',
    description: 'By choosing public transport, you\'ve reduced traffic congestion and emissions.',
    funded: 15,
    goal: 20,
    supporters: 15,
    unit: 'times',
    metricLabel: 'trips this month',
    image: 'https://c8.alamy.com/comp/2R1R5DX/cartoon-illustration-of-a-bus-station-2R1R5DX.jpg',
  },
  {
    id: '3',
    title: 'Eco Projects Invested',
    description: 'Your contributions are driving sustainable projects worldwide.',
    funded: 5,
    goal: 10,
    supporters: 5,
    unit: 'projects',
    metricLabel: 'active investments',
    image: 'https://as2.ftcdn.net/jpg/01/36/52/15/1000_F_136521511_qp3fioMeIi9Srjl2Ujb23AHZfkHXElYv.jpg',
  },
  {
    id: '4',
    title: 'Greener Replacements',
    description: 'Switching to eco-friendly products reduces waste and pollution.',
    funded: 12,
    goal: 20,
    supporters: 8,
    unit: 'items',
    metricLabel: 'categories',
    image: 'https://static.vecteezy.com/system/resources/previews/011/685/146/non_2x/zero-waste-template-hand-drawn-cartoon-flat-illustration-with-durable-and-reusable-items-or-products-to-be-environmentally-friendly-design-vector.jpg',
  },
];

const ProjectCarousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{
          paddingHorizontal: SPACER,
          paddingVertical: 40,
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1.05, 0.9],
            extrapolate: 'clamp',
          });

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [15, -30, 15],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: 'clamp',
          });

          const rotateX = scrollX.interpolate({
            inputRange,
            outputRange: ['20deg', '0deg', '20deg'],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[
                styles.card,
                {
                  transform: [
                    { perspective: 1000 },
                    { scale },
                    { translateY },
                    { rotateX },
                  ],
                  opacity,
                },
              ]}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.supportersBadge}>
                  <Text style={styles.supportersText}>
                    {item.supporters} {item.metricLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.contentContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressInfo}>
                    <Text style={styles.fundingAmount}>
                      {item.funded.toLocaleString()} {item.unit}
                    </Text>
                    <Text style={styles.fundingGoal}>
                      of {item.goal.toLocaleString()} {item.unit}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progress,
                        { width: `${(item.funded / item.goal) * 100}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

// Keep the same styles as previous code
const styles = StyleSheet.create({
  container: {
    height: 500,
    marginTop: 0,
    marginLeft: -16,
    marginRight: -16,
    marginBottom: -80,
  },
  card: {
    width: CARD_WIDTH,
    height: 380,
    backgroundColor: '#1a2a38',
    borderRadius: 20,
    marginHorizontal: CARD_MARGIN,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#243447',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  fundingAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 4,
  },
  fundingGoal: {
    color: '#718096',
    fontSize: 14,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 3,
  },
  supportersBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  supportersText: {
    color: '#1a2a38',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProjectCarousel;