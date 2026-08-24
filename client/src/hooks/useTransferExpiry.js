import { useEffect, useState } from "react";

export default function useTransferExpiry(expiresAt, onExpire) {
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        if (!expiresAt) {
            setRemainingTime(0);
            return;
        }

        const updateRemainingTime = () => {
            const expiryTime = new Date(expiresAt).getTime();
            const difference = Math.max(0, expiryTime - Date.now());

            setRemainingTime(difference);

            if (difference === 0) {
                onExpire?.();
            }
        };

        updateRemainingTime();

        const interval = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    return {
        remainingTime,
        isExpired: remainingTime <= 0,
        isExpiringSoon:
            remainingTime > 0 &&
            remainingTime <= 60 * 1000,
    };
}