import { StyleSheet } from 'react-native';
import { colors, radii } from './theme';

export const LoginScreenStyles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: colors.maroonDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
  },
  card: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 5,
  },
  brandContainer: {
    alignSelf: 'center',
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: 0.4,
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    backgroundColor: colors.canvas,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 17,
    fontSize: 16,
    color: colors.ink,
  },
  buttonWrapper: {
    marginTop: 8,
  },
  primaryButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.maroon,
    borderRadius: radii.sm,
    marginTop: 4,
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.maroon,
    borderRadius: radii.sm,
    marginTop: 12,
  },
  secondaryButtonText: {
    color: colors.maroon,
    fontWeight: '800',
    fontSize: 14,
  },
  error: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderRadius: radii.sm,
    padding: 11,
    fontSize: 13,
    marginBottom: 12,
  },
});
