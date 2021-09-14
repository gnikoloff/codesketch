import Exoskeleton from 'exoskeleton';

import Router from './router/Router.js';
import WorkCollection from './collections/WorkCollection';

import DATA from './DATA'

const collection = new WorkCollection(DATA);
new Router(collection);
Exoskeleton.history.start();     

