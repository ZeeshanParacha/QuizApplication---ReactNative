import React from 'react';
import { TextInput, StyleSheet, Text, Modal, View, Alert, TouchableOpacity, TouchableHighlight, Button, Image, FlatList, ScrollView } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';


export default class DetectFace extends React.Component {
    state = {
        hasCameraPermission: null,
        list: [],
        type: Camera.Constants.Type.back,
        isBack: true
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }



    //   renderModal() {
    //     return <Modal
    //     animationType="slide"
    //     presentationStyle="pageSheet"
    //     transparent={true}
    //     visible={this.state.modalVisible}
    //     onRequestClose={() => {
    //       Alert.alert('Modal has been closed.');
    //     }}>
    //     <View style={{margin: 50, borderWidth: 2, backgroundColor: 'white'}}>
    //       <View>
    //         <Text>Hello World!</Text>

    //         <TouchableHighlight
    //           onPress={() => {
    //             this.setState({modalVisible: false})
    //           }}>
    //           <Text>Hide Modal</Text>
    //         </TouchableHighlight>
    //       </View>
    //     </View>
    //   </Modal>
    //   }

    capture = async () => {
        if (this.camera) {
          const photo = await this.camera.takePictureAsync();
          try{
              let detect = await this.detectFaces(photo.uri)
              if(detect.faces.length){
                  alert('Recognized!')
                  this.props.faceAuth()
              }else{alert('Please Capture you picture to let us know you are not robot.')}
          }catch(e){
            console.log(e)
          }
          
        }
      };
    
    detectFaces = async imageUri => {
        const options = { mode: FaceDetector.Constants.Mode.accurate };
        return await FaceDetector.detectFacesAsync(imageUri, options);
      };

    render() {
        const { hasCameraPermission, isBack } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                // this.state.photo && isBack ?
                //     <View style={{ flex: 1 }}>
                //         <Image
                //             source={{ uri: this.state.photo }}
                //             style={{ flex: 1 }}
                //         />
                //         <View
                //             style={{

                //                 position: 'absolute', top: 580, left: 0, right: 0, bottom: 20, justifyContent: 'center', alignItems: 'flex-start'

                //             }}>
                //             <TouchableOpacity
                //                 style={{
                //                     flex: 0.8,
                //                     alignItems: 'flex-start',


                //                 }}
                //                 onPress={() => {
                //                     this.setState({ isBack: false });
                //                 }}>
                //                 <Image
                //                     source={require('../../Images/goback.png')}
                //                     style={{ width: 55, height: 55, backgroundColor: '#ccc', borderRadius: 50 }}
                //                 />
                //             </TouchableOpacity>
                //         </View>
                //     </View>

                     <View style={{ flex: 1 }}>
                        <Camera
                            ref={ref => {
                                this.camera = ref;
                            }}
                            onFacesDetected={this.handleFacesDetected}
                            faceDetectorSettings={{
                                mode: FaceDetector.Constants.Mode.fast,
                                detectLandmarks: FaceDetector.Constants.Landmarks.none,
                                runClassifications: FaceDetector.Constants.Classifications.none,
                            }}
                            style={{ flex: 1 }}
                            type={this.state.type}>
                            <View
                                style={{

                                    flex: 1,
                                    backgroundColor: 'transparent',
                                    flexDirection: 'row',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    paddingBottom: 5
                                }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 0.7,
                                        alignItems: 'flex-start',
                                        alignSelf: 'flex-start',
                                        marginTop: 25,



                                    }}
                                    onPress={() => {
                                        this.setState({
                                            type:
                                                this.state.type === Camera.Constants.Type.back
                                                    ? Camera.Constants.Type.front
                                                    : Camera.Constants.Type.back,
                                        });
                                    }}>
                                    <Image
                                        source={require('../../Images/cameraFlip.png')}
                                        style={{ width: 45, height: 45, backgroundColor: '#ccc', borderRadius: 50 }}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        alignItems: 'flex-start',



                                    }}
                                    onPress={() => this.capture()}>
                                    <Image
                                        source={require('../../Images/capture.png')}
                                        style={{ width: 57, height: 57 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </Camera>
                    </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});