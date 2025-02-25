import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { View } from 'react-native'

import {TextInput, Button} from 'react-native-paper'

function Login() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const auth = getAuth();

  const signUp = async() => {
    createUserWithEmailAndPassword(auth, email, password);
  }
  const signIn = async() => {
    signInWithEmailAndPassword(auth, email, password);
  }

  return (
    <View className='flex-1 items-center justify-center'>
        <View>

        <View className='flex-1 justify-center pb-4 items-center gap-2'>
        <TextInput label="Email" onChangeText={(text: string) => setEmail(text)} value={email} />
        <TextInput label="Password" onChangeText={(text: string) => setPassword(text)} value={password}/>
        </View>  

        <View className='flex gap-4 flex-row justify-center'>
        <Button mode='outlined'  onPress={signUp}>
        Create User
        </Button>
        <Button mode='contained'  onPress={signIn}>
          Sign in
        </Button>
        </View>  

        </View>
      
    </View>
  )
}

export default Login