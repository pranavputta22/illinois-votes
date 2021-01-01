import React from 'react';
import { StyleSheet, Alert, Animated, Dimensions } from 'react-native';
import TabBarItem from './TabBarItem';
import { colors } from '../assets';
import { SafeAreaView } from 'react-native-safe-area-context';
// key enum for each tab
export enum TabKey {
  bills = 'Bills',
  search = 'Search',
  profile = 'Profile',
}

export interface TabModel {
  icon: {
    name: string;
    type: string;
  };
  tkey: TabKey;
  width: number;
  color?: string;
  textColor?: string;
  label: string;
}

type State = {
  active: string;
  shown: boolean;
};

type Props = {
  zIndex?: number;
  show: boolean;
  current: string;
  tabPressed: (tab: string) => void;
  tabs: TabModel[];
};

const screenWidth = Dimensions.get('screen').width;

class TabBar extends React.Component<Props, State> {
  bottomVal: Animated.AnimatedInterpolation;
  animation: Animated.Value;
  tickerAnimation: Animated.Value;

  constructor(props: Props) {
    super(props);

    this.state = {
      active: this.props.current,
      shown: true,
    };

    this.animation = new Animated.Value(0);
    this.tickerAnimation = new Animated.Value(0);
    this.bottomVal = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '-20%'],
    });
  }

  // hide tab bar
  hide = () => {
    Animated.spring(this.animation, {
      toValue: 1,
      bounciness: 0,
      speed: 2,
      useNativeDriver: false,
    }).start(() => {
      this.setState({ shown: false });
    });
  };

  // show tab bar
  show = () => {
    Animated.spring(this.animation, {
      toValue: 0,
      bounciness: 5,
      useNativeDriver: false,
    }).start(() => {
      this.setState({ shown: true });
    });
  };

  componentDidUpdate() {
    if (this.props.show && !this.state.shown) {
      this.show();
    } else if (!this.props.show && this.state.shown) {
      this.hide();
    }
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            zIndex: this.props.zIndex || 1,
            bottom: this.bottomVal,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.ticker,
            { transform: [{ translateX: this.tickerAnimation }] },
          ]}
        />
        <SafeAreaView style={{ flexDirection: 'row' }} edges={['bottom']}>
          {this.props.tabs.map((val, index) => {
            const { icon, label, tkey, width, color, textColor } = val;
            return (
              <TabBarItem
                key={tkey}
                icon={icon}
                tkey={tkey}
                active={this.state.active == tkey}
                onPress={() => {
                  this.setState({ active: tkey });
                  this.props.tabPressed(tkey);

                  // start animation
                  let multiplier = 0;
                  switch (tkey) {
                    case TabKey.bills:
                      multiplier = 0;
                      break;
                    case TabKey.search:
                      multiplier = 1;
                      break;
                    case TabKey.profile:
                      multiplier = 2;
                      break;
                  }
                  Animated.spring(this.tickerAnimation, {
                    toValue: multiplier * (screenWidth / 3),
                    useNativeDriver: true,
                  }).start();
                }}
                width={width}
                color={color || colors.tabs.bills.color}
                textColor={textColor || colors.tabs.bills.text}
                label={label}
              />
            );
          })}
        </SafeAreaView>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: -0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    alignItems: 'center',
  },
  ticker: {
    height: 4,
    width: '10%',
    backgroundColor: colors.votingBackgroundColor,
    position: 'absolute',
    top: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    left: (7 * screenWidth) / 60,
  },
});

export default TabBar;
