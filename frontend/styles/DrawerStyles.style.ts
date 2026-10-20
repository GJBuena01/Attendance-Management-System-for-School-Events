import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  drawerContent: {
    flexGrow: 1,
    paddingTop: 0,
  },
  drawerBrandHeader: {
    backgroundColor: '#6F1023',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    marginBottom: 12,
    marginTop: 10,
    borderRadius: 12,
  },
  logoutButton: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  logoutText: {
    color: '#F4C542',
    fontWeight: '600',
  },
});
