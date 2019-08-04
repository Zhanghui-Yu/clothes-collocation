import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    AsyncStorage,
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-popup-dialog';
import head from './head';
import http from "./http";
import DeviceStorage from './DeviceStorage';
import SideMenu from 'react-native-side-menu';
import TabNavigator from 'react-native-tab-navigator';
import LinearGradient from 'react-native-linear-gradient';
const { width, height } = Dimensions.get('window');
type Props = {};
export default class Side extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            uid: -1,
            head: '',
            isOpen: false,
            community: [],
            selectedTab: 'tb_msg',
            foot: 0,
            times: 0,
            shareData: '',
            shareFriend: '',
            friends: [],
            headcontent: '',
            defaultAnimationDialog: false,
        };
        this.tabNavigatorItems = this.tabNavigatorItems.bind(this);
        this.todetail = this.todetail.bind(this);
        this.renderMovie = this.renderMovie.bind(this);
        this.renderFriend = this.renderFriend.bind(this);
    }

    logout = () => {
        let login = '';
        DeviceStorage.save('login', login).then((tags) => {
            window.alert('注销成功！');
            DeviceEventEmitter.emit('relogin', 1);
            this.props.navigation.navigate('Login', { message: 'Login' });
        });
    }
    deleteCommunity = (id, index) => {
        let t = this;
        Alert.alert('', '确定要删除此条动态吗？',
            [
                { text: "取消", onPress: t.opntion1Selected },
                { text: "确定", onPress: t.opntion2Selected.bind(t, id) },

            ]);
    };
    opntion2Selected = (id, index) => {
        let t = this;
        let value = { id: id };
        http.post('http://192.168.137.1:8763/deleteCommunity', value)
            .then(function (data) {
                let tmp = t.state.community;
                tmp.splice(index, 1);
                t.setState({ community: tmp });
                window.alert('删除成功');
                DeviceEventEmitter.emit('remain', 1);
            }
            )
            .catch(err => console.log(err))

    };
    componentDidMount() {
        this.emitter = DeviceEventEmitter.addListener("remymain", (data) => {
            let t = this;
            DeviceStorage.get('login').then((login) => {
                let value = {
                    uid: login,
                    times: 0
                }
                t.setState({ uid: login })
                http.post('http://192.168.137.1:8763/findCommunityBySenderUid', value)
                    .then(function (data) {

                        if (data[0].flag == "Not Found") {
                            window.alert("已加载全部！")
                            t.setState({ foot: 2 })
                        }

                        else {
                            t.setState({ community: data })
                            t.setState({ times: 1 })
                            t.setState({ foot: 1 })
                        }


                    }
                    )
                    .catch(err => console.log(err))
                let value1 = { uid: login }
                http.post('http://192.168.137.1:8762/findFriends', value1)
                    .then(function (data1) {
                        t.setState({ friends: data1 });
                    }
                    )
                    .catch(err => console.log(err))

            });
            DeviceStorage.get('headid').then((headid) => {
                this.setState({ head: headid })
            });
            DeviceStorage.get('username').then((username) => {
                this.setState({ username: username })
            });

        });
    }

    componentWillUnmount() {
        this.emitter.remove();
    }

    changehead = () => {
        this.props.navigation.navigate('ChangeHead', { message: 'ChangeHead' });
    }
    changepassword = () => {
        this.props.navigation.navigate('ChangePassword', { message: 'ChangePassword' });
    }
    changeinformation = () => {
        this.props.navigation.navigate('ChangeInformation', { message: 'ChangeInformation' });
    }

    addpublic = () => {
        this.props.navigation.navigate('AddPublic', { message: 'AddPublic' });
    }
    getmyDate() {
        var date = new Date();

        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString();
        var day = date.getDate().toString();
        var hour = date.getHours().toString();
        var minute = date.getMinutes().toString();

        return year + '年' + month + '月' + day + '日' + ' ' + hour + ':' + minute;
    };
    checklog = () => {
        let t = this;
        DeviceStorage.get('login').then((login) => {
            if (login) {
                return false;
            } else {
                window.alert('请先登录哦！');
                t.props.navigation.navigate('Login', { message: 'Login' });
                return false;
            };

        });
    }

    todetail = (id) => {
        this.props.navigation.navigate('MainDetail', { i: id });
    }
    share = (data) => {
        this.setState({
            shareData: data,
            defaultAnimationDialog: true
        });
    }
    shareTo = () => {
        let t = this;
        if (t.state.shareFriend == '') window.alert('请选择好友！')
        else {
            var date = this.getmyDate();
            let value = {
                sender: t.state.username,
                recipient: t.state.shareFriend,
                content: t.state.shareData,
                time: date
            }
            http.post('http://192.168.137.1:8763/addMessage', value)
                .then(function (data) {
                    window.alert("分享成功！");
                    t.setState({ defaultAnimationDialog: false });
                })
                .catch(err => console.log(err));

        }
    }
    onHeadcontentChanged = (Content) => {
        this.state.headcontent = Content;
    };


    like = (cid, index) => {
        let t = this;
        let tmp = t.state.community;
        tmp[index].likeFlag = !tmp[index].likeFlag;
        if (tmp[index].likeFlag == true) tmp[index].like += 1;
        else tmp[index].like -= 1;
        this.setState({ community: tmp })

        let value = {
            id: cid,
            uid: t.state.uid
        }
        http.post('http://192.168.137.1:8763/updateLike', value)

    }
    show = () => {
        let t = this;
        DeviceStorage.get('login').then((login) => {
            let value = {
                senderUid: login,
                times: t.state.times
            }
            t.setState({ uid: login })
            http.post('http://192.168.137.1:8763/findCommunityBySenderUid', value)
                .then(function (data) {

                    if (data[0].flag == "Not Found") {
                        window.alert("已加载全部！")
                        t.setState({ foot: 2 })
                    }

                    else {
                        t.setState({ community: data })
                        t.setState({ times: t.state.times + 1 })
                        t.setState({ foot: 1 })
                    }





                }
                )
                .catch(err => console.log(err))
            let value1 = { uid: login }
            http.post('http://192.168.137.1:8762/findFriends', value1)
                .then(function (data1) {
                    t.setState({ friends: data1 });
                }
                )
                .catch(err => console.log(err))

        });

    }
    findmore = () => {
        let t = this;
        let value = {
            senderUid: t.state.uid,
            times: t.state.times
        }
        t.setState({ foot: 0 })
        http.post('http://192.168.137.1:8763/findCommunityBySenderUid', value)
            .then(function (data) {
                if (data[0].flag == "Not Found") {
                    window.alert("已加载全部！")
                    t.setState({ foot: 2 })
                }

                else {
                    t.setState({ community: t.state.community.concat(data) })
                    t.setState({ times: t.state.times + 1 })
                    t.setState({ foot: 1 })
                }

            }
            )
            .catch(err => console.log(err))
    }
    renderFooter = () => {
        let footer = '';
        let t = this;
        if (t.state.foot == 1)
            footer = (
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={t.findmore}>
                        <Text style={styles.footerText}>点击加载更多</Text>
                    </TouchableOpacity>
                </View>
            )
        else {
            if (t.state.foot == 0)
                footer = (
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.footerText}>数据加载中…</Text>
                    </View>
                )
            else
                footer = (
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.footerText}>已全部加载</Text>
                    </View>
                )
        }
        return footer;
    }
    renderHeader = () => {
        let header = '';
        let t = this;
        header = (
            <View style={{ flexDirection: 'row', backgroundColor: "#BFEFFF" }}>
                <View style={styles.inputBox}>
                    <TextInput
                        onChangeText={this.onHeadcontentChanged}  //添加值改变事件
                        style={styles.input}
                        autoCapitalize='none'  //设置首字母不自动大写
                        underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                        placeholderTextColor={'#696969'}  //设置占位符颜色
                        placeholder={'请输入检索内容'}  //设置占位符
                    />
                </View>
                <TouchableOpacity onPress={t.findcommunity} >
                    <Image source={require('../img/搜索.png')} style={styles.thumbnail} />
                </TouchableOpacity>
            </View>
        );
        return header;
    }
    tabNavigatorItems(selectedTab, title, icon, selectedIcon, mark, viewContent, newPage) {
        let t = this;
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                renderIcon={() => <Image style={styles.myImage} source={icon} />}
                renderSelectedIcon={() => <Image style={styles.myImage} source={selectedIcon} />}
                badgeText={mark}
                onPress={() => {
                    this.setState({ selectedTab: 'tb_msg' });
                    this.setState({ isOpen: false });
                    t.props.navigation.navigate(newPage, { message: 'newPage' });
                }}
            >
                <View style={{ flex: 1 }}></View>
            </TabNavigator.Item>
        )
    }
    componentWillMount() {
        this.show();
        DeviceStorage.get('headid').then((headid) => {
            this.setState({ head: headid })
        });
        DeviceStorage.get('username').then((username) => {
            this.setState({ username: username })
        });
    }
    render() {

        this.checklog();
        let t = this;

        const menu = <View>
            <LinearGradient colors={['#6495ED', '#B0E0E6']} >
                <View style={styles.container2}>
                    <TouchableOpacity onPress={this.changehead}>
                        <Image style={styles.sculpture2}
                            source={head['img' + this.state.head]}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, textAlign: 'center', marginLeft: 25, marginTop: 47 }}
                    >
                        {t.state.username}
                    </Text>
                </View>
            </LinearGradient>
            <View style={{ height: 4 }}></View>
            <LinearGradient colors={['#B0E0E6', '#6495ED']} >
                <View style={styles.container4}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Favorite', { message: 'Favorite' }) }}>
                        <Text style={{ marginLeft: 10, fontSize: 20, marginTop: 30, color: '#000000' }}>我的收藏</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { DeviceEventEmitter.emit('remymain', 1); this.props.navigation.navigate('MyMain', { message: 'MyMain' }) }}>
                        <Text style={{ marginLeft: 10, fontSize: 20, marginTop: 30, color: '#000000' }}>发布历史</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.changeinformation}>
                        <Text style={{ marginLeft: 10, fontSize: 20, marginTop: 30, color: '#000000' }}>账号管理</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.changepassword}>
                        <Text style={{ marginLeft: 10, fontSize: 20, marginTop: 30, color: '#000000' }}>修改密码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.logout}>
                        <Text style={{ marginLeft: 10, fontSize: 20, marginTop: 30, color: '#000000' }}>退出登录</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>

        return (
            <SideMenu
                menu={menu}                    //抽屉内的组件
                isOpen={this.state.isOpen}     //抽屉打开/关闭
                openMenuOffset={width / 2}     //抽屉的宽度
                hiddenMenuOffset={0}          //抽屉关闭状态时,显示多少宽度 默认0 抽屉完全隐藏
                edgeHitWidth={80}              //距离屏幕多少距离可以滑出抽屉,默认60
                disableGestures={false}        //是否禁用手势滑动抽屉 默认false 允许手势滑动
                menuPosition={'left'}     //抽屉在左侧还是右侧
                autoClosing={true}         //默认为true 如果为true 一有事件发生抽屉就会关闭
            >
                <View style={styles.container3}>
                    <LinearGradient colors={['#FFBBFF', '#B0E0E6']} >
                        <View style={styles.container}>
                            <TouchableOpacity onPress={() => { this.setState({ isOpen: true }) }}>
                                <Image style={styles.sculpture} source={head['img' + this.state.head]} />
                            </TouchableOpacity>
                            <Text style={styles.title} onPress={() => { this.setState({ isOpen: true }) }} >
                                Mardrobe
                             </Text>
                            <TouchableOpacity onPress={this.addpublic}>
                                <Image style={styles.sculpture1} source={require('../img/add.png')} />
                            </TouchableOpacity>

                        </View>
                    </LinearGradient>
                </View>

                <View>
                    <FlatList
                        data={t.state.community}
                        renderItem={this.renderMovie}
                        style={{ backgroundColor: "#F5FCFF", height: height * 0.82 }}
                        keyExtractor={item => item.id}
                        ListFooterComponent={this.renderFooter}
                        ListHeaderComponent={this.renderHeader}
                    />
                </View>
                <Dialog
                    onDismiss={() => {
                        this.setState({ defaultAnimationDialog: false });
                    }}
                    width={0.9}
                    visible={this.state.defaultAnimationDialog}
                    rounded
                    actionsBordered

                    dialogTitle={
                        <DialogTitle
                            title="发送给"
                            style={{
                                alignSelf: "center",
                            }}
                            hasTitleBar={false}
                            align="left"
                        />
                    }
                    footer={
                        <DialogFooter>
                            <DialogButton
                                text="取消"
                                bordered
                                onPress={() => {
                                    this.setState({ defaultAnimationDialog: false });
                                }}
                                key="button-1"
                            />
                            <DialogButton
                                text="分享"
                                bordered
                                onPress={t.shareTo}
                                key="button-2"
                            />
                        </DialogFooter>
                    }
                >
                    <DialogContent
                        style={{
                            backgroundColor: '#F7F7F8',
                        }}
                    >
                        <FlatList
                            data={t.state.friends}
                            renderItem={t.renderFriend}
                            style={{
                                paddingTop: 5,
                                backgroundColor: "#F5FCFF", height: height * 0.4
                            }}
                            keyExtractor={item => item.id}
                        />

                    </DialogContent>
                </Dialog>
                <View style={{ flex: 1, backgroundColor: '#F5FCFF', height: height * 0.1 }}>
                    <TabNavigator>
                        {this.tabNavigatorItems('tb_msg', "主页", require('../img/main.png'), require('../img/mains.png'), "", "消息页面内容", 'Main')}
                        {this.tabNavigatorItems('tb_contacts', "好友", require('../img/friend.png'), require('../img/friends.png'), "", "联系人页面内容", 'Friend')}
                        {this.tabNavigatorItems('tb_watch', "搭配推荐", require('../img/match2.png'), require('../img/match1.png'), "", "看点页面内容", 'Match')}
                        {this.tabNavigatorItems('tb_dynamic', "我的衣柜", require('../img/clothes1.png'), require('../img/clothes.png'), "", "动态页面内容", 'Clothes')}
                        {this.tabNavigatorItems('tb_dyn', "消息", require('../img/message.png'), require('../img/messages.png'), "", "动态页面内容", 'Message')}
                    </TabNavigator>
                </View>
            </SideMenu>

        );

    }
    renderMovie({ item, index }) {
        let t = this;
        let img = { uri: item.picture }
        if(item.isClothes == 1){
        if (item.likeFlag === true) {
            return (
                <ImageBackground style={{ flex: 1 }} source={require('../img/background.jpg')}>
                    <View style={styles.outerView}>
                        <View style={styles.titleView}>
                            <Image style={styles.icon} source={head['img' + item.headPicture]} />
                            <Text style={styles.font2}>
                                {item.account}
                            </Text>
                            <Text style={styles.font1}>
                                -{item.point}-
                            </Text>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ width: 280, fontSize: 16, margin: 10, marginLeft: 25 }}>{item.text}</Text>
                        <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                            <Image style={styles.image} source={img} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={t.like.bind(t, item.id, index)}>
                                <Image style={styles.icon1} source={require('../img/已点赞.png')} />
                            </TouchableOpacity>
                            <Text style={styles.font}>{item.like}</Text>
                            <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                                <Image style={styles.icon1} source={require('../img/评论.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                                <Text style={styles.font}>{item.comment}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.share.bind(t, item.id)}>
                                <Image style={styles.icon1} source={require('../img/分享.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.deleteCommunity.bind(t, item.id, index)}>
                                <Image style={styles.icon1} source={require('../img/delete.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            );
        }
        else if (item.likeFlag === false) {
            return (
                <ImageBackground style={{ flex: 1 }} source={require('../img/background.jpg')}>
                    <View style={styles.outerView}>
                        <View style={styles.titleView}>
                            <Image style={styles.icon} source={head['img' + item.headPicture]} />
                            <Text style={styles.font2}>
                                {item.account}
                            </Text>
                            <Text style={styles.font1}>
                                -{item.point}-
                            </Text>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ width: 280, fontSize: 16, margin: 10, marginLeft: 25 }}>{item.text}</Text>
                        <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                            <Image style={styles.image} source={img} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={t.like.bind(t, item.id, index)}>
                                <Image style={styles.icon1} source={require('../img/未点赞.png')} />
                            </TouchableOpacity>
                            <Text style={styles.font}>{item.like}</Text>
                            <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                                <Image style={styles.icon1} source={require('../img/评论.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                                <Text style={styles.font}>{item.comment}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.share.bind(t, item.id)}>
                                <Image style={styles.icon1} source={require('../img/分享.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.deleteCommunity.bind(t, item.id, index)}>
                                <Image style={styles.icon1} source={require('../img/delete.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            );
        }}
    else{
        if (item.likeFlag === true) {
            return (
                <ImageBackground style={{ flex: 1 }} source={require('../img/background.jpg')}>
                    <View style={styles.outerView}>
                        <View style={styles.titleView}>
                            <Image style={styles.icon} source={head['img' + item.headPicture]} />
                            <Text style={styles.font2}>
                                {item.account}
                            </Text>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ width: 280, fontSize: 16, margin: 10, marginLeft: 25 }}>{item.text}</Text>
                        <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                            <Image style={styles.image} source={img} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={t.like.bind(t, item.id, index)}>
                                <Image style={styles.icon1} source={require('../img/已点赞.png')} />
                            </TouchableOpacity>
                            <Text style={styles.font}>{item.like}</Text>
                            <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                                <Image style={styles.icon1} source={require('../img/评论.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                                <Text style={styles.font}>{item.comment}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.share.bind(t, item.id)}>
                                <Image style={styles.icon1} source={require('../img/分享.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.deleteCommunity.bind(t, item.id, index)}>
                                <Image style={styles.icon1} source={require('../img/delete.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            );
        }
        else if (item.likeFlag === false) {
            return (
                <ImageBackground style={{ flex: 1 }} source={require('../img/background.jpg')}>
                    <View style={styles.outerView}>
                        <View style={styles.titleView}>
                            <Image style={styles.icon} source={head['img' + item.headPicture]} />
                            <Text style={styles.font2}>
                                {item.account}
                            </Text>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ width: 280, fontSize: 16, margin: 10, marginLeft: 25 }}>{item.text}</Text>
                        <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                            <Image style={styles.image} source={img} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={t.like.bind(t, item.id, index)}>
                                <Image style={styles.icon1} source={require('../img/未点赞.png')} />
                            </TouchableOpacity>
                            <Text style={styles.font}>{item.like}</Text>
                            <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                                <Image style={styles.icon1} source={require('../img/评论.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.todetail.bind(t, item.id)}>
                                <Text style={styles.font}>{item.comment}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.share.bind(t, item.id)}>
                                <Image style={styles.icon1} source={require('../img/分享.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.deleteCommunity.bind(t, item.id, index)}>
                                <Image style={styles.icon1} source={require('../img/delete.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            );
        }


    }

    }
    renderFriend({ item }) {
        let headid = item.picture;
        let t = this;
        return (
            <TouchableOpacity onPress={() => {
                t.setState({ shareFriend: item.name });
            }}>
                <View style={styles.container5}>
                    <Image
                        style={styles.thumbnail}
                        source={head['img' + headid]}
                    />
                    <View style={styles.rightContainer}>
                        <Text style={styles.username}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    sculpture: {
        width: 35,
        height: 35,
        marginLeft: 5,
        marginTop: 5
    },
    sculpture1: {
        width: 35,
        height: 35,
        marginLeft: 56,
        marginTop: 5,

    },
    sculpture2: {
        width: 55,
        height: 55,
        marginLeft: 5,
        marginTop: 30
    },
    container: {
        marginTop: 0,
        width: width,
        height: 45,
        flexDirection: 'row',
    },
    container2: {
        marginTop: 0,
        width: width,
        height: 150,
        flexDirection: 'row',
    },
    container3: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container4: {
        marginTop: 0,
        width: width,
        height: height - 150
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    container5: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    rightContainer: {
        flex: 1
    },
    username: {
        fontSize: 15,
        marginBottom: 5,
    },
    dynamic: {
        fontSize: 10
    },
    thumbnail: {
        width: 40,
        height: 40,
        margin: 5,
        marginLeft: 20
    },
    myImage: {
        width: 24,
        height: 22,
    },
    outerView: {
        width: width - 20,
        marginLeft: 10,
        marginTop: 10,

        borderStyle: 'solid',
        borderColor: 'gray',
        borderRadius: 8,
        borderWidth: 1
    },
    titleView: {
        flexDirection: 'row',
        height: 45,
        borderColor: 'gray',
        borderStyle: "dotted",
    },
    icon: {
        marginTop: 5,
        width: 35,
        height: 35,
        marginLeft: 10
    },
    icon1: {
        marginTop: 5,
        width: 20,
        height: 20,
        marginLeft: 25
    },
    font: {
        marginTop: 5,
        fontSize: 19,
        marginLeft: 5,

    },
    font2: {
        marginTop: 5,
        fontSize: 19,
        marginLeft: 5,
        width: width * 0.47
    },
    font1: {
        marginTop: 10,
        height: 28,
        fontSize: 19,
        marginLeft: width * 0.1,
        backgroundColor: '#EE82EE',
        color: '#FFFFFF',
        borderRadius: 8,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center',
    },
    image: {
        width: width / 1.2,
        height: width / 1.1,
        borderRadius: 15,
        marginTop: 5,
        alignSelf: "center"
    },
    title: {
        fontSize: 28,
        color: '#FFFFFF',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center',
        marginLeft: width / 3.6
    },
    dialogContentView: {
        paddingLeft: 18,
        paddingRight: 18,

    },
    navigationBar: {
        borderBottomColor: '#b5b5b5',
        borderBottomWidth: 0.5,
        backgroundColor: '#ffffff',
    },
    navigationTitle: {
        padding: 10,
    },
    navigationButton: {
        padding: 10,
    },
    navigationLeftButton: {
        paddingLeft: 20,
        paddingRight: 40,
    },
    navigator: {
        flex: 1,
        // backgroundColor: '#000000',
    },
    customBackgroundDialog: {
        opacity: 0.5,
        backgroundColor: '#000',
    },
    thumbnail: {
        width: 30,
        height: 30,
        marginLeft: 20,
        marginTop: 3
    },
    input: {
        width: 240,
        height: 40,
        fontSize: 17,
        color: '#000000',
    },
    inputBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.8,
        height: 35,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginLeft: 10
    },
});