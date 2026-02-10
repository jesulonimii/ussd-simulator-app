import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const KEYS = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
];

const SUB_LABELS: Record<string, string> = {
    "1": "",
    "2": "ABC",
    "3": "DEF",
    "4": "GHI",
    "5": "JKL",
    "6": "MNO",
    "7": "PQRS",
    "8": "TUV",
    "9": "WXYZ",
    "*": "",
    "0": "+",
    "#": "",
};

interface DialPadProps {
    onCall: (code: string) => void;
}

export default function DialPad({ onCall }: DialPadProps) {
    const [input, setInput] = useState("");

    const handlePress = useCallback((key: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setInput((prev) => prev + key);
    }, []);

    const handleDelete = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setInput((prev) => prev.slice(0, -1));
    }, []);

    const handleCall = useCallback(() => {
        if (input.trim()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onCall(input.trim());
            setInput("");
        }
    }, [input, onCall]);

    return (
        <View style={styles.container}>
            {/* Input display */}
            <View style={styles.inputContainer}>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Dial USSD code"
                    placeholderTextColor="#8E8E93"
                    style={styles.inputField}
                    editable={true}
                    caretHidden={false}
                    autoFocus={false}
                />
            </View>

            {/* Keypad */}
            <View style={styles.keypad}>
                {KEYS.map((row, rowIdx) => (
                    <View key={rowIdx} style={styles.keyRow}>
                        {row.map((key) => (
                            <Pressable
                                key={key}
                                onPress={() => handlePress(key)}
                                style={({ pressed }) => [
                                    styles.key,
                                    pressed && styles.keyPressed,
                                ]}
                            >
                                <Text style={styles.keyText}>{key}</Text>
                                {SUB_LABELS[key] ? (
                                    <Text style={styles.keySubLabel}>{SUB_LABELS[key]}</Text>
                                ) : null}
                            </Pressable>
                        ))}
                    </View>
                ))}
            </View>

            {/* Action row */}
            <View style={styles.actionRow}>
                {/* Delete */}
                <Pressable onPress={handleDelete} style={styles.actionBtn}>
                    <Text style={styles.deleteText}>⌫</Text>
                </Pressable>

                {/* Call */}
                <Pressable
                    onPress={handleCall}
                    style={({ pressed }) => [
                        styles.callBtn,
                        pressed && styles.callBtnPressed,
                    ]}
                >
                    <Text style={styles.callIcon}>📞</Text>
                </Pressable>

                {/* Spacer for symmetry */}
                <View style={styles.actionBtn} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: 32,
        paddingHorizontal: 24,
    },
    inputContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    inputField: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "300",
        textAlign: "center",
        width: "100%",
    },
    keypad: {
        gap: 12,
    },
    keyRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 24,
    },
    key: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#333333",
        alignItems: "center",
        justifyContent: "center",
    },
    keyPressed: {
        backgroundColor: "#555555",
    },
    keyText: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "300",
    },
    keySubLabel: {
        color: "#8E8E93",
        fontSize: 11,
        fontWeight: "500",
        letterSpacing: 2,
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 64,
        marginTop: 16,
    },
    actionBtn: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    deleteText: {
        color: "#8E8E93",
        fontSize: 18,
    },
    callBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#30D158",
        alignItems: "center",
        justifyContent: "center",
    },
    callBtnPressed: {
        backgroundColor: "#28b84d",
    },
    callIcon: {
        fontSize: 24,
    },
});
