import React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { act } from 'react-test-renderer';

type TabItemProps = {
  style?: StyleProp<ViewStyle>;
  icon: {
    type: string;
    name: string;
  };
  label: string;
  color: string;
  textColor: string;
  width: number;
  tkey: string;
  active: boolean;
  onPress: (tkey: string) => void;
};

type TabItemState = {
  // current animation progress
  animation: Animated.Value;
  // if the current tab is expanded
  expanded: boolean;
};

class TabBarItem extends React.Component<TabItemProps, TabItemState> {
  labelWidth: Animated.AnimatedInterpolation;
  backgroundColor: Animated.AnimatedInterpolation;
  iconColor: Animated.AnimatedInterpolation;

  constructor(props: TabItemProps) {
    super(props);
    this.state = {
      animation: new Animated.Value(props.active ? 1 : 0),
      expanded: props.active,
    };

    // set up label width and margin left animation
    this.labelWidth = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.props.width],
    });

    this.backgroundColor = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(255, 255, 255)', this.props.color],
    });

    this.iconColor = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(0, 0, 0)', this.props.textColor],
    });
  }
  // expand tab function
  expand = () => {
    this.setState({ expanded: true }, () => {
      Animated.timing(this.state.animation, {
        toValue: 1,
        useNativeDriver: false,
        duration: 250,
      }).start();
    });
  };

  collapse = () => {
    this.setState({ expanded: false }, () => {
      Animated.timing(this.state.animation, {
        toValue: 0,
        useNativeDriver: false,
        duration: 250,
      }).start();
    });
  };

  componentDidUpdate() {
    // is this tab active
    // if the tab is not active and is expanded, collapse it
    if (!this.props.active && this.state.expanded) {
      this.collapse();
    } else if (this.props.active && !this.state.expanded) {
      this.expand();
    }
  }

  render() {
    // destructure for convenience
    const { textColor, icon, label, tkey, active, onPress } = this.props;

    return (
      <View style={tabStyles.container}>
        <TouchableOpacity
          disabled={active}
          onPress={() => {
            if (!active) {
              this.expand();
              onPress(tkey);
            }
          }}
          style={[tabStyles.tabTouchable]}
        >
          <Animated.View
            style={[
              tabStyles.tabComponets,
              {
                backgroundColor: this.backgroundColor,
              },
            ]}
          >
            <Icon
              type={icon.type}
              name={icon.name}
              color={this.state.expanded ? textColor : 'black'}
              style={{ fontWeight: '200' }}
            />
            <Animated.Text
              numberOfLines={1}
              ellipsizeMode={'clip'}
              style={[
                tabStyles.label,
                { width: this.labelWidth, color: textColor },
              ]}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}
const tabStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  tabTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabComponets: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  label: {
    textAlign: 'center',
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TabBarItem;
