import React, { Component } from 'react';
import http from "./http";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    TextInput,
    Alert,
    Button,
} from 'react-native';


export default class FirstPage extends Component {




        constructor(props) {
        super(props);
        this.register = this.register.bind(this);
        }
        username = '';  //保存用户名
        password = '';  //保存密码
        confirmPassword = '';  //保存确认密码
        phone='';
        flag='';

        isPhoneAvailable(str) {
             let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
             if (str.length == 0 || str == null) {
                    return false;
              } else if (!myreg.test(str)) {
                    return false;
              } else {
                    return true;
                      }
        }
        onUsernameChanged = (newUsername) => {
            this.username = newUsername;
        };

        onPasswordChanged = (newPassword) => {
            this.password = newPassword;
        };

        onPhoneChanged = (newPhone) => {
            this.phone = newPhone;
        };

        onConfirmPasswordChanged = (newConfirmPassword) => {
            this.confirmPassword = newConfirmPassword;
        };

        blurTextInput = () => {
            this.refs.username.blur();
            this.refs.password.blur();
            this.refs.confirmPassword.blur();
            this.refs.phone.blur();
        }

        register = () => {
            if (this.username != '' && this.password != '') {
                    if (this.password === this.confirmPassword) {
                        if(this.isPhoneAvailable(this.phone)){
                                let value={
                                            account:this.username,
                                            password:this.password,
                                            phone:this.phone
                                           }
                                let t =this;
                                http.post('http://192.168.137.1:8762/addUser', value)
                                    .then(function (data){
                                                if(data==-1) Alert.alert("注册失败，该用户名已被注册");
                                                else{
                                                        Alert.alert("注册成功");
                                                        t.props.navigation.navigate('Login',{message:'Login'})}
                                                        })
                                    .catch(err => console.log(err));}
                        else alert('注册失败，请输入正确的手机号码');

                     }
                    else {
                        Alert.alert("注册失败,两次密码不一致");
                    }
            } else {
                Alert.alert("注册失败,用户名或密码不能为空");
            }
        };

    render() {
        const { navigate } = this.props.navigation;
        return (
         <ScrollView>
            <ImageBackground style={{ flex: 1 }} source={require('../img/background.jpg')}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                 <View style={styles.titleBackground}>
                          <Text style={styles.title}>注册</Text>
                 </View>
                 <TouchableOpacity
                            activeOpacity={1.0}
                            onPress={this.blurTextInput}
                            style={styles.container}>
                          <View style={styles.inputBox1}>
                                <TextInput
                                    ref="username"  //添加描述
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
                                    ref="password"  //添加描述
                                    onChangeText={this.onPasswordChanged}  //添加值改变事件
                                    style={styles.input}
                                    secureTextEntry={true}  //设置为密码输入框
                                    autoCapitalize='none'  //设置首字母不自动大写
                                    underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                    placeholderTextColor={'#ccc'}  //设置占位符颜色
                                    placeholder={'密码'}  //设置占位符
                                />
                          </View>
                          <View style={styles.inputBox}>
                                <TextInput
                                    ref="confirmPassword"  //添加描述
                                    onChangeText={this.onConfirmPasswordChanged}  //添加值改变事件
                                    style={styles.input}
                                    secureTextEntry={true}  //设置为密码输入框
                                    autoCapitalize='none'  //设置首字母不自动大写
                                    underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                    placeholderTextColor={'#ccc'}  //设置占位符颜色
                                    placeholder={'确认密码'}  //设置占位符
                                />
                          </View>
                          <View style={styles.inputBox}>
                                <TextInput
                                    ref="phone"  //添加描述
                                    onChangeText={this.onPhoneChanged}  //添加值改变事件
                                    style={styles.input}
                                    autoCapitalize='none'  //设置首字母不自动大写
                                    underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                    placeholderTextColor={'#ccc'}  //设置占位符颜色
                                    placeholder={'手机号码'}  //设置占位符
                                />
                          </View>
                          <TouchableOpacity
                                onPress={this.register}  //添加点击事件
                                style={styles.button}>
                                <Text style={styles.btText}>注册</Text>
                          </TouchableOpacity>
                 </TouchableOpacity>
                 <Image source={require('../img/test4.png')} style={styles.thumbnail} />
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
   marginTop: 20,
   },
 btText: {
   color: '#fff',
   fontSize: 20,
   },
 thumbnail: {
   width: 545/6,
   height: 765/6,
   alignSelf:"center",
   marginTop: 50,
   marginBottom: 200
   }

});