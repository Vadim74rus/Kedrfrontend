import React, { useState } from 'react';
import { useGetUserBalanceQuery, useLazyGetUserBalanceQuery, useUpdateUserBalanceMutation } from '../../app/services/userApi'; // Замените на правильный путь

interface UserBalanceComponentProps {
    userId: string;
}

const UserBalanceComponent: React.FC<UserBalanceComponentProps> = ({ userId }) => {
    // Используем хук для получения баланса пользователя по userId
    const { data, isLoading } = useGetUserBalanceQuery(userId);

    // Используем ленивый хук для получения баланса пользователя по требованию
    const [triggerGetUserBalance, { isLoading: lazyIsLoading }] = useLazyGetUserBalanceQuery();

    // Используем хук для обновления баланса пользователя
    const [updateUserBalance, { data: updateData, isLoading: updateIsLoading }] = useUpdateUserBalanceMutation();

    // Состояние для хранения нового баланса, который пользователь хочет установить
    const [newBalance, setNewBalance] = useState<number | undefined>(undefined);

    // Функция для получения баланса пользователя по требованию
    const handleGetBalance = () => {
        triggerGetUserBalance(userId);
    };

    // Функция для обновления баланса пользователя
    const handleUpdateBalance = () => {
        if (newBalance !== undefined) {
            updateUserBalance({ id: userId, balance: newBalance });
        }
    };

    // Если данные загружаются, отображаем сообщение о загрузке
    if (isLoading || lazyIsLoading) return <div>Loading...</div>;

    // Отображаем текущий баланс пользователя и кнопки для получения и обновления баланса
    return (
        <div>
            <h2>User Balance</h2>
            <div>Current Balance: {data?.balance}</div>
            <button onClick={handleGetBalance}>Get Balance</button>
            <div>
                <input
                    type="number"
                    value={newBalance}
                    onChange={(e) => setNewBalance(Number(e.target.value))}
                    placeholder="New Balance"
                />
                <button onClick={handleUpdateBalance}>Update Balance</button>
            </div>
            {updateIsLoading && <div>Updating...</div>}
            {updateData && <div>Update Success: {updateData.balance}</div>}
        </div>
    );
};

export default UserBalanceComponent;
