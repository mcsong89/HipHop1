import { StyleSheet } from 'react-native';

export const colors = {
  black: '#1a1917',
  gray: '#888888',
  background1: '#E6E6E6',
  // background1: '#B721FF',
  background2: '#21D4FD',
};

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardDeckview: {
    flex: 1,
  },
  RECArea: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  feedArea: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardTitle: {
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  RECbutton: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 30,
    lineHeight: 30,
  },
  exampleContainer: {
    flex: 1,
    // paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  exampleContainerDark: {
    backgroundColor: colors.black,
  },
  exampleContainerLight: {
    backgroundColor: 'white',
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleDark: {
    color: colors.black,
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  slider: {
    marginTop: 15,
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  mainBG: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  slideDefault: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  Extext: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
