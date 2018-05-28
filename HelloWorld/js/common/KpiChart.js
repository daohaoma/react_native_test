/**
 * Created by developer on 2017/3/19.
 */

'use strict';

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
} from 'react-native'

var details = [11,2,13,4,15];

export default class KpiChart extends Component {
    constructor(props) {
        super(props);
        this.props= props;
    }

    renderExpenseItem(item) {
        var item_width=3
        var items_width=2
        if(this.props.chartData.length==12)
        {
            item_width=8
            items_width=8
        }


        //console.log(item)
        return (
            <View style={[styles.items, {width: items_width}]}>

                <View style={


                    [  styles.item,{width: item_width} ,{height: item}]


                }></View>
            </View>
        );
    }

    render() {
        var k =this.props.chartData
        var c=k[0]

        for(var i=1;i<k.length;i++)
        {

            if(c<k[i])
            {
                c=k[i]
            }
        }

        for(var j=0;j<k.length;j++)
        {
            k[j]=k[j]/c*25
        }
        //console.log(k)



        return (

            <View style={styles.container}>
                {

                    k.map((item) => this.renderExpenseItem(item))
                    //details.map((item) => this.renderExpenseItem(item))
            }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 6,
        flexDirection: 'row',
        //flexWrap: 'wrap',
        height: 20,
        marginBottom: 6
    },
    items: {
        alignItems: 'center',
        //width: 4,
        height: 20,
        //backgroundColor: "white",
        justifyContent: 'flex-end',
        margin: 1
    },
    item: {
        backgroundColor: "white",
    }
});
