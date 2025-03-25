import { Stack } from 'expo-router';
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    router.replace("./Screens/WelcomeScreen"); // Redirect to Welcome screen
  }, []);

  return <Stack />;
}