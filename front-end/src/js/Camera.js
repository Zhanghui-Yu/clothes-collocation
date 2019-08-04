import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Tab2Style from './Tab2Style'
const photoOptions = {
    title: '请选择',
    quality: 0.8,
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
class ImagePickerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarSource: null
        };
        this.choosePicker = this.choosePicker.bind(this)
    }
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
                    avatarSource: source
                });
            }
        });
    }
    render() {
        return (
            <View style={Tab2Style.imgbox}>
                <TouchableHighlight style={Tab2Style.button} onPress={this.choosePicker}>
                    <Text>相机 & 相册</Text>
                </TouchableHighlight>
                <Image source={this.state.avatarSource} style={Tab2Style.imageStyle}></Image>
            </View>
        )
    }
}
class Tabnavigation2 extends Component {
    static navigationOptions = {
        headerTitle: "发现"
    };
    render() {
        return (
            <View style={Tab2Style.container}>
                <Text>Tabnavigation2</Text>
                <ImagePickerView />
            </View>
        );
    }
}
export default Tabnavigation2
