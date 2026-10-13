import { StyleSheet } from 'react-native';
import { colors, radii } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF8',
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
    color: '#756A6D',
    fontWeight: '700',
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#211B1D',
    marginTop: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6F1023',
    borderRadius: 10,
    padding: 11,
  },
  refreshButton: {
    backgroundColor: colors.maroon,
    borderRadius: radii.sm,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  refreshButtonText: {
    color: colors.yellow,
    fontWeight: '800',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#6F1023',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  formPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9DFE1',
    padding: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E9DFE1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: '#211B1D',
    backgroundColor: '#f8fafc',
  },
  multilineInput: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#6F1023',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
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
    color: '#756A6D',
  },
  recordDescription: {
    marginTop: 6,
    color: '#211B1D',
  },
  errorPanel: {
    backgroundColor: '#FCECEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#A52836',
  },
  statusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPresent: {
    backgroundColor: '#E8F6EF',
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
    color: '#237A55',
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
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 10,
  },
  selectedRecordCard: {
    borderColor: colors.maroon,
    borderWidth: 2,
  },
  selectEventText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: '700',
  },
  selectedEventPanel: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
  },
  formTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  formDescription: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 14,
  },
  successPanel: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  successText: {
    color: '#166534',
    fontWeight: '600',
  },
  viewAttendanceButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6F1023',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  viewAttendanceButtonText: {
    color: '#6F1023',
    fontWeight: '700',
  },
  attendanceModal: {
    flex: 1,
    backgroundColor: '#FCFAF8',
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
    color: '#211B1D',
    fontSize: 22,
    fontWeight: '800',
  },
  attendanceModalSubtitle: {
    color: '#756A6D',
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
  eventWorkspaceContent: {
    flex: 1,
  },
  eventWorkspaceDescription: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 16,
  },
  backToFormButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 12,
  },
  backToFormButtonText: {
    color: '#1d4ed8',
    fontWeight: '700',
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
    backgroundColor: '#F8EDEF',
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
