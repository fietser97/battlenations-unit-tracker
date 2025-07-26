import { describe, it, expect, vi, beforeEach } from 'vitest';
import '../src/js/tracking.js';

describe('updateTracking', () => {
    let mockLocalStorage;
    let mockGetStoredTrackingData;
    global.unitData = [
        { unit_name: 'Sniper', rank: 1 },
        { unit_name: 'Sniper', rank: 2 },
        { unit_name: 'Soldier', rank: 1 },
    ];
    global.getStoredTrackingData = () => ({});
    beforeEach(() => {
        mockLocalStorage = {
            data: {},
            setItem: vi.fn(function (key, value) {
                this.data[key] = value;
            }),
        };

        mockGetStoredTrackingData = vi.fn(() => ({}));

        global.localStorage = mockLocalStorage;
    });

    it('updates ranked unit correctly', () => {
        updateTracking('Sniper', 'ranked', true, 2);

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'unitTracking',
            JSON.stringify({ 'Sniper::2': { ranked: true } })
        );
    });

    it('updates owned status for all ranks', () => {
        unitData = [
            { unit_name: 'Sniper', rank: 1 },
            { unit_name: 'Sniper', rank: 2 }
        ];

        updateTracking('Sniper', 'owned', true, null);

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'unitTracking',
            JSON.stringify({
                'Sniper::1': { owned: true },
                'Sniper::2': { owned: true }
            })
        );
    });
});