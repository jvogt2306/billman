import React, { Component } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import global from '../GlobalFunctions'

export default class Favorite extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Favorite',
        }
    }
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        let apiURL = global.getAPI().url;
        return fetch(apiURL + '/Document/Favorites/userid')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                })
                console.log(responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        var dateFormat = require('dateformat');

        if (!this.state.isLoading) {
            return (
                <ScrollView>
                    <View style={{ marginHorizontal: 10, top: 5 }}>
                        {this.state.dataSource.map((l, i) => (
                            <ListItem
                                containerStyle={{ borderBottomWidth: 0.5, borderColor: '#c5c5c5' }}
                                key={i}
                                leftIcon={
                                    { name: 'star' }
                                }
                                rightIcon={{
                                    name: 'navigate-next'
                                }}
                                title={l.company}
                                subtitle={<View>
                                    <Text style={{ fontSize: 12 }}>Datum: {dateFormat(l.procurement_date, "yyyy-mm-dd")} </Text>
                                    <Text style={{ fontSize: 12 }}>Betrag: {l.sum} EUR</Text>
                                </View>}
                                onPress={() => this.props.navigation.navigate('DetailBillPage', { friend: l })}
                            />
                        ))
                        }
                    </View>
                </ScrollView>
            )
        } else {
            return (<ActivityIndicator style={styles.container} />)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})