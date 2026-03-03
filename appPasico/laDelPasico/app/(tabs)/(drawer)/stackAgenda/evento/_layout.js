import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="[nidEvento]" // Nombre de la pantalla principal
        options={({ route }) => ({
          headerShown: false,
        })}
      />
    </Stack>
  );
}
