import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';



export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Settings-Screen</Text>
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