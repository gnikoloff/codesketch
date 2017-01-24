import Exoskeleton from 'exoskeleton';

import Layout from '../views/Layout.js';

const Router = Exoskeleton.Router.extend({

    layout: null,

    singleOpen: false,
    initialLoad: false,

    initialize (collection) {
        this.layout = new Layout(collection);
    },

    routes: {
        ''            : 'showIndex', 
        'sketch/:key': 'showSingle'
    },

    showIndex () {
        if (this.singleOpen === true) {
            this.layout.closeSingle();
            this.singleOpen = false;
        }
        if (this.initialLoad === false) {
            this.layout.showLoading();
        } else {
            this.layout.showQuickLoad();
        }
        this.initialLoad = true;
    },

    showSingle (key) {
        this.singleOpen = true;
        this.initialLoad = true;
        this.layout.openSingle(key);
    }

});

export default Router;