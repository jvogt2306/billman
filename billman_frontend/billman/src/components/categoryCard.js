import * as React from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';

const CategoryCard = () => (
    <View >
        <Button style={{ height: 'auto', width: '25%' }} icon="add-a-photo" mode="contained" onPress={() => console.log('Pressed')}>
            Press me
         </Button>
    </View>
);

export default CategoryCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})

