import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1917',
    },
    noPermissions: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    topBarContainer: {
        backgroundColor: 'transparent',
        left: 0,
        top: 0,
        right: 0,
        zIndex: 100,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topBarSearch: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 3,
    },
    topBarInner: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
    },
    topBarFlash: {
        color: 'white', fontWeight: 'bold'
    },
    topBarFacing: {
        color: 'white', fontWeight: 'bold'
    },
    bottomBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 15,
        alignItems: 'flex-end',
    },
    bottomBarRecordButton: {
        height: 72,
        width: 72,
        borderWidth: 5,
        borderColor: '#FFFFFF',
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomBarRecord: {
        height: 50,
        width: 50,
        borderRadius: 50,
        backgroundColor: 'rgba(190, 0, 4, 1)',
    },
    bottomBarStop: {
        color: 'rgba(190, 0, 4, 1)', fontWeight: 'bold'
    },
    cameraContainer: {
        flex: 1, justifyContent: 'space-between'
    }
});