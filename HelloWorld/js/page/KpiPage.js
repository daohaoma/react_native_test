/**
 * KpiPage
 * @flow
 */
'use strict';
import React, {Component} from 'react'
import {
    ListView,
    StyleSheet,
    RefreshControl,
    TouchableHighlight,
    Image,
    View
} from 'react-native'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import MoreMenu, {MORE_MENU} from '../common/MoreMenu'
import KpiCell from '../common/KpiCell'
import RepositoryDetail from './RepositoryDetail'
import FavoriteDao from '../expand/dao/FavoriteDao'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import DataManifest from '../expand/dao/DataManifest'
import CustomTheme from "./my/CustomTheme"
import SearchPage from "./SearchPage"
import ProjectModel from '../model/ProjectModel'
import {FLAG_TAB} from './HomePage'
import KpiGroupsDao, {FLAG_LANGUAGE}  from '../expand/dao/KpiGroupsDao'
import GlobalStyles from '../../res/styles/GlobalStyles'
import Utils from '../util/Utils'

const API_URL = 'http://m.pousheng.com'
const QUERY_STR = '&sort=stars'
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_kpi)
var dataRepository = new DataRepository(FLAG_STORAGE.flag_Kpi)

export default class KpiPage extends Component {
    constructor(props) {
        super(props);
        this.kpiGroupsDao = new KpiGroupsDao('manifest_' + API_URL);
        this.state = {
            languages: [],
            customThemeViewVisible: false,
            theme: this.props.theme,
        };
    }

    componentDidMount() {
        this.props.homeComponent.addSubscriber(this.onSubscriber);
        this.loadLanguage();
    }

    componentWillUnmount() {
        this.props.homeComponent.removeSubscriber(this.onSubscriber);
    }

    onSubscriber = (preTab, currentTab) => {
        var changedValues = this.props.homeComponent.changedValues;
        if (changedValues.my.themeChange && preTab.styles) {
            this.setState({
                theme: preTab
            })
            return;
        }
        if (currentTab != FLAG_TAB.flag_kpiTab) return;
        if (FLAG_TAB.flag_kpiTab === currentTab && changedValues.my.keyChange) { //从设置页面切换过来
            this.props.homeComponent.onReStart(FLAG_TAB.flag_kpiTab);
        }
    }

    loadLanguage() {
        this.kpiGroupsDao.fetch().then((languages) => {
            if (languages) {
                this.setState({
                    languages: languages,
                });
            }
        }).catch((error) => {

        });
    }

    renderMoreButton() {
        return (
            <View style={{flexDirection: 'row',}}>
                <TouchableHighlight
                    ref='button'
                    underlayColor='transparent'
                    onPress={() => {
                        this.props.navigator.push({
                            component: SearchPage,
                            params: {
                                theme: this.state.theme,
                                ...this.props,
                            },
                        });
                    }}>
                    <View style={{padding: 5}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../res/images/ic_search_white_48pt.png')}
                        />
                    </View>
                </TouchableHighlight>
                {ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
            </View>)
    }

    renderMoreView() {
        let params = {
            ...this.props,
            theme: this.state.theme,
            fromPage: FLAG_TAB.flag_KpiTab
        }
        return <MoreMenu
            {...params}
            ref="moreMenu"
            menus={[MORE_MENU.Sort_Key, MORE_MENU.Custom_Key, MORE_MENU.Remove_Key, MORE_MENU.Custom_Theme, MORE_MENU.About_Author, MORE_MENU.About, MORE_MENU.Feedback]}
            contentStyle={{right: 20}}
            onMoreMenuSelect={(e) => {
                if (e === MORE_MENU.Custom_Theme) {
                    this.setState({customThemeViewVisible: true});
                }
            }}
            anchorView={this.refs.moreMenuButton}
            navigator={this.props.navigator}/>
    }

    render() {
        var content = this.state.languages.length > 0 ?
            <ScrollableTabView
                tabBarUnderlineColor='#e7e7e7'
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='white'
                tabBarBackgroundColor={this.state.theme.themeColor}
                ref="scrollableTabView"
                initialPage={0}
                renderTabBar={() => <ScrollableTabBar style={{height: 40, borderWidth: 0, elevation: 2}}
                                                      tabStyle={{height: 39}}
                                                      underlineHeight={2}/>}
            >
                {this.state.languages.map((result, i, arr) => {
                    var language = arr[i];
                    return language ?
                        < KpiTab key={i}
                                 {...this.props}
                                 theme={
                                     this.state.theme
                                 }
                                 tabLabel={language.Name}
                        /> : null;
                })}
            </ScrollableTabView>
            : null;
        var statusBar = {
            backgroundColor: this.state.theme.themeColor,
        }
        let navigationBar =
            <NavigationBar
                title='Kpis'
                style={this.state.theme.styles.navBar}
                rightButton={this.renderMoreButton()}
                statusBar={statusBar}
                hide={false}/>;
        let customThemeView =
            <CustomTheme
                visible={this.state.customThemeViewVisible}
                {...this.props}
                onClose={() => {
                    this.setState({customThemeViewVisible: false})
                }}/>
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
                {customThemeView}
                {this.renderMoreView()}
            </View>
        );
    }

}

/***
 * KpiTab
 */
class KpiTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isLoadingFail: false,
            favoritKeys: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            filter: '',
            theme: this.props.theme,
        };
    }

    onSubscriber = (preTab, currentTab) => {
        var changedValues = this.props.homeComponent.changedValues;
        if (changedValues.my.themeChange && preTab.styles) {
            this.setState({
                theme: preTab
            })
            this.updateFavorite();//更新favoriteIcon
            return;
        }
        if (currentTab != FLAG_TAB.flag_KpiTab) return;
        if (FLAG_TAB.flag_favoriteTab === preTab && changedValues.favorite.KpiChange) { //从收藏页面切换过来,且Trending收藏有改变
            // changedValues.favorite.KpiChange = false;
            this.updateFavorite();
        }

    }

    componentDidMount() {
        this.props.homeComponent.addSubscriber(this.onSubscriber);
        this.loadData(true);
    }

    componentWillUnmount() {
        this.props.homeComponent.removeSubscriber(this.onSubscriber);
    }

    updateFavorite() {
        this.getFavoriteKeys();
    }


    flushFavoriteState() {//更新ProjectItem的Favorite状态
        let projectModels = [];
        let items = this.items;
        for (var i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoritKeys)));
        }
        this.updateState({
            isLoading: false,
            isLoadingFail: false,
            dataSource: this.getDataSource(projectModels),
        });
    }

    getFavoriteKeys() {//获取本地用户收藏的ProjectItem
        favoriteDao.getFavoriteKeys().then((keys) => {
            if (keys) {
                this.updateState({favoritKeys: keys});
            }
            this.flushFavoriteState();
        }).catch((error) => {
            this.flushFavoriteState();
            console.log(error);
        });
    }

    genFetchUrl(category) {
        return API_URL + category + QUERY_STR;
    }

    updateState(dic) {
        if (!this)return;
        this.setState(dic);
    }

    loadData(isRefresh) {
        this.updateState({
            isLoading: true,
            isLoadingFail: false,
        });
        // let url = this.genFetchUrl(this.props.tabLabel);
        let url = API_URL;
        this.DataManifest = new DataManifest(this.props);
        this.DataManifest.fetchManifest(url).then((wrapData) => {
            for (var i = 0; i < wrapData.Hubs[0].KpiGroups.length; i++) {
                if (wrapData.Hubs[0].KpiGroups[i].Name == this.props.tabLabel) {
                    this.items = wrapData && wrapData.Hubs[0].KpiGroups[i].Items ? wrapData.Hubs[0].KpiGroups[i].Items : wrapData ? wrapData : [];
                    break
                    console.log(this.items)
                }
            }


            this.getFavoriteKeys();
            if (isRefresh && wrapData && wrapData.date && !this.DataManifest.checkDate(wrapData.date))
                return this.DataManifest.fetchNetManifest(url);
        }).then((items) => {
            if (!items || items.length === 0)return;
            this.items = items;
            this.getFavoriteKeys();
        }).catch((error) => {
            console.log(error);
            this.updateState({
                isLoading: false,
                isLoadingFail: true,
            });
        })
    }

    onRefresh() {
        this.loadData(true);
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    onSelectKpi(projectModel) {
        var item = projectModel.item;
        this.props.navigator.push({
            title: item.full_name,
            component: RepositoryDetail,
            params: {
                projectModel: projectModel,
                parentComponent: this,
                flag: FLAG_STORAGE.flag_Kpi,
                ...this.props

            },
        });
    }

    onFavorite(item, isFavorite) {//favoriteIcon单击回调函数
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.id.toString());
        }
    }

    renderRow(projectModel, sectionID, rowID) {
        let {navigator} = this.props;

        return (
            <KpiCell
                key={projectModel.item.id}
                onSelect={() => this.onSelectKpi(projectModel)}
                theme={this.state.theme}
                
                {...{navigator}}
                projectModel={projectModel}
                onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}/>
        );
    }

    render() {
        var content =
            <ListView
                ref="listView"
                style={styles.listView}
                contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap',}}
                renderRow={(e) => this.renderRow(e)}
                renderFooter={() => {
                    return <View style={{height: 50}}/>
                }}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => this.onRefresh()}
                        tintColor={this.props.theme.themeColor}
                        title="Loading..."
                        titleColor={this.props.theme.themeColor}
                        colors={[this.props.theme.themeColor, this.props.theme.themeColor, this.props.theme.themeColor]}
                    />}
            />;
        return (
            <View style={
                [GlobalStyles.listView_container, {paddingTop: 0}]}>
                {content}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
