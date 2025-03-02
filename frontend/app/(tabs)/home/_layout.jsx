import { Stack } from "expo-router";

export default function TravelLayout() {
    return (
        <Stack>
            <Stack.Screen 
                name="index" 
                options={{
                    headerShown: false,
                    headerTitle: 'Where To?',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        height: 80,
                    },
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                    },
                }} 
            />
            <Stack.Screen 
  name="account" 
  options={{
    headerTitle: 'Your Account',
    headerTitleAlign: 'center',
    headerStyle: {
      height: 80,
      backgroundColor: '#0a0f1a', // Set header background color
    },
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff', // Set header text color to white
    },
    headerTintColor: '#fff', // Set back button and other icons to white
  }} 
/>
        </Stack>
    );
}
