import { useSessionStore } from "@/stores/useSessionStore";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface USSDModalProps {
    visible: boolean;
    onSend: (input: string) => void;
    onCancel: () => void;
    continueSession: boolean;
}

export default function USSDModal({
    visible,
    onSend,
    onCancel,
    continueSession,
}: USSDModalProps) {
    const [userInput, setUserInput] = useState("");
    const { currentMessage, isLoading, error } = useSessionStore();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [visible, fadeAnim]);

    useEffect(() => {
        setUserInput("");
    }, [currentMessage]);

    const handleSend = () => {
        if (userInput.trim()) {
            onSend(userInput.trim());
            setUserInput("");
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.flex}
            >
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                    {/* USSD Dialog Box */}
                    <View style={styles.dialog}>
                        {/* Title bar */}
                        <View style={styles.titleBar}>
                            <Text style={styles.titleText}>USSD Service</Text>
                        </View>

                        {/* Message body */}
                        <View style={styles.body}>
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator color="#007AFF" size="small" />
                                    <Text style={styles.loadingText}>Please wait...</Text>
                                </View>
                            ) : error ? (
                                <Text style={styles.errorText}>⚠ {error}</Text>
                            ) : (
                                <Text style={styles.messageText}>{currentMessage}</Text>
                            )}
                        </View>

                        {/* Input field */}
                        {continueSession && !isLoading && !error && (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    value={userInput}
                                    onChangeText={setUserInput}
                                    placeholder="Enter response"
                                    placeholderTextColor="#636366"
                                    keyboardType="default"
                                    autoFocus
                                    returnKeyType="send"
                                    onSubmitEditing={handleSend}
                                    style={styles.input}
                                />
                            </View>
                        )}

                        {/* Action buttons */}
                        <View style={styles.buttonRow}>
                            <Pressable
                                onPress={onCancel}
                                style={({ pressed }) => [
                                    styles.button,
                                    pressed && styles.buttonPressed,
                                ]}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </Pressable>

                            {continueSession && !isLoading ? (
                                <>
                                    <View style={styles.dividerV} />
                                    <Pressable
                                        onPress={handleSend}
                                        style={({ pressed }) => [
                                            styles.button,
                                            pressed && styles.buttonPressed,
                                        ]}
                                    >
                                        <Text style={styles.sendText}>Send</Text>
                                    </Pressable>
                                </>
                            ) : !isLoading ? (
                                <>
                                    <View style={styles.dividerV} />
                                    <Pressable
                                        onPress={onCancel}
                                        style={({ pressed }) => [
                                            styles.button,
                                            pressed && styles.buttonPressed,
                                        ]}
                                    >
                                        <Text style={styles.sendText}>OK</Text>
                                    </Pressable>
                                </>
                            ) : null}
                        </View>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    dialog: {
        width: "100%",
        maxWidth: 340,
        backgroundColor: "#2C2C2E",
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 16,
    },
    titleBar: {
        backgroundColor: "#1C1C1E",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#3A3A3C",
    },
    titleText: {
        color: "#8E8E93",
        fontSize: 14,
        fontWeight: "500",
    },
    body: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        minHeight: 100,
        justifyContent: "center",
    },
    loadingContainer: {
        alignItems: "center",
        paddingVertical: 16,
    },
    loadingText: {
        color: "#8E8E93",
        fontSize: 14,
        marginTop: 12,
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 14,
        lineHeight: 20,
    },
    messageText: {
        color: "#FFFFFF",
        fontSize: 15,
        lineHeight: 24,
    },
    inputContainer: {
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    input: {
        backgroundColor: "#1C1C1E",
        color: "#FFFFFF",
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#3A3A3C",
    },
    buttonRow: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#3A3A3C",
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        alignItems: "center",
    },
    buttonPressed: {
        backgroundColor: "#3A3A3C",
    },
    dividerV: {
        width: 1,
        backgroundColor: "#3A3A3C",
    },
    cancelText: {
        color: "#FF3B30",
        fontSize: 16,
        fontWeight: "500",
    },
    sendText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
