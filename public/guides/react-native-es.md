# React Native - Guía de Aprendizaje

## Qué es React Native y Diferencias con React
**Descripción:** React Native es un framework que permite desarrollar aplicaciones móviles nativas para iOS y Android usando React y JavaScript, compilando a código nativo en lugar de ejecutarse en un WebView.

**Ejemplo:**
```javascript
// React (Web) - Renderiza en el DOM
import React from 'react';

function WebApp() {
  return (
    <div className="container">
      <h1>Mi App Web</h1>
      <p>Este es un párrafo en HTML</p>
      <button onClick={() => alert('Hola!')}>
        Hacer clic
      </button>
      <input type="text" placeholder="Escribe algo..." />
    </div>
  );
}

// React Native (Móvil) - Renderiza componentes nativos
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet
} from 'react-native';

function MobileApp() {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi App Móvil</Text>
      <Text style={styles.paragraph}>
        Este es texto nativo de la plataforma
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => Alert.alert('¡Hola desde móvil!')}
      >
        <Text style={styles.buttonText}>Tocar aquí</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Escribe algo..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666'
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    backgroundColor: 'white'
  }
});

// Principales diferencias:
// 1. Componentes: div → View, p → Text, button → TouchableOpacity
// 2. Estilos: CSS classes → StyleSheet objects
// 3. Eventos: onClick → onPress
// 4. Navegación: diferente sistema de rutas
// 5. APIs específicas de plataforma disponibles

// Ejemplo de funcionalidades específicas móviles
import {
  Dimensions,
  Platform,
  StatusBar,
  BackHandler
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

function AdvancedMobileFeatures() {
  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  // Obtener dimensiones de la pantalla
  const { width, height } = Dimensions.get('window');

  // Detectar plataforma
  const isIOS = Platform.OS === 'ios';
  const isAndroid = Platform.OS === 'android';

  // Almacenamiento local persistente
  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  };

  // Permisos y ubicación
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  // Manejo del botón atrás en Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        Alert.alert(
          '¿Salir de la app?',
          '¿Estás seguro que quieres salir?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sí', onPress: () => BackHandler.exitApp() }
          ]
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }
  }, []);

  return (
    <View style={{
      flex: 1,
      paddingTop: StatusBar.currentHeight || 0
    }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <Text>Ancho de pantalla: {width}</Text>
      <Text>Alto de pantalla: {height}</Text>
      <Text>Plataforma: {Platform.OS}</Text>
      <Text>Versión: {Platform.Version}</Text>
      
      {location && (
        <Text>
          Ubicación: {location.coords.latitude}, {location.coords.longitude}
        </Text>
      )}

      {isIOS && (
        <Text style={{ color: 'blue' }}>
          Funcionalidades específicas de iOS
        </Text>
      )}

      {isAndroid && (
        <Text style={{ color: 'green' }}>
          Funcionalidades específicas de Android
        </Text>
      )}
    </View>
  );
}
```

**Comparación:** React Native vs Desarrollo Nativo - React Native permite usar una sola base de código para múltiples plataformas con rendimiento cercano al nativo, mientras el desarrollo nativo requiere códigos separados pero ofrece acceso completo a APIs de plataforma.

## Componentes Principales
**Descripción:** React Native proporciona componentes básicos que se mapean a elementos nativos de UI, permitiendo crear interfaces consistentes en diferentes plataformas.

**Ejemplo:**
```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  Image,
  TextInput,
  Switch,
  ActivityIndicator,
  FlatList,
  SectionList,
  Modal,
  Alert
} from 'react-native';

// Componente principal que demuestra todos los elementos básicos
function MainComponents() {
  const [switchValue, setSwitchValue] = useState(false);
  const [inputText, setInputText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Datos para las listas
  const simpleData = [
    { id: '1', title: 'Elemento 1', subtitle: 'Descripción del elemento 1' },
    { id: '2', title: 'Elemento 2', subtitle: 'Descripción del elemento 2' },
    { id: '3', title: 'Elemento 3', subtitle: 'Descripción del elemento 3' },
    { id: '4', title: 'Elemento 4', subtitle: 'Descripción del elemento 4' },
  ];

  const sectionData = [
    {
      title: 'Frutas',
      data: ['Manzana', 'Banana', 'Naranja', 'Uva']
    },
    {
      title: 'Verduras',
      data: ['Lechuga', 'Tomate', 'Cebolla', 'Zanahoria']
    },
    {
      title: 'Carnes',
      data: ['Pollo', 'Res', 'Pescado', 'Cerdo']
    }
  ];

  const handleButtonPress = () => {
    Alert.alert(
      'Botón presionado',
      '¡Has presionado el botón!',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'OK', onPress: () => console.log('OK presionado') }
      ]
    );
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Carga completa', 'La operación ha terminado');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Textos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Componentes de Texto</Text>
          <Text style={styles.normalText}>Texto normal</Text>
          <Text style={styles.boldText}>Texto en negrita</Text>
          <Text style={styles.italicText}>Texto en cursiva</Text>
          <Text style={styles.coloredText}>Texto con color</Text>
        </View>

        {/* Botones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos de Botones</Text>
          
          <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
            <Text style={styles.buttonText}>TouchableOpacity</Text>
          </TouchableOpacity>

          <TouchableHighlight 
            style={styles.button}
            underlayColor="#ddd"
            onPress={handleButtonPress}
          >
            <Text style={styles.buttonText}>TouchableHighlight</Text>
          </TouchableHighlight>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={handleButtonPress}
          >
            <Text style={styles.buttonText}>Pressable</Text>
          </Pressable>
        </View>

        {/* Input y Switch */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controles de Entrada</Text>
          
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe algo aquí..."
            multiline={false}
          />

          <View style={styles.switchContainer}>
            <Text>Activar notificaciones:</Text>
            <Switch
              value={switchValue}
              onValueChange={setSwitchValue}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={switchValue ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Imágenes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imágenes</Text>
          
          {/* Imagen local */}
          <Image
            source={require('../assets/react.svg')}
            style={styles.localImage}
            resizeMode="contain"
          />

          {/* Imagen de red */}
          <Image
            source={{
              uri: 'https://picsum.photos/200/150',
              cache: 'only-if-cached'
            }}
            style={styles.networkImage}
            resizeMode="cover"
          />
        </View>

        {/* Lista simple */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lista Simple (FlatList)</Text>
          <FlatList
            data={simpleData}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={[
                styles.listItem,
                { backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }
              ]}>
                <Text style={styles.listItemTitle}>{item.title}</Text>
                <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>
              </View>
            )}
            style={styles.flatList}
            scrollEnabled={false} // Deshabilitado porque estamos dentro de ScrollView
          />
        </View>

        {/* Lista con secciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lista con Secciones</Text>
          <SectionList
            sections={sectionData}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <View style={styles.sectionListItem}>
                <Text>{item}</Text>
              </View>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
              </View>
            )}
            style={styles.sectionList}
            scrollEnabled={false}
          />
        </View>

        {/* Indicador de carga */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indicador de Carga</Text>
          <TouchableOpacity style={styles.button} onPress={simulateLoading}>
            <Text style={styles.buttonText}>Simular Carga</Text>
          </TouchableOpacity>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Cargando...</Text>
            </View>
          )}
        </View>

        {/* Modal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modal</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Abrir Modal</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Modal Component */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modal de Ejemplo</Text>
            <Text style={styles.modalText}>
              Este es un modal que se superpone al contenido principal.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.modalButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cerrar Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Componente avanzado con navegación y estado
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Pantalla de inicio
function HomeScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    name: 'Usuario',
    notifications: 5
  });

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Pantalla de Inicio</Text>
      <Text>Bienvenido, {userInfo.name}</Text>
      <Text>Tienes {userInfo.notifications} notificaciones</Text>
      
      <TouchableOpacity
        style={styles.navigateButton}
        onPress={() => navigation.navigate('Details', { userId: 123 })}
      >
        <Text style={styles.buttonText}>Ir a Detalles</Text>
      </TouchableOpacity>
    </View>
  );
}

// Pantalla de detalles
function DetailsScreen({ route, navigation }) {
  const { userId } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: `Usuario ${userId}`,
      headerRight: () => (
        <TouchableOpacity onPress={() => Alert.alert('Configuraciones')}>
          <Text style={{ color: '#007AFF', marginRight: 15 }}>Config</Text>
        </TouchableOpacity>
      )
    });
  }, [navigation, userId]);

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Detalles del Usuario</Text>
      <Text>ID del usuario: {userId}</Text>
      
      <TouchableOpacity
        style={styles.navigateButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

// Componente de navegación principal
function AppWithNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  normalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  italicText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  coloredText: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  localImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  networkImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  flatList: {
    maxHeight: 200,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionList: {
    maxHeight: 300,
  },
  sectionHeader: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    color: '#495057',
  },
  sectionListItem: {
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  modalButton: {
    marginTop: 10,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  navigateButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
});

export default MainComponents;
```

**Comparación:** Componentes RN vs HTML - Los componentes de React Native se mapean directamente a elementos nativos de UI (View→UIView/ViewGroup, Text→UILabel/TextView), ofreciendo mejor rendimiento que los WebView.

## StyleSheet y Flexbox
**Descripción:** React Native usa StyleSheet para definir estilos y Flexbox como sistema de layout principal, proporcionando diseños responsivos y consistentes.

**Ejemplo:**
```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';

const { width, height } = Dimensions.get('window');

function StylesAndLayoutExamples() {
  const [layoutMode, setLayoutMode] = useState('flex');

  // Ejemplo básico de Flexbox
  const FlexboxBasics = () => (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Flexbox Básico</Text>
      
      {/* Flex Direction */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>Flex Direction</Text>
        
        <View style={styles.flexRow}>
          <View style={[styles.flexItem, { backgroundColor: '#ff6b6b' }]}>
            <Text style={styles.flexText}>1</Text>
          </View>
          <View style={[styles.flexItem, { backgroundColor: '#4ecdc4' }]}>
            <Text style={styles.flexText}>2</Text>
          </View>
          <View style={[styles.flexItem, { backgroundColor: '#45b7d1' }]}>
            <Text style={styles.flexText}>3</Text>
          </View>
        </View>

        <View style={styles.flexColumn}>
          <View style={[styles.flexItem, { backgroundColor: '#96ceb4' }]}>
            <Text style={styles.flexText}>A</Text>
          </View>
          <View style={[styles.flexItem, { backgroundColor: '#feca57' }]}>
            <Text style={styles.flexText}>B</Text>
          </View>
        </View>
      </View>

      {/* Justify Content */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>Justify Content</Text>
        
        <View style={[styles.flexRow, styles.justifyStart]}>
          <View style={[styles.smallItem, { backgroundColor: '#ff9ff3' }]}>
            <Text>Start</Text>
          </View>
          <View style={[styles.smallItem, { backgroundColor: '#54a0ff' }]}>
            <Text>Start</Text>
          </View>
        </View>

        <View style={[styles.flexRow, styles.justifyCenter]}>
          <View style={[styles.smallItem, { backgroundColor: '#5f27cd' }]}>
            <Text style={{ color: 'white' }}>Center</Text>
          </View>
          <View style={[styles.smallItem, { backgroundColor: '#00d2d3' }]}>
            <Text>Center</Text>
          </View>
        </View>

        <View style={[styles.flexRow, styles.justifySpaceBetween]}>
          <View style={[styles.smallItem, { backgroundColor: '#ff6348' }]}>
            <Text style={{ color: 'white' }}>Between</Text>
          </View>
          <View style={[styles.smallItem, { backgroundColor: '#2ed573' }]}>
            <Text>Between</Text>
          </View>
        </View>
      </View>

      {/* Align Items */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>Align Items</Text>
        
        <View style={[styles.flexRow, styles.alignStretch, { height: 80 }]}>
          <View style={[styles.flexItem, { backgroundColor: '#ffa502' }]}>
            <Text>Stretch</Text>
          </View>
          <View style={[styles.flexItem, { backgroundColor: '#3742fa' }]}>
            <Text style={{ color: 'white' }}>Stretch</Text>
          </View>
        </View>

        <View style={[styles.flexRow, styles.alignCenter, { height: 80, backgroundColor: '#f1f2f6' }]}>
          <View style={[styles.smallItem, { backgroundColor: '#2f3542' }]}>
            <Text style={{ color: 'white' }}>Center</Text>
          </View>
          <View style={[styles.smallItem, { backgroundColor: '#ff3838' }]}>
            <Text style={{ color: 'white' }}>Center</Text>
          </View>
        </View>
      </View>

      {/* Flex Values */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>Flex Values</Text>
        
        <View style={styles.flexRow}>
          <View style={[styles.flexBase, { flex: 1, backgroundColor: '#7bed9f' }]}>
            <Text>Flex: 1</Text>
          </View>
          <View style={[styles.flexBase, { flex: 2, backgroundColor: '#70a1ff' }]}>
            <Text>Flex: 2</Text>
          </View>
          <View style={[styles.flexBase, { flex: 1, backgroundColor: '#ff6b81' }]}>
            <Text>Flex: 1</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Layouts responsivos
  const ResponsiveLayouts = () => (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Layouts Responsivos</Text>
      
      {/* Grid Layout */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>Grid Simulado</Text>
        <View style={styles.gridContainer}>
          {Array.from({ length: 6 }, (_, index) => (
            <View 
              key={index}
              style={[
                styles.gridItem,
                { backgroundColor: `hsl(${index * 60}, 70%, 70%)` }
              ]}
            >
              <Text>Item {index + 1}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Card Layout */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>Cards Responsivas</Text>
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Card 1</Text>
            <Text style={styles.cardContent}>
              Contenido de la primera tarjeta con información relevante.
            </Text>
            <TouchableOpacity style={styles.cardButton}>
              <Text style={styles.cardButtonText}>Acción</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Card 2</Text>
            <Text style={styles.cardContent}>
              Segunda tarjeta con más contenido para demostrar flexibilidad.
            </Text>
            <TouchableOpacity style={styles.cardButton}>
              <Text style={styles.cardButtonText}>Ver Más</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Layout Dimensions Based */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>Layout basado en Dimensiones</Text>
        <Text style={styles.dimensionInfo}>
          Ancho: {width.toFixed(0)}px, Alto: {height.toFixed(0)}px
        </Text>
        <View style={[
          styles.responsiveContainer,
          { 
            flexDirection: width > 400 ? 'row' : 'column',
            height: width > 400 ? 100 : 200 
          }
        ]}>
          <View style={[
            styles.responsiveItem,
            { 
              width: width > 400 ? '48%' : '100%',
              backgroundColor: '#dda0dd'
            }
          ]}>
            <Text>Responsive A</Text>
          </View>
          <View style={[
            styles.responsiveItem,
            { 
              width: width > 400 ? '48%' : '100%',
              backgroundColor: '#98fb98'
            }
          ]}>
            <Text>Responsive B</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Advanced Styling
  const AdvancedStyling = () => (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Estilos Avanzados</Text>
      
      {/* Shadows and Elevation */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>Sombras y Elevación</Text>
        
        <View style={styles.shadowContainer}>
          <View style={[styles.shadowBox, styles.shadowIOS]}>
            <Text>Sombra iOS</Text>
          </View>
          
          <View style={[styles.shadowBox, styles.elevationAndroid]}>
            <Text>Elevación Android</Text>
          </View>
          
          <View style={[styles.shadowBox, styles.combinedShadow]}>
            <Text>Sombra Combinada</Text>
          </View>
        </View>
      </View>

      {/* Borders and Radius */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>Bordes y Radius</Text>
        
        <View style={styles.bordersContainer}>
          <View style={styles.roundedBox}>
            <Text>Redondeado</Text>
          </View>
          
          <View style={styles.circularBox}>
            <Text style={styles.circularText}>●</Text>
          </View>
          
          <View style={styles.partiallyRounded}>
            <Text>Parcialmente</Text>
            <Text>Redondeado</Text>
          </View>
          
          <View style={styles.dashedBorder}>
            <Text>Borde</Text>
            <Text>Punteado</Text>
          </View>
        </View>
      </View>

      {/* Positioning */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>Posicionamiento</Text>
        
        <View style={styles.positionContainer}>
          <View style={styles.relativeBox}>
            <Text>Relativo</Text>
            <View style={styles.absoluteBox}>
              <Text style={styles.absoluteText}>Absoluto</Text>
            </View>
          </View>
          
          <View style={styles.zIndexDemo}>
            <View style={[styles.zIndexBox, styles.zIndex1]}>
              <Text>Z-Index 1</Text>
            </View>
            <View style={[styles.zIndexBox, styles.zIndex2]}>
              <Text>Z-Index 2</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Transforms */}
      <View style={styles.subSection}>
        <Text style={styles.subTitle}>Transformaciones</Text>
        
        <View style={styles.transformContainer}>
          <View style={[styles.transformBox, styles.rotated]}>
            <Text>Rotado</Text>
          </View>
          
          <View style={[styles.transformBox, styles.scaled]}>
            <Text>Escalado</Text>
          </View>
          
          <View style={[styles.transformBox, styles.translated]}>
            <Text>Trasladado</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>StyleSheet y Flexbox</Text>
        
        <View style={styles.toggleContainer}>
          {['flex', 'responsive', 'advanced'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.toggleButton,
                layoutMode === mode && styles.toggleButtonActive
              ]}
              onPress={() => setLayoutMode(mode)}
            >
              <Text style={[
                styles.toggleButtonText,
                layoutMode === mode && styles.toggleButtonTextActive
              ]}>
                {mode === 'flex' ? 'Flexbox' : 
                 mode === 'responsive' ? 'Responsive' : 'Avanzado'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {layoutMode === 'flex' && <FlexboxBasics />}
      {layoutMode === 'responsive' && <ResponsiveLayouts />}
      {layoutMode === 'advanced' && <AdvancedStyling />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#212529',
    marginBottom: 15,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
  },
  toggleButtonActive: {
    backgroundColor: '#007bff',
  },
  toggleButtonText: {
    color: '#6c757d',
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: '#ffffff',
  },
  exampleContainer: {
    padding: 20,
  },
  exampleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
  },
  subSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#495057',
  },
  
  // Flexbox Styles
  flexRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  flexColumn: {
    flexDirection: 'column',
    height: 120,
  },
  flexItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    paddingVertical: 15,
    borderRadius: 4,
  },
  flexText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  smallItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBase: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
  },
  
  // Justify Content
  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
  
  // Align Items
  alignStretch: {
    alignItems: 'stretch',
  },
  alignCenter: {
    alignItems: 'center',
  },
  
  // Grid Layout
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  
  // Cards
  cardsContainer: {
    flexDirection: width > 400 ? 'row' : 'column',
    justifyContent: 'space-between',
  },
  card: {
    width: width > 400 ? '48%' : '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 15,
    lineHeight: 20,
  },
  cardButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  cardButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  
  // Responsive
  dimensionInfo: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 10,
    textAlign: 'center',
  },
  responsiveContainer: {
    justifyContent: 'space-between',
  },
  responsiveItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
    paddingVertical: 20,
  },
  
  // Shadows
  shadowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  shadowBox: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 8,
  },
  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  elevationAndroid: {
    elevation: 8,
  },
  combinedShadow: {
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  
  // Borders
  bordersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  roundedBox: {
    width: 80,
    height: 60,
    backgroundColor: '#ffc107',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  circularBox: {
    width: 60,
    height: 60,
    backgroundColor: '#dc3545',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  circularText: {
    color: 'white',
    fontSize: 24,
  },
  partiallyRounded: {
    width: 80,
    height: 60,
    backgroundColor: '#28a745',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  dashedBorder: {
    width: 80,
    height: 60,
    backgroundColor: '#17a2b8',
    borderWidth: 2,
    borderColor: '#6f42c1',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  // Positioning
  positionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  relativeBox: {
    position: 'relative',
    width: 100,
    height: 100,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  absoluteBox: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 50,
    height: 30,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  absoluteText: {
    color: 'white',
    fontSize: 12,
  },
  zIndexDemo: {
    width: 120,
    height: 100,
  },
  zIndexBox: {
    position: 'absolute',
    width: 80,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  zIndex1: {
    backgroundColor: '#ffc107',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  zIndex2: {
    backgroundColor: '#007bff',
    top: 20,
    left: 20,
    zIndex: 2,
  },
  
  // Transforms
  transformContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  transformBox: {
    width: 80,
    height: 80,
    backgroundColor: '#6f42c1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  rotated: {
    transform: [{ rotate: '45deg' }],
  },
  scaled: {
    transform: [{ scaleX: 1.2 }, { scaleY: 0.8 }],
  },
  translated: {
    transform: [{ translateX: 10 }, { translateY: -10 }],
  },
});

export default StylesAndLayoutExamples;
```

**Comparación:** StyleSheet RN vs CSS - StyleSheet de React Native usa una sintaxis similar a CSS pero optimizada para móvil, con propiedades específicas como elevation (Android) y shadow (iOS).
