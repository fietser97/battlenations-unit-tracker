let table;

function initTable(unitData){
    table = $('#unitTable').DataTable({
        data: unitData,
        pageLength: 100,
        responsive: true,
        order: [[2, 'asc']],
        columns: [
            {data: 'unit_name', title: 'Unit Name'},
            {data: 'rank', title: 'Rank'},
            {data: 'sp', title: 'SP'},
            {data: 'sp_reward', title: 'SP on Kill'},
            {data: 'promotion_reward', title: 'Promotion Reward'},
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
            },
            {data: 'unlock_level', title: 'Unit Unlock Level'},
            {data: 'pre_req_rank', title: 'Pre-Rank requirement'},
            {data: 'category', title: 'Category'},
            {data: 'unit_type', title: 'Unit Type'},
            {data: 'building_requirement', title: 'Building Requirement'},
            {data: 'other_requirements', title: 'Other Requirements'},

            {
                data: 'requires_nanopods',
                title: 'Requires Nanopods',
                render: data => data ? 'Yes' : 'No'
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
                highlight($(this).closest('tr'));
                document.getElementById('torank-count').textContent = `${countTotalRanksTodo()}`;
                document.getElementById('owned-count').textContent = `${countOwnedUnits()}`;
            });
            $('#unitTable .ranked-checkbox').off().on('change', function () {
                const unit = $(this).data('unit');
                const rank = $(this).data('rank');
                highlight($(this).closest('tr'));
                updateTracking(unit, 'ranked', this.checked, rank); // Specific rank only
                document.getElementById('ranked-count').textContent = `${countRankedUnits()}`;
            });
        }
    });
}