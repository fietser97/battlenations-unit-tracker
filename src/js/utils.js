function getStoredValue(unitName, field, rank) {
    const data = getStoredTrackingData();
    const key = `${unitName}::${rank}`;
    return data[key]?.[field] || false;
}
function getStoredTrackingData() {
    return JSON.parse(localStorage.getItem('unitTracking') || '{}');
}