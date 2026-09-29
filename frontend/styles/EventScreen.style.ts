import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#64748b',
    fontWeight: '700',
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    padding: 11,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 12,
  },
  recordInfo: {
    flex: 1,
    marginRight: 12,
  },
  recordEvent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  recordDate: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPresent: {
    backgroundColor: '#dcfce7',
    borderColor: '#166534',
  },
  statusAbsent: {
    backgroundColor: '#fee2e2',
    borderColor: '#991b1b',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextPresent: {
    color: '#166534',
  },
  statusTextAbsent: {
    color: '#991b1b',
  },
  emptyState: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    padding: 18,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 6,
  },
  emptyStateText: {
    color: '#334155',
    fontSize: 14,
  },
});