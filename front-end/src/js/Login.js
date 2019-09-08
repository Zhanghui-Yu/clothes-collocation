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
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
}

        username = '';  //保存用户名
        password = '';  //保存密码
        userdata = '';

        onUsernameChanged = (newUsername) => {
            this.username = newUsername;
        };

        onPasswordChanged = (newPassword) => {
            this.password = newPassword;
        };
 /**
     * 点击空白处使输入框失去焦点
     */
    blurTextInput = () => {
        this.refs.username.blur();
        this.refs.password.blur();
    };

    login = () => {
    let uid=0;
    let t=this;
    let value={
        account:this.username,
        password:this.password
    }
    http.post('http://192.168.137.1:8762/findUser', value)
                .then(function (data){
                         uid = data.uid;
                         headid = data.picture;
                         username = data.account;
                         phone = data.phone;
                         if (uid!=-1) {
                                if(data.state=='forbid') window.alert("您的账户已被禁用");
                                else{
                                    let login = uid;
                                    DeviceStorage.save('headid',headid);
                                    DeviceStorage.save('username',username);
                                    DeviceStorage.save('phone',phone);
                                    DeviceStorage.save('login',login).then(() => {
                                           t.props.navigation.navigate('Main',{message:'Main'});
                                           window.alert("登录成功");
                                                        });


                                    }
                                }
                         else {
                                window.alert("登录失败,用户名或密码不正确");  //弹出提示框
                                };
                 }
                )
                .catch(err => console.log(err))
        };

    register = () => {
        this.props.navigation.navigate('Register',{message:'Register'});
    }


    render() {
        const { navigate } = this.props.navigation;
        return (
          <ScrollView>
            <ImageBackground style={{ flex: 1 }} source={require('../img/background.jpg')}>
             <View style={{flex: 1,alignItems: 'center', justifyContent: 'center' }}>
                 <View style={styles.titleBackground}>
                      <Text style={styles.title}>欢迎来到Mardrobe！</Text>
                 </View>
                 <TouchableOpacity  //用可点击的组件作为背景
                        activeOpacity={1.0}  //设置背景被点击时的透明度改变值
                        onPress={this.blurTextInput}  //添加点击事件
                        style={styles.container}
                 >
                     <View style={styles.inputBox1}>
                          <TextInput
                                ref="username"  //设置描述
                                onChangeText={this.onUsernameChanged}  //添加值改变事件
                                style={styles.input}
                                autoCapitalize='none'  //设置首字母不自动大写
                                underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                placeholderTextColor={'#ccc'}  //设置占位符颜色
                                placeholder={'用户名'}  //设置占位符
                          />
                     </View>
                     <View style={styles.inputBox}>
                          <TextInput
                                ref="password"  //设置描述
                                onChangeText={this.onPasswordChanged}  //添加值改变事件
                                style={styles.input}
                                autoCapitalize='none'  //设置首字母不自动大写
                                underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                secureTextEntry={true}  //设置为密码输入框
                                placeholderTextColor={'#ccc'}  //设置占位符颜色
                                placeholder={'密码'}  //设置占位符
                          />
                     </View>
                     <TouchableOpacity onPress={this.login} style={styles.button}>
                            <Text style={styles.btText}>登录</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={this.register} style={styles.button}>
                            <Text style={styles.btText}>注册</Text>
                     </TouchableOpacity>

                 </TouchableOpacity>
                 <Image source={require('../img/test4.png')} style={styles.thumbnail}/>
             </View>
            </ImageBackground>
          </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

 titleBackground:{
   width: 400,
   height: 50,
   backgroundColor:  '#4682B4'
   },
 title:{
   fontSize: 28,
   textAlign: 'center',
   margin: 10,
   color:'#FFFFFF'
   },
 welcome: {
   fontSize: 20,
   textAlign: 'center',
   margin: 10,
   },
 textView: {
   fontSize: 16,
   textAlign: 'center',
   margin: 10,
   color:'red'
   },
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor:'rgba(187,255,255,0)',
   },
 input: {
   width: 200,
   height: 40,
   fontSize: 17,
   color: '#000000',
   },
 inputBox: {
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   width: 280,
   height: 50,
   borderRadius: 8,
   backgroundColor: '#F0FFFF',
   marginBottom: 8,
   },
 inputBox1: {
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   width: 280,
   height: 50,
   borderRadius: 8,
   backgroundColor: '#F0FFFF',
   marginBottom: 8,
   marginTop: 40
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
   width: 545/6,
   height: 765/6,
   alignSelf:"center",
   marginTop: 80,
   marginBottom: 200
   },

});