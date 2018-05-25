/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
})

const MOCKED_MOVIES_DATA = [
  {title: '勒布朗·詹姆斯', year: '2018骑士总冠军', posters: {thumbnail: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2467377107,2812520460&fm=27&gp=0.jpg'}},
]

// type Props = {}
export default class App extends Component {
  render() {
    let James = MOCKED_MOVIES_DATA[0]
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {James.title}
        </Text>
        <Text style={styles.instructions}>
          {James.year}
        </Text>
        <Text style={styles.instructions}>
          <Image source={{uri: James.posters.thumbnail}} style={styles.thumbnail} />
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 212,
    height: 324,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
