import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { useLazyGetUserByIdQuery } from "../../app/services/userApi";
import { Dispatch, SetStateAction } from "react";
import { User } from "../../app/types"; // Убедитесь, что путь к типу User правильный

export interface MiningComponentProps {
    balanceMining: number;
    setBalanceMining: Dispatch<SetStateAction<number>>;
    balance: number;
    setBalance: Dispatch<SetStateAction<number>>;
    refetch: () => void; // Используем тип void
    currentUser: User | null;
}

export const MiningComponent: React.FC<MiningComponentProps> = ({
                                                                    balanceMining,
                                                                    setBalanceMining,
                                                                    balance,
                                                                    setBalance,
                                                                    refetch,
                                                                    currentUser
                                                                }) => {
    const { id } = useParams<{ id: string }>();
    const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery();
    const [isMining, setIsMining] = useState(false);
    const [showClaimButton, setShowClaimButton] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10); // 10 секунд

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("Token is missing");
                    return;
                }

                const savedTimeLeft = localStorage.getItem(`miningTimeLeft_${id}`);
                const startTime = localStorage.getItem(`miningStartTime_${id}`);
                const savedBalanceMining = localStorage.getItem(`miningBalance_${id}`);
                const savedShowClaimButton = localStorage.getItem(`showClaimButton_${id}`);

                if (savedTimeLeft) {
                    setTimeLeft(parseInt(savedTimeLeft, 10));
                }

                if (startTime) {
                    const elapsedTime = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
                    const remainingTime = 10 - elapsedTime;
                    if (remainingTime > 0) {
                        setTimeLeft(remainingTime);
                        setIsMining(true);
                        startMiningTimer(remainingTime);
                    } else {
                        handleMiningComplete();
                    }
                } else {
                    setTimeLeft(10);
                }

                if (savedBalanceMining) {
                    setBalanceMining(parseFloat(savedBalanceMining));
                }

                if (savedShowClaimButton) {
                    setShowClaimButton(savedShowClaimButton === "true");
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserData();
    }, [id]);

    useEffect(() => {
        localStorage.setItem(`miningTimeLeft_${id}`, timeLeft.toString());
    }, [timeLeft, id]);

    useEffect(() => {
        localStorage.setItem(`miningBalance_${id}`, balanceMining.toString());
    }, [balanceMining, id]);

    useEffect(() => {
        localStorage.setItem(`showClaimButton_${id}`, showClaimButton.toString());
    }, [showClaimButton, id]);

    useEffect(() => {
        const calculateMinedBalance = () => {
            const elapsedTime = 10 - timeLeft;
            const minedBalance = (elapsedTime / 10) * 0.0400; // 0.0400 монет за 10 секунд
            setBalanceMining(minedBalance);
        };

        calculateMinedBalance();
    }, [timeLeft, setBalanceMining]);

    const updateUserBalance = async (userId: string, newBalance: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token is missing");
                return;
            }

            const response = await fetch(`http://localhost:3000/api/balance/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ balance: newBalance }),
            });
            if (!response.ok) {
                throw new Error("Failed to update balance");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const startMiningTimer = (remainingTime: number) => {
        const timerInterval = setInterval(() => {
            setTimeLeft((prevTime: number) => {
                const newTime = prevTime - 1;
                if (newTime <= 0) {
                    clearInterval(timerInterval);
                    handleMiningComplete();
                }
                return newTime;
            });
        }, 1000);

        setTimeout(() => {
            clearInterval(timerInterval);
            handleMiningComplete();
        }, remainingTime * 1000);
    };

    const handleMiningComplete = () => {
        setIsMining(false);
        setShowClaimButton(true);
        setTimeLeft(0);
        localStorage.removeItem(`miningStartTime_${id}`);
        localStorage.setItem(`showClaimButton_${id}`, "true");
    };

    const handleMining = async () => {
        if (!id) return;

        setIsMining(true);
        const startTime = Date.now();
        localStorage.setItem(`miningStartTime_${id}`, startTime.toString());
        startMiningTimer(10);
    };

    const handleClaim = async () => {
        if (!id || !currentUser) return;

        try {
            const newBalance = parseFloat((currentUser.balance + balanceMining).toFixed(4));
            await updateUserBalance(id, newBalance);
            await triggerGetUserByIdQuery(id);
            setShowClaimButton(false);
            setIsMining(false);
            setBalanceMining(0);
            setBalance(newBalance);
            localStorage.removeItem(`miningStartTime_${id}`);
            localStorage.removeItem(`miningTimeLeft_${id}`);
            localStorage.removeItem(`miningBalance_${id}`);
            localStorage.removeItem(`showClaimButton_${id}`);
        } catch (error) {
            console.log(error);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            {isMining ? (
                <div>Оставшееся время: {formatTime(timeLeft)}</div>
            ) : (
                <>
                    {!showClaimButton && <Button onClick={handleMining}>Майнинг</Button>}
                    {showClaimButton && (
                        <>
                            <div>Намайненный баланс: {balanceMining.toFixed(4)}</div>
                            <Button onClick={handleClaim}>Собрать</Button>
                        </>
                    )}
                </>
            )}
        </>
    );
};
