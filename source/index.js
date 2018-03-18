/* eslint-disable no-sync */
// eslint-disable-next-line max-params
(function main(DATO) {
    return module.exports = push_to_dato;

    // -----------

    function push_to_dato(token,raw_json) {
        try {
            const place_list = JSON.parse(raw_json);
            if (!Array.isArray(place_list)) {
                return false;
            }
            const client = new DATO.SiteClient(token);
            for (const place of place_list) {
                // do it
            }
        } catch (exception) {
            return false;
        }
        return true;
    }
}(
    require('datocms-client'),
));
