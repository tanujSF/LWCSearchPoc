import { LightningElement, api } from 'lwc';

export default class cdtCustomAction extends LightningElement {

    @api recordId;
    @api customButtonValue;

    fireCustomButtonAction() {
        let newcustomButtonValue = this.customButtonValue + 1;
        const event = new CustomEvent('custombuttonaction', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                recordId: this.recordId,
                newcustomButtonValue: newcustomButtonValue
            },
        });
        this.dispatchEvent(event);
    }
}