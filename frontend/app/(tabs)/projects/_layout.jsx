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
                name="projectdetails" 
                options={{
                    headerTitle: 'Project Details',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        height: 80,
                        backgroundColor: "#0a0f1a"
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#FFFFFF"
                    },
                }} 
            />
        </Stack>
    );
}
