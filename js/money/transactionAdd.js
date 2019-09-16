import React from 'react';
import { Text, TouchableOpacity, View, Modal } from 'react-native';
import theme from '../theme';
import TransactionForm from './transactionForm';

class TransactionAdd extends React.Component {
  state = {
    showModal: false,
  };
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.setState({
              showModal: true,
            })
          }
          style={{
            position: 'absolute',
            bottom: 10,
            alignSelf: 'center',
            backgroundColor: theme.colors.primary,
            borderRadius: 30,
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
          }}
        >
          <Text style={{ color: theme.colors.secondary, fontSize: 16 }}>
            Add
          </Text>
        </TouchableOpacity>
        <Modal
          key="modal"
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}
        >
          <TransactionForm
            collapse={() => {
              this.setState({ showModal: false });
            }}
          />
        </Modal>
      </View>
    );
  }
}
export default TransactionAdd;
