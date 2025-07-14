import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import type { ViewStyle } from 'react-native';

const { width, height } = Dimensions.get('window');

// Interfaces para tipos
interface CircleData {
  translateY: Animated.Value;
  translateX: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
}

interface ParticleData {
  translateY: Animated.Value;
  translateX: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
}

interface BackgroundProps {
  style?: ViewStyle;
}

// 1. Círculos flotantes con movimiento suave
export const FloatingCircles: React.FC<BackgroundProps> = ({ style }) => {
  const circles = useRef<CircleData[]>([...Array(6)].map(() => ({
    translateY: new Animated.Value(Math.random() * height),
    translateX: new Animated.Value(Math.random() * width),
    scale: new Animated.Value(0.5 + Math.random() * 0.5),
    opacity: new Animated.Value(0.1 + Math.random() * 0.4),
  }))).current;

  useEffect(() => {
    /** Guardamos los objetos CompositeAnimation para poder detenerlos */
    const running: Animated.CompositeAnimation[] = [];

    circles.forEach((circle, index) => {
      const animateCircle = (): void => {
        const anim = Animated.parallel([
          Animated.timing(circle.translateY, {
            toValue: Math.random() * height,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(circle.translateX, {
            toValue: Math.random() * width,
            duration: 4000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(circle.scale, {
            toValue: 0.3 + Math.random() * 0.7,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ]);

        running.push(anim);            // <— guardamos la referencia
        anim.start(() => animateCircle());
      };

      const timeoutId = setTimeout(animateCircle, index * 500);
      /** Limpiamos también el timeout si el componente se desmonta
       *  antes de que arranque la animación por primera vez. */
      running.push({
        stop: () => clearTimeout(timeoutId),
        start: () => {},
        reset: () => {},
      } as unknown as Animated.CompositeAnimation);
    });

    /** Limpieza: detenemos TODAS las animaciones */
    return () => running.forEach(anim => anim.stop());
  }, [circles]);


  return (
    <View style={[StyleSheet.absoluteFillObject, style]}>
      {circles.map((circle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.circle,
            {
              transform: [
                { translateX: circle.translateX },
                { translateY: circle.translateY },
                { scale: circle.scale },
              ],
              opacity: circle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

// 2. Ondas de gradiente que se mueven
export const WaveBackground: React.FC<BackgroundProps> = ({ style }) => {
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createWaveAnimation = (animValue: Animated.Value, duration: number): Animated.CompositeAnimation => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = [
      createWaveAnimation(wave1, 4000),
      createWaveAnimation(wave2, 6000),
      createWaveAnimation(wave3, 8000),
    ];

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [wave1, wave2, wave3]);

  return (
    <View style={[StyleSheet.absoluteFillObject, style]}>
      <Animated.View
        style={[
          styles.wave,
          styles.wave1,
          {
            transform: [
              {
                translateY: wave1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -50],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          styles.wave2,
          {
            transform: [
              {
                translateY: wave2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 30],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          styles.wave3,
          {
            transform: [
              {
                translateY: wave3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

// 3. Partículas que caen suavemente
export const ParticleRain: React.FC<BackgroundProps> = ({ style }) => {
  const particles = useRef<ParticleData[]>(
    [...Array(15)].map(() => ({
      translateY: new Animated.Value(-50),
      translateX: new Animated.Value(Math.random() * width),
      opacity: new Animated.Value(0.2 + Math.random() * 0.3),
      rotation: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    /** Guardamos todas las animaciones y timeouts para poder detenerlos. */
    const running: Animated.CompositeAnimation[] = [];

    particles.forEach((particle, index) => {
      const animateParticle = (): void => {
        /* Reiniciamos valores antes de cada ciclo */
        particle.translateY.setValue(-50);
        particle.translateX.setValue(Math.random() * width);
        particle.rotation.setValue(0);

        const anim = Animated.parallel([
          Animated.timing(particle.translateY, {
            toValue: height + 50,
            duration: 8_000 + Math.random() * 4_000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.rotation, {
            toValue: 1,
            duration: 8_000 + Math.random() * 4_000,
            useNativeDriver: true,
          }),
        ]);

        running.push(anim);
        anim.start(() => animateParticle());
      };

      /* Arranque escalonado con timeout */
      const timeoutId = setTimeout(animateParticle, index * 500);

      /* Guardamos un “pseudo‑CompositeAnimation” para poder cancelar el timeout */
      running.push({
        stop: () => clearTimeout(timeoutId),
        start: () => {},
        reset: () => {},
      } as unknown as Animated.CompositeAnimation);
    });

    /* Limpieza: detenemos TODAS las animaciones y timeouts */
    return () => running.forEach(anim => anim.stop());
  }, [particles]);

  return (
    <View style={[StyleSheet.absoluteFillObject, style]}>
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.translateX },
                { translateY: particle.translateY },
                {
                  rotate: particle.rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

// 4. Patrón geométrico con pulso
export const GeometricPattern: React.FC<BackgroundProps> = ({ style }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    const pulseAnimation = (): void => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => pulseAnimation());
    };

    pulseAnimation();
  }, [scale, opacity]);

  return (
    <View style={[StyleSheet.absoluteFillObject, style]}>
      <Animated.View
        style={[
          styles.geometricPattern,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        {[...Array(12)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.hexagon,
              {
                transform: [
                  { rotate: `${i * 30}deg` },
                  { translateY: -100 },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

// 5. Degradado animado de fondo
export const AnimatedGradient: React.FC<BackgroundProps> = ({ style }) => {
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateColors = (): void => {
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ]).start(() => animateColors());
    };

    animateColors();
  }, [colorAnim]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#667eea', '#764ba2'],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor },
        style,
      ]}
    />
  );
};

// 6. Nuevo: Burbujas que suben
export const BubbleBackground: React.FC<BackgroundProps> = ({ style }) => {
  const bubbles = useRef<CircleData[]>([...Array(8)].map(() => ({
    translateY: new Animated.Value(height + 50),
    translateX: new Animated.Value(Math.random() * width),
    scale: new Animated.Value(0.3 + Math.random() * 0.4),
    opacity: new Animated.Value(0.1 + Math.random() * 0.4),
  }))).current;

  useEffect(() => {
    const running: Animated.CompositeAnimation[] = [];

    bubbles.forEach((bubble, index) => {
      const animateBubble = (): void => {
        bubble.translateY.setValue(height + 50);
        bubble.translateX.setValue(Math.random() * width);

        const anim = Animated.parallel([
          Animated.timing(bubble.translateY, {
            toValue: -100,
            duration: 6000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
          Animated.timing(bubble.translateX, {
            /**  
             *  Ya no usamos `_value`, que no está en la definición de tipos.
             *  Simplemente le damos un nuevo punto X aleatorio.  
             */
            toValue: Math.random() * width,
            duration: 6000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
        ]);

        running.push(anim);
        anim.start(() => animateBubble());
      };

      const timeoutId = setTimeout(animateBubble, index * 800);
      running.push({
        stop: () => clearTimeout(timeoutId),
        start: () => {},
        reset: () => {},
      } as unknown as Animated.CompositeAnimation);
    });

    return () => running.forEach(anim => anim.stop());
  }, [bubbles]);

  return (
    <View style={[StyleSheet.absoluteFillObject, style]}>
      {bubbles.map((bubble, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bubble,
            {
              transform: [
                { translateX: bubble.translateX },
                { translateY: bubble.translateY },
                { scale: bubble.scale },
              ],
              opacity: bubble.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wave: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.3,
    borderRadius: width,
    opacity: 0.15,
  },
  wave1: {
    backgroundColor: '#667eea',
    bottom: -50,
    left: -width * 0.25,
  },
  wave2: {
    backgroundColor: '#764ba2',
    bottom: -100,
    left: -width * 0.25,
  },
  wave3: {
    backgroundColor: '#f093fb',
    bottom: -150,
    left: -width * 0.25,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  geometricPattern: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: '50%',
    left: '50%',
    marginTop: -100,
    marginLeft: -100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagon: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ rotate: '45deg' }],
    opacity: 0.3,
  },
  bubble: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default {
  FloatingCircles,
  WaveBackground,
  ParticleRain,
  GeometricPattern,
  AnimatedGradient,
  BubbleBackground,
};