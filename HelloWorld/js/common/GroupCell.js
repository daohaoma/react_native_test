/**
 *
 *
 * @flow
 */
'use strict';

import React, {Component} from 'react'
import {
    AsyncStorage,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    Dimensions,
    View,
} from 'react-native'
import GlobalStyles from '../../res/styles/GlobalStyles'
import KpiChart from './KpiChart'
import DataToken from '../expand/dao/DataToken'
const {height, width} = Dimensions.get('window');
export default class GroupCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.groupModel.isFavorite,
            favoriteIcon: this.props.groupModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png'),
        };
        this.authorization = 'eGlhb21pbmcucWk6cHNfMTIyMQ==';
        this.token = '';
        this.url = 'http://m.pousheng.com';
    }
    componentDidMount() {
        this._fetchNetToken(this.url)
    }

    componentWillReceiveProps(nextProps) {//当从当前页面切换走，再切换回来后
        this.setFavoriteState(nextProps.groupModel.isFavorite)
    }

    setFavoriteState(isFavorite) {
        this.props.groupModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        })
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite)
        this.props.onFavorite(this.props.groupModel.item, !this.state.isFavorite)
    }

    _fetchNetToken(url) {
        this.DataToken = new DataToken(this.props);
        return new Promise((resolve, reject) => {
            this.DataToken.fetchToken(url, this.authorization).then((data) => {

                    if (!data) {
                        reject(new Error('token is null'));
                        return;
                    }
                    resolve(data);
                    this.saveToken(url, data)
                }).done();
            });
    }

    fetchLocalToken(url) {
        return new Promise((resolve, reject) => {
            var token_key = 'token_' + url;
            AsyncStorage.getItem(token_key, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

    saveToken(url, token, callback) {
        if (!token || !url)return;
        let wrapData = {token: token, date: new Date().getTime()};
        var token_key = 'token_' + url;
        AsyncStorage.setItem(token_key, JSON.stringify(wrapData), callback);
    }

    removeToken(url) {
        var token_key = 'token_' + url;
        AsyncStorage.removeItem(token_key, (error, result) => {
            if (error) console.log(error);
        });
    }

    render() {
        let item = this.props.groupModel.item ? this.props.groupModel.item : this.props.groupModel;
        //this.removeToken(this.url)
        this.fetchLocalToken(this.url).then((data) => {
            this.token = data.token
            //console.log(this.token)
        })

        let TouchableElement = TouchableHighlight;

        console.log(this.token )

        let favoriteButton = this.props.groupModel.item ?
            <TouchableHighlight
                style={{padding:6}}
                onPress={()=>this.onPressFavorite()} underlayColor='transparent'>
                <Image
                    ref='favoriteIcon'
                    style={[{width: 16, height: 16},this.props.theme.styles.tabBarSelectedIcon]}
                    source={this.state.favoriteIcon}/>
            </TouchableHighlight> : null;
        return (
            <TouchableElement
                style={GlobalStyles.dashboard_cell_container}
                onPress={this.props.onSelect}
                onShowUnderlay={this.props.onHighlight}
                underlayColor='transparent'
                onHideUnderlay={this.props.onUnhighlight}>
                <View>
                    <View style={styles.item}>
                        <Image source={{uri: this.url + item.ThumbnailUri + 'sm&' + 'token=' +this.token   }}
                               style={{width: 100, height: 150}} />
                        <Text style={styles.title}>
                            {item.Name}
                        </Text>
                        {/*<Text style={styles.value}>*/}
                         {/*{item.Value}*/}
                        {/*</Text>*/}
                        {/*<KpiChart*/}
                            {/*{...{navigator}}*/}
                            {/*chartData={item.TrendSet}*/}
                        {/*/>*/}
                    </View>
                </View>
            </TouchableElement>

        );
    }
}


var styles = StyleSheet.create({
    item:{
        alignItems: 'center'
    },
    title: {
        fontSize: 11,
        color: '#212121',
    },
    value: {
        marginTop: 8,
        fontSize: 15,
        color: '#757575',
    },
});

