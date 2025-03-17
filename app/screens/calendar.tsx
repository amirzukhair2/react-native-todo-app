import dayjs from 'dayjs'
import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'

import { Calendar, type ICalendarEventBase, type Mode, CalendarTouchableOpacityProps } from 'react-native-big-calendar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { events } from '../../events'


export interface MyCustomEventType {
  color: string
}

const renderEvent = <T extends ICalendarEventBase>(
  event: T,
  touchableOpacityProps: CalendarTouchableOpacityProps,
) => (
  <TouchableOpacity {...touchableOpacityProps}>
    <Text>{event.title}</Text>
  </TouchableOpacity>
)


const EmptyHourComponent = () => <View />; // Empty component

interface IndexProps {
  onPress: (data: {title: String}) => void; // Define the onPress function type
  items: {title: string, id: string, start: Date, end: Date}[];
  addNewTodo: (title: string,start: Date, end: Date) => void;
}

export default function Index({ onPress,items, addNewTodo }: IndexProps) {
  const { height } = useWindowDimensions()
  const [additionalEvents, setAdditionalEvents] = React.useState<ICalendarEventBase[]>([])

  const addEvent = React.useCallback(
    (start: Date) => {
      const title = 'new Event'
      const end = dayjs(start).add(59, 'minute').toDate()
      
      onPress({title: ''});
      // setAdditionalEvents([...additionalEvents, { start, end, title }])
      addNewTodo(title,start,end);
    },
    [additionalEvents],
  )

  const addLongEvent = React.useCallback(
    (start: Date) => {
      const title = 'new Long Event'
      const end = dayjs(start).add(1, 'hour').add(59, 'minute').toDate()
      setAdditionalEvents([...additionalEvents, { start, end, title }])
    },
    [additionalEvents],
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View>
        <SafeAreaView>
          <Calendar
            hourComponent={EmptyHourComponent} // Hide hour labels
            height={height - 60}
            events={[...items, ...additionalEvents]}
            onLongPressCell={addLongEvent}
            onPressCell={addEvent}
            sortedMonthView={false}
            mode={'week'}
            moreLabel="+{moreCount}"
            onPressMoreLabel={(moreEvents) => {
              console.log(moreEvents)
            }}
            renderEvent={renderEvent}
            itemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginEnd: 15,
  },
  buttonContainerActive: {
    borderBottomColor: 'blue',
    borderBottomWidth: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headline: {
    fontSize: 16,
  },
  itemSeparator: {
    height: 5,
    marginBottom: 20,
  },
})
