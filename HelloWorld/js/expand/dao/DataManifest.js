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

import DataToken from './DataToken'

const manifest_str = '/api3/manifest';

export default class DataManifest {
    constructor() {
        this.authorization = 'dGFvLnNoZTpIZWxsb3R0MjAxNzEx';
    }

    fetchManifest(url) {
        //this.removeManifest(url)
        return new Promise((resolve, reject) => {
            this.fetchLocalManifest(url).then((wrapData) => {
                if (wrapData) {
                    resolve(wrapData, true);
                } else {
                    this.fetchNetManifest(url).then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    })
                }

            }).catch((error) => {
                console.log('fetchLocalManifest fail:' + error);
                this.fetchNetManifest(url).then((data) => {
                    resolve(data);
                }).catch((error => {
                    reject(error);
                }))
            })
        })
    }

    fetchNetManifest(url) {
        this.DataToken = new DataToken(this.props);
        return new Promise((resolve, reject) => {
            this.DataToken.fetchToken(url, this.authorization).then((data) => {
                fetch(
                        (url + manifest_str), {
                            method: 'GET',
                            headers: {
                                'des-token': data,
                                'Accept': 'application/json'
                            }
                        }
                    )
                    .then((response) => response.json())
                    .catch((error) => {
                        reject(error);
                    }).then((responseData) => {
                        if (!responseData || !responseData.Hubs) {
                            console.log(responseData)
                            reject(new Error('manifest responseData is null'));
                            return;
                        }
                        resolve(responseData.Hubs);
                        this.saveManifest(url, responseData.Hubs)
                    }).done();
            });
        })
    }

    fetchLocalManifest(url) {
        return new Promise((resolve, reject) => {
            var manifest_key = 'manifest_' + url;
            AsyncStorage.getItem(manifest_key, (error, result) => {
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

    saveManifest(url, hubs, callback) {
        if (!hubs || !url) return;
        let wrapData = {
            Hubs: hubs,
            date: new Date().getTime()
        };
        var manifest_key = 'manifest_' + url;
        AsyncStorage.setItem(manifest_key, JSON.stringify(wrapData), callback);
    }

    removeManifest(url) {
        var manifest_key = 'manifest_' + url;
        AsyncStorage.removeItem(manifest_key, (error, result) => {
            if (error) console.log(error);
        });
    }

    checkDate(longTime) {
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours() - targetDate.getHours() > 4) return false;
        if (currentDate.getMinutes() - targetDate.getMinutes() > 1) return false;
        return true;
    }
}