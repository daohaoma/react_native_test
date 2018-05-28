/**
 * RespositoryDao
 * @flow
 */
'use strict';

import {
    AsyncStorage,
} from 'react-native';

export default class LanguageDao{
    constructor(flag) {
        this.flag = flag;
    }
    fetch(){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(this.flag,(error,result)=>{
                if(error){
                    reject(error);
                    return;
                }
                    try {
                        result = JSON.parse(result)
                        resolve(result.Hubs[0].KpiGroups);
                    } catch (e) {
                        reject(error);
                    }

        });
        });
    }
    save(objectData){
        var stringData=JSON.stringify(objectData);
        AsyncStorage.setItem(this.flag,stringData,(error,result)=>{

        });
    }
}