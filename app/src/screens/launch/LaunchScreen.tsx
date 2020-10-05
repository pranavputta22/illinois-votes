import React from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import {globalStyles, storage} from '../../assets';
import routes from '../../routes/routes';

type Props = {
  navigation: StackNavigationProp<any, any>;
};

class LaunchScreen extends React.Component<Props> {
  componentDidMount() {
    const {navigation} = this.props;
    // check if user is signed in
    AsyncStorage.getItem(storage.userSignedIn)
      .then((signedIn) => {
        if (signedIn && signedIn == 'true') {
          // user is signed in
          navigation.navigate(routes.home);
        } else {
          // user is not signed in
          // TODO: BIG NONONONONONONO change pls
          navigation.navigate(routes.home);
        }
      })
      .catch(() => {
        // something went wrong, route to login
        navigation.navigate(routes.login);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[globalStyles.headerText, styles.dominoText]}>Domino</Text>
        <Text style={[globalStyles.captionText, styles.createdText]}>
          Created by Pranav Putta, Sunny Gandhi, and Dylan Hu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  dominoText: {
    top: '50%',
  },
  createdText: {
    top: '88%',
  },
});

export default LaunchScreen;
