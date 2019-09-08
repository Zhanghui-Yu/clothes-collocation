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
            uid:'',
            password:'',
            newpassword:'',
            confirmpassword:''
             };

        }




        onPasswordChanged = (Password) => {
            this.state.password = Password;
        };

        onNewPasswordChanged = (newPassword) => {
            this.state.newpassword = newPassword;
        };

        onConfirmPasswordChanged = (newConfirmPassword) => {
            this.state.confirmpassword = newConfirmPassword;
        };

    changepassword = () => {
                                       if (this.state.newpassword != '' && this.state.confirmpassword != '') {
                                               if (this.state.password === this.state.confirmPassword) {

                                                           let value={
                                                                       uid:this.state.uid,
                                                                       password:this.state.password,
                                                                       phone:this.state.newpassword
                                                                      }
                                                           let t =this;
                                                           http.post('http://192.168.137.1:8762/updatePassword', value)
                                                               .then(function (data){
                                                                           if(data==-1) Alert.alert("修改失败，原密码输入错误！");
                                                                           else{
                                                                                   Alert.alert("修改成功");
                                                                                   t.props.navigation.navigate('Main',{message:'Main'})}
                                                                                   })
                                                               .catch(err => console.log(err));


                                                }
                                               else {
                                                   Alert.alert("两次密码不一致！");
                                               }
                                       } else {
                                           Alert.alert("新密码不能为空！");
                                       }
    };




    componentWillMount() {
      DeviceStorage.get('login').then((login) => {
            this.setState({uid:login})
            });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
          <ScrollView>
            <ImageBackground style={{ flex: 1 }} source={require('../img/background.jpg')}>
             <View style={{flex: 1,alignItems: 'center', justifyContent: 'center' }}>
                 <View style={styles.titleBackground}>
                      <Text style={styles.title}>修改密码</Text>
                 </View>

                     <View style={styles.inputBox1}>
                          <TextInput
                                ref="username"  //设置描述
                                onChangeText={this.onPasswordChanged}  //添加值改变事件
                                style={styles.input}
                                autoCapitalize='none'  //设置首字母不自动大写
                                underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                secureTextEntry={true}  //设置为密码输入框
                                placeholderTextColor={'#ccc'}  //设置占位符颜色
                                placeholder={'请输入原密码'}  //设置占位符
                          />
                     </View>
                     <View style={styles.inputBox}>
                          <TextInput
                                ref="password"  //设置描述
                                onChangeText={this.onNewPasswordChanged}  //添加值改变事件
                                style={styles.input}
                                autoCapitalize='none'  //设置首字母不自动大写
                                underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                secureTextEntry={true}  //设置为密码输入框
                                placeholderTextColor={'#ccc'}  //设置占位符颜色
                                placeholder={'新密码'}  //设置占位符
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
                                placeholder={'确认新密码'}  //设置占位符
                          />
                     </View>
                     <TouchableOpacity onPress={this.changepassword} style={styles.button}>
                            <Text style={styles.btText}>确定</Text>
                     </TouchableOpacity>

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