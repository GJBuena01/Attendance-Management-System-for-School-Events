import { StyleSheet } from 'react-native';
import { colors, radii } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 38,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 29,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
  },
  refreshButton: {
    backgroundColor: colors.maroon,
    borderRadius: radii.sm,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  refreshText: {
    color: colors.yellow,
    fontWeight: '800',
  },
  sectionPanel: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 17,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 13,
  },
  recordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  recordMain: {
    flex: 1,
    marginRight: 12,
  },
  recordEvent: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  recordDate: {
    marginTop: 5,
    fontSize: 12,
    color: colors.muted,
  },
  statusBadge: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  presentBadge: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  absentBadge: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  presentText: {
    color: colors.success,
  },
  absentText: {
    color: colors.danger,
  },
  emptyState: {
    backgroundColor: colors.yellowSoft,
    borderWidth: 1,
    borderColor: colors.yellow,
    borderRadius: radii.md,
    padding: 18,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.maroon,
    marginBottom: 6,
  },
  emptyStateText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.maroon,
    borderRadius: radii.sm,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginTop: 12,
  },
  backText: {
    color: colors.maroon,
    fontWeight: '800',
    marginBottom: 16,
  },
  detailText: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 7,
  },
  detailDescription: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
    marginBottom: 16,
  },
  attendanceDetails: {
    backgroundColor: colors.canvas,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginTop: 8,
  },
  detailHeading: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  viewAttendanceButton: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: radii.sm,
    padding: 12,
    marginTop: 8,
  },
  viewAttendanceButtonText: {
    color: colors.surface,
    fontWeight: '800',
  },
  attendanceModal: {
    flex: 1,
    backgroundColor: colors.canvas,
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
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  attendanceModalSubtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  closeModalButton: {
    backgroundColor: colors.maroon,
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  closeModalButtonText: {
    color: colors.surface,
    fontWeight: '800',
  },
  attendanceTableVerticalScroll: {
    flex: 1,
  },
  attendanceTable: {
    minWidth: 790,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  attendanceTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  attendanceTableHeader: {
    backgroundColor: colors.maroonSoft,
  },
  attendanceTableAlternateRow: {
    backgroundColor: colors.canvas,
  },
  attendanceTableCell: {
    color: colors.ink,
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
