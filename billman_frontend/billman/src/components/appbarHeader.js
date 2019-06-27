import * as React from 'react';
import { StyleSheet } from 'react-native'
import { Appbar } from 'react-native-paper';

export default class AppbarHeader extends React.Component {
    _goBack = () => console.log('Went back');
    _onSearch = () => console.log('Searching');
    _onMore = () => console.log('Shown more');

    render() {
        return (
            <Appbar.Header>
                <Appbar.BackAction
                    onPress={this._goBack}
                />
                <Appbar.Content
                    title="Title"
                    subtitle="Subtitle"
                />
                <Appbar.Action icon="search" onPress={this._onSearch} />
                <Appbar.Action icon="more-vert" onPress={this._onMore} />
            </Appbar.Header>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#58CCED'
    },
});
