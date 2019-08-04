import React, { Component } from 'react';
import http from "./http";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Alert,
    Button,
    Image,
    Animated,
    ImageBackground,
    ScrollView,
    Dimensions,
    AsyncStorage,
    FlatList,
    DeviceEventEmitter
} from 'react-native';
const { width, height } = Dimensions.get('window');
import head from './head';
import DeviceStorage from './DeviceStorage';
export default class ThirdPage extends Component<Props> {

    constructor(props) {
        super(props);   //这一句不能省略，照抄即可
        this.state = {
            uid: '',
            username: '',
            friend: '',
            head: '',
            flag: 0,
            isFriend: false
        };

    }
    onFriendChanged = (newFriend) => {
        this.state.friend = newFriend;
    };
    getmyDate() {
        var date = new Date();

        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString();
        var day = date.getDate().toString();
        var hour = date.getHours().toString();
        var minute = date.getMinutes().toString();

        return year + '年' + month + '月' + day + '日' + ' ' + hour + ':' + minute;
    };
    sendmessage = (friend) => {

        var date = this.getmyDate();
        let value = {
            sender: this.state.username,
            recipient: friend,
            content: '',
            time: date
        }
        let t = this;
        http.post('http://192.168.137.1:8763/addMessage', value)
            .then(function (data) {
                DeviceEventEmitter.emit('remessage', 1);
                Alert.alert("申请已发送,请等待好友同意！");
                this.setState({
                    friend: '',
                    head: '',
                    flag: 0,
                    isFriend: false
                })

            })
            .catch(err => console.log(err));


    }
    findfriend = () => {
        let t = this;
        if (this.state.friend != '') {
            let value = {
                account: this.state.friend,
                uid: this.state.uid
            }
            let t = this;
            http.post('http://192.168.137.1:8762/findFriendByAccount', value)
                .then(function (data) {

                    if (data.flag === 'not found') {
                        t.setState({ flag: 0 });
                        Alert.alert("未找到该用户！");
                    }
                    else {
                        t.setState({ friend: data.account });
                        t.setState({ head: data.picture });
                        t.setState({ isFriend: data.isFriend });
                        t.setState({ flag: 1 });

                    }
                })
                .catch(err => console.log(err));

        } else {
            Alert.alert("用户名不能为空！");
        }
    };


    componentWillMount() {
        DeviceStorage.get('login').then((login) => {
            this.setState({ uid: login })
        });
        DeviceStorage.get('username').then((username) => {
            this.setState({ username: username })
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        let t = this;
        if (this.state.flag === 0)
            return (
                <ScrollView style={{ backgroundColor: "#F5FCFF" }}>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={styles.titleBackground}>
                            <Text style={styles.title}>添加好友</Text>
                        </View>

                        <Text style={styles.text}>输入用户名查找新朋友：</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.inputBox}>
                                <TextInput
                                    ref="username"  //设置描述
                                    onChangeText={this.onFriendChanged}  //添加值改变事件
                                    style={styles.input}
                                    autoCapitalize='none'  //设置首字母不自动大写
                                    underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                    placeholderTextColor={'#FFFAFA'}  //设置占位符颜色
                                    placeholder={'用户名'}  //设置占位符
                                />
                            </View>
                            <TouchableOpacity onPress={this.findfriend} >
                                <Image source={require('../img/find.png')} style={styles.thumbnail} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            );
        else
            if (this.state.isFriend === false) return (
                <ScrollView style={{ backgroundColor: "#F5FCFF" }}>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={styles.titleBackground}>
                            <Text style={styles.title}>添加好友</Text>
                        </View>

                        <Text style={styles.text}>输入用户名查找新朋友：</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.inputBox}>
                                <TextInput
                                    ref="username"  //设置描述
                                    onChangeText={this.onFriendChanged}  //添加值改变事件
                                    style={styles.input}
                                    autoCapitalize='none'  //设置首字母不自动大写
                                    underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                    placeholderTextColor={'#FFFAFA'}  //设置占位符颜色
                                    placeholder={'用户名'}  //设置占位符
                                />
                            </View>
                            <TouchableOpacity onPress={this.findfriend} >
                                <Image source={require('../img/find.png')} style={styles.thumbnail} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container5}>
                            <Image
                                style={styles.thumbnail}
                                source={head['img' + this.state.head]}
                            />
                            <View style={styles.rightContainer}>
                                <Text style={styles.username}>{this.state.friend}</Text>
                            </View>
                            <TouchableOpacity onPress={t.sendmessage.bind(t, this.state.friend)} style={styles.button}>
                                <Text style={styles.btText}>申请</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            );
            else
                return (
                    <ScrollView style={{ backgroundColor: "#F5FCFF" }}>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={styles.titleBackground}>
                                <Text style={styles.title}>添加好友</Text>
                            </View>

                            <Text style={styles.text}>输入用户名查找新朋友：</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.inputBox}>
                                    <TextInput
                                        ref="username"  //设置描述
                                        onChangeText={this.onFriendChanged}  //添加值改变事件
                                        style={styles.input}
                                        autoCapitalize='none'  //设置首字母不自动大写
                                        underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                        placeholderTextColor={'#FFFAFA'}  //设置占位符颜色
                                        placeholder={'用户名'}  //设置占位符
                                    />
                                </View>
                                <TouchableOpacity onPress={this.findfriend} >
                                    <Image source={require('../img/find.png')} style={styles.thumbnail} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.container5}>
                                <Image
                                    style={styles.thumbnail}
                                    source={head['img' + this.state.head]}
                                />
                                <View style={styles.rightContainer}>
                                    <Text style={styles.username}>{this.state.friend}</Text>
                                </View>
                                <View style={styles.button}>
                                    <Text style={styles.btText}>已添加</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                );
    }






}

const styles = StyleSheet.create({

    titleBackground: {
        width: 400,
        height: 50,
        backgroundColor: '#4682B4'
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        margin: 10,
        color: '#FFFFFF'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(187,255,255,0)',
    },
    input: {
        width: 160,
        height: 40,
        fontSize: 17,
        color: '#000000',
    },
    inputBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#B0C4DE',
        marginBottom: 8,
        marginTop: 20
    },

    text: {
        fontSize: 20,
        marginTop: 20
    },
    container5: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    thumbnail: {
        width: 40,
        height: 40,
        marginTop: 25,
        marginLeft: 20
    },
    rightContainer: {
        flex: 1
    },
    username: {
        fontSize: 20,
        marginLeft: 15,
        marginTop: 23
    },
    button: {
        height: 35,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        backgroundColor: '#87CEFA',
        marginTop: 20,
        marginRight: 20
    },
    btText: {
        color: '#fff',
        fontSize: 18,
    },
});