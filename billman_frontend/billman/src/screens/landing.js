import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemeProvider, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconMaterialComm from 'react-native-vector-icons/MaterialCommunityIcons';

export default class LandingPage extends Component {

    static navigationOptions = { header: null };
    state = {
        categorys: [],
        isLoading: true
    };

    render() {
        const iconSize = 35
        return (
            <ThemeProvider>
                <View style={{ height: 25, backgroundColor: '#fff' }} />
                <ScrollView>
                    <Button
                        style={[styles.navigationItem, styles.shadowBox, { marginTop: 20 }]}
                        title=" Neues Dokument"
                        icon={<Icon name="add-to-photos" color="#fff" size={iconSize} />}
                        onPress={() => this.props.navigation.navigate('AddBillPage', { param: 'value' })}
                    ></Button>
                    <Button
                        style={[styles.navigationItem, styles.shadowBox]}
                        title=" Dokumente"
                        icon={<IconMaterialComm name="file-multiple" size={iconSize} color="#fff" />}
                        onPress={() => this.props.navigation.navigate('StoragePage', { param: 'value' })}
                    ></Button>
                    <Button
                        style={[styles.navigationItem, styles.shadowBox]}
                        title=" Favoriten"
                        icon={<IconAwesome5 name="star" size={iconSize} color="#fff" />}
                        onPress={() => this.props.navigation.navigate('FavoritePage', { param: 'value' })}
                    ></Button>
                    <Button
                        style={[styles.navigationItem, styles.shadowBox]}
                        title=" Statistik"
                        icon={<IconAwesome5 name="chart-line" size={iconSize} color="#fff" />}
                        onPress={() => this.props.navigation.navigate('StatistikPage', { param: 'value' })}
                    ></Button>
                </ScrollView>
            </ThemeProvider>
        );
    }
}

const styles = StyleSheet.create({
    navigationItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        marginHorizontal: '8%',
        padding: 5,
        marginTop: '2%',
        height: 100,
        backgroundColor: '#2089DC',
    },
    shadowBox: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
    }
})