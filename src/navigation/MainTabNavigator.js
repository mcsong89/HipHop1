/* eslint-disable */
import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Icon } from 'native-base';
import {
  createMaterialTopTabNavigator,
  createAppContainer,
} from 'react-navigation';

import Feed from '../screens/Feed';
import Camera from '../screens/Camera';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppTabNavigator = createMaterialTopTabNavigator(
  {
    Camera: { screen: Camera },
    Feed: { screen: Feed },
  },
  {
    animationEnabled: true,
    swipeEnabled: true,
    initialRouteName: 'Feed',
    // tabBarPosition: "bottom",
    // tabBarOptions: {
    //   style: {
    //     backgroundColor: "white"
    //   },
    //   iconStyle: {
    //     ...Platform.select({
    //       ios: {
    //         height: 35,
    //         marginBottom: 20
    //       }
    //     })
    //   },
    //   activeTintColor: "#000",
    //   inactiveTintColor: "#d1cece",
    //   upperCaseLabel: false,
    //   showLabel: false,
    //   showIcon: true
    // }
  },
);
const AppTabContainet = createAppContainer(AppTabNavigator);

export default AppTabContainet;
