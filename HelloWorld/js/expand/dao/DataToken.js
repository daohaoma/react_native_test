/**
 * DataToken
 * 刷新从网络获取;非刷新从本地获取,
 * 若本地数据过期,先返回本地数据,然后返回从网络获取的数据
 * @flow
 */
'use strict';

import {
    AsyncStorage,
} from 'react-native';

const token_str = '/api3/auth';

export default class DataToken {
    constructor() {
    }

    fetchToken(url, authorization) {
        return new Promise((resolve, reject) => {
                this.fetchNetToken(url, authorization).then((data) => {
                    resolve(data);
                }).catch((error => {
                    reject(error);
                }))

        })
    }

    fetchNetToken(url, authorization) {
        var tokenurl = url + token_str;
        return new Promise((resolve, reject) => {
            fetch(
                tokenurl,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + authorization,
                        'Accept': 'application/json'
                    }
                }
            )
                .then((response) => response.json())
                .catch((error) => {
                    reject(error);
                }).then((responseData) => {
                if (!responseData || !responseData.Token) {
                    reject(new Error('token responseData is null'));
                    return;
                }
                resolve(responseData.Token);
                var token_key = 'token_' + url;
                this.saveToken(url, responseData.Token)

            }).done();
        })
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

    checkDate(longTime) {
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if (currentDate.getMonth() !== targetDate.getMonth())return false;
        if (currentDate.getDate() !== targetDate.getDate())return false;
        if (currentDate.getHours() - targetDate.getHours() > 4)return false;
        // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
        return true;
    }
}
