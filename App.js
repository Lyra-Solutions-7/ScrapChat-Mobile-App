import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, FlatList,Image, View, ScrollView,StyleSheet, Text, TextInput, TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera, CameraType } from 'expo-camera';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

var noOfPhotos = 0;
var uriArray = [];

/* Screen Functions */

function LoginScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>User Login</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Username"
      />
      <TextInput
        secureTextEntry
        style={styles.textInput}
        placeholder="Password"
      />
      <Button
        title="Log in"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={styles.menuButtons}>
      <Row>
      <Col numRows={3}>
      <TouchableHighlight onPress={() => navigation.navigate('Camera')}>
        <Image source={require('./assets/camerabutton.png')}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => navigation.navigate('ARView')}>
        <Image source={require('./assets/arviewbutton.png')}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => navigation.navigate('Community')}>
        <Image source={require('./assets/communitybutton.png')}/>
      </TouchableHighlight>
      </Col>
      <Col numRows={3}>
      <TouchableHighlight onPress={() => navigation.navigate('Photos')}>
        <Image source={require('./assets/photosbutton.png')}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => navigation.navigate('Map')}>
        <Image source={require('./assets/mapbutton.png')}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => navigation.navigate('Settings')}>
        <Image source={require('./assets/settingsbutton.png')}/>
      </TouchableHighlight>
      </Col>
      </Row>
    </View>
  );
}

function CameraScreen({}) {
  let camRef = useRef();

  let takePhoto = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    var hour = new Date().getHours();
    var minute = new Date().getMinutes();
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    let location = await Location.getCurrentPositionAsync({});
    var lat = location.coords.latitude;
    var long = location.coords.longitude;
    //var lat = 1;
    //var long = 1;

    Alert.alert('Photo taken at:', hour+':'+minute+', '+day+'-'+ month +'-'+ year +'\nLatitude: '+lat+
    '\nLongitude: '+long);
    const {uri} = await camRef.current.takePictureAsync(options);
    const asset = await MediaLibrary.createAssetAsync(uri);
    MediaLibrary.createAlbumAsync("ScrapChat", asset);
  };

  return (
    <View style={styles.container}>
      <Camera ref={camRef} style={styles.camera} type={CameraType.back}>
        <View style={styles.takePictureButton}>
          <TouchableHighlight onPress={() =>takePhoto()}>
            <Image source={require('./assets/takephoto.png')}/>
          </TouchableHighlight>
        </View>
      </Camera>
    </View>
  );

}

function PhotosScreen() {
  let checkAlbum = async () => {
    const album = await MediaLibrary.getAlbumAsync("ScrapChat");
    if (album === null){
    }
    else {
      const savedImages = await MediaLibrary.getAssetsAsync({album:album});
      const imageArray = savedImages.assets
      noOfPhotos = imageArray.length;
      for (let i = 0; i < imageArray.length; i++) {
        uriArray[i] = imageArray[i].uri;
      }
    }
  };
  let showInfo = async () => {
    Alert.alert("This is an image");
  };
  checkAlbum()
  return (
    <ScrollView >
      <Text>Number of saved photos: {noOfPhotos}</Text>
      <TouchableHighlight onPress={() => showInfo()}>
        <Image source={{ uri: uriArray[0], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => showInfo()}>
        <Image source={{ uri: uriArray[1], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => showInfo()}>
        <Image source={{ uri: uriArray[2], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => showInfo()}>
        <Image source={{ uri: uriArray[3], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => showInfo()}>
        <Image source={{ uri: uriArray[4], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => showInfo()}>
        <Image source={{ uri: uriArray[5], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => showInfo()}>
        <Image source={{ uri: uriArray[6], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => showInfo()}>
        <Image source={{ uri: uriArray[7], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => showInfo()}>
        <Image source={{ uri: uriArray[8], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => showInfo()}>
        <Image source={{ uri: uriArray[9], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
    </ScrollView>
    
  );
}

function MapScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <MapView style={styles.map} />
    </View>
  );
}

function ARViewScreen() {
  let ARcamRef = useRef();

  return (
    <View style={styles.container}>
      <Camera ref={ARcamRef} style={styles.camera} type={CameraType.back}>
        <View>
        <Button
            title="Show Objects"
          />
        </View>
      </Camera>
    </View>
  );
}

function CommunityScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  useEffect(() => {
    (async () => {
      //const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      //setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  
  /*
  const [cameraAllowed, requestCameraPermission] = Camera.useCameraPermissions();
  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log("Please grant location permissions");
      return;
    }
  }
  getLocationPermission();

  if (!cameraAllowed.granted==null) {
    Alert.alert('Camera Permission', "Please allow ScrapChat to use your device's camera",
    [{text:'Allow', onPress: () => requestCameraPermission}, {text: 'Dismiss'}]);
  }

  else {*/
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Camera" component={CameraScreen}/>
        <Stack.Screen name="Photos" component={PhotosScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="ARView" component={ARViewScreen} />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
//}
}

const Row = ({ children }) => (
  <View style={styles.row}>{children}</View>
)
const Col = ({ numRows, children }) => {
  return  (
    <View style={styles[`${numRows}col`]}>{children}</View>
  )
}
const styles = StyleSheet.create({
  textInput: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  menuButtons: {
    backgroundColor:  "white",
    flex: 3,
  },
  row: {
    flexDirection: 'row',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
  },
  takePictureButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom:0,
  },
  camera: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default App;