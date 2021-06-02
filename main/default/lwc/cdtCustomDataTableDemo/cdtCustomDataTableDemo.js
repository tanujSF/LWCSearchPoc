import { LightningElement, track } from 'lwc';

export default class cdtCustomDataTableDemo extends LightningElement {
    
    columns = [
        { label: 'Name', fieldName: 'Name', editable: true},
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

    @track data = [
        { id: 1, Name: 'Burlington Textiles', customField: 1, Rating: 'Hot'},
        { id: 2, Name: 'Ab Corp & Gas, UK', customField: 2, Rating: 'Cold'},
        { id: 3, Name: 'Alpha Dynamics', customField: 3, Rating: 'Hot'},
        { id: 4, Name: 'Northern Trail Travel', customField: 4, Rating: 'Cold'}

    ];
    
    handleCustomButtonAction(event) {
        const { recordId, newcustomButtonValue } = event.detail;
        console.log('CUSTOM Button Field' + recordId + ' - ' + newcustomButtonValue);
        this.data.find(item => item.id == recordId).customField = newcustomButtonValue;
        this.data = [...this.data];
    }
}