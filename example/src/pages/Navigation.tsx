import { createDrawerNavigator } from "@react-navigation/drawer";
import WelcomeScreen from "./welcome/WelcomeScreen";

const Drawer = createDrawerNavigator();

const Navigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen component={WelcomeScreen} name="Welcome" />
    </Drawer.Navigator>
  );
};

export default Navigation;
