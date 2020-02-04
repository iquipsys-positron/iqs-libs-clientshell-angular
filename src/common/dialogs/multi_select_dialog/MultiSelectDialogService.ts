import { IMultiSelectDialogService, MultiSelectDialogParams } from './IMultiSelectDialogService';
import { SearchResult } from '../../../services';

class MultiSelectDialogService implements IMultiSelectDialogService {
    public _mdDialog: angular.material.IDialogService;
    
    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }


    public show(params: MultiSelectDialogParams, successCallback?: (data?: any) => void, cancelCallback?: () => void) {
        this._mdDialog.show({
            controller: 'iqsMultiSelectDialogController',
            controllerAs: '$ctrl',
            locals: { params: params },
            bindToController: true,
            clickOutsideToClose: true,
            template:
            `<md-dialog class="pip-dialog layout-column bp0 pip-scroll iqs-multiselect-dialog" style="height: 80%" md-theme="{{$ctrl.theme}}">
                <div class="pip-header p16 divider-bottom">
                    <div class="w-stretch">
                        <h3 class="m0 bm16 w-stretch">{{ ::$ctrl.dialogTitle | translate }}</h3>
                        <iqs-global-search-panel iqs-search-query="$ctrl.status" iqs-search-callback="$ctrl.onSearchResult(query)"
                         iqs-cancel-callback="$ctrl.onCanselSearch()" iqs-default-values="$ctrl.defaultCollection" iqs-search-collection="$ctrl.searchedCollection">
                        </iqs-global-search-panel>
                    </div>
                </div>
            
                <div class="pip-body lp0 rp0">
                    <md-list class="pip-ref-list tp0">
                        <md-list-item class="pip-ref-list-item divider-bottom" md-ink-ripple ng-repeat="section in $ctrl.collection track by section.id"
                         ng-click="$ctrl.selectItem($index)">
                            <div class="pip-pic tm0" ng-if="section.item.id || section.item.name">
                                <pip-avatar class="pip-face" pip-rebind="true" pip-id="section.item.id" pip-name="section.item.name"></pip-avatar>
                            </div>
                            <div class="pip-content" ng-class="{'content-single': ($ctrl.entityType == 'control_object' || $ctrl.entityType == 'objects_and_groups') && section.object_type != $ctrl.objectType }">
                                <p class="pip-title text-overflow flex">
                                    {{ section.item.name }}
                                </p>
                                <p class="pip-subtitle text-overflow flex" ng-if="($ctrl.entityType == 'control_object' || $ctrl.entityType == 'objects_and_groups') && section.object_type == $ctrl.objectType">
                                    {{ section.item | formatObjectSubtitle }}
                                </p>
                            </div>
                            <div>
                                <md-checkbox ng-model="section.checked" class="bm0">
                                </md-checkbox>
                            </div>
                        </md-list-item>
                    </md-list>
                </div>
            
                <div class="pip-footer ">
                    <!-- <md-button ng-click="$ctrl.config()" ng-if="$ctrl.configState">{{ ::'CONFIG' | translate }}</md-button> -->
                    <div class="flex"></div>
                    <md-button class="md-accent" ng-click="$ctrl.cancel()">{{ ::'CANCEL' | translate }}</md-button>
                    <md-button class="md-accent" ng-click="$ctrl.change()">{{ ::$ctrl.addButtonLabel | translate }}</md-button>
                </div>
            </md-dialog>`
        })
        .then(
            (data?: SearchResult[]) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            () => {
                if (cancelCallback) {
                    cancelCallback();
                }
            }
        );
    }

}

angular
    .module('iqsMultiSelectDialog')
    .service('iqsMultiSelectDialog', MultiSelectDialogService);