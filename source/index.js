/* eslint-disable no-sync */
// eslint-disable-next-line max-params
(function main(Airtable, CONTENT_BASE_ID) {
    const timeout = 5; // minutes
    return module.exports = push_to_airtable;

    // -----------

    /* eslint-disable max-statements */
    function push_to_airtable(params, log) {
        const { api_key, list, place_list } = validate_params(params);
        const base = new Airtable({ apiKey: api_key }).base(CONTENT_BASE_ID);
        let is_remote_place_list_processed = false;

        const list_table = base('Lists');
        const list_query_criteria = {
            filterByFormula: `slug = '${ list.replace(/\W/g, '_') }'`,
            fields: [],
            maxRecords: 1,
            }; // eslint-disable-line indent
        let list_id;

        const place_table = base('Places');
        // const google_place_ids = place_list.map();
        const place_select_criteria = {
            // filterByFormula:
            //    `FIND(google_place_id, [ '${ google_place_ids }' ])`
            //    , // eslint-disable-line indent
            fields: [ 'title', 'google_place_id', 'list_list' ],
            }; // eslint-disable-line indent
        const remote_place_dict = {};
        return new Promise(push);

        function push(resolve) {
            const list_query = list_table.select(list_query_criteria);
            // debugger;
            list_query.firstPage(process_list_result);
            const place_query = place_table.select(place_select_criteria);
            // debugger;
            place_query.all(process_place_result);
            setTimeout(bail, timeout * 60 * 1000);
            return true;

            // -----------

            function process_list_result(exception, list_result) {
                // debugger;
                if (exception) {
                    throw exception;
                }
                if (0 === list_result.length) {
                    return resolve(new Error(
                        `⛔️  Could not find a list with the slug "${ list }"`,
                        )); // eslint-disable-line indent
                }
                list_id = list_result[0].id;
                upsert_place_list();
                return true;
            }

            function process_place_result(exception, remote_place_list) {
                // debugger;
                if (exception) {
                    throw exception;
                }
                log && log('📍  Processing existing places');
                for (const place of remote_place_list) {
                    const { title, google_place_id } = place.fields;
                    log && log(`   ${ title }`, 'verbose');
                    remote_place_dict[google_place_id] = place.id;
                }
                is_remote_place_list_processed = true;
                return upsert_place_list();
            }

            function upsert_place_list() {
                if (list_id && is_remote_place_list_processed) {
                    log && log('⬆️  Publishing new places info');
                    debugger;
                    for (const place of place_list) {
                        const { google_place_id } = place;
                        const airtable_id = remote_place_dict[google_place_id];
                        airtable_id
                            ? place_table.update(airtable_id, place, finish_op)
                            : place_table.create(place, finish_op)
                            ; // eslint-disable-line indent
                    }
                    return resolve(`🏁  Finished publishing!`);
                }
                return true;
            }

            function finish_op(exception, place) {
                debugger;
                if (exception) {
                    throw exception;
                }
                log && log(`   ${ place.get('title') }`, 'verbose');
                return true;
            }
            function bail() {
                return resolve(new Error(
                    `😞  Timed out after ${ timeout } minutes`,
                    )); // eslint-disable-line indent
            }
        }
    }

    // -----------

    function validate_params(params) {
        const { api_key, list, place_list } = params;
        if (!api_key || 'string' !== typeof api_key) {
            throw new Error('api_key is required and must be a string');
        } else if (!list || 'string' !== typeof list) {
            throw new Error('list is required and must be a string');
        } else if (!Array.isArray(place_list)) {
            throw new Error('place_list is required and must be an array');
        }
        return params;
    }
}(
    require('airtable'),
    'app3bZz5SQufTyuwD',
));
