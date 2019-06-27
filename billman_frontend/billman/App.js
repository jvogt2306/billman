import React, { Component } from 'react';
import AppNavigator from './src/AppNavigator';
import { View, StyleSheet } from 'react-native';
import { Button, Input, Text, Overlay } from 'react-native-elements';
import global from './src/GlobalFunctions'
import { ScrollView } from 'react-native-gesture-handler';

export default class App extends Component {

  state = {
    isAuthenticated: false,
    isLoading: true,
    isRegistration: false
  };

  _doRegistraion() {
    user = {
      username: this.state.username,
      name: this.state.name,
      vorname: this.state.vorname,
      mail: this.state.mail,
      passwort: this.state.passwort
    }
    const config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };

    fetch(global.getAPI().url + "/user", config)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length > 0) {
          this.setState({ isRegistration: false })
          this.setState({ passwort: "" })
        } else {
          this.setState({ isAuthenticated: false })
          alert("Es ist ein Fehler aufgetreten.")
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }

  _checkAuth() {
    login = {
      username: this.state.username,
      passwort: this.state.passwort
    }
    const config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(login),
    };

    fetch(global.getAPI().url + "/user/login", config)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length > 0) {
          this.setState(responseJson)
          this.setState({ isAuthenticated: true })
        } else {
          this.setState({ isAuthenticated: false })
          alert("Try Again - Login is not correct.")
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  componentDidMount() {
    this.setState({ isLoading: false })
  }

  render() {

    const { username, passwort, vorname, name, mail, isRegistration, isAuthenticated, isLoading } = this.state;

    if (isLoading) {
      return (
        <View style={styles.containerLoading}>
          <Button
            loading
          />
        </View>)
    }
    if (!(isAuthenticated)) {
      return (
        <View style={styles.containerLogin}>
          <View style={styles.containerInput}>
            <Text h1 styles={{ color: '#fff' }}>BillMan</Text>
            <Text h4 style={{ marginBottom: 40, color: '#fff', marginHorizontal: 60 }}>The simple way to manage your bills.</Text>
            <Input
              inputStyle={{ color: '#ffffff' }}
              placeholder="Username"
              label="User:"
              value={username}
              onChangeText={(username) => this.setState({ username })} />
            <Input
              inputstyle={{ color: '#ffffff' }}
              placeholder="Password"
              label="Password:"
              secureTextEntry={true}
              passwort={passwort}
              onChangeText={(passwort) => this.setState({ passwort })}
            />
            <View style={{ marginTop: 20, padding: 10 }}>
              <Button title='Login' onPress={() => this._checkAuth()} />
              <Button title='Registration' onPress={() => this.setState({ isRegistration: true })} />
            </View>
            <Overlay isVisible={isRegistration}>
              <ScrollView>
                <View style={styles.containerRegistration}>
                  <Input
                    placeholder="Username"
                    label="User:"
                    value={username}
                    onChangeText={(username) => this.setState({ username })}
                  />
                  <Input
                    placeholder="Password"
                    label="Password:"
                    secureTextEntry={true}
                    passwort={passwort}
                    onChangeText={(passwort) => this.setState({ passwort })}
                  />
                  <Input
                    placeholder="Vorname"
                    label="Vorname:"
                    value={vorname}
                    onChangeText={(vorname) => this.setState({ vorname })}
                  />
                  <Input
                    placeholder="Nachname"
                    label="Nachname:"
                    value={name}
                    onChangeText={(name) => this.setState({ name })} />
                  <Input
                    placeholder="Mail"
                    label="Mail:"
                    value={mail}
                    onChangeText={(mail) => this.setState({ mail })} />
                  <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", marginTop: 5 }}>
                    <Button style={{ margin: 2 }} title="Bestätigen" onPress={() => { this._doRegistraion() }} />
                    <Button style={{ margin: 2 }} title="Cancel" onPress={() => this.setState({ isRegistration: false })} />
                  </View>
                </View>
              </ScrollView>
            </Overlay>
          </View>
        </View >
      );
    }
    else {
      return <AppNavigator />
    }
  }
}

const styles = StyleSheet.create(
  {
    containerInput: {
      top: 60,
      marginHorizontal: 15,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    containerLoading: {
      flex: 1,
      backgroundColor: '#2089DC',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    containerRegistration: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    containerLogin: {
      flex: 1,
      backgroundColor: '#2089DC'
    },
    boxLogin: {
      height: '50%',
      width: '50%'
    },
    buttonContainer: {
      marginTop: 50
    }
  }
)