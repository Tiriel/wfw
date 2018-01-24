'use strict';
const AsyncHooks = require('async_hooks');

const holder = {
    current: undefined
};

const mapping = new Map();
const hook = AsyncHooks.createHook({
    init(asyncId) {

        mapping.set(asyncId, holder.current);
    },
    before(asyncId) {

        holder.current = mapping.get(asyncId);
    },
    destroy(asyncId) {

        mapping.delete(asyncId);
    }
});
hook.enable();

module.exports.getContext = function () {

    if (holder.current === undefined) {
        holder.current = new Map();
        mapping.set(AsyncHooks.executionAsyncId(), holder.current);
    }

    return holder.current;
};
