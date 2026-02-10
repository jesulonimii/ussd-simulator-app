import type { USSDInstance } from "@/stores/useInstanceStore";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const TYPE_COLORS: Record<string, string> = {
    arkesel: "#FF9F0A",
    africastalking: "#30D158",
    hollatags: "#007AFF",
};

const TYPE_LABELS: Record<string, string> = {
    arkesel: "Arkesel",
    africastalking: "Africa's Talking",
    hollatags: "Hollatags",
};

interface InstanceCardProps {
    instance: USSDInstance;
    onPress: () => void;
    onLongPress: () => void;
}

export default function InstanceCard({
    instance,
    onPress,
    onLongPress,
}: InstanceCardProps) {
    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            <View style={styles.header}>
                <Text style={styles.name} numberOfLines={1}>
                    {instance.name}
                </Text>
                <View
                    style={[
                        styles.badge,
                        { backgroundColor: TYPE_COLORS[instance.interactionType] },
                    ]}
                >
                    <Text style={styles.badgeText}>
                        {TYPE_LABELS[instance.interactionType]}
                    </Text>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.icon}>📱</Text>
                <Text style={styles.phone}>{instance.phoneNumber}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.icon}>🔗</Text>
                <Text style={styles.url} numberOfLines={1}>
                    {instance.callbackUrl}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#2C2C2E",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    cardPressed: {
        backgroundColor: "#3A3A3C",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    name: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
        flex: 1,
        marginRight: 8,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    icon: {
        fontSize: 14,
        marginRight: 8,
        color: "#8E8E93",
    },
    phone: {
        color: "#EBEBF5",
        fontSize: 14,
    },
    url: {
        color: "#8E8E93",
        fontSize: 14,
        flex: 1,
    },
});
