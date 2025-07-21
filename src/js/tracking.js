function updateTracking(unitName, field, value, rank = null) {
    const data = getStoredTrackingData();

    if (field === 'ranked' && rank !== null) {
        // Only update specific rank
        const key = `${unitName}::${rank}`;
        if (!data[key]) data[key] = {};
        data[key][field] = value;

        localStorage.setItem('unitTracking', JSON.stringify(data));
        $(`.${field}-checkbox[data-unit="${unitName}"][data-rank="${rank}"]`).prop('checked', value);

    } else if (field === 'owned') {
        // Update all ranks of this unit
        unitData.forEach(unit => {
            if (unit.unit_name === unitName) {
                const key = `${unit.unit_name}::${unit.rank}`;
                if (!data[key]) data[key] = {};
                data[key][field] = value;
            }
        });

        localStorage.setItem('unitTracking', JSON.stringify(data));
        $(`.${field}-checkbox[data-unit="${unitName}"]`).prop('checked', value);
    }
}