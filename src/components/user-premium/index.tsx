import React from 'react';
import { Button } from "@nextui-org/react";

interface UserPremiumProps {
    userId: string;
    isPremium: boolean;
    onPremiumChange: (isPremium: boolean) => void;
}

const UserPremium: React.FC<UserPremiumProps> = ({ userId, isPremium, onPremiumChange }) => {
    const handleGetPremium = async () => {
        if (!userId) return;

        try {
            const token = localStorage.getItem("token"); // Предполагается, что токен хранится в localStorage
            if (!token) {
                throw new Error("Token not found");
            }

            const response = await fetch(`http://localhost:3000/api/premium/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isPremium: true }),
            });

            if (!response.ok) {
                throw new Error("Failed to update premium status");
            }

            onPremiumChange(true);
        } catch (error) {
            console.error("Error updating premium status:", error);
        }
    };

    return (
        <>
            {!isPremium && (
                <Button onClick={handleGetPremium}>Активировать премиум</Button>
            )}
            {isPremium && (
                <div className="mt-4">
                    <h3 className="text-xl font-bold">Премиум-функции:</h3>
                    <Button color="primary" variant="flat" onClick={() => alert("Премиум-функция 1")}>
                        Премиум-функция 1
                    </Button>
                    <Button color="primary" variant="flat" onClick={() => alert("Премиум-функция 2")}>
                        Премиум-функция 2
                    </Button>
                </div>
            )}
        </>
    );
};

export default UserPremium;
