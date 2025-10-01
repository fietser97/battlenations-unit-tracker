let unitData = [];
let unlockSlider;
let rankSlider;
let seenUnitNames = new Set();

const excludeOthers = new Set([
    "The Ridgy-Didge",
    "Promotional",
    "SpecOps CenterPromotional",
    "Mercenary Vault",
    "Missile Silo",
    "The Way to a Bigfoot's Heart...",
    "Research Lab",
    "Drop fromAncient ConstructorExperiment X17",
    "Drop fromSpiderwasp Queen",
    "Drop fromGoliath Tank",
    "SCRAM, For Kids",
    "The Frontier Jubilee Charity Drive",
    "Boss Strike",
    "Arena Challenge 1"
]);

document.addEventListener('DOMContentLoaded', function () {
    // Unlock level range filtering
    unlockSlider = document.getElementById('unlock-level-slider');
    noUiSlider.create(unlockSlider, {
        start: [0, 46],
        connect: true,
        step: 1,
        tooltips: true,
        stateSave: true,
        range: {
            min: 0,
            max: 70
        },
        format: {
            to: value => Math.round(value),
            from: value => Number(value)
        }
    });

    rankSlider = document.getElementById('unlock-rank-slider');
    noUiSlider.create(rankSlider, {
        start: [0, 46],
        connect: true,
        step: 1,
        tooltips: true,
        stateSave: true,
        range: {
            min: 0,
            max: 70
        },
        format: {
            to: value => Math.round(value),
            from: value => Number(value)
        }
    });

    fetch('data/unit_data.json')
        .then(res => res.json())
        .then(data => {
            unitData = data;
            populateFilters();
            initTable(data);

            $('select').formSelect();
            $('#rank-filter').formSelect();

            $('select').on('change', filterTable);
            const unlockDisplay = document.getElementById('unlock-range-display');
            unlockSlider.noUiSlider.on('update', function (values) {
                unlockDisplay.textContent = `Level: ${values[0]} - ${values[1]}`;
                table.draw();
            });
            const rankDisplay = document.getElementById('unlock-rank-display');
            rankSlider.noUiSlider.on('update', function (values) {
                rankDisplay.textContent = `Unlock rank: ${values[0]} - ${values[1]}`;
                table.draw();
            })
            $('#unitTable').on('change', '.owned-checkbox, .ranked-checkbox', function () {
                seenUnitNames = new Set();
                table.draw();
            });

            $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                if (dataIndex === 0) {
                    seenUnitNames = new Set();
                }
                const row = unitData[dataIndex];
                if (!row) return false;

                // Unlock level
                let [min, max] = [1, 100];
                if (unlockSlider?.noUiSlider) {
                    [min, max] = unlockSlider.noUiSlider.get().map(Number);
                }
                let [rMin, rMax] = [1, 100];
                if (rankSlider?.noUiSlider) {
                    [rMin, rMax] = rankSlider.noUiSlider.get().map(Number);
                }
                let level = row.unlock_level;
                let unlockRankLevel = row.pre_req_rank;
                if (isNaN(level) || level === null || level === undefined) {
                    level = 1;
                }
                if (isNaN(unlockRankLevel) || unlockRankLevel === null || unlockRankLevel === undefined) {
                    unlockRankLevel = 1;
                }
                if (level < min || level > max) return false;
                if (unlockRankLevel < rMin || unlockRankLevel > rMax) return false;
                // Rank
                const selectedRanks = $('#rank-filter').val();
                if (selectedRanks?.length && !selectedRanks.includes(row.rank)) return false;

                // Building / Other / Category
                const selected = (id) => Array.from(document.getElementById(id).selectedOptions).map(opt => opt.value);
                const buildingFilter = selected('building_filter');
                const otherFilter = selected('other_filter');
                const categoryFilter = selected('category_filter');
                const nanopodVal = document.getElementById("nanopods_filter").value;

                const matchBuilding = buildingFilter.length === 0 || buildingFilter.includes(row.building_requirement);
                const matchOther = otherFilter.length === 0 || otherFilter.includes(row.other_requirements);
                const matchCategory = categoryFilter.length === 0 || categoryFilter.includes(row.category);
                const matchNano =
                    nanopodVal === "all" ||
                    (nanopodVal === "true" && row.requires_nanopods) ||
                    (nanopodVal === "false" && !row.requires_nanopods);

                // Owned / Ranked
                const tracking = getStoredTrackingData();
                const key = `${row.unit_name}::${row.rank}`;
                const status = tracking[key] || {};
                const filterOwned = $('#filter-owned').prop('checked');
                const filterRanked = $('#filter-ranked').prop('checked');
                const ownedPass = !filterOwned || status.owned;
                const rankedPass = !filterRanked || !status.ranked;

                // Unique unit name filter
                const uniqueOnly = $('#filter-unique').prop('checked');
                if (uniqueOnly && !isUnique(row.unit_name)) return false;

                return matchBuilding && matchOther && matchCategory && matchNano && ownedPass && rankedPass;
            });

            $('#filter-owned, #filter-ranked').on('change', () => table.draw());
            drawTable();
        });

});
document.getElementById('currentVersionBtn').addEventListener('click', () => {
    // 1. Set unlock level slider max to 46, min remains 1
    unlockSlider.noUiSlider.set([0, 46]);
    rankSlider.noUiSlider.set([0, 46]);

    // 2. Select "other_requirements" all options except excluded ones
    const otherFilter = document.getElementById('other_filter');

    // First deselect all
    for (const option of otherFilter.options) {
        option.selected = false;
    }

    // Select options NOT in excludeOthers
    for (const option of otherFilter.options) {
        if (!excludeOthers.has(option.value)) {
            option.selected = true;
        }
    }

    // Refresh the Materialize select UI
    if (M?.FormSelect) {
        M.FormSelect.getInstance(otherFilter)?.destroy();
        M.FormSelect.init(otherFilter);
    }

    // Finally redraw the table with new filters applied
    table.draw();
});
// Theme toggle
document.getElementById("themeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
});

document.getElementById('exportData').addEventListener('click', exportData);
document.getElementById('importDataBtn').addEventListener('click', () => {
    document.getElementById('importData').click();
});
document.getElementById('importData').addEventListener('change', function (e) {
    importData(e.target.files[0]);
});
// Import
// Owned controls
$('#owned-select-all').on('click', () => updateOwnedCheckboxes(true));
$('#owned-deselect-all').on('click', () => updateOwnedCheckboxes(false));

// Ranked controls
$('#ranked-select-all').on('click', () => updateRankedCheckboxes(true));
$('#ranked-deselect-all').on('click', () => updateRankedCheckboxes(false));

// Helper functions
function updateOwnedCheckboxes(checked) {
    $('#unitTable tbody tr:visible .owned-checkbox').each(function () {
        if ($(this).prop('checked') !== checked) {
            const unit = $(this).data('unit');
            updateTracking(unit, 'owned', checked);
        }
    });
    drawTable();
}

function updateRankedCheckboxes(checked) {
    $('#unitTable tbody tr:visible .ranked-checkbox').each(function () {
        if ($(this).prop('checked') !== checked) {
            const unit = $(this).data('unit');
            const rank = $(this).data('rank');
            updateTracking(unit, 'ranked', checked, rank);
        }
    });
    drawTable();
}

$('#filter-unique').on('change', () => table.draw());

document.getElementById('clear-filters').addEventListener('click', () => {
    // Reset all select filters
    clearFilters();
});

document.getElementById('clear-all').addEventListener('click', () => {
    // Clear localStorage tracking
    localStorage.removeItem('unitTracking');

    // Also reset filters
    clearFilters(true);

    // Uncheck all checkboxes visually
    $('.owned-checkbox, .ranked-checkbox').prop('checked', false);
    $('#username').val("")

    drawTable();
});

function isUnique(unitName) {
    if (seenUnitNames.has(unitName)) {
        return false;
    } else {
        seenUnitNames.add(unitName);
        return true;
    }
}

function drawTable() {
    document.getElementById('torank-count').textContent = `${countTotalRanksTodo()}`;
    document.getElementById('owned-count').textContent = `${countOwnedUnits()}`;
    document.getElementById('ranked-count').textContent = `${countRankedUnits()}`;
    table.draw();
}

function clearFilters(noReload = false) {
    const filters = ['building_filter', 'other_filter', 'category_filter', 'rank-filter', 'nanopods_filter'];
    filters.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el.multiple) el.value = null;
            else el.value = 'all';
            M.FormSelect.getInstance(el)?.destroy();
            M.FormSelect.init(el);
        }
    });

    // Reset range
    if (unlockSlider?.noUiSlider) {
        unlockSlider.noUiSlider.set([0, 70]);
    }
    if (rankSlider?.noUiSlider) {
        rankSlider.noUiSlider.set([0, 100]);
    }
    // Uncheck owned/ranked filters
    $('#filter-owned').prop('checked', false);
    $('#filter-ranked').prop('checked', false);
    $('#filter-unique').prop('checked', false);
    if (noReload === false) {
        table.draw();
    }
}

function populateFilters() {
    const addOptions = (id, values) => {
        const select = document.getElementById(id);
        values.forEach(v => {
            const opt = document.createElement("option");
            opt.value = v;
            opt.textContent = v || "(none)";
            select.appendChild(opt);
        });
    };

    const uniqueVals = (field) =>
        [...new Set(unitData.map(d => d[field]).filter(v => v !== undefined))];

    addOptions("building_filter", uniqueVals("building_requirement"));
    addOptions("other_filter", uniqueVals("other_requirements"));
    addOptions("category_filter", uniqueVals("category"));
}


function getCurrentFilters() {
    return {
        building_filter: $('#building_filter').val(),
        other_filter: $('#other_filter').val(),
        category_filter: $('#category_filter').val(),
        nanopods_filter: $('#nanopods_filter').val(),
        rank_filter: $('#rank-filter').val(),
        filter_owned: $('#filter-owned').prop('checked'),
        filter_ranked: $('#filter-ranked').prop('checked'),
        unlock_level_range: unlockSlider.noUiSlider.get().map(Number),
        rank_slider: rankSlider.noUiSlider.get().map(Number),
        username: $('#username').prop('value'),
    };
}

function setFilters(filters) {
    if (!filters) return;
    $('#building_filter').val(filters.building_filter).formSelect();
    $('#other_filter').val(filters.other_filter).formSelect();
    $('#category_filter').val(filters.category_filter).formSelect();
    $('#nanopods_filter').val(filters.nanopods_filter).formSelect();
    $('#rank-filter').val(filters.rank_filter).formSelect();
    $('#filter-owned').prop('checked', filters.filter_owned);
    $('#filter-ranked').prop('checked', filters.filter_ranked);
    $('#username').val(filters.username);
    if (filters.unlock_level_range && filters.unlock_level_range.length === 2) {
        unlockSlider.noUiSlider.set(filters.unlock_level_range);
    }
    if (filters.rank_slider && filters.rank_slider.length === 2) {
        rankSlider.noUiSlider.set(filters.rank_slider);
        rankSlider.noUiSlider.set(filters.rank_slider);
    }
}

function filterTable() {
    if (table && typeof table.draw === 'function') {
        table.draw();
    } else {
        console.error('Unable to draw table');
    }
}

function highlight(row) {
    row.addClass('highlight-change');
    setTimeout(() => row.removeClass('highlight-change'), 500);
}

function getUserName() {
    let username = $('#username').val();
    if (username) {
        return username;
    } else {
        return 'unknown';
    }
}