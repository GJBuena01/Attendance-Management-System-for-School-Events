import { StyleSheet } from 'react-native';

export const LoginScreenStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 12,
    padding: 24,
  },
  loginHeader: {
    alignSelf: "center",
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  subtitle: {
    alignSelf: 'center',
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cfcfcf',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#111111',
  },
  buttonWrapper: {
    marginTop: 8,
  },
});