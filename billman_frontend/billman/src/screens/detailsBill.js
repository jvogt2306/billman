import React, { Component } from 'react';
import { Input, CheckBox } from 'react-native-elements';
import { StyleSheet, View, Image, ScrollView, Button } from 'react-native';
import global from '../GlobalFunctions'
export default class DetailBill extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Details',
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            checked: this.props.navigation.getParam('friend').favorite
        }
    }

    async deleteDocument(_id) {

        let apiURL = global.getAPI().url;

        const config = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: null,
        };

        await fetch(apiURL + "/Document/" + _id, config)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
        this.setState({ checked: !this.state.checked })
        this.props.navigation.navigate('LandingPage');
    }

    async updateDocumentFavorite(_id) {

        let apiURL = global.getAPI().url;
        let updateFields =
            { "favorite": !this.state.checked }

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateFields),
        };

        await fetch(apiURL + "/Document/" + _id, config)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
        this.setState({ checked: !this.state.checked })
    }

    render() {
        const document = this.props.navigation.getParam('friend');
        var apiURL = global.getAPI().url;
        var ImageURL = { uri: apiURL + "/Attachment/" + document.attachment[0].id };

        return (
            <ScrollView >
                <View style={styles.container}>
                    <Image
                        style={{ width: "100%", height: 200 }}
                        source={ImageURL}
                    />
                    <CheckBox
                        center
                        title='Favorite'
                        checkedIcon='star'
                        uncheckedIcon='star-o'
                        checked={this.state.checked}
                        onPress={() => this.updateDocumentFavorite(document._id)}
                    />
                    <Input
                        editable={false}
                        label='Betrag:'
                        style={[styles.defaults, { fontSize: 50, fontWeight: "bold", }]}
                        value={document.sum.toString()}
                    />
                    <Input
                        editable={false}
                        label='Datum:'
                        value={document.procurement_date}
                    />
                    <Input
                        editable={false}
                        label='Unternehmen:'
                        placeholder=""
                        style={[styles.defaults]}
                        keyboardType={'default'}
                        value={document.company}
                    />
                    <Input
                        editable={false}
                        label='Kategorie:'
                        placeholder=""
                        style={[styles.defaults]}
                        keyboardType={'default'}
                        value={document.category}
                    />
                    <Input
                        editable={false}
                        label='Beleg-Nr:'
                        placeholder=""
                        style={[styles.defaults]}
                        keyboardType={'default'}
                        value={document.receiptid}
                    />
                    <Input
                        editable={false}
                        label='Notiz:'
                        placeholder=""
                        style={[styles.defaults, { height: 75 }]}
                        keyboardType={'default'}
                        value={document.note}
                        multiline={true}
                    />
                    <Button style={{ margin: 5 }}
                        backgroundColor='red'
                        titleStyle={{ color: 'red' }}
                        title="Delete" onPress={() => this.deleteDocument(document._id)} />
                </View>
            </ScrollView >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        margin: 10
    },
    defaults: {
        fontSize: 18,
    },
    containerDatePicker: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 20,
    },
})
