function filterArgs(rules, args, denyByDefault) {
    const denyByDefaultCurrent = denyByDefault || (rules ? rules["__deny_by_default"] || false : false);
    for (let item in args) {
        if (denyByDefaultCurrent === true) {
            if (!rules || !rules[item] || rules[item] === false) {
                delete args[item];
            }
        } else {
            if (rules && rules[item] === false) {
                delete args[item];
            }
        }

        if (typeof args[item] == "object" && !Array.isArray(args[item])) {
            filterArgs(rules[item], args[item], denyByDefaultCurrent);
        }
    }
    return "No Node Present";
}

module.exports.filterArgs = filterArgs;
