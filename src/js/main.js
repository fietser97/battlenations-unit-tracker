let table;
let unitData = [];
let unlockSlider;
let seenUnitNames = new Set();

const excludeOthers = [
    "The Ridgy-Didge",
    "Promotional",
    "SpecOps CenterPromotional",
    "Infection Test Facility",
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
];

document.addEventListener('DOMContentLoaded', function () {
    // Unlock level range filtering
    unlockSlider = document.getElementById('unlock-level-slider');
    noUiSlider.create(unlockSlider, {
        start: [1, 46],
        connect: true,
        step: 1,
        tooltips: true,
        range: {
            min: 1,
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

            table = $('#unitTable').DataTable({
                data: unitData,
                pageLength: 100,
                responsive: true,
                order: [[2, 'asc']],
                columns: [
                    {data: 'unit_name', title: 'Unit Name'},
                    {data: 'rank', title: 'Rank'},
                    {data: 'sp', title: 'SP'},
                    {data: 'promotion_reward', title: 'Promotion Reward'},
                    {data: 'unit_type', title: 'Unit Type'},
                    {data: 'unlock_level', title: 'Unlock Level'},
                    {data: 'building_requirement', title: 'Building Requirement'},
                    {data: 'other_requirements', title: 'Other Requirements'},
                    {data: 'category', title: 'Category'},
                    {
                        data: 'requires_nanopods',
                        title: 'Requires Nanopods',
                        render: data => data ? 'Yes' : 'No'
                    },
                    {
                        data: null,
                        title: 'Owned',
                        render: function (data, type, row) {
                            const checked = getStoredValue(row.unit_name, 'owned', row.rank) ? 'checked' : '';
                            return `<label><input type="checkbox" class="owned-checkbox" data-unit="${row.unit_name}" data-rank="${row.rank}" ${checked}><span></span></label>`;
                        }
                    },
                    {
                        data: null,
                        title: 'Ranked',
                        render: function (data, type, row) {
                            const checked = getStoredValue(row.unit_name, 'ranked', row.rank) ? 'checked' : '';
                            return `<label><input type="checkbox" class="ranked-checkbox" data-unit="${row.unit_name}" data-rank="${row.rank}" ${checked}><span></span></label>`;
                        }
                    }
                ],
                drawCallback: function () {
                    const tracking = getStoredTrackingData();

                    $('#unitTable .owned-checkbox').each(function () {
                        const unit = $(this).data('unit');
                        const rank = $(this).data('rank');
                        const key = `${unit}::${rank}`;
                        const checked = tracking[key]?.owned || false;
                        $(this).prop('checked', checked);
                    });

                    $('#unitTable .ranked-checkbox').each(function () {
                        const unit = $(this).data('unit');
                        const rank = $(this).data('rank');
                        const key = `${unit}::${rank}`;
                        const checked = tracking[key]?.ranked || false;
                        $(this).prop('checked', checked);
                    });

                    // (Re)bind event handlers
                    $('#unitTable .owned-checkbox').off().on('change', function () {
                        const unit = $(this).data('unit');
                        updateTracking(unit, 'owned', this.checked);
                    });
                    $('#unitTable .ranked-checkbox').off().on('change', function () {
                        const unit = $(this).data('unit');
                        const rank = $(this).data('rank');
                        updateTracking(unit, 'ranked', this.checked, rank); // Specific rank only
                    });
                }
            });

            $('select').formSelect();
            $('#rank-filter').formSelect();

            $('select').on('change', filterTable);
            const unlockDisplay = document.getElementById('unlock-range-display');
            unlockSlider.noUiSlider.on('update', function (values) {
                unlockDisplay.textContent = `Level: ${values[0]} - ${values[1]}`;
                table.draw();
            });
            $('#unitTable').on('change', '.owned-checkbox, .ranked-checkbox', function () {
                seenUnitNames = new Set();
                table.draw();
            });
            document.getElementById('currentVersionBtn').addEventListener('click', () => {
                // 1. Set unlock level slider max to 46, min remains 1
                unlockSlider.noUiSlider.set([1, 46]);

                // 2. Select "other_requirements" all options except excluded ones
                const otherFilter = document.getElementById('other_filter');

                // First deselect all
                for (let option of otherFilter.options) {
                    option.selected = false;
                }

                // Select options NOT in excludeOthers
                for (let option of otherFilter.options) {
                    if (!excludeOthers.includes(option.value)) {
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

        });
    setTimeout(() => {
        const lengthSelect = document.querySelector('#unitTable_length select');
        if (lengthSelect && M.FormSelect.getInstance(lengthSelect)) {
            M.FormSelect.getInstance(lengthSelect).destroy();
            lengthSelect.classList.remove('browser-default'); // Optional
        }
    }, 100);

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

    function filterTable() {
        if (table && typeof table.draw === 'function') {
            table.draw();
        } else {
            console.error('Unable to draw table');
        }
    }


    $.fn.dataTable.ext.search = []; // clear previous filters

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
        let level = row.unlock_level;
        if (isNaN(level) || level === null || level === undefined) {
            level = 1;
        }
        if (level < min || level > max) return false;

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

    // Theme toggle
    document.getElementById("themeToggle").addEventListener("change", function () {
        document.body.classList.toggle("dark-mode", this.checked);
    });

    $('#exportData').on('click', () => {
        const data = {
            tracking: getStoredTrackingData(),
            filters: getCurrentFilters()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:T]/g, '-').split('.')[0]; // e.g. 2025-07-20_14-35-22
        a.href = url;
        a.download = `unitTracking_${timestamp}.json`;
        a.click();
    });

    // Import
    $('#importDataBtn').on('click', () => $('#importData').click());
    $('#importData').on('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const imported = JSON.parse(e.target.result);

                if (!imported.tracking || typeof imported.tracking !== 'object') {
                    alert('Invalid format: missing or malformed "tracking" field.');
                    return;
                }

                const allKeysValid = Object.keys(imported.tracking).every(k => k.includes('::'));
                if (!allKeysValid) {
                    alert('Import failed: All tracking keys must use "unit_name::rank" format.');
                    return;
                }

                // Store new tracking data
                localStorage.setItem('unitTracking', JSON.stringify(imported.tracking));

                if (imported.filters) {
                    setFilters(imported.filters);
                }

                table.draw(); // Redraw to apply checkbox states
            } catch (err) {
                console.error('Invalid JSON file');
            }
        };

        reader.readAsText(file);
    });

// Helpers
    function getStoredTrackingData() {
        return JSON.parse(localStorage.getItem('unitTracking') || '{}');
    }

    function getStoredValue(unitName, field, rank) {
        const data = getStoredTrackingData();
        const key = `${unitName}::${rank}`;
        return data[key]?.[field] || false;
    }

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

    function getCurrentFilters() {
        return {
            building_filter: $('#building_filter').val(),
            other_filter: $('#other_filter').val(),
            category_filter: $('#category_filter').val(),
            nanopods_filter: $('#nanopods_filter').val(),
            rank_filter: $('#rank-filter').val(),
            filter_owned: $('#filter-owned').prop('checked'),
            filter_ranked: $('#filter-ranked').prop('checked'),
            unlock_level_range: unlockSlider.noUiSlider.get().map(Number)
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
        if (filters.unlock_level_range && filters.unlock_level_range.length === 2) {
            unlockSlider.noUiSlider.set(filters.unlock_level_range);
        }
    }
})
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
            $(this).prop('checked', checked).trigger('change');
        }
    });
}

function updateRankedCheckboxes(checked) {
    $('#unitTable tbody tr:visible .ranked-checkbox').each(function () {
        if ($(this).prop('checked') !== checked) {
            $(this).prop('checked', checked).trigger('change');
        }
    });
}

$('#filter-unique').on('change', () => table.draw());

document.getElementById('clear-filters').addEventListener('click', () => {
    // Reset all select filters
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
        unlockSlider.noUiSlider.set([1, 70]);
    }

    // Uncheck owned/ranked filters
    $('#filter-owned').prop('checked', false);
    $('#filter-ranked').prop('checked', false);
    $('#filter-unique').prop('checked', false);

    table.draw();
});

document.getElementById('clear-all').addEventListener('click', () => {
    // Clear localStorage tracking
    localStorage.removeItem('unitTracking');

    // Also reset filters
    document.getElementById('clear-filters').click();

    // Uncheck all checkboxes visually
    $('.owned-checkbox, .ranked-checkbox').prop('checked', false);

    table.draw();
});

function isUnique(unitName) {
    if (seenUnitNames.has(unitName)) {
        return false;
    } else {
        seenUnitNames.add(unitName);
        return true;
    }
}
