const isBoolean = obj => typeof obj === 'boolean';
const isObject = obj => typeof obj === 'object' && !Array.isArray(obj);
const isArray = obj => Array.isArray(obj);

function filterArgs(rules, args, defaultValue = true) {
    defaultValue = isBoolean(rules['*']) ? rules['*'] : defaultValue || defaultValue;

    Object.keys(args).forEach(key => {
        if (isObject(args[key])) {
            //console.log('IS_OBJECT', {key, defaultValue});
            if (isBoolean(rules[key])) {
                if (rules[key] === false) {
                    delete args[key];
                }
            } else if (isObject(rules[key])) {
                filterArgs(rules[key], args[key], defaultValue);
            }
        } else if (isArray(args[key])) {
            //console.log('IS_ARRAY', rules[key], '---', {key, defaultValue});
            if (isBoolean(rules[key])) {
                if (rules[key] === false) {
                    delete args[key];
                }
            } else {
                args[key].forEach((item, index) => {
                    if (isObject(rules[key])) {
                        filterArgs(rules[key], args[key][index], defaultValue)
                    } else if (isArray(rules[key])) {
                        throw new Error(`Rule can't be an array`)
                    } else {
                        if (defaultValue === false) {
                            args[key][index] = {};
                        }
                    }
                })
            }
        } else {
            //console.log('OTHER', {key, defaultValue});
            if (isBoolean(rules[key])) {
                if (rules[key] === false) {
                    delete args[key];
                }
            } else {
                if (defaultValue === false) {
                    delete args[key];
                }
            }
        }

    })
}

module.exports = {
    filterArgs: filterArgs,
    deny: false,
    allow: true,
};
