import { Modal, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type StudentQrModalProps = {
  visible: boolean;
  studentId?: string;
  onClose: () => void;
};

export default function StudentQrModal({
  visible,
  studentId,
  onClose,
}: StudentQrModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View>
        <Text>Student QR</Text>

        {studentId ? <QRCode value={studentId} size={220} /> : null}

        <TouchableOpacity onPress={onClose} accessibilityRole="button">
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}