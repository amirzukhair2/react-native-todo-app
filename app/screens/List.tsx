import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { Button, TextInput, Portal, Modal } from "react-native-paper";
import MyCalendar from "../../app/screens/calendar";
import { supabase } from "../../lib/supabase";
import dayjs from "dayjs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Calendar,
  type ICalendarEventBase,
  type Mode,
  CalendarTouchableOpacityProps,
  CalendarHeaderProps,
} from "react-native-big-calendar";
import "dayjs/locale/ja";

export type Item = {
  title: string;
  id: string;
  start: Date;
  end: Date;
};

const EmptyHourComponent = () => <View />; // Empty component

const renderEvent = <T extends ICalendarEventBase & { id?: string | number }>(
  event: T,
  touchableOpacityProps: CalendarTouchableOpacityProps
) => {
  // Extract key from touchableOpacityProps if it's present
  const { key, ...restProps } = touchableOpacityProps;

  return (
    <TouchableOpacity key={key} {...restProps} className="justify-center">
      <Text className="text-base text-center text-white">{event.title}</Text>
      {/* {event.id && <Text className="text-xs text-center text-gray-300">ID: {event.id}</Text>} */}
    </TouchableOpacity>
  );
};

function List({ navigation }: any) {
  const [eventData, setEventData] = React.useState<{
    id: number;
    title: string;
    start: Date;
    end: Date;
  }>({
    id: 0,
    title: "", // Provide a default title
    start: new Date(), // Provide a default start date (current date/time)
    end: new Date(), // Provide a default end date (current date/time)
  });

  const [todos, setTodos] = useState<Item[]>([]);
  const { height } = useWindowDimensions();
  const [additionalEvents, setAdditionalEvents] = React.useState<
    ICalendarEventBase[]
  >([]);

  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ title: string } | null>(
    null
  );

  const [isNew, setIsNew] = useState(false);

  const showModal = (item: any, date: Date) => {
    setVisible(true);
    setSelectedItem(item);
  };
  const hideModal = async () => {
    setVisible(false);

    if (eventData) {
      const { id, title, start, end } = eventData;
      if (isNew) {
        addNewTodo(title, start, end);
        setAdditionalEvents([...todos, { id, start, end, title }]);
        // setEventData(null); // Reset event data after adding
      } else {
        setAdditionalEvents([...additionalEvents, { id, start, end, title }]);
        updateTodo(id, title);
      }
    }
  };

  const handleTitleChange = (text: string) => {
    if (eventData) {
      setEventData({ ...eventData, title: text });
    }
  };

  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    width: `100%` as "100%",
    maxWidth: 680,
    alignSelf: `center` as "center",
  };

  const addEvent = (s: Date) => {
    const selectedDay = dayjs(s).date(); // Get the selected day

    const occupiedHours = todos
      .filter((todo) => dayjs(todo.start).date() === selectedDay) // Filter by the same day
      .map((todo) => dayjs(todo.start).hour());

    //Find the first available hour
    let startHour = 0; // Start checking from 1 AM
    while (occupiedHours.includes(startHour)) {
      startHour++;
    }

    const id = 0;
    const title = "";
    const start = dayjs(s).hour(startHour).minute(0).toDate();
    const end = dayjs(start).add(59, "minute").toDate();
    setEventData({ id, title, start, end }); // Store event details in state
  };

  const editEvent = (event: any) => {
    setIsNew(false);
    console.log(event);
    setEventData({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
    }); // Load event data
    showModal({ title: event.title }, event.start); // Open modal for editing
  };
  const addNewTodo = async (title: string, start: Date, end: Date) => {
    const { data, error } = await supabase
      .from("todo") // your table name
      .insert([
        {
          title,
          // done: false,
          start,
          end,
        },
      ])
      .select();
    if (error) {
      console.error("Error inserting todo:", error);
    } else {
      fetchTodos();
      console.log("Todo added:", data);
    }
  };

  async function fetchTodos() {
    const { data, error } = await supabase.from("todo").select("*"); // Select all columns from the "todo" table

    if (error) {
      console.error("Error fetching todos:", error);
      return;
    }
    const sortedTodos = data
      ?.map((todo) => {
        // Convert the 'start' value to a Date object and add 2 hours
        const startDate = dayjs(todo.start).toDate();
        const endDate = dayjs(todo.end).toDate();

        // Update the todo's 'start and end' fields with the new time
        return { ...todo, start: startDate, end: endDate };
      })
      .sort((a, b) => {
        const dateA = new Date(a.start);
        const dateB = new Date(b.start);
        return dateB.getTime() - dateA.getTime(); // Sort by most recent 'start' time
      });

    console.log("Todos:", sortedTodos);
    setTodos(sortedTodos); // Update the todos state
    setAdditionalEvents(sortedTodos);
  }

  const updateTodo = async (id: number, title: string) => {
    const { data, error } = await supabase
      .from("todo") // your table name
      .update({ title })
      .eq("id", id);

    if (error) {
      console.error("Error inserting todo:", error);
    } else {
      console.log("Todo added:", data);
      fetchTodos();
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const renderHeader: React.FC<CalendarHeaderProps<ICalendarEventBase>> = ({
    dateRange,
  }) => {
    return (
      <View style={styles.headerContainer}>
        {dateRange.map((date, index) => (
          <View key={index}>
            <Text className="text-center text-base text-white bg-blue-500 p-2 max-w-fit mx-auto rounded-full">
              {dayjs(date).format("MMM D")}
            </Text>
            <Button
              onPress={() => {
                addEvent(date.toDate());
                showModal("1", date.toDate());
                setIsNew(true);
              }}
              mode="contained"
              style={{ marginTop: 10 }}
            >
              Todoを追加する ＋
            </Button>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="px-4" style={{ flex: 1 }}>
      <ScrollView>
        {/* <MyCalendar onPress={showModal} items={todos} addNewTodo={addNewTodo}/> */}

        <GestureHandlerRootView style={{ flex: 1 }}>
          <View>
            <SafeAreaView>
              <Calendar
                renderHeader={renderHeader}
                locale="ja"
                // hourComponent={EmptyHourComponent} // Hide hour labels
                height={height - 60}
                events={[...todos, ...additionalEvents]}
                hideNowIndicator={true}
                maxHour={12}
                // onPressCell={addEvent}
                onPressEvent={editEvent}
                sortedMonthView={false}
                mode={"week"}
                moreLabel="+{moreCount}"
                onPressMoreLabel={(moreEvents) => {
                  console.log(moreEvents);
                }}
                renderEvent={renderEvent}
                itemSeparatorComponent={() => (
                  <View style={styles.itemSeparator} />
                )}
              />
            </SafeAreaView>
          </View>
        </GestureHandlerRootView>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
          >
            {selectedItem && (
              <>
                <TextInput
                  value={eventData?.title}
                  onChangeText={handleTitleChange}
                />
                <Button
                  onPress={hideModal}
                  mode="contained"
                  style={{ marginTop: 10 }}
                >
                  ほぞんしてとじる
                </Button>
              </>
            )}
          </Modal>
        </Portal>
      </ScrollView>
    </View>
  );
}

export default List;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
  },
  buttonContainer: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginEnd: 15,
  },
  buttonContainerActive: {
    borderBottomColor: "blue",
    borderBottomWidth: 3,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  headline: {
    fontSize: 16,
  },
  itemSeparator: {
    height: 5,
    marginBottom: 20,
  },
});
