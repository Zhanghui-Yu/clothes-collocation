import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList,
    ImageBackground
} from 'react-native';
import DeviceStorage from './DeviceStorage';
import SideMenu from 'react-native-side-menu';
import TabNavigator from 'react-native-tab-navigator';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('window');
type Props = {};
export default class Side extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
             selectedTab:'tb_watch'
        };
        this.tabNavigatorItems = this.tabNavigatorItems.bind(this);
    }

      logout = ()=>{
            let login = '';
            DeviceStorage.update('login',login).then((tags) => {
                        window.alert('注销成功！')
                        this.props.navigation.navigate('Login',{message:'Login'});
                    });
        }

tabNavigatorItems(selectedTab,title,icon,selectedIcon,mark,viewContent,newPage){
   let t=this;
      return (
          <TabNavigator.Item
              selected={this.state.selectedTab === selectedTab }
              title={title}
              renderIcon={()=> <Image style={styles.myImage} source={icon}/> }
              renderSelectedIcon={()=> <Image  style={styles.myImage} source={selectedIcon}/> }
              badgeText={mark}
              onPress={()=> {
              this.setState({selectedTab:'tb_watch' });
              this.setState({isOpen: false });
              t.props.navigation.navigate(newPage,{message:'newPage'});


              }
               }>
              <View style={{flex:1}}></View>
          </TabNavigator.Item>
      )
  }

    render() {

        const menu =<View>
                    <LinearGradient colors={['#6495ED','#B0E0E6']} >
                        <View style={styles.container2}>
                              <TouchableOpacity onPress={() => alert("修改头像")}>
                                    <Image style={styles.sculpture2}
                                        source={require('../img/head_sculpture/6.png')}
                                    />
                              </TouchableOpacity>
                              <Text style={{fontSize: 20, textAlign: 'center', marginLeft:25,marginTop:47}}
                              >
                                    smallqqq
                              </Text>
                        </View>
                    </LinearGradient>
                    <View style={{height:4}}></View>
                    <LinearGradient colors={['#B0E0E6','#6495ED']} >
                        <View style={styles.container4}>
                               <TouchableOpacity onPress={() => alert("账号管理")}>
                                    <Text style={{marginLeft:10,fontSize:20,marginTop:30,color:'#000000'}}>账号管理</Text>
                               </TouchableOpacity>
                               <TouchableOpacity onPress={() => alert("个性装扮")}>
                                    <Text style={{marginLeft:10,fontSize:20,marginTop:30,color:'#000000'}}>个性装扮</Text>
                               </TouchableOpacity>
                               <TouchableOpacity onPress={this.logout}>
                                      <Text style={{marginLeft:10,fontSize:20,marginTop:30,color:'#000000'}}>退出登录</Text>
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
                    <LinearGradient colors={['#FFBBFF','#B0E0E6']} >
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => {this.setState({isOpen: true })}}>
                         <Image style={styles.sculpture}
                              source={require('../img/head_sculpture/6.png')}
                         />
                        </TouchableOpacity>
                        <Text style={styles.title}
                              onPress={() => {this.setState({isOpen: true })}}
                        >
                             匹配结果
                        </Text>
                    </View>
                    </LinearGradient>
                    </View>




                   <View style={{height:width*1.41}}>
                   <ImageBackground style={{ flex: 1}} source={require('../img/background2.jpg')}>
                    <Text style={styles.content}>看看大家怎么穿！</Text>
                   <FlatList
                           data = {[
                                         {key: 'Java'},
                                         {key: 'Android'},
                                         {key: 'iOS'},
                                         {key: 'Flutter'},
                                         {key: 'React Native'},
                                         {key: 'Kotlin'},
                                         {key: 'An'},
                                         {key: 'i'},
                                         {key: 'Flut'},
                                         {key: 'Reative'},
                                         {key: 'Kon'}
                                    ]}
                           renderItem={this.renderMovie}
                           style={{

                                       height:height*0.46,


                                       }}
                           keyExtractor={item => item.id}
                           horizontal={true}
                         />
                         <Image
                                                                               source={require('../img/test4.png')}
                                                                               style={styles.logo}
                                                                               />
                         </ImageBackground>
                   </View>


                   <View style={{backgroundColor: '#F5FCFF',height:height*0.1}}>
                                             <TabNavigator>
                                                {this.tabNavigatorItems('tb_msg',"主页",require('../img/main.png'),require('../img/mains.png'),"","消息页面内容",'Main')}
                                                {this.tabNavigatorItems('tb_contacts',"好友",require('../img/friend.png'),require('../img/friends.png'),"","联系人页面内容",'Friend')}
                                                {this.tabNavigatorItems('tb_watch',"搭配推荐",require('../img/match2.png'),require('../img/match1.png'),"","看点页面内容",'Match')}
                                                {this.tabNavigatorItems('tb_dynamic',"我的衣柜",require('../img/clothes1.png'),require('../img/clothes.png'),"","动态页面内容",'Clothes')}
                                                {this.tabNavigatorItems('tb_dyn',"消息",require('../img/message.png'),require('../img/messages.png'),"1","动态页面内容",'Message')}
                                             </TabNavigator>
                                          </View>
            </SideMenu>
        );
    }
      renderMovie({ item }) {

        // { item }是一种“解构”写法，请阅读ES2015语法的相关文档
        // item也是FlatList中固定的参数名，请阅读FlatList的相关文档
        return (
          <View >
                           <Image
                                 source={require('../img/test3.jpg')}
                                 style={styles.thumbnail}
                                 />
                                 <View style={{flexDirection: 'row'}}>
                                 <TouchableOpacity onPress={() => alert("点赞")}>
                                 <Image style={{width:22, height:22,marginLeft:width/3.2,marginTop:5}} source={require('../img/good.png')}/>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => alert("差评")}>
                                 <Image style={{width:20, height:20,marginLeft:15,marginTop:5}} source={require('../img/bad.png')}/>
                                 </TouchableOpacity>
                                 </View>
          </View>
        );
      }
}


const styles = StyleSheet.create({
    sculpture:{
        width:35,
        height:35,
        marginLeft:5,
        marginTop:5
    },
    sculpture2:{
            width:55,
            height:55,
            marginLeft:5,
            marginTop:30
        },
    container: {
        marginTop: 0,
        width: width,
        height: 45,
        flexDirection:'row',


    },
    container2: {
            marginTop: 0,
            width: width,
            height: 150,
            flexDirection:'row',
        },
    container3: {
            flex: 1,
            backgroundColor: '#F5FCFF',
             height: 45,
        },
    container4: {
                marginTop: 0,
                width: width,
                height: height-150
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

      myImage:{
                    width:24,
                    height:22,
                },
      thumbnail: {
              width: width/2.2,
              height: width/1.45,
              marginLeft: 10,
              borderRadius:8,
            },
      title:{
              fontSize: 28,
              color:'#FFFFFF',
              textAlign: 'center',
              alignItems:'center',
              justifyContent:'center',
              textAlignVertical:'center',
              marginLeft:width/3.6
                                  },
content:{
              fontSize: 20,
              color:'#696969' ,
              marginTop:20,
              marginLeft:15,
              marginBottom:20,
              },
              logo: {
                      width: 545/6,
                      height: 765/6,
                      alignSelf:"center",
                      marginTop: 20,

                    },
});