import React from 'react'
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import * as Icon from '@expo/vector-icons'
import LandingPage from './screens/landing';
import StatistikPage from './screens/statistik';
import StoragePage from './screens/storage';
import AddBillPage from './screens/addBill';
import ProfilePage from './screens/profile';
import SettingPage from './screens/settings';
import FavoritePage from './screens/favorites';
import DetailBillPage from './screens/detailsBill';
import IconMaterialComm from 'react-native-vector-icons/MaterialCommunityIcons';


const HomeStack = createStackNavigator(
    {
        LandingPage, AddBillPage, StatistikPage, StoragePage, FavoritePage, DetailBillPage
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: 'aliceblue'
            }
        }
    }
);

const TabNavigator = createBottomTabNavigator(
    {
        Home: {
            screen: HomeStack,
            navigationOptions: {
                title: 'Home',
                tabBarIcon: ({ tintColor }) => (
                    <Icon.Feather name="home" size={24} color={tintColor} />
                )
            }
        },
        Profile: {
            screen: ProfilePage,
            navigationOptions: {
                title: 'Profile',
                tabBarIcon: ({ tintColor }) => (
                    <IconMaterialComm name="account-circle" size={24} color={tintColor} />
                )
            }
        },
        Settings: {
            screen: SettingPage,
            navigationOptions: {
                title: 'Settings',
                tabBarIcon: ({ tintColor }) => (
                    <IconMaterialComm name="settings" size={24} color={tintColor} />
                )
            }
        },
    }
    ,
    {
        tabBarOptions: {
            activeTintColor: '#2089DC',
            style: {
                backgroundColor: 'aliceblue'
            }
        }
    }
)

export default createAppContainer(TabNavigator)
