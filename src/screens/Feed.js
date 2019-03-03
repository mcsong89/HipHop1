/* eslint-disable */
import React, { Component } from 'react';
import {
  Platform,
  View,
  ImageBackground,
  ScrollView,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Video, LinearGradient } from 'expo';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import Camera from './Camera';
import SliderEntry from '../components/SliderEntry';
import styles, { colors } from '../styles/index.style';
import { ENTRIES1, ENTRIES2 } from '../static/entries';
import { scrollInterpolators, animatedStyles } from '../utils/animations';
import { Container, Content, Icon, Button } from 'native-base';

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 0;
var first_data = null;

export default class Feed extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    // tabBarIcon: ({ tintColor }) => (
    //   <Icon name="ios-home" style={{ color: tintColor }} />
    // )
  };
  constructor(props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      presentData: '',
    };
  }

  componentDidMount() {
    if (this.state.presentData === '') {
      first_data = setInterval(() => {
        this.setState({
          presentData: ENTRIES2[0].illustration,
        });
      }, 3000);
    }
  }

  componentWillUnmount() {
    clearInterval(first_data);
  }

  _setData(item) {
    clearInterval(first_data);
    this.setState({
      presentData: item.illustration,
    });
  }

  _renderItem = ({ item, index }) => {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        setData={this._setData.bind(this, item)}
      />
    );
  };

  // swipe(n) {
  //   swiper = this.refs.swiper;
  //   if (swiper) swiper.scrollBy(n || 1);
  // }

  momentumExample(title) {
    return (
      <View>
        <View style={styles.RECArea}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Camera')}>
            <Icon
              style={styles.RECbutton}
              name="camera"
            // onPress={() => this.swipe(-1)}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.feedArea}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Carousel
          data={ENTRIES2}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.95}
          inactiveSlideOpacity={1}
          enableMomentum
          activeSlideAlignment="start"
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          activeAnimationType="spring"
          activeAnimationOptions={{
            friction: 4,
            tension: 40,
          }}
        />
      </View>
    );
  }

  get gradient() {
    return (
      <LinearGradient
        colors={[colors.background1, colors.background2]}
        startPoint={{ x: 1, y: 0 }}
        endPoint={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
    );
  }

  render() {
    const example = this.momentumExample('추천 | 인기 | 팔로잉');

    return (
      <Container>
        <StatusBar
          // translucent
          // backgroundColor="rgba(0, 0, 0, 0.3)"
          // barStyle="light-content"
          hidden={true}
        />
        <SafeAreaView style={styles.safeArea}>
          <Content style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
            {/* <Swiper
              ref="swiper"
              loop={false}
              showsPagination={false}
              index={1}
              scrollEnabled={this.state.outerScrollEnabled}
            > */}
            {/* <View style={{ flex: 1 }}>
                <Camera/>
              </View> */}
            <ImageBackground
              source={{ uri: this.state.presentData }}
              style={styles.mainBG}
            >
              {/* <Video
          source={{
            uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          shouldPlay
          isLooping
          style={styles.mainBG}
        /> */}
              <View style={styles.exampleContainer}>
                <View style={styles.cardDeckview}>{example}</View>
              </View>
            </ImageBackground>
            {/* </Swiper> */}
          </Content>
        </SafeAreaView>
      </Container>
    );
  }
}
