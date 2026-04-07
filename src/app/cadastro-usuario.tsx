import UserSignupScreen from '@/components/auth/user-signup-screen';
import React from 'react';
import { View } from 'react-native';

export default function UserSignupRoute() {
  return (
    <View style={{ flex: 1 }}>
      <UserSignupScreen />
    </View>
  );
}