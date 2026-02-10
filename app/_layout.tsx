import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#000000" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: "#000000" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "USSD Simulator",
          }}
        />
        <Stack.Screen
          name="create"
          options={{
            title: "New Instance",
            presentation: "modal",
            headerStyle: { backgroundColor: "#1C1C1E" },
          }}
        />
        <Stack.Screen
          name="dialer/[id]"
          options={{
            title: "",
            headerTransparent: true,
            headerBackTitle: "Back",
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
