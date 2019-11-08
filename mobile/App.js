import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import io from 'socket.io-client';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: '',
      chatMessages: []
    };
  }

  componentDidMount() {
    this.socket = io('http://192.168.0.5:3000/');
    this.socket.on('chat message', msg => {
      this.setState({ chatMessages: [...this.state.chatMessages, msg] });
    });
  }

  submitChatMessage() {
    this.socket.emit('chat message', this.state.chatMessage);
    this.setState({ chatMessage: '' });
  }

  render() {
    const chatMessages = this.state.chatMessages.map(msg => (
      <Text key={msg}>{msg}</Text>
    ));

    return (
      <View style={styles.container}>
        <TextInput
          style={{ height: 40, borderWidth: 2 }}
          autoCorrect={false}
          value={this.state.chatMessage}
          onSubmitEditing={() => this.submitChatMessage()}
          onChangeText={chatMessage => {
            this.setState({ chatMessage });
          }}
        />
        {chatMessages}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 40
  }
});
