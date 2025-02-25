import { View, Text } from 'react-native'
import React from 'react'

import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../firebaseConfig';

import { Button } from 'react-native-paper'



interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Details = ({navigation} : RouterProps) => {
  return (
    <View className='flex justify-center items-center flex-1 gap-4'>
      <Button mode='contained-tonal' onPress={() => navigation.navigate('Todo')}>Open Todo</Button>
      <Button mode='contained-tonal' onPress={() => FIREBASE_AUTH.signOut()}>Logout</Button>
    </View>
  )
}

export default Details