import * as React from 'react';
import { Header } from 'react-native-elements';

const HeaderBar = (props) => {

    const { title } = props;
    return (
        <Header
            leftComponent={{ icon: '', color: '' }}
            centerComponent={{ text: title, style: { color: '#fff', fontWeight: 'bold' } }}
            rightComponent={{ icon: '', color: '' }}
        ></Header>
    );
}

export default HeaderBar;