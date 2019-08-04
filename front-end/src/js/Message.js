import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList,
    DeviceEventEmitter
} from 'react-native';
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
            head: '',
            username: '',
            isOpen: false,
            selectedTab: 'tb_dyn',
            messages: []
        };
        this.tabNavigatorItems = this.tabNavigatorItems.bind(this);
        this.renderMovie = this.renderMovie.bind(this);
    }
    componentDidMount() {
        this.emitter = DeviceEventEmitter.addListener("remessage", (data) => {
            this.show();
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

    deletemessage = (id) => {
        let t = this;
        let value = { id: id };
        http.post('http://192.168.137.1:8763/deleteMessage', value)
            .then(function (data) {
                let value1 = { recipient: t.state.username }


                http.post('http://192.168.137.1:8763/findMessages', value1)
                    .then(function (data) {
                        t.setState({ messages: data });


                    }
                    )
                    .catch(err => console.log(err))
            }
            )
            .catch(err => console.log(err))
    }

    logout = () => {
        let login = '';
        DeviceStorage.save('login', login).then((tags) => {
            window.alert('注销成功！');
            DeviceEventEmitter.emit('relogin', 1);
            this.props.navigation.navigate('Login', { message: 'Login' });
        });
    }
    show = () => {
        let t = this;
        DeviceStorage.get('username').then((username) => {
            let value = { recipient: username }
            http.post('http://192.168.137.1:8763/findMessages', value)
                .then(function (data) {
                    t.setState({ messages: data });
                    t.setState({ username: username })
                }
                )
                .catch(err => console.log(err))
        });

    }
    accept = (messageid, flag, index) => {
        let t = this;
        let value = {
            id: messageid,
            flag: flag
        };
        http.post('http://192.168.137.1:8763/manageInvitation', value)
            .then(function (data) {
                DeviceEventEmitter.emit('remessage', 1);
                DeviceEventEmitter.emit('refriend', 1);
                DeviceEventEmitter.emit('remain', 1);
                if (flag == 1) {
                    window.alert('已同意！');
                    let tmp = t.state.messages;
                    tmp.splice(index, 1);
                    this.setState({ messages: tmp });
                    DeviceEventEmitter.emit('remain', 1);
                    DeviceEventEmitter.emit('remymain', 1);
                }

                else {
                    window.alert('已拒绝!');
                    let tmp = t.state.messages;
                    tmp.splice(index, 1);
                    this.setState({ messages: tmp });

                }
            }
            )
            .catch(err => console.log(err))

    }
    specificmessage = (friend, time, content) => {
        DeviceStorage.save('friend', friend);

        this.props.navigation.navigate('SpecificMessage', { t: time, c: content });
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
                    this.setState({ selectedTab: 'tb_dyn' });
                    this.setState({ isOpen: false });
                    t.props.navigation.navigate(newPage, { message: 'newPage' });
                }
                }
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
                        {this.state.username}
                    </Text>
                </View>
            </LinearGradient>
            <View style={{ height: 4 }}></View>
            <LinearGradient colors={['#B0E0E6', '#6495ED']} >
                <View style={styles.container4}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Favorite', { message: 'Favorite' }) }}>
                        <Text style={{ marginLeft: 10, fontSize: 20, marginTop: 30, color: '#000000' }}>我的收藏</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('MyMain', { message: 'MyMain' }) }}>
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
                                <Image style={styles.sculpture}
                                    source={head['img' + this.state.head]}
                                />
                            </TouchableOpacity>
                            <Text style={styles.title}
                                onPress={() => { this.setState({ isOpen: true }) }}
                            >
                                消息
                        </Text>
                        </View>
                    </LinearGradient>
                </View>
                <View>
                    <FlatList
                        data={this.state.messages}
                        renderItem={this.renderMovie}
                        style={{
                            paddingTop: 5,
                            backgroundColor: "#F5FCFF", height: height * 0.8
                        }}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={{ flex: 1, backgroundColor: '#F5FCFF', height: height * 0.2 }}>
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
        if (item.content !== "") {

            if (item.content[0] == ' ') {
                return (
                    <TouchableOpacity >
                        <View style={styles.container5}>
                            <Image
                                style={styles.thumbnail}
                                source={require('../img/message1.png')}
                            />


                            <View style={styles.rightContainer}>
                                <Text style={styles.username}>{item.sender}</Text>
                                <Text style={styles.dynamic}>{item.time}</Text>
                            </View>
                            <TouchableOpacity onPress={t.specificmessage.bind(t, item.sender, item.time, item.content)} style={styles.button}>
                                <Text style={styles.btText}>查看</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.deletemessage.bind(t, item.id, index)} style={styles.button1} >
                                <Text style={styles.btText}>删除</Text>
                            </TouchableOpacity>


                        </View>
                    </TouchableOpacity>
                );
            }
            else {
                return (
                    <TouchableOpacity>
                        <View style={styles.container5}>
                            <Image
                                style={styles.thumbnail}
                                source={require('../img/message1.png')}
                            />
                            <View style={styles.rightContainer}>
                                <Text style={styles.username}>{item.sender} 分享的动态</Text>
                                <Text style={styles.dynamic}>{item.time}</Text>
                            </View>
                            <TouchableOpacity onPress={() => { DeviceEventEmitter.emit('remaindetail', 1); t.props.navigation.navigate('MainDetail', { i: item.content }); }} style={styles.button2}>
                                <Text style={styles.btText}>查看</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={t.deletemessage.bind(t, item.id, index)} style={styles.button1} >
                                <Text style={styles.btText}>删除</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>)

            }
        }
        else {
            return (
                <TouchableOpacity onPress={t.specificmessage.bind(t, item.sender, item.time, item.content)}>
                    <View style={styles.container5}>
                        <Image
                            style={styles.thumbnail}
                            source={require('../img/message1.png')}
                        />
                        <View style={styles.rightContainer}>
                            <Text style={styles.username}>{item.sender}请求加为好友</Text>
                            <Text style={styles.dynamic}>{item.time}</Text>
                        </View>
                        <TouchableOpacity onPress={t.accept.bind(t, item.id, 1)} style={styles.button}>
                            <Text style={styles.btText}>接受</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={t.accept.bind(t, item.id, 0, index)} style={styles.button1} >
                            <Text style={styles.btText}>拒绝</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            );
        }
    }
}


const styles = StyleSheet.create({
    sculpture: {
        width: 35,
        height: 35,
        marginLeft: 5,
        marginTop: 5
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

        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    rightContainer: {
        width: width * 0.5
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
    title: {
        fontSize: 28,
        color: '#FFFFFF',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center',
        marginLeft: width / 3.2
    },
    button: {
        height: 22,
        width: 38,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: '#4682B4',
        marginTop: 5,
        marginLeft: width * 0.05
    },
    button1: {
        height: 22,
        width: 38,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: '#ff0000',
        marginTop: 5,
        marginLeft: 10
    },
    button2: {
        height: 22,
        width: 38,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: '#4682B4',
        marginTop: 5,
        marginLeft: width * 0.05
    },

    btText: {
        color: '#fff',
        fontSize: 15,
    },

});