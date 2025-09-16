import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Navigation from "./pages/Navigation";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />

      <Navigation />
    </NavigationContainer>
  );
}
