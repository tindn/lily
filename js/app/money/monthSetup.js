import React, { useState } from 'react';
import {
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import { connect } from 'react-redux';
import MoneyInput from '../../components/moneyInput';
import OutlineButton from '../../components/outlineButton';
import sharedStyles from '../../sharedStyles';
import theme from '../../theme';
import Screen from '../../components/screen';

function Group(props) {
  var { entries, setEntries, add, entryType } = props;
  function updateEntry(index, earning) {
    entries[index] = earning;
    setEntries([...entries]);
  }

  function removeEntry(index) {
    entries.splice(index, 1);
    setEntries([...entries]);
  }

  function addEntry() {
    entries.push({ memo: '', amount: 0 });
    setEntries([...entries]);
  }
  return (
    <>
      {entries.map((earn, index) => (
        <Swipeable
          key={index.toString()}
          rightButtons={[
            <TouchableOpacity
              key={index.toString()}
              onPress={() => {
                removeEntry(index);
              }}
              style={{
                backgroundColor: 'red',
                flex: 1,
                justifyContent: 'center',
                paddingLeft: 10,
              }}
            >
              <Text style={{ color: 'white' }}>Delete</Text>
            </TouchableOpacity>,
          ]}
        >
          <View style={[sharedStyles.inputRow, { flexDirection: 'row' }]}>
            <TextInput
              value={earn.memo}
              style={{
                flex: 1,
                fontSize: 18,
                color: theme.colors.darkGray,
              }}
              placeholder="Category"
              onChangeText={text => {
                earn.memo = text;
                updateEntry(index, earn);
              }}
            />
            <MoneyInput
              amount={earn.amount}
              onChange={amount => {
                earn.amount = amount;
                updateEntry(index, earn);
              }}
              editable={true}
              style={{
                flex: 1,
              }}
              type={entryType}
              textStyle={{ fontSize: 24 }}
            />
          </View>
        </Swipeable>
      ))}
      <OutlineButton
        color={theme.colors.iosBlue}
        label={`New ${add}`}
        onPress={addEntry}
        style={[
          sharedStyles.outlineButton,
          {
            backgroundColor: 'transparent',
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 25,
          },
        ]}
      />
    </>
  );
}

function MonthSetup(props) {
  const [earnings, setEarnings] = useState(props.earnings);
  const [spendings, setSpendings] = useState(props.fixedSpendings);

  return (
    <Screen>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
        <KeyboardAvoidingView behavior="padding">
          <Group
            entries={earnings}
            setEntries={setEarnings}
            add="Earning"
            entryType="credit"
          />
          <Group
            entries={spendings}
            setEntries={setSpendings}
            add="Fixed Spending"
            entryType="debit"
          />
          <View
            style={[
              sharedStyles.actionButton,
              { borderBottomWidth: 0, marginTop: 20 },
            ]}
          >
            <Button
              title="Save"
              onPress={() => {
                props.dispatch({
                  type: 'UPDATE_MONTH_SETUP',
                  setup: {
                    earnings: earnings.map(e => {
                      e.amount = parseFloat(e.amount);
                      return e;
                    }),
                    fixedSpendings: spendings.map(s => {
                      s.amount = parseFloat(s.amount);
                      return s;
                    }),
                  },
                });
                props.navigation.popToTop();
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Screen>
  );
}

MonthSetup.navigationOptions = {
  headerTitle: 'Setup',
};

function mapStateToProps(state) {
  return state.currentMonthSetup;
}

export default connect(mapStateToProps)(MonthSetup);
