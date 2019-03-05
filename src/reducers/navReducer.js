/* eslint-disable */
import { AppNavigator } from '../navigation/AppNavigator';

const initialState = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams('Main'),
);

// const initialState = {
//   router: AppNavigator.router.getStateForAction(
//     AppNavigator.router.getActionForPathAndParams('Main'),
//   ),
// };

const navigatorReducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);

  return nextState || state;
};

export default { navigatorReducer };
