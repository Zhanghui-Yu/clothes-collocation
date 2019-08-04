import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    AsyncStorage,
    ScrollView,
    TextInput,
    AppRegistry,
    Slider,
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
            like: '',
            likeFlag: '',
            comment: '',
            commentNum: '',
            headid: '',
            username: '',
            head: '',
            uid: '',
            user: '',
            likeNum: '',
            picture: '',
            point:'',
            markFlag:'',
            content:'',
            isOpen: false,
            newcomment: '',
            inputpoint:0,
            isClothes:'',
            selectedTab: 'tb_msg'
        };
        this.tabNavigatorItems = this.tabNavigatorItems.bind(this);
    }

    _onChange =(value)=>{
        this.setState({
            inputpoint: value
        })}
    logout = () => {
        let login = '';
        DeviceStorage.update('login', login).then((tags) => {
            window.alert('注销成功！')
            this.props.navigation.navigate('Login', { message: 'Login' });
        });
    }

    checklog = () => {
        let t = this;
        DeviceStorage.get('login').then((login) => {
            if (login) {
                if (login === '') {
                } else {

                }
                return false;
            } else {
                window.alert('请先登录哦！');
                t.props.navigation.navigate('Login', { message: 'Login' });
                return false;
            };

        });
    }
commitPoint=()=>{
let t = this;
let value = {
id:t.props.navigation.state.params.i,
uid:t.state.uid,
point:t.state.inputpoint
}
            http.post('http://192.168.137.1:8763/markPoint', value)
                .then(function (data) {

                    DeviceEventEmitter.emit('remymain', 1);
                    DeviceEventEmitter.emit('remain', 1);
        let value1 = { id: t.props.navigation.state.params.i ,
                      uid:t.state.uid}
        http.post('http://192.168.137.1:8763/findCommunityById', value1)
            .then(function (data) {
                t.setState(
                    {
                        comment: data.comment,
                        like: data.like,
                        likeFlag: data.likeFlag,
                        head: data.headPicture,
                        user: data.account,
                        commentNum: data.commentNum,
                        likeNum: data.likeNum,
                        picture: data.picture,
                        point:data.point,
                        content:data.text,
                        markFlag:data.markFlag,
                        isClothes:data.isClothes

                    }
                );
            }
            )
            .catch(err => console.log(err))
                })
                .catch(err => console.log(err));


}

    review = () => {
        let t = this;
        if (this.state.newcomment != '') {

            let value = {
                id: this.props.navigation.state.params.i,
                account: this.state.username,
                message: this.state.newcomment
            }

            http.post('http://192.168.137.1:8763/addComment', value)
                .then(function (data) {
                    t.setState({newcomment:''})
                    DeviceEventEmitter.emit('remain', 1);
                    DeviceEventEmitter.emit('remymain', 1);
        let value1 = { id: t.props.navigation.state.params.i ,
                      uid:t.state.uid}
        http.post('http://192.168.137.1:8763/findCommunityById', value1)
            .then(function (data) {
                t.setState(
                    {
                        comment: data.comment,
                        like: data.like,
                        likeFlag: data.likeFlag,
                        head: data.headPicture,
                        user: data.account,
                        commentNum: data.commentNum,
                        likeNum: data.likeNum,
                        picture: data.picture,
                        point:data.point,
                        content:data.text,
                        markFlag:data.markFlag,
                        isClothes:data.isClothes
                    }
                );

            }
            )
            .catch(err => console.log(err))
                })
                .catch(err => console.log(err));
        } else {
            window.alert("请输入内容！");
        }
    };
    onNewcommentChanged = (newcomment) => {
        this.state.newcomment = newcomment;
    };
renderPoint = () => {
            let po= '';
            let t = this;
            if(t.state.markFlag === true)
            po = (
                                <View style={styles.button1}>
                                    <Text style={styles.btText}>已评分</Text>
                                </View>
            )
            else {
            po = (
            <View style={styles.subView}>
                <View style={{ flexDirection: 'row',}}>
                <Slider  style={styles.slider}
                         minimumValue={0}
                         maximumValue={100}
                         value={0}
                         step={1}
                         onValueChange={this._onChange}
                         minimumTrackTintColor={'#1ff000'}
                         maximumTrackTintColor={'#f010ff'}
                         thumbTintColor={'#aafaff'}//只在安卓有效
                />
                <TouchableOpacity onPress={this.commitPoint} >
                                <View style={styles.button1}>
                                    <Text style={styles.btText}>提交评分</Text>
                                </View>
                </TouchableOpacity >
                </View>
                <Text style={styles.text}>
                    评分：{this.state.inputpoint}
                </Text>
            </View>
            )
                }
        return po;
    }
    like = (cid) => {
        let t = this;
        let value = {
            id: cid,
            uid: t.state.uid
        }
        http.post('http://192.168.137.1:8763/updateLike', value)
            .then(function () {
                        DeviceEventEmitter.emit('remain', 1);
                        DeviceEventEmitter.emit('remymain', 1);
                        t.setState({likeFlag: !t.state.likeFlag });
                        if(t.state.likeFlag === false)  t.setState({likeNum: t.state.likeNum-1 });
                        else t.setState({likeNum: t.state.likeNum+1 });
            }
            )
    };
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
                    this.setState({ selectedTab: 'tb_msg' });
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

        DeviceStorage.get('username').then((username) => {
            this.setState({ username: username })
        });
        DeviceStorage.get('headid').then((headid) => {
            this.setState({ headid: headid })
        });
        DeviceStorage.get('login').then(function(uid){
            t.setState({ uid: uid })
        let value = { id: t.props.navigation.state.params.i ,
                      uid:t.state.uid}
        http.post('http://192.168.137.1:8763/findCommunityById', value)
            .then(function (data) {
                        if(data.flag ==  'Not Found')
                          {
                           window.alert('该条动态已不存在')
                           t.props.navigation.navigate('Message', { message: 'AddPublic' });
                           }
               else t.setState(
                    {
                        comment: data.comment,
                        like: data.like,
                        likeFlag: data.likeFlag,
                        head: data.headPicture,
                        user: data.account,
                        commentNum: data.commentNum,
                        likeNum: data.likeNum,
                        picture: data.picture,
                        point:data.point,
                        content:data.text,
                        markFlag:data.markFlag,
                        isClothes:data.isClothes
                    }
                );
            }
            )
            .catch(err => console.log(err))
        });


    }
    render() {
        this.checklog();
        let t = this;
        var isliked = '';
        if (t.state.likeFlag === true) isliked = require('../img/已点赞.png');
        else isliked = require('../img/未点赞.png');
        let img = { uri: this.state.picture };
        if(t.state.isClothes == 1)   {
        if(t.state.markFlag === true)

        return (
        <View>
            <ScrollView style={{height:height*0.88}}>
                <View style={styles.container3}>
                   <LinearGradient colors={['#FFBBFF', '#B0E0E6']}>
                        <View style={styles.container}>
                            <Text style={styles.title} onPress={() => { this.setState({ isOpen: true }) }} >
                                动态详情
                             </Text>
                        </View>
                    </LinearGradient>
                </View>
                <View style={styles.titleView}>
                    <Image style={styles.icon} source={head['img' + this.state.head]} />
                    <Text style={styles.font}>
                        {this.state.username}
                    </Text>
                            <Text style={styles.font1}>
                                -{t.state.point}-
                            </Text>
                </View>
               <Text style={{width:300,fontSize:16,margin:10,marginLeft:25,alignSelf:'center'}}>{this.state.content}</Text>
                <Image style={styles.image} source={img} />
                                <View style={styles.button1}>
                                    <Text style={styles.btText}>已评分</Text>
                                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={t.like.bind(t,t.props.navigation.state.params.i )}>
                    <Image style={styles.icon1} source={isliked} />
                  </TouchableOpacity>
                    <Text style={styles.font}>{this.state.likeNum}</Text>
                    <Image style={styles.icon1} source={require('../img/评论.png')} />
                    <Text style={styles.font}>{this.state.commentNum}</Text>
                </View>
                <View>
                    <FlatList
                        data={this.state.comment}
                        renderItem={this.renderMovie}
                        style={{ backgroundColor: "#F5FCFF", }}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={{ flexDirection: "row", backgroundColor: "#F5FCFF" }}>
                    <View style={styles.inputBox}>
                        <TextInput
                            ref="password"  //设置描述
                            onChangeText={this.onNewcommentChanged}  //添加值改变事件
                            style={styles.input}
                            autoCapitalize='none'  //设置首字母不自动大写
                            underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                            placeholderTextColor={'#ccc'}  //设置占位符颜色

                            placeholder={'输入内容'}  //设置占位符
                        />
                    </View>
                    <TouchableOpacity onPress={this.review} style={styles.button}>
                        <Text style={styles.btText}>发表评论</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
                <View style={{ backgroundColor: '#F5FCFF', height: height * 0.084 }}>

                    <TabNavigator>
                        {this.tabNavigatorItems('tb_msg', "主页", require('../img/main.png'), require('../img/mains.png'), "", "消息页面内容", 'Main')}
                        {this.tabNavigatorItems('tb_contacts', "好友", require('../img/friend.png'), require('../img/friends.png'), "", "联系人页面内容", 'Friend')}
                        {this.tabNavigatorItems('tb_watch', "搭配推荐", require('../img/match2.png'), require('../img/match1.png'), "", "看点页面内容", 'Match')}
                        {this.tabNavigatorItems('tb_dynamic', "我的衣柜", require('../img/clothes1.png'), require('../img/clothes.png'), "", "动态页面内容", 'Clothes')}
                        {this.tabNavigatorItems('tb_dyn', "消息", require('../img/message.png'), require('../img/messages.png'), "", "动态页面内容", 'Message')}
                    </TabNavigator>
                </View>
                </View>
        );
        else
        return (
        <View>
            <ScrollView style={{height:height*0.88}}>
                <View style={styles.container3}>
                   <LinearGradient colors={['#FFBBFF', '#B0E0E6']}>
                        <View style={styles.container}>
                            <Text style={styles.title} onPress={() => { this.setState({ isOpen: true }) }} >
                                动态详情
                             </Text>
                        </View>
                    </LinearGradient>
                </View>
                <View style={styles.titleView}>
                    <Image style={styles.icon} source={head['img' + this.state.head]} />
                    <Text style={styles.font}>
                        {this.state.username}
                    </Text>
                            <Text style={styles.font1}>
                                -{t.state.point}-
                            </Text>
                </View>
               <Text style={{width:300,fontSize:16,margin:10,marginLeft:25,alignSelf:'center'}}>{this.state.content}</Text>
                <Image style={styles.image} source={img} />
            <View style={styles.subView}>
                <View style={{ flexDirection: 'row',}}>
                <Slider  style={styles.slider}
                         minimumValue={0}
                         maximumValue={100}
                         value={0}
                         step={1}
                         onValueChange={this._onChange}
                         minimumTrackTintColor={'#1ff000'}
                         maximumTrackTintColor={'#f010ff'}
                         thumbTintColor={'#aafaff'}//只在安卓有效
                />
                <TouchableOpacity onPress={this.commitPoint} >
                                <View style={styles.button1}>
                                    <Text style={styles.btText}>提交评分</Text>
                                </View>
                </TouchableOpacity >
                </View>
                <Text style={styles.text}>
                    评分：{this.state.inputpoint}
                </Text>
            </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={t.like.bind(t,t.props.navigation.state.params.i )}>
                    <Image style={styles.icon1} source={isliked} />
                  </TouchableOpacity>
                    <Text style={styles.font}>{this.state.likeNum}</Text>
                    <Image style={styles.icon1} source={require('../img/评论.png')} />
                    <Text style={styles.font}>{this.state.commentNum}</Text>
                </View>
                <View>
                    <FlatList
                        data={this.state.comment}
                        renderItem={this.renderMovie}
                        style={{ backgroundColor: "#F5FCFF", }}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={{ flexDirection: "row", backgroundColor: "#F5FCFF" }}>
                    <View style={styles.inputBox}>
                        <TextInput
                            ref="password"  //设置描述
                            onChangeText={this.onNewcommentChanged}  //添加值改变事件
                            style={styles.input}
                            autoCapitalize='none'  //设置首字母不自动大写
                            underlineColorAndroid={'transparent'}  //将下划线颜色改为透明

                            placeholderTextColor={'#ccc'}  //设置占位符颜色
                            placeholder={'输入内容'}  //设置占位符
                        />
                    </View>
                    <TouchableOpacity onPress={this.review} style={styles.button}>
                        <Text style={styles.btText}>发表评论</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
                <View style={{ backgroundColor: '#F5FCFF', height: height * 0.084 }}>

                    <TabNavigator>
                        {this.tabNavigatorItems('tb_msg', "主页", require('../img/main.png'), require('../img/mains.png'), "", "消息页面内容", 'Main')}
                        {this.tabNavigatorItems('tb_contacts', "好友", require('../img/friend.png'), require('../img/friends.png'), "", "联系人页面内容", 'Friend')}
                        {this.tabNavigatorItems('tb_watch', "搭配推荐", require('../img/match2.png'), require('../img/match1.png'), "", "看点页面内容", 'Match')}
                        {this.tabNavigatorItems('tb_dynamic', "我的衣柜", require('../img/clothes1.png'), require('../img/clothes.png'), "", "动态页面内容", 'Clothes')}
                        {this.tabNavigatorItems('tb_dyn', "消息", require('../img/message.png'), require('../img/messages.png'), "", "动态页面内容", 'Message')}
                    </TabNavigator>
                </View>
                </View>
        );}
        else         return (
                     <View>
                         <ScrollView style={{height:height*0.88}}>
                             <View style={styles.container3}>
                                <LinearGradient colors={['#FFBBFF', '#B0E0E6']}>
                                     <View style={styles.container}>
                                         <Text style={styles.title} onPress={() => { this.setState({ isOpen: true }) }} >
                                             动态详情
                                          </Text>
                                     </View>
                                 </LinearGradient>
                             </View>
                             <View style={styles.titleView}>
                                 <Image style={styles.icon} source={head['img' + this.state.head]} />
                                 <Text style={styles.font}>
                                     {this.state.username}
                                 </Text>

                             </View>
                            <Text style={{width:300,fontSize:16,margin:10,marginLeft:25,alignSelf:'center'}}>{this.state.content}</Text>
                             <Image style={styles.image} source={img} />

                             <View style={{ flexDirection: 'row' }}>
                               <TouchableOpacity onPress={t.like.bind(t,t.props.navigation.state.params.i )}>
                                 <Image style={styles.icon1} source={isliked} />
                               </TouchableOpacity>
                                 <Text style={styles.font}>{this.state.likeNum}</Text>
                                 <Image style={styles.icon1} source={require('../img/评论.png')} />
                                 <Text style={styles.font}>{this.state.commentNum}</Text>
                             </View>
                             <View>
                                 <FlatList
                                     data={this.state.comment}
                                     renderItem={this.renderMovie}
                                     style={{ backgroundColor: "#F5FCFF", }}
                                     keyExtractor={item => item.id}
                                 />
                             </View>
                             <View style={{ flexDirection: "row", backgroundColor: "#F5FCFF" }}>
                                 <View style={styles.inputBox}>
                                     <TextInput
                                         ref="password"  //设置描述
                                         onChangeText={this.onNewcommentChanged}  //添加值改变事件
                                         style={styles.input}
                                         autoCapitalize='none'  //设置首字母不自动大写
                                         underlineColorAndroid={'transparent'}  //将下划线颜色改为透明
                                         placeholderTextColor={'#ccc'}  //设置占位符颜色

                                         placeholder={'输入内容'}  //设置占位符
                                     />
                                 </View>
                                 <TouchableOpacity onPress={this.review} style={styles.button}>
                                     <Text style={styles.btText}>发表评论</Text>
                                 </TouchableOpacity>
                             </View>

                         </ScrollView>
                             <View style={{ backgroundColor: '#F5FCFF', height: height * 0.084 }}>

                                 <TabNavigator>
                                     {this.tabNavigatorItems('tb_msg', "主页", require('../img/main.png'), require('../img/mains.png'), "", "消息页面内容", 'Main')}
                                     {this.tabNavigatorItems('tb_contacts', "好友", require('../img/friend.png'), require('../img/friends.png'), "", "联系人页面内容", 'Friend')}
                                     {this.tabNavigatorItems('tb_watch', "搭配推荐", require('../img/match2.png'), require('../img/match1.png'), "", "看点页面内容", 'Match')}
                                     {this.tabNavigatorItems('tb_dynamic', "我的衣柜", require('../img/clothes1.png'), require('../img/clothes.png'), "", "动态页面内容", 'Clothes')}
                                     {this.tabNavigatorItems('tb_dyn', "消息", require('../img/message.png'), require('../img/messages.png'), "", "动态页面内容", 'Message')}
                                 </TabNavigator>
                             </View>
                             </View>
                     );
    }
    renderMovie({ item }) {

        return (
            <View style={styles.container5}>
                <View style={styles.rightContainer}>
                    <Text style={styles.username}>{item.account}:</Text>
                    <Text style={styles.username}>{item.message}</Text>
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    username: {
        fontSize: 15,
        marginBottom: 3,
        marginLeft: 10
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
    outerView: {
        width: width - 20,
        marginLeft: 10,
        marginTop: 10,
        height: width * 1.15,
        borderStyle: 'solid',
        borderColor: 'gray',
        borderRadius: 8,
        borderWidth: 1
    },
    titleView: {
        flexDirection: 'row',
        height: 45,
        borderColor: 'gray',
        borderStyle: "dotted",
    },
    icon: {
        marginTop: 5,
        width: 35,
        height: 35,
        marginLeft: 10
    },
    icon1: {
        marginTop: 5,
        width: 20,
        height: 20,
        marginLeft: 25
    },
    font: {
        marginTop: 5,
        fontSize: 19,
        marginLeft: 5
    },
    image: {
        width: width / 1.38,
        height: width / 1.25,
        borderRadius: 15,
        marginTop: 2,
        alignSelf: "center"
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
    inputBox: {
        height: 40,
        width: width * 0.75,
        flexDirection: 'row',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginLeft: 7,
        marginRight: 7

    },
    button: {
        height: 40,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#6495ED',
    },
    button1: {
        height: 30,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        backgroundColor: '#87CEFA',
        marginTop:5,
        marginRight: 20
    },
    btText: {
        color: '#fff',
        fontSize: 18,
    },
    btText: {
        color: '#fff',

    },
    font1: {
        marginTop: 10,
        height:28,
        fontSize: 19,
        marginLeft:width*0.45,
        backgroundColor:'#EE82EE',
        color:'#FFFFFF',
        borderRadius: 8,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center',
    },

    subView: {
        backgroundColor: '#ffffff',
        marginTop: 30,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 320
    },
    slider: {
        marginLeft:50,
        width: 270,
        height:50,
    },
    text: {
        marginTop: 20
    }
});