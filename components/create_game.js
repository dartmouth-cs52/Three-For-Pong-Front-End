'use strict';

import React, { Component } from 'react';
import { Dimensions, AppRegistry, View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native';
import _ from 'lodash';
import Register from './register.js';
import Dashboard from './dashboard.js';

// clone the default stylesheet
const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

var Form = t.form.Form;


var Positive = t.refinement(t.Number, function (n) {
  return ((n >= 1) && (n<=3));
});

Positive.getValidationErrorMessage = function (value, path, context) {
  return 'Please request between 1 and 3 Players';
};

var GameForm = t.struct({

  Need: Positive,  // an optional string
  At: t.String
});

// overriding the text color
stylesheet.textbox.normal.color = '#FFFFFF';
stylesheet.textbox.normal.borderRadius = 0;
stylesheet.textbox.normal.borderLeftColor = '#1B676B';
stylesheet.textbox.normal.borderRightColor = '#1B676B';
stylesheet.textbox.normal.borderTopColor = '#1B676B';
stylesheet.textbox.normal.height = 100;
stylesheet.textbox.normal.fontSize = 48;


var options = {
  auto: 'placeholders',
  fields: {
    Need: {
      keyboardType: 'phone-pad',
      autoCorrect: false,
      autoCapitalize: 'none',
      placeholderTextColor: 'white',
      clearButtonMode: 'while-editing',
      keyboardAppearance: 'dark',
      selectionColor: '#88C425',
      returnKeyType: 'next',
      autoCapitalize: 'none',
      stylesheet: stylesheet,
    },
    At: {
      keyboardType: 'default',
      autoCorrect: false,
      autoCapitalize: 'none',
      placeholderTextColor: 'white',
      clearButtonMode: 'while-editing',
      keyboardAppearance: 'dark',
      selectionColor: '#88C425',
      returnKeyType: 'next',
      autoCapitalize: 'none',
      stylesheet: stylesheet,
    }
  }
};

class CreateGame extends Component {

  constructor(props){
   super(props);

   this.state = {
     navigator: this.props.navigator
   };

   this._onPress = this._onPress.bind(this);
  //  this._onForward = this._onForward.bind(this);
 }


   _onPress() {
     //var value = this.refs.form.getValue();
     var value = this.refs.form.getValue();
     if (!value) {
       console.log("Problems");
       return null;
     }
     var num_needed = (4 - value.Need);
     var time = value.At;

     fetch('https://threeforpong.herokuapp.com/api/listings/', {
       method: 'POST',
       headers: {
         'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2JhMTRkNmU5ZGZkNTIyMDAxOWYzODEiLCJpYXQiOjE0NzE4MTI5MDc0MTF9.F0l31Wl4rBIfDtQrZq1gWuDE992kV6HUn3XJDIw89Sk',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         host_user_id: '57ba14d6e9dfd5220019f381',
         num_looking_for_game: `${num_needed}`,
         location_id: '57ba112be9dfd5220019f380',
         start_time: `${time}`
       })
     })
     .then((response) => response.json())
     .then((responseData) => {
       console.log(responseData)
     })
     .done();

     this.props.navigator.push({
       title: 'Games',
       component: Dashboard,
       passProps: { navigator: this.props.navigator }
     });
   }


 render() {
   return (
     <View style={styles.container}>

     <Image source={require('../3forponglogo.png')} style={styles.logo} />

       {/* display */}
       <Form
         ref="form"
         type={GameForm}
         options={options}
         style={styles.title}
         context={{locale: 'it-IT'}}
       />
       <TouchableHighlight style={styles.button} onPress={this._onPress} underlayColor='#99d9f4'>
         <Text style={styles.buttonText}>CREATE</Text>
       </TouchableHighlight>
     </View>
   );
 }
 }

 const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   padding: 20,
   backgroundColor: '#1B676B',
 },
 logo: {
   maxWidth: 150,
   maxHeight: 150,
   marginTop: 200,
   marginBottom: 40,
   alignSelf: 'center',
 },
 title: {
   fontSize: 30,
   alignSelf: 'center',
   marginBottom: -200,
   marginTop: 200,
   color: 'white',
   backgroundColor: 'white',
 },
 buttonText: {
   fontSize: 24,
   color: 'white',
   alignSelf: 'center'
 },
 button: {
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#88C425',
   paddingTop: 25,
   paddingBottom: 25,
   width: Dimensions.get('window').width,
   marginLeft: -20,
   marginTop: 105,
   marginBottom: -230,
 }
 });

export default CreateGame;
