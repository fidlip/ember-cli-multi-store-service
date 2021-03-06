import Ember from 'ember';
import DS from 'ember-data';
import getOwner from 'ember-getowner-polyfill';

export default Ember.Service.extend({
    /**
     * This is an observable array for keeping track of stores.
     *
     * @member {Ember.NativeArray}
     */
    storeNames: null,

    /**
     * Init function, just initialize the list of store names.
     */
    init() {
        Ember.set(this, 'storeNames', Ember.A());
        this._super(...arguments);
    },

    /**
     * Check is a store name is registered.
     *
     * @function isStoreRegistered
     * @param {string} name - The name of the store
     * @returns {boolean}
     */
    isStoreRegistered(name) {
        return Ember.get(this, 'storeNames').indexOf(name) !== -1;
    },

    /**
     * Register a new store name.
     *
     * @function registerStore
     * @param {string} name - The name of the store
     * @returns {boolean}
     */
    registerStore(name, options) {
        const storeNames = Ember.get(this, 'storeNames');

        if (storeNames.indexOf(name) === -1) {
            let owner = getOwner(this);
            let store = owner.lookup("service:store")
            let storeInstance = Object.create(Ember.get(store, "constructor")).extend({
              name: name
            }, options || {});
            owner.register(`store:${name}`, storeInstance);
            storeNames.pushObject(name);
            return true;
        }
        return false;
    },

    /**
     * Unregister a store name.
     *
     * @function unregisterStore
     * @param {string} name - The name of the store
     * @returns {boolean}
     */
    unregisterStore(name) {
        const storeNames = Ember.get(this, 'storeNames');

        if (storeNames.indexOf(name) !== -1) {
            getOwner(this).unregister(`store:${name}`);
            storeNames.removeObject(name);
            return true;
        }
        return false;
    },

    /**
     * Get a registered store by name.
     *
     * @function getStore
     * @param {string} name - The name of the store
     * @returns {boolean}
     */
    getStore(name) {
        return getOwner(this).lookup(`store:${name}`);
    },

    /**
     * Change the store that the Ember Inspector uses.
     *
     * NOTE: This will probably stop working on some Ember Data update, but it should only be used for debugging anyway.
     *
     * @function switchInspectorStore
     * @param {string} [name] - The name of the store
     */
    switchInspectorStore(name) {
        const store = name ?
            this.getStore(name) :
            getOwner(this).lookup('service:store');

        let dataAdapter = getOwner(this).lookup('data-adapter:main');
        dataAdapter.set('store', store);
    }
});
