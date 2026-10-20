import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import type { Account } from '../types/event';
import { styles } from '../styles/HomeScreen.style';

type StudentQrModalProps = {
  visible: boolean;
  account: Account;
  onClose: () => void;
};

export default function StudentQrModal({
  visible,
  account,
  onClose,
}: StudentQrModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView
        edges={['top', 'right', 'bottom', 'left']}
        style={styles.qrModalOverlay}
      >
        <View style={styles.qrModalCard}>
          <Text style={styles.qrModalTitle}>Attendance QR</Text>
          <Text style={styles.qrModalSubtitle}>
            Present this QR code for attendance
          </Text>

          <View style={styles.qrCodeContainer}>
            {account.studentId ? (
              <QRCode value={account.studentId} size={220} />
            ) : (
              <Text>No student ID available</Text>
            )}
          </View>

          <View style={styles.qrStudentDetails}>
            <Text style={styles.qrStudentName}>{account.fullName}</Text>
            <Text style={styles.qrStudentId}>
              Student ID: {account.studentId ?? 'Unavailable'}
            </Text>
            <Text style={styles.qrStudentEmail}>
              {account.email || 'No email available'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.qrCloseButton}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={styles.qrCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}