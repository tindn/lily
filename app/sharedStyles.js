import { StyleSheet } from 'react-native';
import theme from '../theme';

export default StyleSheet.create({
  borderBottom: {
    borderBottomColor: theme.colors.lighterGray,
    borderBottomWidth: 1,
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
    padding: 12,
    justifyContent: 'space-between',
  },
  formSwitchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formTextInput: {
    color: theme.colors.darkerGray,
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
  },
  outlineButton: {
    paddingBottom: 7,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
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
  headerRight: {
    marginRight: 10,
  },
});
