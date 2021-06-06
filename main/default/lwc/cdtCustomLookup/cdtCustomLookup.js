/* eslint-disable no-console */
/* eslint-disable @lwc/lwc/no-async-operation */

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { api, LightningElement, track, wire } from 'lwc';

export default class LookupLwc extends LightningElement {

    @api valueId;
    @api objName = 'Account' ;
    @api iconName = 'standard:account';
    @api labelName = 'Account';
    @api readOnly = false;
    @api filters = '';
    @api showLabel = false;
    @api uniqueKey;
    @api placeholder = 'Search';
    @api displayFields = 'Name, AccountNumber';
    @api displayFormat = 'Name (AccountNumber)';
    objLabelName;

    /*Create Record Start*/
    @api createRecord;
    @track recordTypeOptions;
    @track createRecordOpen;
    @track recordTypeSelector;
    @track mainRecord;
    @track isLoaded = false;

    @track label;
    @track options; //lookup values
    @track isValue;
    @track blurTimeout;
    @track defaultValue;

    searchTerm;
    href;
    blurTimeout;

    //css
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';

    connectedCallback() {
        this.defaultValue = this.valueId;
        if (!this.displayFormat) {
            let splitFields = this.displayFields.split(',');
            this.displayFormat = splitFields[0];
        }
    }

    renderedCallback() {
        if (this.objName) {
            let temp = this.objName;
            if (temp.includes('__c')) {
                let newObjName = temp.replace(/__c/g, "");
                if (newObjName.includes('_')) {
                    let vNewObjName = newObjName.replace(/_/g, " ");
                    this.objLabelName = vNewObjName;
                } else {
                    this.objLabelName = newObjName;
                }

            } else {
                this.objLabelName = this.objName;
            }
        }
    }

    @wire(lookUp, { searchTerm: '$searchTerm', objectName: '$objName', filters: '$filters', fields: '$displayFields' })
    wiredRecords({ error, data }) {
        if (data) {
            this.error = undefined;
            this.options = [];
            data.forEach(item => {
                let option = { ...item };
                option.label = this.generateLabel(option);
                this.options.push(option);
            });
        } else if (error) {
            this.error = error;
        }
    }

    @wire(lookUp, { recordId: '$valueId', objectName: '$objName', fields: '$displayFields' })
    wiredDefault({ error, data }) {
        if (data) {
            if (this.valueId) {
                this.selectItem(data[0]);
                this.options = undefined;
            }
        } else if (error) {
            this.error = error;
        }
    }

    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    inblur() {
        this.blurTimeout = setTimeout(() => { this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus' }, 300);
    }

    onSelect(event) {
        let ele = event.currentTarget;
        let selectedId = ele.dataset.id;
        let key = this.uniqueKey;

        this.dispatchEvent(new CustomEvent('valueselect', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                data: { selectedId, key },
            }
        }));

        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }

        this.options.forEach(option => {
            if (option.Id === selectedId) {
                this.selectItem(option);
            }
        });
    }

    selectItem(record) {
        //show selection value on screen
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        this.label = this.generateLabel(record);
        this.href = '/' + record.Id;
        this.isValue = true;
        this.options = undefined;
    }

    generateLabel(record) {
        console.log('record', record);
        let label = this.displayFormat;
        let splitFields = this.displayFields.split(',');
        splitFields.forEach(field => {
            field = field.trim();
            let value;

            //logic to handle relationhships in queries
            if (field.indexOf('.') > -1) {
                let splitRelations = field.split('.');
                splitRelations.forEach(item => {
                    value = (value ? value[item] : record[item]);
                });
            } else {
                value = record[field];
            }
            label = label.replace(field, value);
        });
        return label;
    }

    onChange(event) {
        this.searchTerm = event.target.value;
    }

    handleRemovePill() {
        this.isValue = false;
        this.valueId = '';
        let selectedId = '';
        let key = this.uniqueKey;
        this.dispatchEvent(new CustomEvent('valueselect', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                data: { selectedId, key },
            }
        }));
    }

    handleError() {

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Error saving the record',
                variant: 'error',
            }),
        )
    }

    closeModal() {
        this.stencilClass = '';
        this.stencilReplacement = 'slds-hide';
        this.createRecordOpen = false;
        this.recordTypeSelector = false;
        this.mainRecord = false;
    }
}