import type { InteractionType } from "@/stores/useInstanceStore";
import * as Crypto from "expo-crypto";

// --- Arkesel ---

interface ArkeselRequest {
    sessionID: string;
    userID: string;
    newSession: boolean;
    msisdn: string;
    userData: string;
    network: string;
}

interface ArkeselResponse {
    sessionID: string;
    message: string;
    continueSession: boolean;
    userID: string;
    msisdn: string;
    sessionFrom: string;
}

// --- Africa's Talking ---

interface AfricasTalkingRequest {
    sessionId: string;
    phoneNumber: string;
    serviceCode: string;
    text: string;
}

// Africa's Talking returns plain text: "CON ..." or "END ..."

// --- Hollatags ---

interface HollatagsRequest {
    session_operation: "begin" | "continue" | "end";
    session_type: 1 | 2 | 3 | 4;
    session_id: string;
    session_msg: string;
    session_msisdn: string;
    session_from: string;
    session_mno: string;
}

interface HollatagsResponse {
    session_operation: "begin" | "continue" | "end";
    session_type: 1 | 2 | 3 | 4;
    session_id: string;
    session_msg: string;
    session_msisdn: string;
    session_from: string;
    session_mno: string;
}

// --- Parsed response ---

export interface ParsedUSSDResponse {
    message: string;
    continueSession: boolean;
}

// --- Adapter functions ---

function formatArkeselRequest(params: {
    sessionId: string;
    phoneNumber: string;
    serviceCode: string;
    input: string;
    isNewSession: boolean;
}): ArkeselRequest {
    return {
        sessionID: params.sessionId,
        userID: Crypto.randomUUID(),
        newSession: params.isNewSession,
        msisdn: params.phoneNumber,
        userData: params.isNewSession ? params.serviceCode : params.input,
        network: "SIM",
    };
}

function parseArkeselResponse(data: ArkeselResponse): ParsedUSSDResponse {
    return {
        message: data.message,
        continueSession: data.continueSession,
    };
}

function formatAfricasTalkingRequest(params: {
    sessionId: string;
    phoneNumber: string;
    serviceCode: string;
    input: string;
    fullInput: string;
    isNewSession: boolean;
}): AfricasTalkingRequest {
    return {
        sessionId: params.sessionId,
        phoneNumber: params.phoneNumber,
        serviceCode: params.serviceCode,
        text: params.isNewSession ? "" : params.fullInput,
    };
}

function parseAfricasTalkingResponse(text: string): ParsedUSSDResponse {
    const trimmed = text.trim();
    if (trimmed.startsWith("CON ")) {
        return {
            message: trimmed.slice(4),
            continueSession: true,
        };
    }
    if (trimmed.startsWith("END ")) {
        return {
            message: trimmed.slice(4),
            continueSession: false,
        };
    }
    // Fallback: treat as ending message
    return {
        message: trimmed,
        continueSession: false,
    };
}

function formatHollatagsRequest(params: {
    sessionId: string;
    phoneNumber: string;
    serviceCode: string;
    input: string;
    isNewSession: boolean;
}): HollatagsRequest {
    return {
        session_operation: params.isNewSession ? "begin" : "continue",
        session_type: 1,
        session_id: params.sessionId,
        session_msg: params.isNewSession ? params.serviceCode : params.input,
        session_msisdn: params.phoneNumber,
        session_from: params.serviceCode,
        session_mno: "SIM",
    };
}

function parseHollatagsResponse(data: HollatagsResponse): ParsedUSSDResponse {
    return {
        message: data.session_msg,
        continueSession: data.session_operation !== "end",
    };
}

// --- Public API ---

export function formatRequest(
    type: InteractionType,
    params: {
        sessionId: string;
        phoneNumber: string;
        serviceCode: string;
        input: string;
        fullInput: string;
        isNewSession: boolean;
    }
): unknown {
    switch (type) {
        case "arkesel":
            return formatArkeselRequest(params);
        case "africastalking":
            return formatAfricasTalkingRequest(params);
        case "hollatags":
            return formatHollatagsRequest(params);
    }
}

export function parseResponse(
    type: InteractionType,
    data: unknown
): ParsedUSSDResponse {
    switch (type) {
        case "arkesel":
            return parseArkeselResponse(data as ArkeselResponse);
        case "africastalking":
            return parseAfricasTalkingResponse(data as string);
        case "hollatags":
            return parseHollatagsResponse(data as HollatagsResponse);
    }
}

export function getContentType(type: InteractionType): string {
    switch (type) {
        case "africastalking":
            return "application/x-www-form-urlencoded";
        default:
            return "application/json";
    }
}
