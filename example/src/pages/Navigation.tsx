import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerLabel } from "../components/Drawer/DrawerLabel";
import tw from "../theme";
import { CarouselScreen } from "./carousel/CarouselScreen";
import WelcomeScreen from "./welcome/WelcomeScreen";

const Drawer = createDrawerNavigator();

const Navigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Carousel"
      screenOptions={{
        drawerContentStyle: tw`bg-primary`,
        drawerItemStyle: tw`bg-primary`,
        drawerLabelStyle: tw`text-4xl text-white font-bold`,
        drawerType: "back",
        headerShown: false,
      }}
    >
      <Drawer.Screen
        component={WelcomeScreen}
        name="Welcome"
        options={{
          drawerLabel: ({ focused }) => (
            <DrawerLabel focused={focused} label="Welcome" />
          ),
        }}
      />

      <Drawer.Screen
        component={CarouselScreen}
        name="Carousel"
        options={{
          drawerLabel: ({ focused }) => (
            <DrawerLabel focused={focused} label="Carousel" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default Navigation;
