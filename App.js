import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, PanResponder, View, StyleSheet, Button } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const examplePath = [
  { x: 90, y: 300 },
  { x: 170, y: 45 },
  { x: 250, y: 290 },
  { x: 45, y: 130 },
  { x: 285, y: 130 },
  { x: 90, y: 298 }
];
const GesturePath = ({ path, color, strokeWidth }) => {
  const { width, height } = Dimensions.get('window');
  const points = path.map(p => `${p.x},${p.y}`).join(' ');
  return (
    <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </Svg>    
  );
};

const GestureRecorder = ({ onPathChanged }) => {
  const pathRef = useRef([]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { pathRef.current = [] },
      onPanResponderMove: (event) => {
        pathRef.current.push({
          x: event.nativeEvent.locationX,
          y: event.nativeEvent.locationY,
        })
        onPathChanged([...pathRef.current]);
      },
      onPanResponderRelease: () => { onPathChanged([...pathRef.current]) }
    })
  ).current;

  return (
    <View
      style={StyleSheet.absoluteFill}
      {...panResponder.panHandlers}
    />
  );
}


const App = () => {
  const [path, setPath] = useState(examplePath);
  const [color, setColor] = useState('green');
  const [strokeWidth, setStrokeWidth] = useState('1');
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(
    Dimensions.get('window').width
  );
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get('window').height
  );
  useEffect(() => {
    const updateLayout = () => {
      setAvailableDeviceHeight(Dimensions.get('window').height);
      setAvailableDeviceWidth(Dimensions.get('window').width);
    };
    Dimensions.addEventListener('change', updateLayout)

    return () => {Dimensions.removeEventListener('change',updateLayout); };
  });
  if (availableDeviceWidth < availableDeviceHeight) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <GesturePath path={path} color={color} strokeWidth={strokeWidth} />
      <GestureRecorder onPathChanged={setPath} />
      <View style={{zIndex: 0,position:'absolute',top:'90%',flexDirection:'row'}}><Button title='red' onPress={() => setColor("red")}></Button>
      <Button title='1.5' onPress={() => setStrokeWidth("1.5")}></Button>
      </View>
    </View>
  );
}
return (
  <View style={StyleSheet.absoluteFill}>
    <GesturePath path={path} color={color} strokeWidth={strokeWidth} />
    <GestureRecorder onPathChanged={setPath} />
    <View style={{zIndex: 0,position:'absolute',top:'10%',flexDirection:'row'}}><Button title='red' onPress={() => setColor("red")}></Button>
    <Button title='1.5' onPress={() => setStrokeWidth("1.5")}></Button>
    </View>
  </View>
);
}

export default App