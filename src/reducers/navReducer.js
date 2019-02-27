import { AppNavigator } from '../navigation/AppNavigator'; // 아까 걔임..

const initialState = AppNavigator.router.getStateForAction(
    AppNavigator.router.getActionForPathAndParams('Main') // 액션을 반환한다: {type: 'Navigation/NAVIGATE', 'routeName': 'Home'}
);

const navigatorReducer = (state = initialState, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state);

    return nextState || state;
};

export { navigatorReducer };