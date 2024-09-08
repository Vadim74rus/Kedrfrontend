import React, { useState } from 'react';
import { useGetUserBalanceQuery, useUpdateUserBalanceMutation } from '../app/services/balanceApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

interface BalanceComponentProps {
    userId: string;
}

const BalanceComponent: React.FC<BalanceComponentProps> = ({ userId }) => {
    const { data, error, isLoading } = useGetUserBalanceQuery({ userId });
    const [updateUserBalance] = useUpdateUserBalanceMutation();
    const [newAmount, setNewAmount] = useState<number>(0);

    const handleUpdateBalance = async () => {
        try {
            await updateUserBalance({ userId, amount: newAmount });
            setNewAmount(0);
        } catch (error) {
            console.error('Failed to update balance', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined) => {
        if (!error) return 'Unknown error';
        if ('status' in error) {
            return `Error ${error.status}: ${String(error.data)}`;
        }
        if ('message' in error) {
            return error.message;
        }
        return 'Unknown error';
    };

    if (error) return <div>Error: {getErrorMessage(error)}</div>;

    return (
        <div>
            <p>Current Balance: {data?.amount}</p>
            <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                placeholder="Enter new amount"
            />
            <button onClick={handleUpdateBalance}>Update Balance</button>
        </div>
    );
};

export default BalanceComponent;

