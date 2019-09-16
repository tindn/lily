import { StyleSheet } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
  actionButton: {
    backgroundColor: '#fff',
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    padding: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: theme.colors.lighterGray,
  },
  borderTop: {
    borderColor: theme.colors.lighterGray,
    borderTopWidth: 1,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  formContainer: {
    backgroundColor: theme.colors.backgroundColor,
    borderRadius: 10,
    elevation: 4,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  formFirstRow: {
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  formRow: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  formSwitchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formTextInput: {
    color: theme.colors.darkerGray,
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
  },
  headerRight: {
    marginRight: 10,
  },
  inputRow: {
    backgroundColor: '#fff',
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
    padding: 12,
  },
  modalContainer: {
    backgroundColor: '#fff',
    elevation: 4,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  outlineButton: {
    paddingBottom: 7,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
  },
  shadow1: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  shadow2: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  shadow3: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  shadow4: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
});
