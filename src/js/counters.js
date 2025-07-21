function countRankedUnits() {
    const tracking = getStoredTrackingData();
    return Object.values(tracking).filter(u => u.ranked).length;
}

function countTotalRanksTodo() {
    const tracking = getStoredTrackingData();
    return Object.values(tracking).filter(u => u.owned).length - countRankedUnits();
}

function countOwnedUnits() {
    const tracking = getStoredTrackingData();
    let unique = new Set();
    for (const unit in tracking) {
        const [unitName] = unit.split('::');
        if (tracking[unit].owned) unique.add(unitName);

    }
    return unique.size;
}