import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
export default class Profile extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Profile',
        }
    }
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Profile-Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})