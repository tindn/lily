import {
  Button,
  Icon,
  Text,
  TopNavigation,
  TopNavigationAction,
  Spinner,
} from '@ui-kitten/components';
import { addMinutes, formatDistance, formatRelative } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  ScrollView,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import BottomSheet from '../../components/bottomSheet';
import Screen from '../../components/screen';
import { useToggle } from '../../hooks';
import {
  lock,
  login,
  openFrunk,
  refreshData,
  setChargeLimit,
  unlock,
  wake,
} from '../../redux/actions/tesla';
import {
  getAuthorization,
  getIsLocked,
  getIsRefreshingData,
  getVehicle,
} from '../../redux/selectors/tesla';
import { useThemeColors } from '../../uiKittenTheme';
import SignIn from './SignIn';

const batteryLimits = [
  100,
  95,
  90,
  85,
  80,
  75,
  70,
  65,
  60,
  55,
  50,
  45,
  40,
  35,
  30,
  25,
  20,
  15,
  10,
  5,
];

function Tesla(props) {
  var themeColors = useThemeColors();
  var [showAuthorizationModal, toggleAuthorizationModal] = useToggle(
    props.authorization === undefined
  );
  var [isLocking, setIsLocking] = useState(false);
  var [isUnlocking, setIsUnlocking] = useState(false);
  var [manualLimit, setManualLimit] = useState(props.vehicle.chargeLimit);
  var lastChargeUpdated = useRef(
    props.vehicle.chargeStateTimestamp || Date.now()
  );
  var getData = useCallback(
    function() {
      props.dispatch(refreshData());
    },
    [props.dispatch]
  );
  // useEffect(getData, []);
  useEffect(function() {
    if (
      !lastChargeUpdated.current ||
      lastChargeUpdated.current < props.vehicle.chargeStateTimestamp
    ) {
      setManualLimit(props.vehicle.chargeLimit);
      lastChargeUpdated.current = props.vehicle.chargeStateTimestamp;
    }
  });
  var currentTime = new Date();
  var fullChargeTime = addMinutes(
    currentTime,
    props.vehicle.minutesToFullCharge
  );
  var isCharging = props.vehicle.chargingState == 'Charging';
  return (
    <Screen style={{ flex: 1, justifyContent: 'center' }}>
      <TopNavigation
        rightControls={
          <TopNavigationAction
            onPress={toggleAuthorizationModal}
            icon={s => <Icon name="person" {...s} />}
          />
        }
      />
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 10,
        }}
      >
        {props.authorization ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
              }}
            >
              <View style={{ flex: 11 }}>
                <Text style={{ textAlign: 'left' }}>
                  {props.vehicle.display_name} is {props.vehicle.state}
                </Text>
                <Text>Battery is at {`${props.vehicle.batteryLevel}%`}</Text>
                {isCharging ? (
                  <>
                    <Text>{`Charging at ${props.vehicle.chargePower} W`}</Text>
                    <Text>{`(${props.vehicle.chargeRate} miles/hr)`}</Text>
                    <Text>Added {props.vehicle.chargeAdded} kWh so far</Text>
                    <Text style={{ flex: 1 }}>
                      {`Will reach ${
                        props.vehicle.chargeLimit
                      }% by ${formatRelative(fullChargeTime, currentTime)}`}
                    </Text>
                    <Text>{`(in ${formatDistance(
                      fullChargeTime,
                      currentTime
                    )})`}</Text>
                  </>
                ) : null}
              </View>
              <View style={{ flex: 9, paddingLeft: 20 }}>
                <Button
                  status="warning"
                  onPress={() => props.dispatch(wake())}
                  disabled={
                    props.vehicle.state !== 'asleep' &&
                    props.vehicle.state !== 'offline'
                  }
                  icon={style => {
                    return <Icon {...style} name="sun" />;
                  }}
                  style={{ width: '100%' }}
                >
                  Wake
                </Button>
                <Button
                  style={{ marginTop: 20 }}
                  onPress={() => {
                    if (props.isRefreshingData) {
                      return;
                    }
                    getData();
                  }}
                  icon={style => {
                    return <Icon {...style} name="radio" />;
                  }}
                >
                  {`Refresh   `}
                  {props.isRefreshingData ? <Spinner status="control" /> : null}
                </Button>
              </View>
            </View>
            <FlatList
              style={{
                marginTop: 40,
              }}
              horizontal
              data={batteryLimits}
              renderItem={({ item }) => (
                <Button
                  status={item == manualLimit ? 'success' : 'basic'}
                  appearance="outline"
                  style={{
                    margin: 5,
                  }}
                  onLongPress={() => {
                    setManualLimit(item);
                    props.dispatch(setChargeLimit(item)).catch(() => {});
                  }}
                >
                  {item.toString()}
                </Button>
              )}
              keyExtractor={item => item.toString()}
            />
            <Button
              style={{ alignSelf: 'center', marginTop: 40 }}
              onPress={() => props.dispatch(openFrunk())}
              icon={style => {
                return <Icon {...style} name="briefcase" />;
              }}
              status="info"
            >
              Frunk
            </Button>
            <View
              style={{
                marginTop: 40,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Button
                onPress={() => {
                  setIsLocking(true);
                  props.dispatch(lock()).finally(() => {
                    setIsLocking(false);
                  });
                }}
                disabled={props.vehicle.isLocked}
                style={{
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                status="success"
              >
                Lock
              </Button>
              <Button
                icon={style =>
                  isLocking || isUnlocking ? (
                    <ActivityIndicator
                      color={themeColors.textColor}
                      style={{ marginLeft: 5 }}
                    />
                  ) : (
                    <Icon
                      {...style}
                      name={props.vehicle.isLocked ? 'shield' : 'shield-off'}
                    />
                  )
                }
                style={{ borderRadius: 0 }}
                status={props.vehicle.isLocked ? 'success' : 'danger'}
                appearance="outline"
              />
              <Button
                onPress={() => {
                  setIsUnlocking(true);
                  props.dispatch(unlock()).finally(() => {
                    setIsUnlocking(false);
                  });
                }}
                disabled={!props.vehicle.isLocked}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                status="danger"
              >
                Unlock
              </Button>
            </View>
          </>
        ) : null}
      </ScrollView>

      <BottomSheet
        show={showAuthorizationModal}
        hide={toggleAuthorizationModal}
      >
        {props.authorization ? null : (
          <SignIn
            onLogin={(email, password) => {
              return props.dispatch(login(email, password)).then(() => {
                getData();
                toggleAuthorizationModal();
              });
            }}
          />
        )}
      </BottomSheet>
    </Screen>
  );
}

export default connect(function(state) {
  return {
    isRefreshingData: getIsRefreshingData(state),
    authorization: getAuthorization(state),
    vehicle: getVehicle(state),
    isLocked: getIsLocked(state),
  };
})(Tesla);
