import React, { Component } from 'react';
import Main from './Main';
import Register from './Register';
import Login from './Login';
import Match from './Match';
import Clothes from './Clothes';
import Clothesmatch from './Clothesmatch';
import Friend from './Friend';
import Message from './Message';
import BottomNavigation from './BottomNavigation';
import AsyncStorage from 'react-native';
import MainDetail from './MainDetail';
import ChangeHead from './ChangeHead';
import ChangePassword from './ChangePassword';
import ChangeInformation from './ChangeInformation';
import AddFriend from './AddFriend';
import AddPublic from './AddPublic';
import SendMessage from './SendMessage';
import SpecificMessage from './SpecificMessage';
import Application from './Application';
import Favorite from './Favorite';
import test from './test';
import Btn from './Btn';
import MyMain from './MyMain';
import {
    createAppContainer,
    createStackNavigator
} from 'react-navigation';



export default class Pages extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <SimpleAppNavigator />
        )
    }
};

const SimpleAppNavigator = createAppContainer(createStackNavigator({
    Main: { screen: Main },
    Register: { screen: Register },
    Login: { screen: Login },
    Match: { screen: Match },
    Message: { screen: Message },
    Clothes: { screen: Clothes },
    Friend: { screen: Friend },
    BottomNavigation: { screen: BottomNavigation },
    Clothesmatch: { screen: Clothesmatch },
    MainDetail: { screen: MainDetail },
    ChangeHead: { screen: ChangeHead },
    ChangeInformation: { screen: ChangeInformation },
    ChangePassword: { screen: ChangePassword },
    AddFriend: { screen: AddFriend },
    AddPublic: { screen: AddPublic },
    SendMessage: { screen: SendMessage },
    SpecificMessage: { screen: SpecificMessage },
    Application: { screen: Application },
    Favorite: { screen: Favorite },
    test: { screen: test },
    Btn: { screen: Btn },
    MyMain: { screen: MyMain }
}, {
        initialRouteName: 'Login',
        headerMode: 'none'
    }));

