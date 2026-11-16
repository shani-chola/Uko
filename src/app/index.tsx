import 'react-native-gesture-handler';

import { useEffect, useState } from 'react';

import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { useFonts } from 'expo-font';

import { supabase } from '../../lib/supabase';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const COLORS = {
  black: '#080808',
  dark: '#141414',
  card: '#202020',
  grey: '#888888',
  silver: '#BDBDBD',
  white: '#FFFFFF',
};

const sellers = [
  {
    id: '1',
    name: 'Brian Mwangi',
    ticket: 'Blankets & Wine',
    price: 'KSh 2,200',
    quantity: '2 tickets',
    rating: '4.9'
  },
  {
    id: '2',
    name: 'Sarah Wanjiku',
    ticket: 'Afro Festival',
    price: 'KSh 1,500',
    quantity: '1 ticket',
    rating: '4.8'
  },
  {
    id: '3',
    name: 'Kevin Otieno',
    ticket: 'Jazz Night',
    price: 'KSh 1,200',
    quantity: '3 tickets',
    rating: '4.7'
  },
  {
    id: '4',
    name: 'Mary Njeri',
    ticket: 'Tech Connect',
    price: 'KSh 900',
    quantity: '1 ticket',
    rating: '5.0'
  },
  {
    id: '5',
    name: 'David Kimani',
    ticket: 'December Fest',
    price: 'KSh 2,800',
    quantity: '2 tickets',
    rating: '4.9'
  }
];

const hosts = [
  {
    id: '1',
    name: 'Nyha Wambugu',
    description: "Nyha's Christmas House Party",
    date: '26 Dec 2026',
    location: 'Kilimani',
    for: 'Party-goers seeking company over the holidays',
    slots: '3',
    guestRequirements: 'Bring your own Bottle',
    rating: '5.0'
  },
  {
    id: '2',
    name: 'Destiny Adhiambo',
    description: "Destiny's Rift Valley Roadtrip",
    date: '5 - 8 Dec 2026',
    location: 'Nairobi-West',
    for: 'Travellers with a love for spontaneity',
    slots: '5',
    guestRequirements: 'Contact host',
    rating: '4.9'
  },
  {
    id: '3',
    name: 'Anton Waruhiu',
    description: 'Odeal: Africa 2026 Pregame',
    date: '19 Dec 2026',
    location: 'Imara Daima',
    for: 'Guests with tickets to Odeal',
    slots: '3',
    guestRequirements: 'Organize own transport and bring your own bottle',
    rating: '4.7'
  },
  {
    id: '4',
    name: 'Yobi Odhiambo',
    description: 'Solfest After-Party Kickback',
    date: '19 Dec 2026',
    location: 'Roysambu',
    for: 'Guests looking to keep the party going',
    guestRequirements: 'Bring a Friend',
    slots: '7',
    rating: '4.3'
  },
  {
    id: '5',
    name: 'Marlene Gilo',
    description: 'Kolakopia Pregame',
    date: '12 Dec 2026',
    location: 'Westlands',
    for: 'Lone Kolakopia ticket holders',
    guestRequirements: 'Contact host',
    slots: '5',
    rating: '5.0'
  }
];

function Heading({ children }) {
  return <Text style={styles.heading}>{children}</Text>;
}

function EventCard({ event }) {
  const openTicketLink = async () => {
    if (!event.ticket_url) {
      Alert.alert(
        'Unavailable',
        'Ticket link is not available yet.'
      );
      return;
    }

    try {
      await Linking.openURL(event.ticket_url);
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not open the ticket website.'
      );
    }
  };

  return (
    <View style={styles.rowCard}>
      {event.image_url ? (
        <Image
          source={{ uri: event.image_url }}
          style={styles.eventImage}
        />
      ) : null}

      <View style={styles.rowDetails}>
        <Text style={styles.cardTitle}>
          {event.name}
        </Text>

        <Text style={styles.muted}>
          {event.event_date}
        </Text>

        <Text style={styles.muted}>
          {event.location}
        </Text>

        <Text style={styles.muted}>
          {event.description}
        </Text>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={openTicketLink}
        >
          <Text style={styles.buttonText}>
            View Event
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SellerCard({ seller }) {
  return (
    <View style={styles.rowCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {seller.name.charAt(0)}
        </Text>
      </View>

      <View style={styles.rowDetails}>
        <Text style={styles.cardTitle}>
          {seller.name}
        </Text>

        <Text style={styles.muted}>
          {seller.ticket}
        </Text>

        <Text style={styles.muted}>
          {seller.quantity} · ★ {seller.rating}
        </Text>

        <Text style={styles.price}>
          {seller.price}
        </Text>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={() =>
            Alert.alert(
              'Contact seller',
              `Start a conversation with ${seller.name}`
            )
          }
        >
          <Text style={styles.buttonText}>
            Contact seller
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HostCard({ host, onContact }) {
  return (
    <View style={styles.rowCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {host.name.charAt(0)}
        </Text>
      </View>

      <View style={styles.rowDetails}>
        <Text style={styles.cardTitle}>
          {host.description}
        </Text>

        <Text style={styles.muted}>
          {host.name} · ★ {host.rating}
        </Text>

        <Text style={styles.muted}>
          {host.date}
        </Text>

        <Text style={styles.muted}>
          For: {host.for}
        </Text>

        <Text style={styles.muted}>
          {host.location}
        </Text>

        <Text style={styles.muted}>
          Guest requirements: {host.guestRequirements}
        </Text>

        <Text style={styles.muted}>
          Available slots: {host.slots}
        </Text>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => onContact(host)}
        >
          <Text style={styles.buttonText}>
            Contact host
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BarterSection() {
  return (
    <View style={styles.section}>
      <Heading>Ticket Barter</Heading>

      <Text style={styles.muted}>
        Have a ticket you can no longer use?
        Exchange it with another user.
      </Text>

      <View style={styles.barterCard}>
        <View style={styles.rowDetails}>
          <Text style={styles.cardTitle}>
            Exchange your tickets
          </Text>

          <Text style={styles.muted}>
            Find someone willing to trade their ticket for yours.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            Alert.alert(
              'Ticket barter',
              'Sign in and select a previously purchased ticket to list for exchange.'
            )
          }
        >
          <Text style={styles.buttonText}>
            Start bartering
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [activeSection, setActiveSection] = useState('Marketplace');
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter(event =>
    `${event.name} ${event.location || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredSellers = sellers.filter(seller =>
    `${seller.name} ${seller.ticket}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredHosts = hosts.filter(host =>
    `${host.name} ${host.description} ${host.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.log('Error fetching events:', error.message);
      return;
    }

    setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const contactHost = host => {
    navigation.navigate('Inbox', {
      hostId: host.id,
      hostName: host.name
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topHeader}>
        <Text style={styles.logo}>Uko?</Text>

        <View style={styles.switchContainer}>
          {['Marketplace', 'Events', 'Hosts'].map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                setActiveSection(item);
                setSearch('');
              }}
              style={[
                styles.switchButton,
                activeSection === item && styles.activeSwitch
              ]}
            >
              <Text style={styles.switchText}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Heading>
            {activeSection === 'Marketplace'
              ? 'Tickets sold out? No problem'
              : activeSection === 'Events'
              ? 'Discover what is happening.'
              : 'Find friends for the occasion :)'}
          </Heading>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Search events, tickets, hosts or sellers..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />

        {activeSection === 'Marketplace' ? (
          <View style={styles.section}>
            <Heading>Available Tickets</Heading>

            {filteredSellers.map(seller => (
              <SellerCard
                key={seller.id}
                seller={seller}
              />
            ))}

            {filteredSellers.length === 0 && (
              <Text style={styles.muted}>
                No sellers found.
              </Text>
            )}

            <BarterSection />
          </View>
        ) : activeSection === 'Events' ? (
          <View style={styles.section}>
            <Heading>Popular Events</Heading>

            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}

            {filteredEvents.length === 0 && (
              <Text style={styles.muted}>
                No events found.
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <Heading>Hosts</Heading>

            {filteredHosts.map(host => (
              <HostCard
                key={host.id}
                host={host}
                onContact={contactHost}
              />
            ))}

            {filteredHosts.length === 0 && (
              <Text style={styles.muted}>
                No hosts found.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InboxScreen({ route }) {
  const host = route.params;
  const [message, setMessage] = useState('');

  return (
    <View style={styles.screen}>
      <Heading>Inbox</Heading>

      {host ? (
        <>
          <Text style={styles.cardTitle}>
            Conversation with {host.hostName}
          </Text>

          <View style={styles.emptyInbox}>
            <Text style={styles.muted}>
              Start your conversation with {host.hostName}.
            </Text>
          </View>

          <TextInput
            style={styles.search}
            placeholder="Write a message..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              if (!message.trim()) {
                Alert.alert(
                  'Empty message',
                  'Please type a message first.'
                );
                return;
              }

              Alert.alert(
                'Message',
                'Messaging will be connected to Supabase next.'
              );

              setMessage('');
            }}
          >
            <Text style={styles.buttonText}>
              Send message
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyInbox}>
          <Text style={styles.cardTitle}>
            No messages yet
          </Text>

          <Text style={styles.muted}>
            Contact a host or seller to start a conversation.
          </Text>
        </View>
      )}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: COLORS.dark,
          borderTopColor: '#333',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8
        },

        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.grey
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Text style={styles.navIcon}>⌂</Text>
          )
        }}
      />

      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          tabBarIcon: () => (
            <Text style={styles.navIcon}>✉</Text>
          )
        }}
      />
    </Tab.Navigator>
  );
}

function CustomDrawer(props) {
  const [profilePhoto, setProfilePhoto] = useState(null);

  const changePhoto = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'Please allow photo library access.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Logout failed', error.message);
      return;
    }

    Alert.alert(
      'Logged out',
      'You have successfully logged out.'
    );

    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: COLORS.dark }}
    >
      <View style={styles.drawerProfile}>
        <TouchableOpacity onPress={changePhoto}>
          {profilePhoto ? (
            <Image
              source={{ uri: profilePhoto }}
              style={styles.profilePhoto}
            />
          ) : (
            <View style={styles.profilePhoto}>
              <Text style={styles.avatarText}>U</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.cardTitle}>
          Your Profile
        </Text>

        <TouchableOpacity onPress={changePhoto}>
          <Text style={styles.muted}>
            Change profile photo
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => props.navigation.navigate('Main')}
      >
        <Text style={styles.drawerText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => props.navigation.navigate('Settings')}
      >
        <Text style={styles.drawerText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={logout}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.screen}>
      <Heading>Settings</Heading>

      <View style={styles.settingsRow}>
        <Text style={styles.cardTitle}>
          Notifications
        </Text>

        <TouchableOpacity
          onPress={() => setNotifications(!notifications)}
          style={styles.smallButton}
        >
          <Text style={styles.buttonText}>
            {notifications ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.muted}>
        Profile photo management is available from the drawer.
      </Text>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    RussoOne: RussoOne_400Regular
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => (
          <CustomDrawer {...props} />
        )}
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.dark
          },
          headerTintColor: COLORS.white,
          drawerStyle: {
            backgroundColor: COLORS.dark,
            width: 280
          },
          sceneStyle: {
            backgroundColor: COLORS.black
          }
        }}
      >
        <Drawer.Screen
          name="Main"
          component={MainTabs}
          options={{ title: 'Uko?' }}
        />

        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.black,
    padding: 16
  },

  topHeader: {
    paddingVertical: 12,
    gap: 14
  },

  logo: {
    color: COLORS.white,
    fontSize: 30,
    fontFamily: 'RussoOne'
  },

  heading: {
    color: COLORS.white,
    fontSize: 21,
    fontFamily: 'RussoOne',
    marginBottom: 12
  },

  intro: {
    marginVertical: 18
  },

  muted: {
    color: COLORS.grey,
    fontSize: 13,
    marginTop: 4
  },

  switchContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.dark,
    padding: 5,
    borderRadius: 10
  },

  switchButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8
  },

  activeSwitch: {
    backgroundColor: '#444'
  },

  switchText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13
  },

  search: {
    backgroundColor: COLORS.dark,
    color: COLORS.white,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20
  },

  section: {
    marginTop: 15,
    marginBottom: 15
  },

  rowCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    gap: 13
  },

  eventImage: {
    width: 105,
    height: 115,
    borderRadius: 9
  },

  rowDetails: {
    flex: 1,
    gap: 4
  },

  cardTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold'
  },

  price: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginTop: 4
  },

  smallButton: {
    backgroundColor: '#444',
    alignSelf: 'flex-start',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 7,
    marginTop: 6
  },

  primaryButton: {
    backgroundColor: '#555',
    padding: 14,
    alignItems: 'center',
    borderRadius: 9,
    marginTop: 12
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold'
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center'
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold'
  },

  barterCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginTop: 12
  },

  navIcon: {
    color: COLORS.white,
    fontSize: 22
  },

  emptyInbox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: COLORS.card,
    borderRadius: 12
  },

  drawerProfile: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginBottom: 15,
  },

  profilePhoto: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },

  drawerItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },

  drawerText: {
    color: COLORS.white,
    fontSize: 15
  },

  logoutText: {
    color: '#FF7777',
    fontSize: 15
  },

  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 10,
    marginVertical: 15
  }
});
