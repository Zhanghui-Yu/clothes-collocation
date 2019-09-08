import React, {Component} from 'react';
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
    AsyncStorage
} from 'react-native';
import DeviceStorage from './DeviceStorage';
import SideMenu from 'react-native-side-menu';
import TabNavigator from 'react-native-tab-navigator';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('window');
type Props = {};
export default class Side extends Component<Props> {


      logout = ()=>{
            let login = '';
            DeviceStorage.update('login',login).then((tags) => {
                        window.alert('注销成功！')
                        this.props.navigation.navigate('Login',{message:'Login'});
                    });
        }

        checklog= () =>{
             let t =this;
             DeviceStorage.get('login').then((login) => {
                                    if (login) {
                                                      if (login === '') {
                                                         }else {

                                                          }
                                                          return false;
                                                  } else {
                                                      window.alert('请先登录哦！');
                                                      t.props.navigation.navigate('Login',{message:'Login'});
                                                      return false;
                                                      };

                                 });}

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            selectedTab:'tb_msg'
        };
        this.tabNavigatorItems = this.tabNavigatorItems.bind(this);
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
                this.setState({selectedTab: 'tb_msg'});
                this.setState({isOpen: false });
                t.props.navigation.navigate(newPage,{message:'newPage'});}}
          >
              <View style={{flex:1}}></View>
          </TabNavigator.Item>
      )
  }

    render() {
    this.checklog();
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
<View>
                 <View style={styles.container3}>
                    <LinearGradient colors={['#FFBBFF','#B0E0E6']} >
                        <View style={styles.container}>
                             <Text style={styles.title}onPress={() => {this.setState({isOpen: true })}} >
                                 动态详情
                             </Text>
                        </View>
                    </LinearGradient>
                 </View>



                     <View style={styles.titleView}>
                             <Image style={styles.icon}source={require('../img/head_sculpture/5.png')}/>
                             <Text  style={styles.font}>
                                   smallqqq
                             </Text>
                     </View>
                     <TouchableOpacity onPress={this.logout}>
                        <Image style={styles.image} source={require('../img/test2.jpg')}/>
                     </TouchableOpacity>
                     <View style={{ flexDirection:'row'}}>
                           <Image style={styles.icon1} source={require('../img/未点赞.png')}/>
                           <Text  style={styles.font}>20</Text>
                           <TouchableOpacity onPress={this.logout}>
                                <Image style={styles.icon1} source={require('../img/评论.png')}/>
                            </TouchableOpacity>
                                <Text style={styles.font}>10</Text>

                     </View>
                        <View>
                         <FlatList
                           data = {[
                                         {name: 'Java'},
                                         {name: 'Android'},
                                         {name: 'iOS'},
                                         {name: 'Flutter'},
                                         {name: 'React Native'},
                                         {name: 'Kotlin'},
                                         {name: 'An'},
                                         {name: 'i'},
                                         {name: 'Flut'},
                                         {name: 'Reative'},
                                         {name: 'Kon'},
                                       ]}
                           renderItem={this.renderMovie}
                           style={{ backgroundColor: "#F5FCFF",height:height*0.21}}
                           keyExtractor={item => item.id}
                         />
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
</View>

        );
    }
      renderMovie({ item }) {
      
        return (
          <View style={styles.container5}>
                     <View style={styles.rightContainer}>
                       <Text style={styles.username}>smallqqq：</Text>
                       <Text style={styles.username}>good!</Text>
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

        backgroundColor: '#F5FCFF',
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
        flex: 1,
        flexDirection:'row',
    },
    username: {
        fontSize: 15,
        marginBottom: 5,
    },
    dynamic: {
        fontSize: 10
    },
    thumbnail: {
        width: 40,
        height: 40,
        margin:5,
        marginLeft:20
    },
    myImage:{
        width:24,
        height:22,
    },
    outerView:{
        width:width-20,
        marginLeft:10,
        marginTop:10,
        height:width*1.15,
        borderStyle: 'solid',
        borderColor:'gray',
        borderRadius:8,
        borderWidth:1
    },
    titleView:{
        flexDirection:'row',
        height:45,
        borderColor:'gray',
        borderStyle:"dotted",
    },
    icon:{
        marginTop:5,
        width:35,
        height:35,
        marginLeft:10
    },
    icon1:{
        marginTop:5,
        width:20,
        height:20,
        marginLeft:25
    },
    font:{
        marginTop:5,
        fontSize:19,
        marginLeft:5
    },
    image:{
        width:width/1.38,
        height:width/1.25,
        borderRadius: 15,
        marginTop:5,
        alignSelf:"center"
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
});