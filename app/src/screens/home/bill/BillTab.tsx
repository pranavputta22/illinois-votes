import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Representative } from '../../../models';
import { Bill } from '../../../models/Bill';
import { Category } from '../../../models/Category';
import BillDetailStack from './BillDetailsStack';
import BillDiscoverScreen from './BillDiscoverScreen';
import RepScreen from './RepScreen';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

interface Props {
  navigation: BottomTabNavigationProp<any, any>;
  toggleTabs: (show: boolean) => void;
}
interface State {}

export type BillScreenStackParamList = {
  Discover: undefined;

  Rep: {
    rep: Representative;
  };
  Details: {
    bill: Bill;
    category: Category;
  };
};

export type BillDetailStackProps = StackNavigationProp<
  BillScreenStackParamList,
  'Details'
>;
export type BillDiscoverScreenProps = StackNavigationProp<
  BillScreenStackParamList,
  'Discover'
>;
export type RepresentativeScreenProps = StackNavigationProp<
  BillScreenStackParamList,
  'Rep'
>;

export type BillDetailStackRouteProps = RouteProp<
  BillScreenStackParamList,
  'Details'
>;
export type BillDiscoverScreenRouteProp = RouteProp<
  BillScreenStackParamList,
  'Discover'
>;
export type RepresentativeScreenRouteProp = RouteProp<
  BillScreenStackParamList,
  'Rep'
>;

const Stack = createSharedElementStackNavigator<BillScreenStackParamList>();

export default class BillTab extends React.Component<Props, State> {
  componentDidMount() {
    this.props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
  }

  render() {
    return (
      <Stack.Navigator headerMode="none" screenOptions={{}}>
        <Stack.Screen
          name="Discover"
          options={{ headerShown: false }}
          listeners={{
            focus: () => {
              this.props.toggleTabs(true);
            },
          }}
          component={BillDiscoverScreen}
        />
        <Stack.Screen
          options={{
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: {
                opacity: current.progress,
              },
            }),
          }}
          name="Details"
          component={BillDetailStack}
          sharedElements={(route, other) => {
            const { bill } = route.params;
            return [{ id: `bill.${bill.number}.photo` }];
          }}
          listeners={{
            focus: () => {
              this.props.toggleTabs(false);
            },
          }}
        />
        <Stack.Screen
          name="Rep"
          component={RepScreen}
          listeners={{
            focus: () => {
              this.props.toggleTabs(false);
            },
          }}
        />
      </Stack.Navigator>
    );
  }
}
