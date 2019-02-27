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
import styles from '../styles/camera.style';
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
      readyRecord: false,
      startRecord: false,
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
    this.setState({ startRecord: false });
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
    this.setState({ startRecord: false });
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
      readyRecord: this.state.readyRecord === false ? true : false,
    });

    if (this.state.readyRecord) {
      this.stopRecording();
    }
    // else {
    //   this.readyRecording()
    //   // this.startRecording();
    // }
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

  readyRecording() {
    return (
      <CountDown
        size={30}
        until={3}
        onFinish={() => this.startRecording()}
        onPress={this.toggleRecording}
        digitStyle={{
          // backgroundColor: 'rgba(255, 255, 255, 0.7)',
          // borderColor: 'rgba(29, 32, 41, 0.7)',
          // borderWidth: 5,
          // width: 80,
          // height: 80,
          // borderRadius: 50,
        }}
        digitTxtStyle={{ color: 'red' }}
        timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
        timeToShow={['S']}
        timeLabels={{ m: null, s: null }}
      />
    );
  }


  startRecording = async function () {
    this.setState({ startRecord: true });

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
      this.setState({ readyRecord: false, startRecord: false });
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
        style={styles.noPermissions}
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
        style={styles.topBarContainer}
      >
        <View
          style={styles.topBarSearch}
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
          style={styles.topBarInner}
        >
          <TouchableOpacity onPress={this.toggleFlash}>
            <MaterialIcons
              name={flashIcons[this.state.flash]}
              size={32}
              style={styles.topBarFlash}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleFacing}>
            <Icon
              name="ios-reverse-camera"
              style={styles.topBarFacing}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderBottomBar() {
    return (
      <View
        style={styles.bottomBarContainer}
      >
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="message-reply"
            style={{ color: 'white', fontSize: 36 }}
          />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={this.toggleRecording}
            style={styles.bottomBarRecordButton}>
            {this.state.readyRecord ? (
              <View>{this.state.startRecord ? (<FontAwesome
                name='stop'
                size={30}
                style={styles.bottomBarStop}
              />) :
                this.readyRecording()}</View>
            ) : (
                <View style={styles.bottomBarRecord}>
                </View>
              )}
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
