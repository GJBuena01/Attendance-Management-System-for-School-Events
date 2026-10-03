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
  headerText: {
    flex: 1,
    marginRight: 12,
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
  refreshButton: {
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  refreshText: {
    color: '#ffffff',
    fontWeight: '700',
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
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 12,
  },
  backText: {
    color: '#1d4ed8',
    fontWeight: '700',
    marginBottom: 16,
  },
  detailText: {
    color: '#334155',
    fontSize: 14,
    marginBottom: 6,
  },
  detailDescription: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  attendanceDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginTop: 8,
  },
  detailHeading: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  viewAttendanceButton: {
    alignItems: 'center',
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  viewAttendanceButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  attendanceModal: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  attendanceModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  attendanceModalTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  attendanceModalTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
  },
  attendanceModalSubtitle: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 4,
  },
  closeModalButton: {
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  closeModalButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  attendanceTableVerticalScroll: {
    flex: 1,
  },
  attendanceTable: {
    minWidth: 790,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  attendanceTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  attendanceTableHeader: {
    backgroundColor: '#eaf0fb',
  },
  attendanceTableAlternateRow: {
    backgroundColor: '#f8fafc',
  },
  attendanceTableCell: {
    color: '#334155',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 12,
    textAlignVertical: 'center',
  },
  attendanceTableStudentId: {
    width: 125,
  },
  attendanceTableName: {
    width: 175,
  },
  attendanceTableStatus: {
    width: 105,
  },
  attendanceTableTimestamp: {
    width: 190,
  },
  attendanceTableScanner: {
    width: 195,
  },
});