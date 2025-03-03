import React from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";

interface ModalAlertProps {
  visible: boolean;
  timerName: string;
  onClose: () => void;
}

const ModalAlert: React.FC<ModalAlertProps> = ({
  visible,
  timerName,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.message}>
            Congratulations! Timer "{timerName}" completed!
          </Text>
          <Button color={"purple"} title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
});

export default ModalAlert;
