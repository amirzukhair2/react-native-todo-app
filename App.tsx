import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button} from "react-native";
import "./global.css";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import List from "./app/screens/List";
import Details from "./app/screens/Details";
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import Login from "./app/screens/Login";

import MyCalendar from './app/screens/calendar';

import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig";



import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Account from './components/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};


const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();


function InsideLayout (user: any) {
  return(
    <InsideStack.Navigator>
      <InsideStack.Screen name={`UserName: ${user}`} component={Details}/>
      <InsideStack.Screen name="Todo" component={List}/>
    </InsideStack.Navigator>
  )
}

export default function App() {


  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user)
      setUser(user);
    })
  }, [])
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={session && session.user ? "マイToDo" : "Login"}>
        {/* <Stack.Navigator initialRouteName={"Agenda"}> */}

        {session && session.user ? (
             <Stack.Screen
             name="マイToDo"
             component={List}
             options={({navigation}) => ({
               headerRight: () => (
                 <View style={styles.buttonWrapper}>
                   <Button
                     onPress={() => {
                      console.log('a')
                      navigation.navigate('Inside')
                     } }
                     title="アカウント"
                   />
                 </View>
               ),
             })}
           />
           ):(
          <>
            <Stack.Screen name="Login" component={Auth} />
          </>
        )
        }

        <Stack.Screen name="Inside" component={(props: any) => <Account {...props} key={session?.user.id} session={session} /> }  options={{headerShown: false}}/>
        {/* <Stack.Screen name="Agenda" component={(props: any) => <MyCalendar /> }/> */}

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    marginRight: 10,  // Add margin to the content of the button
  },
});
