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
    Alert,
    ImageBackground,
    DeviceEventEmitter
} from 'react-native';
import head from './head';
import http from "./http";
import Loading from './loading';
import ImagePicker from 'react-native-image-picker';
import DeviceStorage from './DeviceStorage';
import SideMenu from 'react-native-side-menu';
import TabNavigator from 'react-native-tab-navigator';
import LinearGradient from 'react-native-linear-gradient';
const { width, height } = Dimensions.get('window');
const photoOptions = {
    title: '请选择',
    quality: 0.8,
    cancelButtonTitle: '取消',
    maxWidth: 600,
    maxHeight: 600,
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    allowsEditing: true,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
type Props = {};
export default class Side extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            uid: '',
            isOpen: false,
            head: '',
            username: '',
            picture: '',
            clothes: [],
            selectedTab: 'tb_dynamic',
            load:0
        };
        this.tabNavigatorItems = this.tabNavigatorItems.bind(this);
        this.choosePicker = this.choosePicker.bind(this);
        this.renderMovie = this.renderMovie.bind(this);
    }

    componentDidMount() {
        this.emitter = DeviceEventEmitter.addListener("remessage", (data) => {
            let t = this;
            DeviceStorage.get('headid').then((headid) => {
                this.setState({ head: headid })
            });
            DeviceStorage.get('username').then((username) => {
                this.setState({ username: username })
            });
            DeviceStorage.get('login').then(function (uid) {
                t.setState({ uid: uid })
                t.show();
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
    logout = () => {
        let login = '';
        DeviceStorage.save('login', login).then((tags) => {
            window.alert('注销成功！')
            this.props.navigation.navigate('Login', { message: 'Login' });
        });
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
    match = (picture) => {
        if (picture !== '') {
            picture = picture.slice(23);
            let value = {
                pic: picture
            }
            let t = this;
            t.setState({load:1});
            http.postimg('http://192.168.137.162:5000/getLabel', value)
                .then(function (data) {
                    t.setState({load:0});
                    if (data == 'error')
                        window.alert('匹配失败，请选择正确的服装照片！');
                    else t.props.navigation.navigate('Clothesmatch', { d: data });
                })
                .catch(err => console.log(err));
        } else {
            window.alert("请选择图片！");
        }
    };
    show = () => {
        let t = this;
        let value = { uid: t.state.uid }
        http.post('http://192.168.137.1:8763/findWardrobe', value)
            .then(function (data) {
                t.setState({ clothes: data });
            }
            )
            .catch(err => console.log(err))
    }
    addclothes = () => {
        let t = this;
        if (t.state.picture !== '') {
            var date = this.getmyDate();
            let value = {
                uid: t.state.uid,
                time: date,
                picture: t.state.picture.uri
            }
            http.postimg('http://192.168.137.1:8763/addWardrobe', value)
                .then(function (data) {
                    t.show();
                    t.setState({
                        picture: ''
                    });
                    window.alert("添加成功！");
                }
                )
                .catch(err => console.log(err))
        }
        else window.alert("请选择图片！");
    }
    chooseTag = (id, index) => {
        let t = this;
        Alert.alert('分类', '请选择服装种类',
            [
                { text: "春秋", onPress: t.opntion2Selected.bind(t, id, '春秋', index) },
                { text: "夏装", onPress: t.opntion2Selected.bind(t, id, '夏装', index) },
                { text: "冬装", onPress: t.opntion2Selected.bind(t, id, '冬装', index) },

            ]);
    };
    opntion2Selected = (id, tag, index) => {
        let t = this;
        let value = {
            id: id,
            tag: tag
        };
        let tmp = t.state.clothes;
        tmp[index].tag = tag;

        this.setState({ clothes: tmp });

        http.post('http://192.168.137.1:8763/updateWardrobeTag', value)
            .then(function (data) {


            }
            )
            .catch(err => console.log(err))

    };
    deleteclothes = (i, index) => {
        let t = this;
        let value = { id: i };
        let tmp = t.state.clothes;
        tmp.splice(index, 1);
        this.setState({ clothes: tmp });

        http.post('http://192.168.137.1:8763/deleteWardrobe', value)
            .then(function (data) {


            }
            )
            .catch(err => console.log(err))
    }
    choosePicker() {
        let t = this;
        ImagePicker.showImagePicker(photoOptions, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {

                let source = { uri: 'data:image/jpeg;base64,' + response.data };
                t.setState({
                    picture: source
                });


            }
        });
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
                    this.setState({ selectedTab: 'tb_dynamic' });
                    this.setState({ isOpen: false });
                    t.props.navigation.navigate(newPage, { message: 'newPage' });
                }}
            >
                <View style={{ flex: 1 }}></View>
            </TabNavigator.Item>
        )
    }
    componentWillMount() {
        let t = this;
        DeviceStorage.get('headid').then((headid) => {
            this.setState({ head: headid })
        });
        DeviceStorage.get('username').then((username) => {
            this.setState({ username: username })
        });
        DeviceStorage.get('login').then(function (uid) {
            t.setState({ uid: uid })
            t.show();
        });


    }
    render() {
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
                                <Image style={styles.sculpture}
                                    source={head['img' + this.state.head]}
                                />
                            </TouchableOpacity>
                            <Text style={styles.title} onPress={() => { this.setState({ isOpen: true }) }} >
                                我的衣柜
                        </Text>
                        </View>
                    </LinearGradient>
                </View>
                {t.state.load == 1?(<Loading />):(null)}
                <View >

                    <FlatList
                        data={t.state.clothes}
                        renderItem={this.renderMovie}
                        style={{ backgroundColor: "#F5FCFF", height: height * 0.46 }}
                        keyExtractor={item => item.id}
                        horizontal={true}
                    />




                    <View style={{ backgroundColor: '#F5FCFF', height: height * 0.25, flexDirection: "row", }}>
                        <TouchableOpacity onPress={t.choosePicker}>
                            <Image source={require('../img/new.png')} style={styles.news} />
                            <Text style={{ fontSize: 18, marginLeft: width / 6, marginTop: 7, color: '#828282' }}>选择衣服</Text>
                        </TouchableOpacity>
                        <View>
                            <Image source={t.state.picture} style={styles.news}></Image>
                            <TouchableOpacity onPress={t.addclothes} style={styles.button}>
                                <Text style={styles.btText}>添加</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ backgroundColor: '#F5FCFF', height: height * 0.1 }}>
                        <TabNavigator>
                            {this.tabNavigatorItems('tb_msg', "主页", require('../img/main.png'), require('../img/mains.png'), "", "消息页面内容", 'Main')}
                            {this.tabNavigatorItems('tb_contacts', "好友", require('../img/friend.png'), require('../img/friends.png'), "", "联系人页面内容", 'Friend')}
                            {this.tabNavigatorItems('tb_watch', "搭配推荐", require('../img/match2.png'), require('../img/match1.png'), "", "看点页面内容", 'Match')}
                            {this.tabNavigatorItems('tb_dynamic', "我的衣柜", require('../img/clothes1.png'), require('../img/clothes.png'), "", "动态页面内容", 'Clothes')}
                            {this.tabNavigatorItems('tb_dyn', "消息", require('../img/message.png'), require('../img/messages.png'), "", "动态页面内容", 'Message')}
                        </TabNavigator>
                    </View>

                </View>
            </SideMenu>
        );
    }
    renderMovie({ item, index }) {
        let t = this;
        let img = { uri: item.picture }
        return (
            <View style={{
                borderStyle: 'solid',
                borderColor: 'gray',
                borderRadius: 8,
                borderWidth: 1
            }}>
                <Image source={img} style={styles.thumbnail} />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={t.match.bind(t, item.picture)}>
                        <Image style={{ width: 20, height: 20, marginLeft: 10, marginTop: 5 }} source={require('../img/like1.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={t.chooseTag.bind(t, item.id, index)}>
                        <View style={styles.button1}>
                            <Text style={styles.btText}>{item.tag}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={t.deleteclothes.bind(t, item.id, index)}>
                        <Image style={{ width: 20, height: 20, marginLeft: width / 9.8, marginTop: 5 }} source={require('../img/delete.png')} />
                    </TouchableOpacity>

                </View>
            </View>
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
        height: 45,
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
    myImage: {
        width: 24,
        height: 22,
    },
    thumbnail: {
        width: width / 2.2,
        height: width / 1.45,
        marginLeft: 10,
        borderRadius: 8,
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
    news: {
        width: width / 3,
        height: width / 3,
        marginBottom: 5,
        marginLeft: width / 9

    },
    button: {
        height: 35,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#87CEFA',
        marginLeft: width / 5.8,
        marginRight: 20
    },
    btText: {
        color: '#fff',
        fontSize: 18,
    },
    button1: {
        height: 20,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        backgroundColor: '#87CEFA',
        marginTop: 5,
        marginRight: 20,
        marginLeft: 10,
    },
    btText: {
        color: '#fff',
        fontSize: 15,
    },
});