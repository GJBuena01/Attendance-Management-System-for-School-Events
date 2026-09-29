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
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 18,
  },
  sectionPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  recordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  recordMain: {
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
  presentBadge: {
    backgroundColor: '#dcfce7',
    borderColor: '#166534',
  },
  absentBadge: {
    backgroundColor: '#fee2e2',
    borderColor: '#991b1b',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  presentText: {
    color: '#166534',
  },
  absentText: {
    color: '#991b1b',
  },
  emptyState: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
    borderRadius: 12,
    padding: 18,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#312e81',
    marginBottom: 6,
  },
  emptyStateText: {
    color: '#4338ca',
    fontSize: 14,
  },
});