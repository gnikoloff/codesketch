import Exoskeleton from 'exoskeleton';
import Tabletop from 'tabletop';

import Router from './router/Router.js';
import WorkCollection from './collections/WorkCollection';

Tabletop.init({
    key: '1EIXyPeXI3KtIbD_Cr5ZMgkb2gdRJP1jwb4cPCylRyE0',
    callback: (data) => {
        const collection = new WorkCollection(data);
        new Router(collection);
        Exoskeleton.history.start();     
    },
    simpleSheet: true
});