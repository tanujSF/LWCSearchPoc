import { LightningElement, track } from 'lwc';

export default class cdtCustomDataTableDemo extends LightningElement {
    
    @track data = [];
    //have this attribute to track data changed
    //with custom picklist or custom lookup
    @track draftValues = [];

    lastSavedData = [];
    connectedCallback() {
    this.columns = [
        { label: 'Name', fieldName: 'Name'},
        { label: 'Custom Button', fieldName: 'id', type: 'customAction', typeAttributes: {
            customButtonValue: { fieldName: 'customField' }
            }
        },
        { label: 'Rating', fieldName: 'Rating', type: 'picklist', typeAttributes: {
            placeholder: 'Choose rating', options: [
                { label: 'Hot', value: 'Hot' },
                { label: 'Warm', value: 'Warm' },
                { label: 'Cold', value: 'Cold' },
            ] // list of all picklist options
            , value: { fieldName: 'Rating' },
            context: { fieldName: 'Id' } // binding account Id with context variable to be returned back
            }
    }
    ];

     this.data = [
        { id: 1, Name: 'Burlington Textiles', customField: 1, Rating: 'Hot'},
        { id: 2, Name: 'Ab Corp & Gas, UK', customField: 2, Rating: 'Cold'},
        { id: 3, Name: 'Alpha Dynamics', customField: 3, Rating: 'Hot'},
        { id: 4, Name: 'Northern Trail Travel', customField: 4, Rating: 'Cold'}

    ];

    this.lastSavedData = JSON.parse(JSON.stringify(this.data));

}
    handleCustomButtonAction(event) {
        const { recordId, newcustomButtonValue } = event.detail;
        console.log('CUSTOM Button Field' + recordId + ' - ' + newcustomButtonValue);
        this.data.find(item => item.id == recordId).customField = newcustomButtonValue;
        this.data = [...this.data];
    }

    updateDataValues(updateItem) {
        let copyData = [... this.data];
        copyData.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });

        //write changes back to original data
        this.data = [...copyData];
    }

    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = [...this.draftValues];
        //store changed value to do operations
        //on save. This will enable inline editing &
        //show standard cancel & save button
        copyDraftValues.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });

        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }

    //listener handler to get the context and data
    //updates datatable
    picklistChanged(event) {
        event.stopPropagation();
        let dataRecieved = event.detail.data;
        let updatedItem = { Id: dataRecieved.context, Rating: dataRecieved.value };
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
    }
}