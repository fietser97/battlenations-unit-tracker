fetch('data/unit_data.json')
    .then(res => res.json())
    .then(data => {
        $('#unitTable').DataTable({
            data,
            columns: [
                { data: 'unit_name' },
                { data: 'rank' },
                { data: 'sp' },
                { data: 'promotion_reward' },
                { data: 'unit_type' },
                { data: 'unlock_level' },
                { data: 'building_requirement' },
                { data: 'other_requirements' },
                { data: 'requires_nanopods' },
                { data: 'category' }
            ]
        });
    });