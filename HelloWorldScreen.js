import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const HelloWorldScreen = () => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    Alert.alert(`Hello ${name}`);
  };

  return (
    <View>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default HelloWorldScreen;