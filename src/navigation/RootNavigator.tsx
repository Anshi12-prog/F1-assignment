import React from 'react';
import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import {
  EmiPlansScreen,
  OrderConfirmedScreen,
  ProductDetailScreen,
  ReviewOrderScreen,
  ShopScreen,
} from '@/screens';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** React Navigation's theme is fed from the same tokens as the rest of the app. */
const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.brand,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Shop"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="EmiPlans" component={EmiPlansScreen} />
        <Stack.Screen name="ReviewOrder" component={ReviewOrderScreen} />
        <Stack.Screen
          name="OrderConfirmed"
          component={OrderConfirmedScreen}
          options={{ gestureEnabled: false, animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
