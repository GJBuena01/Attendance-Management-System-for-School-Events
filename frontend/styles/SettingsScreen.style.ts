import { StyleSheet } from 'react-native';
import { colors, radii } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 28,
    marginBottom: 10,
    color: colors.ink,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    marginBottom: 28,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    color: colors.maroon,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationCopy: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 5,
  },
  notificationDescription: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});
