/**
 * 添加Trending语言,Popular 关键字
 * @flow
 * **/

import React, {
    Component
} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    Alert
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import BaseCommon from '../../common/BaseCommon'
import {
    MORE_MENU
} from '../../common/MoreMenu'
import ViewUtils from '../../util/ViewUtils'
import DataManifest from '../../expand/dao/DataManifest'

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.baseCommon = new BaseCommon({...props,
            backPress: (e) => this.onBackPress(e)
        });
        this.changeValues = [];
        this.isRemoveKey = this.props.menuType === MORE_MENU.Remove_Key;
        this.state = {
            dataArray: [],
            server: 'm.pousheng.com',
            username: 'tao.she',
            password: 'Hellott201711',
        }
        this.authorization = 'dGFvLnNoZTpIZWxsb3R0MjAxNzEx';
    }

    componentDidMount() {
        this.baseCommon.componentDidMount();
    }

    componentWillUnmount() {
        this.baseCommon.componentWillUnmount();
    }

    onBackPress(e) {
        this.onBack();
        return true;
    }

    onConnect() {
        var url = "http://" + this.state.server;
        this.DataManifest = new DataManifest();
        this.DataManifest.fetchManifest(url);

        // if (this.changeValues.length === 0) {
        //     this.props.navigator.pop();
        //     return;
        // }

        if (this.props.fromPage) {
            this.props.homeComponent.onReStart(this.props.fromPage)
        } else {
            this.props.navigator.pop();
        }
    }

    onBack() {
        this.props.navigator.pop();
    }

    renderView() {
        return <View style={styles.loginItemContainer}>
            <View style={styles.loginItem}>
                <Text style={styles.serverText}> Server: </Text>
                <TextInput style={styles.loginServerInput}
                           autoCapitalize="none"
                           autoCorrect={false}
                           value={this.state.server}
                />
            </View>
            <View style={styles.loginItem}>
                <Text style={styles.serverText}> UserName: </Text>
                <TextInput style={styles.loginServerInput}
                           autoCapitalize="none"
                           autoCorrect={false}
                           value={this.state.username}
                />
            </View>
            <View style={styles.loginItem}>
                <Text style={styles.serverText}> Password: </Text>
                <TextInput style={styles.loginServerInput}
                           autoCapitalize="none"
                           autoCorrect={false}
                           secureTextEntry={true}
                           value={this.state.password}
                />
            </View>

        </View>
    }

    render() {
        let rightButtonTitle = this.isRemoveKey ? 'Remove' : 'Connect';
        let rightButtonConfig = {
            title: rightButtonTitle,
            handler: () => this.onConnect(),
            tintColor: 'white',
        };
        let navigationBar =
            <NavigationBar
                title={this.props.menuType}
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                style={this.props.theme.styles.navBar}
                rightButton={rightButtonConfig}/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        flexDirection: 'row',
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray'
    },
    loginItemContainer: {
        marginTop: 15,
    },
    loginItem: {
        //flexDirection:'row'
        margin: 10
    },
    serverText: {
        fontSize: 20

    },
    loginServerInput: {
        margin: 3,
        height: 35,
        borderColor: 'gray',
        borderWidth: 1,
        fontSize: 17
    }
})