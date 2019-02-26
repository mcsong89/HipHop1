import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  CameraRoll,
} from 'react-native';
import { Camera, Permissions, FileSystem, FaceDetector } from 'expo';
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
  Ionicons,
  MaterialIcons,
  Foundation,
  FontAwesome,
  MaterialCommunityIcons,
  Octicons,
} from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import CountDown from 'react-native-countdown-component';
import Mask from '../components/Mask';
import Glasses from '../components/Glasses';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1917',
  },
});

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

const recordIcons = {
  start: 'dot-circle-o',
  // resume: 'dot-circle-o',
  // pause: 'pause-circle-o',
  stop: 'stop-circle-o',
};

class CameraComponent extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      permissionsGranted: false,
      type: 'front',
      flash: 'off',
      isRecord: 'start',
      // isPause: 'pause',
      whiteBalance: 'auto',
      ratio: '16:9',
      autoFocus: 'on',
      depth: 0,
      videos: [],
      faces: [],
      photoId: 1,
      recordingId: 1,
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
    this.stopRecording();
    this.setState({ isRecord: 'start' });
  }

  componentWillReceiveProps() {
    const isFocused = this.props.isFocused;

    if (!isFocused) {
      this.componentWillFocus();
    } else {
      this.componentWillBlur();
    }
  }

  componentWillUnmount() {
    this.stopRecording();
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

  toggleFlash = () => {
    this.setState({ flash: flashModeOrder[this.state.flash] });
  };

  toggleFacing = () => {
    this.setState({ type: this.state.type === 'front' ? 'back' : 'front' });
  };

  toggleRecording = () => {
    this.setState({
      isRecord: this.state.isRecord === 'start' ? 'stop' : 'start',
    });

    if (this.state.isRecord === 'start') {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  };

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

  startRecording = async function() {
    let recordingConfig = {
      quality: Camera.Constants.VideoQuality['1080p'],
      maxDuration: 60,
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
  };

  stopRecording() {
    if (this.camera) {
      this.camera.stopRecording();
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
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        }}
      >
        <Text style={{ color: 'white' }}>
          Camera permissions not granted - cannot open camera preview.
        </Text>
      </View>
    );
  }

  renderTopBar() {
    return (
      <View
        searchBar
        rounded
        style={{
          backgroundColor: 'transparent',
          left: 0,
          top: 0,
          right: 0,
          zIndex: 100,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            flex: 3,
          }}
        >
          <Item style={{ backgroundColor: 'transparent' }}>
            <Icon
              name="ios-search"
              style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}
            />

            <Input placeholder="Beats Search..." placeholderTextColor="white" />
          </Item>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-around',
          }}
        >
          <TouchableOpacity onPress={this.toggleFlash}>
            <MaterialIcons
              name={flashIcons[this.state.flash]}
              size={32}
              style={{ color: 'white', fontWeight: 'bold' }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleFacing}>
            <Icon
              name="ios-reverse-camera"
              style={{ color: 'white', fontWeight: 'bold' }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderBottomBar() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          marginBottom: 15,
          alignItems: 'flex-end',
        }}
      >
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="message-reply"
            style={{ color: 'white', fontSize: 36 }}
          />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity>
            {/* <TouchableOpacity onPress={this.toggleRecording}> */}
            {/* <FontAwesome
              name={recordIcons[this.state.isRecord]}
              size={100}
              style={{ color: 'white', fontWeight: 'bold' }}
            /> */}
            <CountDown
              size={30}
              until={3}
              onFinish={this.startRecording()}
              digitStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderColor: 'rgba(29, 32, 41, 0.7)',
                borderWidth: 5,
                width: 80,
                height: 80,
                borderRadius: '50%',
              }}
              digitTxtStyle={{ color: 'red' }}
              timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
              timeToShow={['S']}
              timeLabels={{ m: null, s: null }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="ios-images" style={{ color: 'white', fontSize: 36 }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <MaterialCommunityIcons
            name="beats"
            style={{ color: 'white', fontSize: 36 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderCamera() {
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
          captureAudio={true}
          style={{ flex: 1, justifyContent: 'space-between' }}
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
      return <View style={styles.container}>{this.renderTopBar()}</View>;
    }
  }

  render() {
    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();

    return <View style={styles.container}>{cameraScreenContent}</View>;
  }
}

export default withNavigationFocus(CameraComponent);
