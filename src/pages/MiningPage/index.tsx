import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStartMiningSessionMutation, useEndMiningSessionMutation } from '../../app/services/miningApi';

const MiningPage: React.FC = () => {
    const [startMiningSession, { isLoading: isStarting }] = useStartMiningSessionMutation();
    const [endMiningSession, { isLoading: isEnding }] = useEndMiningSessionMutation();
    const [miningInterval, setMiningInterval] = useState<NodeJS.Timeout | null>(null);
    const [minedCoins, setMinedCoins] = useState<number>(0);

    const handleStartMining = async () => {
        try {
            await startMiningSession({ userId: 'user123', speed: '100' });
            console.log('Mining session started');

            const interval = setInterval(() => {
                setMinedCoins((prevCoins) => prevCoins + 1);
                console.log('Mined 1 coin');
            }, 1000);

            setMiningInterval(interval);

            // Останавливаем начисление монет через 60 секунд
            setTimeout(async () => {
                clearInterval(interval);
                setMiningInterval(null);
                console.log('Mining session ended automatically after 60 seconds');

                // Сохраняем результаты в базе данных
                await saveMiningResults({ userId: 'user123', coins: minedCoins });
                console.log('Mining results saved');
            }, 60000);
        } catch (error) {
            console.error('Failed to start mining session', error);
        }
    };

    const handleEndMining = async () => {
        try {
            if (miningInterval) {
                clearInterval(miningInterval);
                setMiningInterval(null);
                console.log('Mining session ended manually');

                // Сохраняем результаты в базе данных
                await saveMiningResults({ userId: 'user123', coins: minedCoins });
                console.log('Mining results saved');
            }
            await endMiningSession('session123');
            console.log('Mining session ended');
        } catch (error) {
            console.error('Failed to end mining session', error);
        }
    };

    const saveMiningResults = async ({ userId, coins }: { userId: string; coins: number }) => {
        try {
            await axios.post('/api/saveMiningResults', { userId, coins });
        } catch (error) {
            console.error('Failed to save mining results', error);
        }
    };

    useEffect(() => {
        return () => {
            if (miningInterval) {
                clearInterval(miningInterval);
            }
        };
    }, [miningInterval]);

    return (
        <div>
            <button onClick={handleStartMining} disabled={isStarting || miningInterval !== null}>
                {isStarting ? 'Starting...' : 'Start Mining'}
            </button>
            <button onClick={handleEndMining} disabled={isEnding || miningInterval === null}>
                {isEnding ? 'Ending...' : 'End Mining'}
            </button>
            <div>Mined Coins: {minedCoins}</div>
            <div>Current Balance: {minedCoins}</div> {/* Добавлено слово "баланс" */}
        </div>
    );
};

export default MiningPage;

