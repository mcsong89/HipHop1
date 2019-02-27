import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import Main from './MainTabNavigator';

export const AppNavigator = createAppContainer(
  createSwitchNavigator({
    Main: { screen: Main },
  }),
);

const mapStateToProps = state => {
  return { ...state };
};

export default connect(mapStateToProps)(AppNavigator);