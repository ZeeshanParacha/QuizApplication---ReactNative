import React from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  Modal,
  View,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  Button,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import { Font } from 'expo';
import * as Permissions from 'expo-permissions';
import { FetchQuizApi } from './quizApi';
import { Ionicons } from '@expo/vector-icons';

export default class QuizApi extends React.Component {
  constructor() {
    super();

    this.state = {
      ApiQuestions: [],
      CurrentIndexNum: 0,
      selectedAnswer: '',
      fontLoaded: false,
      Score: 0,
      modalVisible: false,
    };
    this.next = this.next.bind(this);
    this.playAgain = this.playAgain.bind(this);
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  playAgain() {
    this.setModalVisible(!this.state.modalVisible);
    const { CurrentIndexNum, selectedAnswer, Score } = this.state;
    this.setState({ CurrentIndexNum: 0, selectedAnswer: '', Score: 0 });
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      ApiQuestions: nextProps.data,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'open-sans-bold': require('../Fonts/poppins/Poppins-Regular.otf')
    });

    this.setState({ fontLoaded: true });
  }

  next() {
    const { CurrentIndexNum, selectedAnswer, ApiQuestions, Score } = this.state;
    if (CurrentIndexNum + 1 !== ApiQuestions.length) {
      this.setState({ CurrentIndexNum: CurrentIndexNum + 1 });
    } else {
      this.setModalVisible(true);
    }
    if (ApiQuestions[CurrentIndexNum].correct_answer === selectedAnswer) {
      this.setState({ Score: Score + 1 });
    }
  }

  render() {
    const { ApiQuestions, CurrentIndexNum, Score } = this.state;

    return this.state.fontLoaded ? (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'open-sans-bold',
        }}>
        <View
          style={{
            backgroundColor: '#4eb589',
            width: '100%',
            padding: 10,
            marginTop: 24,
            fontFamily: 'open-sans-bold',
          }}>
          <Text
            style={{
              fontFamily: 'open-sans-bold',
              color : 'white'
            }}>
            {CurrentIndexNum + 1} / {ApiQuestions.length}
          </Text>
        </View>
        <View
          style={{
            flex: 0.9,
            backgroundColor: '#42bf8a',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <Text
            style={{
              padding: 20,
              fontSize: 18,
              color: '#fff',
              fontFamily: 'open-sans-bold',
            }}>
            Q: {ApiQuestions[CurrentIndexNum].question}
          </Text>
        </View>

        <View
          style={{
            flex: 2,
            backgroundColor: '#3b4151',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                selectedAnswer: ApiQuestions[CurrentIndexNum].correct_answer,
              });
            }}
            style={{ overflow: 'hidden', width: '85%' }}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                padding: 10,
                backgroundColor: '#3b415173',
                fontFamily: 'open-sans-bold',
                elevation: 4,
                shadowOffset: { width: 5, height: 5 },
                shadowColor: '#3b415173',
                shadowOpacity: 0.5,
                shadowRadius: 10,
              }}>
              1: {ApiQuestions[CurrentIndexNum].correct_answer}
            </Text>
          </TouchableOpacity>
          {ApiQuestions[CurrentIndexNum].incorrect_answers.map((e, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ selectedAnswer: e });
                }}
                style={{ overflow: 'hidden', width: '85%' }}
                key={e}>
               <Text
              style={{
                fontSize: 18,
                color: 'white',
                padding: 10,
                backgroundColor: '#3b415173',
                fontFamily: 'open-sans-bold',
                elevation: 3,
                shadowOffset: { width: 5, height: 5 },
                shadowColor: '#3b415173',
                shadowOpacity: 0.5,
                shadowRadius: 10,
              }}>
                  {index + 2}: {e}
                </Text>
              </TouchableOpacity>
            );
          })}
          
            <TouchableOpacity
              onPress={() => this.next()}
              style={{ overflow: 'hidden', width: '80%' }}>
              <Text
                style={{
                    fontSize: 18,
                    letterSpacing : 4,
                    color: 'white',
                    padding: 10,
                    backgroundColor: '#42bf8a',
                    fontFamily: 'open-sans-bold',
                    elevation: 5,
                    shadowOffset: { width: 5, height: 5 },
                    shadowColor: '#52bf8a00',
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    textAlign : 'center',
                   
                }}>
                Next
              </Text>
            </TouchableOpacity>
         
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: 'open-sans-bold',
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                fontFamily: 'open-sans-bold',
              }}>
              <View>
                <Image
                  source={require('../../Images/result.png')}
                  style={{
                    width: 120,
                    height: 120,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}
                />
              </View>
              <View style={{ overflow: 'hidden', width: '100%' }}>
                <Text
                  style={{
                    fontSize: 16,
                    letterSpacing: 2,
                    fontFamily: 'open-sans-bold',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    backgroundColor: '#df4556',
                    color: 'white',
                    padding: 10,
                  }}>
                  {'You have chose : ' +
                    Score + ' correct answers' +
                    ' out of ' +
                    ApiQuestions.length}
                </Text>
              </View>
              <View style={{ overflow: 'hidden', width: '100%' }}>
                <Text
                  style={{
                    fontSize: 16,
                    letterSpacing: 2,
                    fontFamily: 'open-sans-bold',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    backgroundColor: '#df4556',
                    color: 'white',
                    padding: 10,
                    width: '100%',
                  }}>
                  {'You got : ' +
                    (Score * 100) / ApiQuestions.length +
                    '%'}
                </Text>
              </View>
              <View style={{ overflow: 'hidden', width: '100%',backgroundColor: '#df4556'   }}>
              <Text
                  style={{
                    fontSize: 16,
                    letterSpacing: 2,
                    fontFamily: 'open-sans-bold',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    backgroundColor: '#df4556',
                    color: 'white',
                    padding: 10,
                    textAlign : 'center',
                    alignSelf : "center"
                  }}>
                  {(Score * 100) / ApiQuestions.length > 70
                    ? 'Congratulation, You have passed :)'
                    : 'Sorry, You have failed'}
                </Text>
                {(Score * 100) / ApiQuestions.length > 70 ?
                <View style={{ width : '100%' , justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',}}>
                 <Ionicons name="md-happy" size={32} color="white" />
                 </View>
                 :
                <View style={{ width : '100%' , justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',}}>
                 <Ionicons name="ios-sad" size={32} color="white" />
                 </View>}
              </View>

              <TouchableHighlight
                style={{
                  overflow: 'hidden',
                  shadowColor: 'black',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  backgroundColor: '#2980b9',
                  width: 100,
                  height: 40,
                  borderRadius: 0,
                  marginBottom: 10,
                }}
                onPress={() => {
                  this.playAgain();
                  // this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    color: 'white',
                  }}>
                  Play Again
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    ) : null;
  }
}
