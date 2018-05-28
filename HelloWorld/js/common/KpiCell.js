/**
 *
 *
 * @flow
 */
'use strict';

import React, {Component} from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    Dimensions,
    View,
} from 'react-native'
import GlobalStyles from '../../res/styles/GlobalStyles'
import KpiChart from './KpiChart'
const {height, width} = Dimensions.get('window');
export default class KpiCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png'),
        };
    }

    componentWillReceiveProps(nextProps) {//当从当前页面切换走，再切换回来后
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        })
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite)
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
    }

    _forMarValue(value, format) {
        let formartvalue = ''

        if (String(value).includes('\"')) {

            /*正则表达式替换引号 */
            formartvalue = String(value).replace(/\"/g, '')
        } else if
        (format == 'Percent' && !String(value).includes('%')) {
            formartvalue = String(this._toDecimal(value * 100)) + '%'
        } else {
            formartvalue = value
        }
        return formartvalue
    }

    /*数据类型转换*/
    _toDecimal(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return;
        }
        f = Math.round(x * 100) / 100;
        return f;
    }

    render() {
        let item = this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel;
        //console.log(item)
        let color_id = ''
        if(item.Status==1)
        {
            color_id= '#5dd439'
        }else if(item.Status==0)
        {
            color_id= '#FFCD3B'
        }else if(item.Status==-1)
        {
            color_id= 'red'
        }else
        {
            color_id= '#5dd439'
        }
        let TouchableElement = TouchableHighlight;
        let favoriteButton = this.props.projectModel.item ?
            <TouchableHighlight
                style={{padding: 6}}
                onPress={() => this.onPressFavorite()} underlayColor='transparent'>
                <Image
                    ref='favoriteIcon'
                    style={[{width: 16, height: 16}, this.props.theme.styles.tabBarSelectedIcon]}
                    source={this.state.favoriteIcon}/>
            </TouchableHighlight> : null;
        return (
            <TouchableElement
                style={[GlobalStyles.cell_container,{backgroundColor: color_id}]}
                onPress={this.props.onSelect}
                onShowUnderlay={this.props.onHighlight}
                underlayColor='transparent'
                onHideUnderlay={this.props.onUnhighlight}>
                <View>
                    <View style={styles.item}>
                        <Text style={styles.title}>
                            {item.Name}
                        </Text>
                        <Text style={styles.value}>
                            {this._forMarValue(item.Value, item.ValueFormat)}
                        </Text>
                        <KpiChart
                        {...{navigator}}
                        chartData={item.TrendSet}
                        />
                    </View>
                </View>
            </TouchableElement>

        );
    }
}


var styles = StyleSheet.create({
    item: {
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        color: '#ffffff',
    },
    value: {
        marginTop: 4,
        fontSize: 20,
        color: '#ffffff',
        fontWeight  : '700'
    },
});

