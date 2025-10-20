function exportData() {
    const trackingData = getStoredTrackingData();
    for (const [key, value] of Object.entries(trackingData)) {
        if (value['ranked'] === true && !value['date']) {
            console.log("no date");
            trackingData[key]['ranked-date'] = new Date().toISOString().split('.')[0] + 'Z';
        }
    }

    const data = {
        tracking: trackingData,
        filters: getCurrentFilters()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unitTracking_${getUserName()}_${new Date().toISOString().replace(/[:T]/g, '-').split('.')[0]}.json`;
    a.click();
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (!imported.tracking) throw new Error("Missing 'tracking'");
            localStorage.setItem('unitTracking', JSON.stringify(imported.tracking));
            if (imported.filters) setFilters(imported.filters);
            drawTable();
        } catch (e) {
            console.error(e);
            alert('Invalid file format.');
        }
    };
    reader.readAsText(file);
}