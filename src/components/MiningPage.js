// src/components/MiningPage.js
import React from 'react';
import { useStartMiningSessionMutation, useEndMiningSessionMutation } from '../app/services/miningApi.ts';

const MiningPage = () => {
    const [startMiningSession] = useStartMiningSessionMutation();
    const [endMiningSession] = useEndMiningSessionMutation();

    const handleStartMining = async () => {
        try {
            await startMiningSession({ userId: '123', speed: 'fast' });
        } catch (error) {
            console.error('Failed to start mining session', error);
        }
    };

    const handleEndMining = async () => {
        try {
            await endMiningSession('sessionId123');
        } catch (error) {
            console.error('Failed to end mining session', error);
        }
    };

    return (
        <div>
            <button onClick={handleStartMining}>Start Mining</button>
            <button onClick={handleEndMining}>End Mining</button>
        </div>
    );
};

export default MiningPage;
