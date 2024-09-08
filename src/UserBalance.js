import React from 'react';
import { useGetUserBalanceQuery } from './app/services/balanceApi.js';

const UserBalance = ({ userId }) => {
    const { data, error, isLoading } = useGetUserBalanceQuery({ userId });

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }

    return (
        <div>
            <h1>Баланс пользователя</h1>
            <p>Баланс: {data?.amount}</p>
        </div>
    );
};

export default UserBalance;
