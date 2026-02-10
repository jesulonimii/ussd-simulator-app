import InstanceCard from "@/components/InstanceCard";
import type { USSDInstance } from "@/stores/useInstanceStore";
import { useInstanceStore } from "@/stores/useInstanceStore";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function InstanceListScreen() {
    const router = useRouter();
    const { instances, removeInstance, duplicateInstance } = useInstanceStore();

    const handlePress = useCallback(
        (instance: USSDInstance) => {
            router.push(`/dialer/${instance.id}`);
        },
        [router]
    );

    const handleLongPress = useCallback(
        (instance: USSDInstance) => {
            Alert.alert(
                instance.name,
                "What would you like to do?",
                [
                    {
                        text: "Edit",
                        onPress: () => router.push(`/create?id=${instance.id}`),
                    },
                    {
                        text: "Duplicate",
                        onPress: () => duplicateInstance(instance.id),
                    },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => removeInstance(instance.id),
                    },
                    { text: "Cancel", style: "cancel" },
                ]
            );
        },
        [removeInstance, duplicateInstance, router]
    );

    const renderItem = useCallback(
        ({ item }: { item: USSDInstance }) => (
            <InstanceCard
                instance={item}
                onPress={() => handlePress(item)}
                onLongPress={() => handleLongPress(item)}
            />
        ),
        [handlePress, handleLongPress]
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={instances}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={
                    instances.length === 0
                        ? styles.emptyContainer
                        : styles.listContainer
                }
                ListEmptyComponent={
                    <View style={styles.emptyContent}>
                        <Text style={styles.emptyIcon}>📱</Text>
                        <Text style={styles.emptyTitle}>No instances yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Create a USSD instance to start{"\n"}testing your USSD
                            application
                        </Text>
                    </View>
                }
            />

            {/* FAB */}
            <Pressable
                onPress={() => router.push("/create")}
                style={styles.fab}
            >
                <Text style={styles.fabText}>+</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    listContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContent: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
    },
    emptyIcon: {
        fontSize: 56,
        marginBottom: 16,
    },
    emptyTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#8E8E93",
        fontSize: 16,
        textAlign: "center",
    },
    fab: {
        position: "absolute",
        bottom: 40,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#007AFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    fabText: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "300",
    },
});
