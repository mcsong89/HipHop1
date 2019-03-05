/* eslint-disable */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  CameraRoll,
} from 'react-native';
import { Audio, Camera, Permissions, FileSystem, FaceDetector } from 'expo';
import {
  Container,
  Content,
  Header,
  Item,
  Icon,
  Input,
  Button,
} from 'native-base';
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  Foundation,
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
  Octicons,
} from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import CountDown from 'react-native-countdown-component';
import styles from '../styles/camera.style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as videoActions } from '../reducers/cameraReducer';

import Mask from '../components/Mask';
import Glasses from '../components/Glasses';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const flashIcons = {
  off: 'flash-off',
  on: 'flash-on',
  auto: 'flash-auto',
  torch: 'highlight',
};

const cameraIcons = {
  on: 'camera',
  off: 'camera-off',
};

function formatTime(time) {
  var minutes = Math.floor(time / 60);
  time -= minutes * 60;

  var seconds = parseInt(time % 60, 10);

  return `${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
}

class CameraComponent extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.playbackInstance = null;

    this.state = {
      permissionsGranted: false,
      type: 'front',
      isCameraOn: 'on',
      flash: 'off',
      readyRecord: false,
      whiteBalance: 'auto',
      ratio: '16:9',
      autoFocus: 'on',
      depth: 0,
      videos: [],
      faces: [],
      photoId: 1,
      recordingId: 1,
      timer: 3,
      isPlaying: false,
      interval: null,
    };

    // this.onFacesDetected = this.onFacesDetected.bind(this);
    // this.onFaceDetectionError = this.onFaceDetectionError.bind(this);
  }

  async componentWillMount() {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const audioPermission = await Permissions.askAsync(
      Permissions.AUDIO_RECORDING,
    );
    const cameraRollPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
    );

    const photoStatus = cameraPermission.status;
    const videoStatus = audioPermission.status;
    const rollStatus = cameraRollPermission.status;
    this.setState({
      permissionsGranted:
        photoStatus === 'granted' &&
        videoStatus === 'granted' &&
        rollStatus === 'granted',
    });
  }

  componentWillFocus() {
    // Screen will entered
  }

  componentWillBlur() {
    // Screen will leave
    const currentProps = this.props;

    clearInterval(this.state.interval);
    if (this.state.isPlaying) {
      this.toggleBeat();
    }
    if (currentProps.camera.elapsedTime !== 0 || this.state.timer < 3) {
      currentProps.restartTimer();
      this.setState({
        readyRecord: false,
        timer: 3,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentProps = this.props;

    if (!currentProps.camera.isPlaying && nextProps.camera.isPlaying) {
      const timerInterval = setInterval(() => {
        currentProps.addSecond();
      }, 1000);
      this.setState({
        interval: timerInterval,
      });
    } else if (currentProps.camera.isPlaying && !nextProps.camera.isPlaying) {
      clearInterval(this.state.interval);
      this.stopRecording();
    }
  }

  componentDidUpdate() {
    const isFocused = this.props.isFocused;

    if (isFocused) {
      this.componentWillFocus();
    } else {
      this.componentWillBlur();
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  componentWillUpdate() {
    const currentProps = this.props;

    if (this.state.timer === 0 && currentProps.camera.elapsedTime === 0) {
      clearInterval(this.state.interval);
      currentProps.startTimer();
      this.startRecording();
      if (!this.state.isPlaying) {
        this.toggleBeat();
      }
    }
  }

  // implement face detection callback function
  // onFacesDetected({ faces }) {
  //   // print the found face data to console
  //   console.log(faces);
  //   // store faces to component state
  //   this.setState({ faces });
  // }

  // // implement face detection error function
  // onFaceDetectionError(error) {
  //   console.log(error);
  // }
  closeCamera = () => {
    this.props.navigation.goBack();
  };

  toggleFlash = () => {
    this.setState({ flash: flashModeOrder[this.state.flash] });
  };

  toggleFacing = () => {
    this.setState({ type: this.state.type === 'front' ? 'back' : 'front' });
  };

  toggleCameraOnOff = () => {
    this.setState({
      isCameraOn: this.state.isCameraOn === 'on' ? 'off' : 'on',
    });
  };

  toggleRecording = () => {
    this.setState({
      readyRecord: this.state.readyRecord === false ? true : false,
    });

    if (this.state.readyRecord) {
      this.stopRecording();
    } else {
      this.readyRecording();
      if (this.state.isPlaying) {
        this.toggleBeat();
      }
    }
  };

  toggleBeat = () => {
    this.setState({ isPlaying: this.state.isPlaying === false ? true : false });

    if (!this.state.isPlaying) {
      this.playBeat();
    } else {
      this.stopBeat();
    }
  };

  async playBeat() {
    if (!this.state.isPlaying) {
      try {
        const { sound: soundObject, status } = await Audio.Sound.createAsync(
          {
            uri:
              'https://s3.ap-northeast-2.amazonaws.com/musiabucket/sampleBeat/Bye+tagged.mp3',
          },
          { shouldPlay: true },
        );
        this.playbackInstance = soundObject;
        // Your sound is playing!
      } catch (error) {
        // An error occurred!
      }
    }
  }

  stopBeat = () => {
    if (this.state.isPlaying) {
      this.playbackInstance.stopAsync();
      this.playbackInstance = null;
    }
  };

  readyRecording() {
    const countDown = setInterval(() => {
      this.setState({
        timer: this.state.timer - 1,
      });
    }, 1000);
    this.setState({
      interval: countDown,
    });
  }

  // togglePauseResume = () => {
  //   this.setState({
  //     isRecord: this.state.isPause === 'pause' ? 'resume' : 'pause',
  //   });

  //   if (this.state.isRecord === 'pause') {
  //     this.pauseRecording();
  //   } else {
  //     this.resumeRecording();
  //   }
  // };

  // readyRecording() {
  //   return (
  //     <CountDown
  //       size={30}
  //       until={3}
  //       onFinish={() => this.startRecording()}
  //       onPress={this.toggleRecording}
  //       digitStyle={{
  //         // backgroundColor: 'rgba(255, 255, 255, 0.7)',
  //         // borderColor: 'rgba(29, 32, 41, 0.7)',
  //         // borderWidth: 5,
  //         // width: 80,
  //         // height: 80,
  //         // borderRadius: 50,
  //       }}
  //       digitTxtStyle={{ color: 'red' }}
  //       timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
  //       timeToShow={['S']}
  //       timeLabels={{ m: null, s: null }}
  //     />
  //   );
  // }

  async startRecording() {
    let recordingConfig = {
      quality: Camera.Constants.VideoQuality['1080p'],
      maxDuration: 60,
      mute: false,
    };

    if (this.camera) {
      this.camera.recordAsync(recordingConfig).then(async data => {
        console.log(data.uri);
        // Vibration.vibrate();
        let saveResult = await CameraRoll.saveToCameraRoll(data.uri);
        this.state.videos.push({
          uri: data.uri,
          fs: `${FileSystem.documentDirectory}videos/Video_${
            this.state.recordingId
          }.mp4`,
          rollUri: saveResult,
        });
        this.state.recordingId = this.state.recordingId + 1;
      });
    }
  }

  stopRecording() {
    const currentProps = this.props;

    if (this.camera) {
      clearInterval(this.state.interval);
      this.camera.stopRecording();
      currentProps.restartTimer();
      if (this.state.isPlaying && this.playbackInstance !== null) {
        this.toggleBeat();
      }
      this.setState({
        readyRecord: false,
        timer: 3,
      });
    }
  }

  // pauseRecording() {
  //   if (this.camera) {
  //     this.camera.pausePreview();
  //   }
  // }

  // resumeRecording() {
  //   if (this.camera) {
  //     this.camera.resumePreview();
  //   }
  // }

  renderNoPermissions() {
    return (
      <View style={styles.noPermissions}>
        <Text style={{ color: 'white' }}>
          Camera permissions not granted - cannot open camera preview.
        </Text>
      </View>
    );
  }

  renderTopBar() {
    return (
      <View searchBar rounded style={styles.topBarContainer}>
        <View style={styles.topBarInner}>
          <View style={styles.topBarLeft}>
            <TouchableOpacity onPress={this.closeCamera}>
              <AntDesign name="close" size={32} style={styles.close} />
            </TouchableOpacity>
          </View>
          <View style={styles.topBarRight}>
            <TouchableOpacity onPress={this.toggleFlash}>
              <MaterialIcons
                name={flashIcons[this.state.flash]}
                size={32}
                style={styles.topBarFlash}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleFacing}>
              <FontAwesome
                name="refresh"
                size={32}
                style={styles.topBarFacing}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleCameraOnOff}>
              <Feather
                name={cameraIcons[this.state.isCameraOn]}
                size={32}
                style={styles.topBarCameraOff}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderBottomBar() {
    const { elapsedTime, timerDuration } = this.props.camera;
    return (
      <View>
        <View style={styles.bottomBarRecordArea}>
          {this.state.timer >= 0 ? null : (
            <Text style={styles.recordDuration}>
              {formatTime(timerDuration - elapsedTime)}
            </Text>
          )}
          <TouchableOpacity
            onPress={this.toggleRecording}
            style={styles.bottomBarRecordWarp}
          >
            {this.state.readyRecord ? (
              this.state.timer >= 0 ? (
                <View style={styles.bottomBarRecordInner}>
                  <Text style={styles.countDown}>{this.state.timer}</Text>
                </View>
              ) : (
                <FontAwesome
                  name="stop"
                  size={30}
                  style={styles.bottomBarStop}
                />
              )
            ) : (
              <View style={styles.bottomBarRecordInner} />
            )}
          </TouchableOpacity>
        </View>
        <View
          style={
            this.state.readyRecord
              ? styles.disabledTouch
              : styles.bottomBarBeatArea
          }
          pointerEvents={this.state.readyRecord ? 'none' : 'auto'}
        >
          <View style={styles.beatPlay}>
            <TouchableOpacity onPress={this.toggleBeat}>
              {this.state.isPlaying ? (
                <MaterialCommunityIcons
                  name="pause-circle"
                  size={45}
                  style={{
                    color: this.state.readyRecord ? '#6E6E6E' : 'white',
                  }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="play-circle"
                  size={45}
                  style={{
                    color: this.state.readyRecord ? '#6E6E6E' : 'white',
                  }}
                />
              )}
            </TouchableOpacity>
            <Text
              style={{
                color: this.state.readyRecord ? '#6E6E6E' : 'white',
                fontSize: 20,
              }}
            >
              인기 | Sample Beat 01
            </Text>
          </View>

          <TouchableOpacity>
            <MaterialCommunityIcons
              name="playlist-play"
              style={{
                color: this.state.readyRecord ? '#6E6E6E' : 'white',
                fontSize: 45,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderCameraOn() {
    const isFocused = this.props.isFocused;

    if (isFocused) {
      return (
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          type={this.state.type}
          flashMode={this.state.flash}
          autoFocus={this.state.autoFocus}
          whiteBalance={this.state.whiteBalance}
          ratio={this.state.ratio}
          focusDepth={this.state.depth}
          style={styles.cameraContainer}
          // faceDetectorSettings={{
          //   mode: FaceDetector.Constants.Mode.fast,
          //   detectLandmarks: FaceDetector.Constants.Landmarks.all,
          //   runClassifications: FaceDetector.Constants.Classifications.all,
          // }}
          // onFacesDetected={this.onFacesDetected}
          // onFacesDetectionError={this.onFacesDetectionError}
        >
          {this.renderTopBar()}
          {this.renderBottomBar()}
          {/* {this.state.faces.map(face => (
            <Mask key={face.faceID} face={face} />
            // <Glasses key={face.faceID} face={face} />
          ))} */}
        </Camera>
      );
    } else {
      return (
        <View style={styles.container}>
          {this.renderTopBar()}
          {this.renderBottomBar()}
        </View>
      );
    }
  }

  renderCameraOff() {
    const isFocused = this.props.isFocused;

    if (isFocused) {
      return (
        <View style={styles.container}>
          {this.renderTopBar()}
          {this.renderBottomBar()}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {this.renderTopBar()}
          {this.renderBottomBar()}
        </View>
      );
    }
  }

  render() {
    const cameraOnScreenContent = this.state.permissionsGranted
      ? this.renderCameraOn()
      : this.renderNoPermissions();

    const cameraOffScreenContent = this.state.permissionsGranted
      ? this.renderCameraOff()
      : this.renderNoPermissions();

    return this.state.isCameraOn === 'on' ? (
      <View style={styles.container}>{cameraOnScreenContent}</View>
    ) : (
      <View style={styles.container}>{cameraOffScreenContent}</View>
    );
  }
}

// export default withNavigationFocus(CameraComponent);

function mapStateToProps(state) {
  // const { isPlaying, elapsedTime, timerDuration } = state;

  return {
    // isPlaying,
    // elapsedTime,
    // timerDuration,
    ...state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startTimer: bindActionCreators(videoActions.startTimer, dispatch),
    restartTimer: bindActionCreators(videoActions.restartTimer, dispatch),
    addSecond: bindActionCreators(videoActions.addSecond, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigationFocus(CameraComponent));
