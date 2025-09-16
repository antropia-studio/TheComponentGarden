import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerLabel } from "../components/Drawer/DrawerLabel";
import tw from "../theme";
import WelcomeScreen from "./welcome/WelcomeScreen";

const Drawer = createDrawerNavigator();

const Navigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        drawerContentStyle: tw`bg-primary`,
        drawerItemStyle: tw`bg-primary`,
        drawerType: "back",
        drawerLabelStyle: tw`text-4xl text-white font-bold`,
      }}
    >
      <Drawer.Screen
        component={WelcomeScreen}
        name="Welcome"
        options={{
          drawerLabel: ({ focused }) => (
            <DrawerLabel label="Welcome" focused={focused} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default Navigation;
