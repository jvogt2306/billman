import React, { Component } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements'
import global from '../GlobalFunctions';

export default class Storage extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Dokumente',
        }
    }

    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        let apiURL = global.getAPI().url;
        return fetch(apiURL + '/Document')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        if (this.state.isLoading) {
            return (<ActivityIndicator style={styles.loading} />)
        } else {
            var dateFormat = require('dateformat');
            return (
                <ScrollView>
                    <View style={{ marginHorizontal: 10, top: 5 }}>
                        {this.state.dataSource.map((l, i) => (
                            <ListItem
                                containerStyle={{ borderBottomWidth: 0.5, borderColor: '#c5c5c5' }}
                                key={i}
                                leftIcon={
                                    { name: 'credit-card' }
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
            );
        }
    }
}
const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5
    },
    ratingImage: {
        height: 19.21,
        width: 100
    },
    ratingText: {
        paddingLeft: 10,
        color: 'grey'
    },
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})