## 🌌 SpaceBackground

`SpaceBackground` is an animated background component that displays moving stars reacting to the device's gyroscope. It creates an immersive space effect perfect for onboarding screens, games, or creative layouts.

### ✨ Features

- Parallax starfield background
- Real-time gyroscope animation
- Fully customizable number, size, and motion sensitivity of stars
- Wrap any content with `children` to display over the starfield

---

## Installation

```bash
npm install react-native-expo-backgrounds expo-sensors
```

> ⚠️ **Note:** This library depends on `expo-sensors` for device motion features like the gyroscope.

## ⚙️ Props

| Prop                | Type        | Default | Description                                            |
| ------------------- | ----------- | ------- | ------------------------------------------------------ |
| `children`          | `ReactNode` | `—`     | Components to render on top of the animated background |
| `numStarts`         | `number`    | `100`   | Number of stars to render                              |
| `sizeStarts`        | `number`    | `1`     | Base size for each star (randomized slightly per star) |
| `sencivity`         | `number`    | `10`    | Controls how much the stars move with device rotation  |
| `intervalGyroscope` | `number`    | `50`    | Update interval (in ms) for gyroscope readings         |

## 📝 Notes

- If you notice the animation is too sensitive or slow, tweak `sencivity` or `intervalGyroscope` to fit your needs.
- Ideal for use with `Expo` projects. If using in bare `React Native apps`, make sure `expo-sensors` is configured properly.

## Usage example: SpaceBackground

```ts
import { SpaceBackground } from 'react-native-expo-backgrounds';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <StarBackground>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Welcome to the universe!</Text>
      </View>
    </SpaceBackground>
  );
}
```

## 🧪 Example with customization

```ts
import { SpaceBackground } from 'react-native-expo-backgrounds';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <StarBackground
        numStarts={150}
        sizeStarts={1.5}
        sencivity={50}
        intervalGyroscope={30}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Welcome to the universe!</Text>
      </View>
    </SpaceBackground>
  );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 📄 License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
