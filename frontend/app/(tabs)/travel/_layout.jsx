import { Stack } from "expo-router";

export default function TravelLayout() {
    return (
        <Stack>
            <Stack.Screen 
                name="index" 
                options={{
                    headerTitle: 'Explore',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        height: 80,
                        backgroundColor: '#0a0f1a',
                    },
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'white',
                    },
                    headerTintColor: 'white',
                }} 
            />
            <Stack.Screen 
                name="routescreen" 
                options={{
                    headerTitle: 'Available Routes',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        height: 80,
                        backgroundColor: '#0a0f1a',
                    },
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'white',
                    },
                    headerTintColor: 'white',
                }} 
            />
            <Stack.Screen 
                name="mapscreen" 
                options={{
                    headerTitle: 'Your Route',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        height: 80,
                        backgroundColor: '#0a0f1a',
                    },
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'white',
                    },
                    headerTintColor: 'white',
                }} 
            />
            <Stack.Screen 
                name="booking" 
                options={{
                    headerTitle: 'Booking Summary',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        height: 80,
                        backgroundColor: '#0a0f1a',
                    },
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'white',
                    },
                    headerTintColor: 'white',
                }} 
            />
            <Stack.Screen 
                name="tickets" 
                options={{
                    headerTitle: 'Tickets',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        height: 80,
                        backgroundColor: '#0a0f1a',
                    },
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'white',
                    },
                    headerTintColor: 'white',
                }} 
            />
        </Stack>
    );
}