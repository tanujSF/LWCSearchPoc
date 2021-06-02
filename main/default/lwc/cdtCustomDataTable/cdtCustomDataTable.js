import LightningDatatable from 'lightning/datatable';
import actionTemplate from './customActionTemplate';
import lookupTemplate from './customLookupTemplate';
import picklistTemplate from './customPicklistTemplate';

export default class cdtCustomDataTable extends LightningDatatable {
    static customTypes = {
        customAction: {
            template: actionTemplate,
            typeAttributes: ['recordId', 'customButtonValue']
        },
        picklist: {
            template: picklistTemplate,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context'],
        }
    };


}