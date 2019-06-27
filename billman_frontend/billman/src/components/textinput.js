import * as React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default class myTextInput extends React.Component {
    state = {
        text: ''
    };

    render() {
        return (
            <TextInput
                label='Email'
                value={this.state.text}
                onChangeText={text => this.setState({ text })}
            />
        );
    }
}
const styles = StyleSheet.create({
    input: {
        backgroundColor: '#000',
    },
});