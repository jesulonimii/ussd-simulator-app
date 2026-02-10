import {
    useInstanceStore,
    type InteractionType,
} from "@/stores/useInstanceStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const INTERACTION_TYPES: {
    value: InteractionType;
    label: string;
    description: string;
    color: string;
}[] = [
        {
            value: "arkesel",
            label: "Arkesel",
            description: "JSON-based session with continueSession flag",
            color: "#FF9F0A",
        },
        {
            value: "africastalking",
            label: "Africa's Talking",
            description: "Text-based with CON/END prefix responses",
            color: "#30D158",
        },
        {
            value: "hollatags",
            label: "Hollatags",
            description: "JSON with session_operation begin/continue/end",
            color: "#007AFF",
        },
    ];

export default function CreateInstanceScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { addInstance, updateInstance, getInstance } = useInstanceStore();

    const existing = id ? getInstance(id) : undefined;
    const isEditing = !!existing;

    const [name, setName] = useState(existing?.name ?? "");
    const [phoneNumber, setPhoneNumber] = useState(existing?.phoneNumber ?? "");
    const [callbackUrl, setCallbackUrl] = useState(existing?.callbackUrl ?? "");
    const [interactionType, setInteractionType] =
        useState<InteractionType>(existing?.interactionType ?? "africastalking");

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert("Validation", "Please enter a name for this instance.");
            return;
        }
        if (!phoneNumber.trim()) {
            Alert.alert("Validation", "Please enter a phone number.");
            return;
        }
        if (!callbackUrl.trim()) {
            Alert.alert("Validation", "Please enter a callback URL.");
            return;
        }
        try {
            new URL(callbackUrl.trim());
        } catch {
            Alert.alert(
                "Validation",
                "Please enter a valid URL (e.g., https://example.com/ussd)."
            );
            return;
        }

        if (isEditing) {
            updateInstance(id!, {
                name: name.trim(),
                phoneNumber: phoneNumber.trim(),
                callbackUrl: callbackUrl.trim(),
                interactionType,
            });
        } else {
            addInstance({
                name: name.trim(),
                phoneNumber: phoneNumber.trim(),
                callbackUrl: callbackUrl.trim(),
                interactionType,
            });
        }

        router.back();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Name */}
                <Text style={styles.label}>INSTANCE NAME</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., My Bank USSD"
                    placeholderTextColor="#636366"
                    style={styles.input}
                />

                {/* Phone Number */}
                <Text style={styles.label}>PHONE NUMBER</Text>
                <TextInput
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="e.g., +233123456789"
                    placeholderTextColor="#636366"
                    keyboardType="phone-pad"
                    style={styles.input}
                />

                {/* Callback URL */}
                <Text style={styles.label}>CALLBACK URL</Text>
                <TextInput
                    value={callbackUrl}
                    onChangeText={setCallbackUrl}
                    placeholder="https://your-api.com/ussd"
                    placeholderTextColor="#636366"
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                />

                {/* Interaction Type */}
                <Text style={styles.label}>INTERACTION TYPE</Text>
                <View style={{ gap: 12, marginBottom: 32 }}>
                    {INTERACTION_TYPES.map((type) => {
                        const selected = interactionType === type.value;
                        return (
                            <Pressable
                                key={type.value}
                                onPress={() => setInteractionType(type.value)}
                                style={[
                                    styles.typeCard,
                                    selected && styles.typeCardSelected,
                                ]}
                            >
                                <View style={styles.typeHeader}>
                                    <View
                                        style={[styles.typeDot, { backgroundColor: type.color }]}
                                    />
                                    <Text style={styles.typeLabel}>{type.label}</Text>
                                    {selected && (
                                        <Text style={styles.typeCheck}>✓</Text>
                                    )}
                                </View>
                                <Text style={styles.typeDesc}>{type.description}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Save Button */}
                <Pressable onPress={handleSave} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>
                        {isEditing ? "Update Instance" : "Create Instance"}
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    label: {
        color: "#8E8E93",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: "#1C1C1E",
        color: "#FFFFFF",
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#3A3A3C",
    },
    typeCard: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: "#3A3A3C",
        backgroundColor: "#1C1C1E",
    },
    typeCardSelected: {
        borderColor: "#007AFF",
    },
    typeHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    typeDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    typeLabel: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
    },
    typeCheck: {
        color: "#007AFF",
        fontSize: 14,
    },
    typeDesc: {
        color: "#8E8E93",
        fontSize: 14,
        marginLeft: 22,
    },
    saveBtn: {
        backgroundColor: "#007AFF",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
    },
    saveBtnText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
