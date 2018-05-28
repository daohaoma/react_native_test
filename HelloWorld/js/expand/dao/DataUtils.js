/**
 * DataRepository
 * 刷新从网络获取;非刷新从本地获取,
 * 若本地数据过期,先返回本地数据,然后返回从网络获取的数据
 * @flow
 */
'use strict';

import {
    AsyncStorage,
} from 'react-native';

var dataUtils;
export default class DataUtils {
    constructor(isInit) {
        if (isInit)this.start();
    }

    static init(isInit) {
        if (!dataUtils) {
            dataUtils = new DataUtils(isInit);
        }
        return dataUtils;
    }

    start() {

    }
}
