import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SectionList
} from 'react-native'
import TabNavigator from 'react-native-tab-navigator'
// import Home from './components/Home'
// import Nice from './components/Nice'
import TabNavigatorItem from "react-native-tab-navigator/TabNavigatorItem"

export default class RootApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'FlatList'
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TabNavigator>
          <TabNavigatorItem
            title="Home"
            onPress={() => this.setState({selectedTab: 'home'})}
            selected={this.state.selectedTab === 'home'}>
            {/* <Home/> */}
            <Text>
              我是home
            </Text>
          </TabNavigatorItem>
          <TabNavigatorItem
            title='长列表'
            onPress={() => this.setState({selectedTab: 'FlatList'})}
            selected={this.state.selectedTab === 'FlatList'}
          >
            <View>
              <FlatList
                data={[
                  {key: 'Devin'},
                  {key: 'Jackson'},
                  {key: 'James'},
                  {key: 'Joel'},
                  {key: 'John'},
                  {key: 'Jillian'},
                  {key: 'Jimmy'},
                  {key: 'Julie'},
                ]}
                renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
              />
              {/* <SectionList
                sections={[
                  {title: 'D', data: ['D']},
                  {title: 'J', data: ['J', 'Ja', 'Ji', 'Jm', 'Jo', 'Jh', 'Ju']},
                ]}
                renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
                renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
              /> */}
            </View>
          </TabNavigatorItem>
        </TabNavigator>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
})