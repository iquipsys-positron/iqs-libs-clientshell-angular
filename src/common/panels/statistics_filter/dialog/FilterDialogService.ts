import { IFilterDialogService, FilterDialogParams } from './IFilterDialogService';

class FilterDialogService implements IFilterDialogService {
    public _mdDialog: angular.material.IDialogService;

    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }


    public show(params: FilterDialogParams, successCallback?: (data?: any) => void, cancelCallback?: () => void) {
        this._mdDialog.show({
            // templateUrl: 'common/panels/statistics_filter/dialog/FilterDialog.html',
            controller: 'iqsFilterDialogController',
            controllerAs: '$ctrl',
            locals: { params: params },
            bindToController: true,
            clickOutsideToClose: true,
            template:
                `
            <md-dialog class="pip-dialog layout-column bp0 pip-scroll iqs-filter-dialog" style="height: 80%" md-theme="{{$ctrl.theme}}">
                <div class="pip-header p16 divider-bottom">
                    <h3 class="m0 w-stretch">{{ 'FILTER_DIALOG_TITLE' | translate }}</h3>
                </div>
                    
                <!-- params -->
                <div class="pip-body p16">
                    <div class="text-caption rm4 param-block" ng-if="$ctrl.isParamsFilter">
                        <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                            <md-select class="flex" aria-label="RULES" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.paramsFilter">
                                <md-option ng-value="opt.id" ng-repeat="opt in $ctrl.paramsCollection track by opt.id">
                                    {{ ::opt.name | translate }}
                                </md-option>
                            </md-select>
                        </md-input-container>
                    </div>
                    
                    <div class="text-caption rm4 param-block" ng-if="$ctrl.isEventRuleFilter">
                        <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                            <md-select class="flex" aria-label="RULES" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.ruleFilter">
                                <md-option ng-value="rule.id" ng-repeat="rule in $ctrl.rulesCollection track by rule.id">
                                    {{ ::rule.name }}
                                </md-option>
                            </md-select>
                        </md-input-container>
                    </div>
                    <!--rule action-->
                    <div class="text-caption rm4 param-block" ng-if="$ctrl.isActionFilter">
                        <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                            <md-select class="flex" aria-label="RULES_ACTION" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.ruleAction">
                                <md-option ng-value="action.id" ng-repeat="action in $ctrl.ruleActionsCollection track by action.id">
                                    {{ ::action.name }}
                                </md-option>
                            </md-select>
                        </md-input-container>
                    </div>
                    <!--zones-->
                    <div class="text-caption rm4 param-block" ng-if="$ctrl.isZoneFilter">
                        <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                            <md-select class="flex" aria-label="ZONES" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.zoneFilter">
                                <md-option ng-value="zone.id" ng-repeat="zone in $ctrl.zonesCollection track by zone.id">
                                    {{ ::zone.name }}
                                </md-option>
                            </md-select>
                        </md-input-container>
                    </div>
                    <!--objects-->
                    <div class="text-caption rm4 param-block" ng-if="$ctrl.isObjectFilter">
                        <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                            <md-select class="flex" aria-label="OBJECTS" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.objectFilter">
                                <md-option ng-value="object.id" ng-repeat="object in $ctrl.objectsCollection track by object.id">
                                    {{ ::object.name }}
                                </md-option>
                            </md-select>
                        </md-input-container>
                    </div>
                    <!--devices-->
                    <div class="text-caption rm4 param-block" ng-if="$ctrl.isDeviceFilter">
                        <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                            <md-select class="flex" aria-label="DEVICE" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.deviceFilter">
                                <md-option ng-value="device.id" ng-repeat="device in $ctrl.devicesCollection track by device.id">
                                    {{ ::device.name }}
                                </md-option>
                            </md-select>
                        </md-input-container>
                    </div>
                    
                    <!--date periods-->
                    <div class="text-caption rm4 param-block" ng-if="$ctrl.isDatePeriod">
                        <md-input-container class="md-block iqs-small-select hide-md-errors-spacer  m0">
                            <md-select class="flex" aria-label="Status" ng-model="$ctrl.datePeriod" ng-disabled="$ctrl.ngDisabled" ng-change="$ctrl.changeDatePeriod()">
                                <md-option ng-value="opt.id" ng-repeat="opt in $ctrl.dateFilters track by opt.id">
                                    {{ ::opt.name | translate }}
                                </md-option>
                            </md-select>
                        </md-input-container>
                    </div>
                    
                    <div class="text-caption rm4 param-block" ng-if="$ctrl.datePeriod != 'range'">
                        <md-input-container class="md-block flex tm0 bm0 iqs-stats-datepicker hide-md-errors-spacer">
                            <md-datepicker md-hide-icons="calendar" class="text-caption rm0 tm4 {{ $ctrl.datePeriod == 'Weekly' ? 'iqs-week' : '' }} {{ $ctrl.openDatePicker ? '' : 'iqs-active-date color-accent' }}"
                                ng-model="$ctrl.startDate" aria-label="START_DATE" ng-change="$ctrl.onCalendarDateChange()">
                            </md-datepicker>
                        </md-input-container>
                    </div>
                    
                    <div class="layout-column layout-align-start-stretch" ng-if="$ctrl.datePeriod == 'range'">
                        <div class="flex layout-column layout-align-start-start tm8">
                            <span class="flex" style="max-height: 18px;">{{ ::'CONFIG_DOT_TRACES_START' | translate }}</span>
                            <div class="flex layout-row w-stretch" style="max-height: 70px;">
                                <md-input-container class="md-block flex bm0 tm0">
                                    <md-datepicker class="w-stretch " md-hide-icons="calendar" aria-label="TIME" ng-change="$ctrl.startDateTimeChanged($ctrl.startDate)"
                                        ng-model="$ctrl.startDate" ng-disabled="$ctrl.ngDisabled">
                                    </md-datepicker>
                                </md-input-container>
                                <div class="flex">
                                    <pip-time-autocomplete pip-time-label="false" pip-change-callback="$ctrl.startDateTimeChanged" ng-disabled="$ctrl.ngDisabled"
                                        pip-date-time="$ctrl.startDate" pip-time-step="60">
                                    </pip-time-autocomplete>
                                </div>
                            </div>
                        </div>
                    
                        <div class="flex layout-column layout-align-start-start">
                            <span class="flex" style="max-height: 18px;">{{ ::'CONFIG_DOT_TRACES_END' | translate }}</span>
                            <div class="flex layout-row w-stretch" style="max-height: 70px;">
                                <md-input-container class="md-block flex bm0 tm0">
                                    <md-datepicker class="w-stretch " md-hide-icons="calendar" aria-label="TIME" ng-change="$ctrl.endDateTimeChanged($ctrl.endDate)"
                                        ng-model="$ctrl.endDate" ng-disabled="$ctrl.ngDisabled">
                                    </md-datepicker>
                                </md-input-container>
                                <div class="flex">
                                    <pip-time-autocomplete pip-time-label="false" pip-change-callback="$ctrl.endDateTimeChanged" ng-disabled="$ctrl.ngDisabled"
                                        pip-date-time="$ctrl.endDate" pip-time-step="60">
                                    </pip-time-autocomplete>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- shifts -->
                    
                    <div class="text-caption rm4 param-block" ng-if="$ctrl.isDatePeriod && $ctrl.datePeriod == 'shift'">
                        <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                            <md-select class="flex" aria-label="DEVICE" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.shiftFilter">
                                <md-option ng-value="shift.id" ng-repeat="shift in $ctrl.shiftsCollection track by shift.id">
                                    {{ ::shift.name }}
                                </md-option>
                            </md-select>
                        </md-input-container>
                    </div>
                </div>
                <div class="pip-footer ">
                    <!-- <md-button ng-click="$ctrl.config()" ng-if="$ctrl.configState">{{ ::'CONFIG' | translate }}</md-button> -->
                    <div class="flex"></div>
                    <md-button class="md-accent" ng-click="$ctrl.cancel()">{{ 'CANCEL' | translate }}</md-button>
                    <md-button class="md-accent" ng-click="$ctrl.change()">{{ 'FILTER_DIALOG_APPLY' | translate }}</md-button>
                </div>
            </md-dialog>
            `
        })
            .then(
                (data?: any) => {
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
    .module('iqsFilterDialog')
    .service('iqsFilterDialog', FilterDialogService);