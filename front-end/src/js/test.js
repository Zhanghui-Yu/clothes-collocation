import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-popup-dialog';

const styles = StyleSheet.create({
    container7: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogContentView: {
        paddingLeft: 18,
        paddingRight: 18,

    },
    navigationBar: {
        borderBottomColor: '#b5b5b5',
        borderBottomWidth: 0.5,
        backgroundColor: '#ffffff',
    },
    navigationTitle: {
        padding: 10,
    },
    navigationButton: {
        padding: 10,
    },
    navigationLeftButton: {
        paddingLeft: 20,
        paddingRight: 40,
    },
    navigator: {
        flex: 1,
        // backgroundColor: '#000000',
    },
    customBackgroundDialog: {
        opacity: 0.5,
        backgroundColor: '#000',
    },
});

export default class App extends Component {
    state = {

        defaultAnimationDialog: false,

    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.container7}>
                    <Button
                        title="发送给"
                        onPress={() => {
                            this.setState({
                                defaultAnimationDialog: true,
                            });
                        }}
                    />


                </View>

                <Dialog
                    onDismiss={() => {
                        this.setState({ defaultAnimationDialog: false });
                    }}
                    width={0.9}
                    visible={this.state.defaultAnimationDialog}
                    rounded
                    actionsBordered

                    dialogTitle={
                        <DialogTitle
                            title="Popup Dialog - Default Animation"
                            style={{
                                backgroundColor: '#F7F7F8',
                            }}
                            hasTitleBar={false}
                            align="left"
                        />
                    }
                    footer={
                        <DialogFooter>
                            <DialogButton
                                text="取消"
                                bordered
                                onPress={() => {
                                    this.setState({ defaultAnimationDialog: false });
                                }}
                                key="button-1"
                            />
                            <DialogButton
                                text="分享"
                                bordered
                                onPress={() => {
                                    this.setState({ defaultAnimationDialog: false });
                                }}
                                key="button-2"
                            />
                        </DialogFooter>
                    }
                >
                    <DialogContent
                        style={{
                            backgroundColor: '#F7F7F8',
                        }}
                    >
                        <Text>Default Animation</Text>
                        <Text>No onTouchOutside handler. will not dismiss when touch overlay.</Text>
                        <TouchableOpacity onPress={() => { window.alert('ok') }}>
                            <Image style={styles.icon1} source={require('../img/分享.png')} />
                        </TouchableOpacity>
                    </DialogContent>
                </Dialog>



            </View>
        );
    }
}