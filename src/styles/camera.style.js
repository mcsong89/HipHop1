/* eslint-disable */
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1917',
    justifyContent: 'space-between',
  },
  noPermissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  topBarContainer: {
    backgroundColor: 'transparent',
    padding: 15,
    zIndex: 100,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordDuration: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarInner: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  topBarLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  close: {
    color: 'white',
    fontWeight: 'bold',
  },
  topBarFlash: {
    flex: 3,
    color: 'white',
    fontWeight: 'bold',
  },
  topBarFacing: {
    color: 'white',
    fontWeight: 'bold',
  },
  topBarCameraOff: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomBarRecordArea: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  bottomBarRecordWarp: {
    height: 80,
    width: 80,
    borderWidth: 3,
    borderColor: 'rgba(190, 0, 4, 1)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarRecordInner: {
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: 'rgba(190, 0, 4, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countDown: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarStop: {
    color: 'rgba(190, 0, 4, 1)',
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bottomBarBeatArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  beatPlay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  enabledTouch: {},
  disabledTouch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});
