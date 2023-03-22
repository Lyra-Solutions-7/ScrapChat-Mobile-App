import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, View, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera, CameraType } from 'expo-camera';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import * as SQLite from "expo-sqlite";

var noOfPhotos = 0;
var uriArray = [];
var timeArray = [];
var dateArray = [];
var latArray = [];
var longArray = [];
var selectedPhoto = 0;

/* Screen Functions */

function LoginScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{fontSize: 20}}>User Login</Text>
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

    if (hour < 10)
      hour = '0' + hour;
    if (minute < 10)
      minute = '0' + minute;
    if (day < 10)
      day = '0' + day;
    if (month < 10)
      month = '0' + month;

    var time = hour+':'+minute;
    var date = day+'-'+month+'-'+year

    let location = await Location.getCurrentPositionAsync({});
    var lat = location.coords.latitude;
    var long = location.coords.longitude;

    const {uri} = await camRef.current.takePictureAsync(options);
    const asset = await MediaLibrary.createAssetAsync(uri);
    MediaLibrary.createAlbumAsync("ScrapChat", asset);
    timeArray.push(time);
    dateArray.push(date);
    latArray.push(lat);
    longArray.push(long);
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
  const [isLoading, setIsLoading] = useState(true);
  const [photo, setPhoto] = useState();

  var message = '';

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
    setIsLoading(false);
  };
  let getInfo = async (num) => {
    selectedPhoto = num;
    setPhoto("Selected");
  };

  checkAlbum()
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading photos...</Text>
      </View>
    );
  }
  if (photo) {
    //console.log(uriArray[selectedPhoto]);
    return (
      <View style={{backgroundColor:  "white"}}>
        <Image source={{ uri:  uriArray[selectedPhoto] }} style={{width: 400, height: 300,}}/>
        <Text style={{fontSize: 20}}>   Photo taken at:</Text>
        <Text style={{fontSize: 20}}>   {timeArray[selectedPhoto]}</Text>
        <Text style={{fontSize: 20}}>   {dateArray[selectedPhoto]}</Text>
        <Text style={{fontSize: 20}}>   Latitude: {latArray[selectedPhoto]}</Text>
        <Text style={{fontSize: 20}}>   Longitude: {longArray[selectedPhoto]}</Text>
        <TouchableHighlight onPress={() => Alert.alert('Upload Photo','Photo successfully uploaded.')}>
          <Image source={require('./assets/uploadbutton.png')}/>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => setPhoto(undefined)}>
          <Image source={require('./assets/backbutton.png')}/>
        </TouchableHighlight>
      </View>
    );
  }
  return (
    <ScrollView style={{backgroundColor:  "white"}}>
      <Text style={{fontSize: 20}}>   Number of saved photos: {noOfPhotos}</Text>
      <TouchableHighlight onPress={() => getInfo(0)}>
        <Image source={{ uri: uriArray[0], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => getInfo(1)}>
        <Image source={{ uri: uriArray[1], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => getInfo(2)}>
        <Image source={{ uri: uriArray[2], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => getInfo(3)}>
        <Image source={{ uri: uriArray[3], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => getInfo(4)}>
        <Image source={{ uri: uriArray[4], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => getInfo(5)}>
        <Image source={{ uri: uriArray[5], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => getInfo(6)}>
        <Image source={{ uri: uriArray[6], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => getInfo(7)}>
        <Image source={{ uri: uriArray[7], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => getInfo(8)}>
        <Image source={{ uri: uriArray[8], isStatic: true,}} style={{width: 400, height: 300,}}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => getInfo(9)}>
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
  /* Handling permissions */
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasLocationPermission, setHasLocationPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasLocationPermission(locationPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  const db = SQLite.openDatabase("scrapchat.db");
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS photos (path TEXT PRIMARY KEY NOT NULL, time TEXT, date TEXT, lat REAL, long REAL)"
      );
    });
  }, []);

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