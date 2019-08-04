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
    AsyncStorage
} from 'react-native';
import DeviceStorage from './DeviceStorage';
export default class ThirdPage extends Component<Props> {

    constructor(props) {
        super(props);   //这一句不能省略，照抄即可
        this.state = {
            friend: '',
            username: '',
            content: '',


        };

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

    onContentChanged = (Content) => {
        this.state.content = Content;
    };

    send = () => {
        if (this.state.content != '') {
            var date = this.getmyDate();

            let value = {
                sender: this.state.username,
                recipient: this.state.friend,
                content: "  " + this.state.content,
                time: date
            }
            let t = this;
            http.post('http://192.168.137.1:8763/addMessage', value)
                .then(function (data) {
                    Alert.alert("发送成功！");
                    t.props.navigation.navigate('Main', { message: 'ChangePassword' });
                })
                .catch(err => console.log(err));
        } else {
            Alert.alert("信件内容不能为空！");
        }
    };
    componentWillMount() {
        DeviceStorage.get('friend').then((friend) => {
            this.setState({ friend: friend })
        });
        DeviceStorage.get('username').then((username) => {
            this.setState({ username: username })
        });

    }

    render() {

        return (
            <ScrollView >
                <ImageBackground style={{ flex: 1 }} source={require('../img/background.jpg')}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={styles.titleBackground}>
                            <Text style={styles.title}>发送私信</Text>
                        </View>
                        <View style={{ height: 700 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={require('../img/message2.png')} style={styles.thumbnail} />
                                <Text style={styles.friend}>收件人：{this.state.friend}</Text>
                            </View>
                            <View style={styles.inputBox}>
                                <TextInput
                                    onChangeText={this.onContentChanged}  //添加值改变事件
                                    style={styles.input}
                                    underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                    placeholderTextColor={'#ccc'}  //设置占位符颜色
                                    placeholder={'在此编辑内容'}  //设置占位符
                                    multiline
                                />
                            </View>

                            <TouchableOpacity onPress={this.send} style={styles.button}>
                                <Text style={styles.btText}>确认发送</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
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
    input: {
        width: 270,
        height: 300,
        fontSize: 17,
        color: '#000000',
        textAlignVertical: 'top'
    },
    inputBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 280,
        height: 300,
        borderRadius: 8,
        backgroundColor: '#F0FFFF',
        marginBottom: 8,
    },
    button: {
        height: 50,
        width: 280,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#4682B4',
        marginTop: 20
    },
    btText: {
        color: '#fff',
        fontSize: 20,
    },
    thumbnail: {
        width: 36,
        height: 25,
        marginTop: 20
    },
    friend: {
        fontSize: 20,
        marginTop: 20,
        marginBottom: 20,
    }

});