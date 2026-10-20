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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: 13,
    marginBottom: 18,
  },
  attendeeSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: 13,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    minHeight: 46,
    paddingVertical: 10,
    paddingLeft: 10,
    color: colors.ink,
    fontSize: 14,
  },
  searchIcon: {
    color: colors.muted,
  },
  searchPlaceholder: {
    color: colors.muted,
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
    flexDirection: 'column',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 12,
  },
  recordCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  eventActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.maroonSoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginLeft: 8,
  },
  eventStatusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginTop: 7,
  },
  startingSoonStatusBadge: {
    backgroundColor: '#FFF7D6',
    borderColor: colors.yellow,
  },
  ongoingStatusBadge: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  endedStatusBadge: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  eventStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  startingSoonStatusText: {
    color: colors.maroon,
  },
  ongoingStatusText: {
    color: colors.success,
  },
  endedStatusText: {
    color: colors.danger,
  },
  eventActionIcon: {
    color: colors.maroon,
  },
  eventActionText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },
  archiveEventButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellowSoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginLeft: 8,
  },
  archiveEventText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },
  confirmationOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(33, 27, 29, 0.55)',
    padding: 20,
  },
  confirmationPanel: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
  },
  confirmationTitle: {
    color: '#211B1D',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
  },
  confirmationMessage: {
    color: '#756A6D',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  confirmationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  confirmationCancelButton: {
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginRight: 8,
  },
  confirmationCancelText: {
    color: '#756A6D',
    fontWeight: '800',
  },
  confirmationArchiveButton: {
    backgroundColor: colors.maroon,
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  confirmationArchiveText: {
    color: colors.yellow,
    fontWeight: '800',
  },
  attendeeTableActions: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  editAttendeesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  editAttendeesText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
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
    backgroundColor: colors.maroon,
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
    color: colors.maroon,
    fontWeight: '700',
  },
  attendanceTable: {
    minWidth: 790,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  attendanceTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
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
  },scanQrButton: {
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#6F1023',
  borderRadius: 8,
  padding: 12,
  marginTop: 10,
},

scanQrButtonText: {
  color: '#6F1023',
  fontWeight: '700',
},

scannerContainer: {
  flex: 1,
  backgroundColor: colors.maroon,
},

camera: {
  flex: 1,
},

closeScannerButton: {
  position: 'absolute',
  left: 20,
  right: 20,
  bottom: 32,
  alignItems: 'center',
  backgroundColor: colors.danger,
  borderRadius: radii.sm,
  paddingVertical: 12,
},
});
