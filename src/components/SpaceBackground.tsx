// components/StarFieldBackground.tsx
import { Gyroscope } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import type { ReactNode } from 'react';

const { width, height } = Dimensions.get("window");

type Props = {
  children?: ReactNode;
  numStarts?: number;
  sizeStarts?: number;
  sencivity?: number;
  intervalGyroscope?: number;
};

function generateStars(NUM_STARS: number, SIZE_STARS: number) {
  return Array.from({ length: NUM_STARS }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + SIZE_STARS,
  }));
}

export function SpaceBackground({
  children,
  numStarts = 100,
  sizeStarts = 1,
  sencivity = 10,
  intervalGyroscope = 50,
}: Props) {
  const [stars] = useState(generateStars(numStarts, sizeStarts));
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = Gyroscope.addListener(({ x, y }) => {
      Animated.spring(translateX, {
        toValue: x * sencivity,
        useNativeDriver: true,
        bounciness: 0,
        speed: 10,
      }).start();
      Animated.spring(translateY, {
        toValue: y * sencivity,
        useNativeDriver: true,
        bounciness: 0,
        speed: 10,
      }).start();
    });

    Gyroscope.setUpdateInterval(intervalGyroscope);

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }, { translateY }],
          },
        ]}
      >
        {stars.map((star, index) => (
          <View
            key={index}
            style={{
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              backgroundColor: "white",
              opacity: 0.8,
            }}
          />
        ))}
      </Animated.View>

      {/* Aquí va el contenido que quieras renderizar sobre las estrellas */}
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
