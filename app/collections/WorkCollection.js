import Exoskeleton from 'exoskeleton';

import WorkModel from '../models/WorkModel';

const WorkCollection = Exoskeleton.Collection.extend({
    model: WorkModel
}); 

export default WorkCollection;