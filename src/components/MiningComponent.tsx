import React from 'react';
import { useStartMiningSessionMutation, useEndMiningSessionMutation } from '../app/services/miningApi';

const MiningComponent: React.FC = () => {
    const [startMiningSession, { isLoading: isStarting }] = useStartMiningSessionMutation();
    const [endMiningSession, { isLoading: isEnding }] = useEndMiningSessionMutation();

    const handleStartMining = async () => {
        try {
            await startMiningSession({ userId: 'user123', speed: '100' });
            console.log('Mining session started');
        } catch (error) {
            console.error('Failed to start mining session', error);
        }
    };

    const handleEndMining = async () => {
        try {
            await endMiningSession('session123');
            console.log('Mining session ended');
        } catch (error) {
            console.error('Failed to end mining session', error);
        }
    };

    return (
        <div>
            <button onClick={handleStartMining} disabled={isStarting}>
                {isStarting ? 'Starting...' : 'Start Mining'}
            </button>
            <button onClick={handleEndMining} disabled={isEnding}>
                {isEnding ? 'Ending...' : 'End Mining'}
            </button>
        </div>
    );
};

export default MiningComponent;
