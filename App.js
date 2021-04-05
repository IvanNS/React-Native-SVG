import React, { useRef, useState } from 'react';
import { Dimensions, PanResponder, View, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const examplePath = [
  { x: 90, y: 300 },
  { x: 170, y: 45 },
  { x: 250, y: 290 },
  { x: 45, y: 130 },
  { x: 285, y: 130 },
  { x: 90, y: 298 }
];

const GesturePath = ({ path, color }) => {
  const { width, height } = Dimensions.get('window');
  const points = path.map(p => `${p.x},${p.y}`).join(' ');
  return (
    <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1"
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
  return (
    <View style={StyleSheet.absoluteFill}>
      <GesturePath path={path} color="green" />
      <GestureRecorder onPathChanged={setPath} />
    </View>
  );
}

export default App