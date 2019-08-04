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


        };

    }
    sendmessage = () => {

        this.props.navigation.navigate('SendMessage', { message: 'SendMessage' });
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
                        <View >
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={require('../img/message2.png')} style={styles.thumbnail} />
                                <Text style={styles.friend}>发件人：{this.state.friend}</Text>
                            </View>
                            <Text style={styles.friend}>发送时间：{this.props.navigation.state.params.t}</Text>
                            <Text style={styles.friend}>内容：</Text>
                            <View style={styles.inputBox}>
                                <Text style={styles.input}>{this.props.navigation.state.params.c}</Text>
                            </View>
                            <TouchableOpacity onPress={this.sendmessage} style={styles.button}>
                                <Text style={styles.btText}>回复</Text>
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
        fontSize: 18,
        color: '#000000',
        textAlignVertical: 'top'
    },
    inputBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 280,

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


    }

});