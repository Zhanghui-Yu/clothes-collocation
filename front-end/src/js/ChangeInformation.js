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
            username:'',
            phone:'',

             };

        }


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

        onUsernameChanged = (Username) => {
            this.state.username = Username;
        };

        onPhoneChanged = (Phone) => {
            this.state.phone = Phone;
        };



    change = () => {
                                       if (this.state.username!= '' && this.phone != '') {
                                                     if(this.isPhoneAvailable(this.phone)){

                                                           let value={
                                                                       uid:this.state.uid,
                                                                       account:this.state.username,
                                                                       phone:this.state.phone
                                                                      }
                                                           let t =this;
                                                           http.post('http://192.168.137.1:8762/updateInfo', value)
                                                               .then(function (data){
                                                                           if(data==-1) Alert.alert("修改失败，原密码输入错误！");
                                                                           else{
                                                                                   Alert.alert("修改成功");
                                                                                   t.props.navigation.navigate('Main',{message:'Main'})}
                                                                                   })
                                                               .catch(err => console.log(err));
                                                                }
                                                            else{
                                                                Alert.alert("请输入正确的手机号码！");
                                                            }


                                       } else {
                                           Alert.alert("新属性不能为空！");
                                       }
                                   };



    componentWillMount() {
      DeviceStorage.get('login').then((login) => {
            this.setState({uid:login})
            });
      DeviceStorage.get('username').then((username) => {
            this.setState({username:username})
            });
      DeviceStorage.get('phone').then((phone) => {
            this.setState({phone:phone})
            });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
          <ScrollView >
            <ImageBackground style={{ flex: 1 }} source={require('../img/background.jpg')}>
             <View style={{flex: 1,alignItems: 'center', justifyContent: 'center' }}>
                 <View style={styles.titleBackground}>
                      <Text style={styles.title}>账号管理</Text>
                 </View>
                 <View style = {{height:700}}>
                     <View style={styles.inputBox1}>
                          <TextInput
                                ref="username"  //设置描述
                                onChangeText={this.onPasswordChanged}  //添加值改变事件
                                style={styles.input}
                                autoCapitalize='none'  //设置首字母不自动大写
                                underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                placeholderTextColor={'#ccc'}  //设置占位符颜色
                                placeholder={'用户名'}  //设置占位符
                                defaultValue = {this.state.username}
                          />
                     </View>
                     <View style={styles.inputBox}>
                          <TextInput
                                ref="information"  //设置描述
                                onChangeText={this.onNewPasswordChanged}  //添加值改变事件
                                style={styles.input}
                                autoCapitalize='none'  //设置首字母不自动大写
                                underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                placeholderTextColor={'#ccc'}  //设置占位符颜色
                                placeholder={'电话号码'}  //设置占位符
                                defaultValue = {this.state.phone}
                          />
                     </View>

                     <TouchableOpacity onPress={this.change} style={styles.button}>
                            <Text style={styles.btText}>修改</Text>
                     </TouchableOpacity>
                </View>
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
   color: '#000000'
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