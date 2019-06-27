import React, { Component } from 'react';
import { Text, Button, Input, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from "react-native-modal-datetime-picker";
import { StyleSheet, View, Image, TouchableOpacity, CameraRoll, ScrollView, TextInput } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import global from '../GlobalFunctions';
import { Camera, Permissions } from 'expo'


export default class AddBill extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Add Bill',
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            isDateTimePickerVisible: false,
            pictureURI: { uri: 'https://via.placeholder.com/320x200?text=Bill' },
            isPictureTaken: false,
            isMakePicture: false,
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            company: null,
            procurement_date: null,
            receiptid: null,
            category: null,
            sum: null,
            note: null,
            favorite: null,
            attachment: [],
            apiURL: global.getAPI().url,
            userCategory: 'null'
        };
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted', procurement_date: new Date().toISOString() });
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        this.setState({ procurement_date: date.toISOString() });
        this.hideDateTimePicker();
    };

    makePicture = () => {
        this.setState({ isMakePicture: true })
    }

    saveDocument = async () => {

        console.log(JSON.stringify(this.state))


        if (this.state.category == null) {
            alert("Kategorie ist erforderlich");
        } else if (this.state.sum == null) {
            alert("Kategorie ist erforderlich");
        }
        else {
            await this._uploadAttachment();
            var document = new Object();
            document = {
                company: this.state.company,
                procurement_date: this.state.procurement_date,
                receiptid: this.state.receiptid,
                category: this.state.category,
                sum: this.state.sum,
                favorite: this.state.favorite,
                userid: this.state.userid,
                note: this.state.note,
                attachment: this.state.attachment,
            }

            documentJSON = JSON.stringify(document);
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: documentJSON,
            };
            await fetch(this.state.apiURL + "/Document", config)
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                })
                .catch((error) => {
                    console.error(error);
                });
            this.props.navigation.goBack();
        }
    }

    takePicture = async function () {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);
            CameraRoll.saveToCameraRoll(data.uri, type = "photo");
            this.setState({ isPictureTaken: true, isMakePicture: false, pictureURI: { uri: data.uri } })
        }
    };

    async _uploadAttachment() {
        const data = new FormData();
        data.append('name', 'avatar');
        data.append('fileData', {
            uri: this.state.pictureURI,
            type: 'image/jpeg',
            name: 'testPhotoName'
        });
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data,
        };
        await fetch(this.state.apiURL + "/Attachment", config)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({ attachment: [{ id: responseJson.id }] })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    checkSumInput(sum) {
        sum = sum.replace(",", ".");
        this.setState({ sum })
    }

    render() {
        //Save soon in the Profile
        let userCategory = [
            { value: 'Nahrung', },
            { value: 'Wohnung', },
            { value: 'Mobilität', },
            { value: 'Hobbies', },
            { value: 'Gesundheit', },
            { value: 'Kleidung', }
        ];
        var dateFormat = require('dateformat');

        const { isDateTimePickerVisible, procurement_date, category, company, receiptid, note, pictureURI, sum } = this.state;

        if (!(this.state.isMakePicture)) {
            return (
                <ScrollView >
                    <View style={styles.container}>
                        <Input
                            label='Betrag:'
                            placeholder="0.00"
                            style={[styles.defaults, { fontSize: 50, fontWeight: "bold", }]}
                            keyboardType={'numeric'}
                            value={sum}
                            onChangeText={(sum) => this.checkSumInput(sum)}
                        />
                        <Input
                            label='Datum:'
                            value={dateFormat(procurement_date, "yyyy-mm-dd")}
                            onTouchStart={this.showDateTimePicker}
                            onChangeText={(procurement_date) => this.setState({ procurement_date })}
                        />
                        <DateTimePicker
                            ref={this.categoryRef}
                            isVisible={isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                        />
                        <Dropdown
                            label='Kategorie'
                            labelFontSize={18}
                            data={userCategory}
                            style={[styles.defaults]}
                            onChangeText={(category) => this.setState({ category })}
                        />
                        <Input
                            label='Unternehmen:'
                            placeholder=""
                            style={[styles.defaults]}
                            keyboardType={'default'}
                            value={company}
                            onChangeText={(company) => this.setState({ company })}
                        />
                        <Input
                            label='Beleg-Nr:'
                            placeholder=""
                            style={[styles.defaults]}
                            keyboardType={'default'}
                            value={receiptid}
                            onChangeText={(receiptid) => this.setState({ receiptid })}
                        />
                        <Input
                            label='Notiz:'
                            placeholder=""
                            style={[styles.defaults, { height: 75 }]}
                            keyboardType={'default'}
                            value={note}
                            multiline={true}
                            onChangeText={(note) => this.setState({ note })}
                        />
                        <CheckBox
                            center
                            title='Favorite'
                            checkedIcon='star'
                            uncheckedIcon='star-o'
                            checked={this.state.favorite}
                            onPress={() => this.setState({ favorite: !this.state.favorite })}
                        />

                        <View style={styles.container}>
                            <Button style={{ marginBottom: 5, height: 50 }} icon={<Icon name='camera-enhance' color='#fff' size={25} />} onPress={() => this.makePicture()} />
                            <Image style={{ width: "100%", height: 200 }} source={pictureURI} />
                            <Button style={{ marginTop: 5, height: 50 }} icon={<Icon name='sd-card' color='#fff' size={25} />} onPress={() => this.saveDocument()} />
                        </View>
                    </View>
                </ScrollView >
            );
        } else {
            return (
                <View style={styles.CAMcontainer}>
                    <Camera ref={ref => { this.camera = ref; }}
                        style={styles.CAMpreview}
                        type={Camera.Constants.Type.back}
                        flashMode={Camera.Constants.FlashMode.on}
                        permissionDialogTitle={'Permission to use camera'}
                        permissionDialogMessage={'We need your permission to use your camera phone'}
                        onGoogleVisionBarcodesDetected={({ barcodes }) => { console.log(barcodes); }}
                    />
                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.CAMcapture}>
                            <Text style={{ fontSize: 14 }}>ADD</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
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
    dateIcon: {
        padding: 10,
    },
    CAMcontainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    CAMcamera: {
        height: 50,
        width: 50
    },
    CAMpreview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    CAMcapture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});