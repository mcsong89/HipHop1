import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Main from './MainTabNavigator';

export default createAppContainer(
  createSwitchNavigator({
    Main: { screen: Main },
  }),
);
