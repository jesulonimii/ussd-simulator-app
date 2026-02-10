import DialPad from "@/components/DialPad";
import USSDModal from "@/components/USSDModal";
import { useUssdRequest } from "@/lib/api";
import { useInstanceStore } from "@/stores/useInstanceStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function DialerScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation();
    const { getInstance } = useInstanceStore();
    const session = useSessionStore();
    const ussdMutation = useUssdRequest();

    const [showModal, setShowModal] = useState(false);
    const [continueSession, setContinueSession] = useState(true);

    const instance = getInstance(id!);

    React.useEffect(() => {
        if (instance) {
            navigation.setOptions({ title: instance.name });
        }
    }, [instance, navigation]);

    const handleCall = useCallback(
        (code: string) => {
            if (!instance) return;

            const sessionId = session.startSession(code);
            setShowModal(true);
            setContinueSession(true);

            ussdMutation.mutate(
                {
                    callbackUrl: instance.callbackUrl,
                    interactionType: instance.interactionType,
                    sessionId,
                    phoneNumber: instance.phoneNumber,
                    serviceCode: code,
                    input: code,
                    fullInput: "",
                    isNewSession: true,
                },
                {
                    onSuccess: (data) => {
                        setContinueSession(data.continueSession);
                    },
                }
            );
        },
        [instance, session, ussdMutation]
    );

    const handleSend = useCallback(
        (input: string) => {
            if (!instance || !session.sessionId) return;

            session.addToHistory(input);
            session.setLoading(true);

            const fullInput = [...session.history, input].join("*");

            ussdMutation.mutate(
                {
                    callbackUrl: instance.callbackUrl,
                    interactionType: instance.interactionType,
                    sessionId: session.sessionId,
                    phoneNumber: instance.phoneNumber,
                    serviceCode: session.serviceCode,
                    input,
                    fullInput,
                    isNewSession: false,
                },
                {
                    onSuccess: (data) => {
                        setContinueSession(data.continueSession);
                    },
                }
            );
        },
        [instance, session, ussdMutation]
    );

    const handleCancel = useCallback(() => {
        setShowModal(false);
        setContinueSession(true);
        session.endSession();
    }, [session]);

    if (!instance) {
        return (
            <SafeAreaView style={styles.notFound}>
                <Text style={styles.notFoundText}>Instance not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Instance info header */}
            <View style={styles.header}>
                <Text style={styles.phoneNumber}>{instance.phoneNumber}</Text>
            </View>

            {/* Dial pad */}
            <DialPad onCall={handleCall} />

            {/* USSD Modal */}
            <USSDModal
                visible={showModal}
                onSend={handleSend}
                onCancel={handleCancel}
                continueSession={continueSession}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    header: {
        paddingTop: 56,
        paddingBottom: 8,
        paddingHorizontal: 24,
    },
    phoneNumber: {
        color: "#8E8E93",
        fontSize: 14,
        textAlign: "center",
    },
    notFound: {
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },
    notFoundText: {
        color: "#FFFFFF",
        fontSize: 18,
    },
});
