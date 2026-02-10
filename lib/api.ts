import type { InteractionType } from "@/stores/useInstanceStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import {
    formatRequest,
    getContentType,
    parseResponse,
    type ParsedUSSDResponse,
} from "./ussd-adapters";

interface UssdRequestParams {
    callbackUrl: string;
    interactionType: InteractionType;
    sessionId: string;
    phoneNumber: string;
    serviceCode: string;
    input: string;
    fullInput: string;
    isNewSession: boolean;
}

async function sendUssdRequest(
    params: UssdRequestParams
): Promise<ParsedUSSDResponse> {
    const body = formatRequest(params.interactionType, {
        sessionId: params.sessionId,
        phoneNumber: params.phoneNumber,
        serviceCode: params.serviceCode,
        input: params.input,
        fullInput: params.fullInput,
        isNewSession: params.isNewSession,
    });

    const contentType = getContentType(params.interactionType);

    let requestBody: string | URLSearchParams;

    if (contentType === "application/x-www-form-urlencoded") {
        const formData = new URLSearchParams();
        const bodyObj = body as Record<string, string>;
        for (const [key, value] of Object.entries(bodyObj)) {
            formData.append(key, String(value));
        }
        requestBody = formData;
    } else {
        requestBody = JSON.stringify(body);
    }

    const response = await ky.post(params.callbackUrl, {
        body: requestBody,
        headers: {
            "Content-Type": contentType,
        },
        timeout: 30000,
    });

    if (params.interactionType === "africastalking") {
        const text = await response.text();
        return parseResponse(params.interactionType, text);
    }

    const data = await response.json();
    return parseResponse(params.interactionType, data);
}

export function useUssdRequest() {
    const { setMessage, setLoading, setError, addToHistory, endSession } =
        useSessionStore();

    return useMutation({
        mutationFn: sendUssdRequest,
        onMutate: () => {
            setLoading(true);
            setError(null);
        },
        onSuccess: (data) => {
            setMessage(data.message);
            setLoading(false);

            if (!data.continueSession) {
                // Session ended — keep modal visible with final message
                // The UI will show an "OK" button to dismiss
            }
        },
        onError: (error: Error) => {
            setLoading(false);
            setError(error.message || "Failed to reach the callback URL");
        },
    });
}
