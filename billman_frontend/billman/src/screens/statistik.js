import React, { Component } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView } from 'react-native';
import { ListItem, Card } from 'react-native-elements';
import global from '../GlobalFunctions';

export default class Statistik extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoadingDay: true,
            isLoadingMonth: true,
            isLoadingYear: true
        }
    }

    loadStatistikDay(apiURL) {
        fetch(apiURL + '/Statistik/Day/admin')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    dataSourceToday: responseJson,
                    isLoadingDay: false
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    loadStatistikMonth(apiURL) {
        fetch(apiURL + '/Statistik/Month/admin')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    dataSourceMonth: responseJson,
                    isLoadingMonth: false,
                })
                console.log(JSON.stringify(responseJson))
            })
            .catch((error) => {
                console.error(error);
            });
    }

    loadStatistikYear(apiURL) {
        fetch(apiURL + '/Statistik/Year/admin')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoadingYear: false,
                    dataSourceYear: responseJson,
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }
    componentDidMount() {
        let apiURL = global.getAPI().url;
        this.loadStatistikDay(apiURL);
        this.loadStatistikMonth(apiURL);
        this.loadStatistikYear(apiURL);
    }

    getMonthName(monthID) {
        const month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        return month[monthID];
    }

    render() {
        var dateFormat = require('dateformat');
        if (!this.state.isLoadingDay && !this.state.isLoadingMonth && !this.state.isLoadingYear) {
            var d = new Date();
            return (
                <ScrollView>
                    <View style={{ marginHorizontal: 5, top: 5 }}>
                        <Card title={"Ausgaben am: " + dateFormat(new Date(), "yyyy-mm-dd")} titleSyle={{ borderColor: '#c5c5c5' }} >
                            {this.state.dataSourceToday.map((l, i) => (
                                <ListItem
                                    containerStyle={{ borderBottomWidth: 0.5, borderColor: '#c5c5c5' }}
                                    key={i}
                                    leftIcon={
                                        { name: 'trending-up' }
                                    }
                                    title={l._id}
                                    subtitle={<View>
                                        <Text style={{ fontSize: 12 }}>Betrag: {l.sum_category.toString()} EUR</Text>
                                    </View>}

                                />
                            ))
                            }
                        </Card>
                        <Card title={"Ausgaben im: " + this.getMonthName(new Date().getMonth())} >
                            {this.state.dataSourceMonth.map((l, i) => (
                                <ListItem
                                    containerStyle={{ borderBottomWidth: 0.5, borderColor: '#c5c5c5' }}
                                    key={i}
                                    leftIcon={
                                        { name: 'trending-up' }
                                    }
                                    title={l._id}
                                    subtitle={<View>
                                        <Text style={{ fontSize: 12 }}>Betrag: {l.sum_category.toString()} EUR</Text>
                                    </View>}

                                />
                            ))
                            }
                        </Card>
                        <Card title={"Ausgaben in: " + new Date().getFullYear()} >
                            {this.state.dataSourceYear.map((l, i) => (
                                <ListItem
                                    containerStyle={{ borderBottomWidth: 0.5, borderColor: '#c5c5c5' }}
                                    key={i}
                                    leftIcon={
                                        { name: 'trending-up' }
                                    }
                                    title={l._id}
                                    subtitle={<View>
                                        <Text style={{ fontSize: 12 }}>Betrag: {l.sum_category.toString()} EUR</Text>
                                    </View>}
                                />
                            ))
                            }
                        </Card>
                    </View>
                </ScrollView>
            )
        } else {
            return <ActivityIndicator style={styles.containerLoading} />
        }
    }
}

const styles = StyleSheet.create({
    containerLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})