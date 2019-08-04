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
    Dimensions,
    Image,
    Animated,
    ImageBackground,
    ScrollView,
    AsyncStorage,
    TouchableHighlight,
    DeviceEventEmitter
} from 'react-native';
import head from './head';
import ImagePicker from 'react-native-image-picker';
import DeviceStorage from './DeviceStorage';
const { width, height } = Dimensions.get('window');
const photoOptions = {
    title: '请选择',
    quality: 0.8,
    maxWidth: 600,
    maxHeight: 600,
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    allowsEditing: true,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class ThirdPage extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            uid: '',
            picture: '',
            picturedata:'',
            content: '',
            isClothes:0
        };
        this.choosePicker = this.choosePicker.bind(this)
    }
    onContentChanged = (Content) => {
        this.state.content = Content;
    };
    choosePicker() {
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
                // let source = { uri: response.uri };
                // You can also display the image using data:
                let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    picture: source,
                    picturedata:response.data
                });


            }
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
    onContentChanged = (Content) => {
        this.state.content = Content;
    };
    chooseFlag= () => {
        this.setState({isClothes:!this.state.isClothes+0});
    };

    publish = () => {

        if(this.state.isClothes == 1){

        if (this.state.picture == '')  {
                                                  Alert.alert("请选择图片！");
                                              }
                                              else{
        let picture1 = this.state.picturedata;
                    let value1 = {
                        pic: picture1
                    }
                    let t = this;
                    http.postimg('http://192.168.137.45:5000/checkSuit', value1)
                        .then(function (data) {
                      window.alert(data)

                        })



        }






        }


        else{
        if (this.state.picture != '') {
            var date = this.getmyDate();
            let value = {
                senderUid: this.state.uid,
                picture: this.state.picture.uri,
                text: this.state.content,
                isClothes:0,
                time: date
            }
            let t = this;
            http.postimg('http://192.168.137.1:8763/addCommunity', value)
                .then(function (data) {
                    window.alert("发布成功！");
                    DeviceEventEmitter.emit('remymain', 1);
                    DeviceEventEmitter.emit('remain', 1);
                    t.props.navigation.navigate('Main', { message: 'Main' });
                })
                .catch(err => console.log(err));
        } else {
            Alert.alert("请选择图片！");
        }}
    };
    componentWillMount() {
        DeviceStorage.get('login').then((uid) => {
            this.setState({ uid: uid })
        });
    }

    render() {
        let t = this;
        var ischosen = '';
        if (t.state.picture === '') ischosen = require('../img/new2.png');
        else ischosen = t.state.picture
        if (t.state.isClothes == 0) isflag = require('../img/未选中.png');
        else isflag = require('../img/选中.png');
        return (
            <ScrollView >
                <ImageBackground style={{ flex: 1 }} source={require('../img/background.jpg')}>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={styles.titleBackground}>
                            <Text style={styles.title}>分享</Text>
                        </View>

                        <View style={styles.inputBox}>
                            <TextInput
                                onChangeText={this.onContentChanged}  //添加值改变事件
                                style={styles.input}
                                underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                placeholderTextColor={'#ccc'}  //设置占位符颜色
                                placeholder={'说点什么，让世界发现你的美…'}  //设置占位符
                                multiline
                            />
                        </View>
                        <View style={{ height: 367 }}>
                            <TouchableOpacity onPress={t.choosePicker}>
                                <Image source={ischosen} style={styles.news} />
                                <Text style={{ fontSize: 18, textAlign: 'center', color: '#828282' }}>选择图片</Text>
                            </TouchableOpacity>
<View style={{flexDirection: 'row'}}>
<Text style={{ fontSize: 18,  color: '#828282' }}>上传为搭配</Text>
                            <TouchableOpacity onPress={t.chooseFlag}>


                                <Image source={isflag} style={{width:18,height:18,marginLeft:20,marginTop:3}} />

                            </TouchableOpacity>
       </View>

                            <TouchableOpacity onPress={this.publish} style={styles.button}>
                                <Text style={styles.btText}>发布</Text>
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
    news: {
        width: width / 2,
        height: width / 2,
        margin: 5,
        marginTop: 10,
        alignSelf: "center"
    },
    picture: {
        width: width / 1.8,
        height: width / 1.45,
        margin: 5,
        marginTop: 10,
        alignSelf: "center"
    },
    input: {
        width: 270,
        height: 180,
        fontSize: 17,
        color: '#000000',
        textAlignVertical: 'top'
    },
    inputBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 280,
        height: 180,
        borderRadius: 8,
        backgroundColor: '#F0FFFF',
        marginBottom: 8,
        marginTop: 10
    },
});