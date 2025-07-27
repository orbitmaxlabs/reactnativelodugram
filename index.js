import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// Some build configurations attempt to start the app using the component name
// "auth" instead of the default "main". Registering this alias avoids runtime
// errors like "Component auth has not been registered yet".
AppRegistry.registerComponent('auth', () => App);
