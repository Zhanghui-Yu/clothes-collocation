import React, {Component} from 'react';
import {StyleSheet, View,Text,Image,Dimensions} from 'react-native';
import TabNavigator from 'react-native-tab-navigator'

export default class App extends Component<Props> {
  /*初始化state*/
  constructor(props){
      super();
      this.state={
        selectedTab:'tb_msg',
      }
this.tabNavigatorItems = this.tabNavigatorItems.bind(this);
  }
    /**
     * 公共组件方法
     * @param selectedTab 选中的tab
     * @param title
     * @param icon
     * @param selectedIcon
     * @param imageStyle  选中时渲染图标的颜色
     * @param mark  角标
     * @param viewContent  页面内容
     * @returns {*}
     */

  tabNavigatorItems(selectedTab,title,icon,selectedIcon,mark,viewContent){
   let t=this;
      return (
          <TabNavigator.Item
              selected={this.state.selectedTab === selectedTab }
              title={title}
              renderIcon={()=> <Image style={styles.myImage} source={icon}/> }
              renderSelectedIcon={()=> <Image  style={styles.myImage} source={selectedIcon}/> }
              badgeText={mark}
              onPress={()=> {
              this.setState({selectedTab:selectedTab  });
              t.props.navigation.navigate('Register',{message:'Register'});


              }
               }>
              <View style={{flex:1}}></View>
          </TabNavigator.Item>
      )
  }

  render() {
   let MainHeight = Dimensions.get('window').height;
    return (
      <View style={{flex: 1,backgroundColor: '#F5FCFF',height:MainHeight*0.2}}>
         <TabNavigator>
            {this.tabNavigatorItems('tb_msg',"主页",require('../img/main.png'),require('../img/mains.png'),"","消息页面内容")}
            {this.tabNavigatorItems('tb_contacts',"好友",require('../img/friend.png'),require('../img/friends.png'),"","联系人页面内容")}
            {this.tabNavigatorItems('tb_watch',"搭配推荐",require('../img/match2.png'),require('../img/match1.png'),"","看点页面内容")}
            {this.tabNavigatorItems('tb_dynamic',"我的衣柜",require('../img/clothes1.png'),require('../img/clothes.png'),"","动态页面内容")}
            {this.tabNavigatorItems('tb_dyn',"消息",require('../img/message.png'),require('../img/messages.png'),"1","动态页面内容")}
         </TabNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {

    },
    myImage:{
        width:24,
        height:22,
    }
});

