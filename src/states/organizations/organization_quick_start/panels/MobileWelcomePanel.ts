interface IMobileWelcomePanelBindings {
    [key: string]: any;

    onLora: any;
    onPhone: any;
    ngDisabled: any;
}

const MobileWelcomePanelBindings: IMobileWelcomePanelBindings = {
    onLora: '&?iqsLora',
    onPhone: '&?iqsPhone',
    ngDisabled: '&?'
}

class MobileWelcomePanelChanges implements ng.IOnChangesObject, IMobileWelcomePanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onLora: ng.IChangesObject<() => ng.IPromise<void>>;
    onPhone: ng.IChangesObject<() => ng.IPromise<void>>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class MobileWelcomePanelController implements ng.IController {          public $onInit() {}
    public ngDisabled: () => boolean;
    public onLora: () => void;
    public onPhone: () => void;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $timeout: ng.ITimeoutService,
        public pipMedia: pip.layouts.IMediaService,
    ) {
        "ngInject";

        $element.addClass('iqs-mobile-welcome-panel');
    }


    public onNextPhone() {
        if (this.onPhone) {
            this.onPhone();
        }
    }

    public onNextLora() {
        if (this.onLora) {
            this.onLora();
        }
    }
}

(() => {
    angular
        .module('iqsMobileWelcomePanel', [])
        .component('iqsMobileWelcomePanel', {
            bindings: MobileWelcomePanelBindings,
            // templateUrl: 'states/organizations/organization_quick_start/panels/MobileWelcomePanel.html',
            controller: MobileWelcomePanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="pip-body {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }}">
                    <h2 class="text-center bm24 lm24 rm24">
                        {{:: 'SITES_CREATE_MOBILE_WELCOME_TITLE' | translate}}
                    </h2>

                    <div class="text-body1 min-h136 bm16 iqs-info">
                        <p>
                            {{:: 'SITES_CREATE_MOBILE_WELCOME_SUBTITLE1' | translate}}
                        </p>
                        <ul>
                            <li>{{:: 'SITES_CREATE_MOBILE_WELCOME_SUBTITLE2' | translate}}</li>
                            <li>{{:: 'SITES_CREATE_MOBILE_WELCOME_SUBTITLE3' | translate}}</li>
                            <li>{{:: 'SITES_CREATE_MOBILE_WELCOME_SUBTITLE4' | translate}}</li>
                        </ul>
                        <p>
                            {{:: 'SITES_CREATE_MOBILE_WELCOME_SUBTITLE5' | translate}}
                        </p>
                        <p>
                            {{:: 'SITES_CREATE_MOBILE_WELCOME_SUBTITLE6' | translate}}
                        </p>
                    </div>

                </div>
                <div class="pip-footer {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }} tp0">
                    <div ng-if="!$ctrl.pipMedia('gt-sm')">

                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm0 rm0 tm16" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onNextLora()">
                            {{ ::'SITES_CREATE_MOBILE_WELCOME_NOT_BUTTON' | translate }}
                        </md-button>
                        <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm0 bm0 " ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onNextPhone()">
                            {{ ::'SITES_CREATE_MOBILE_WELCOME_YES_BUTTON' | translate }}
                        </md-button>
                    </div>
                    <div class="layout-row layout-align-start-center tm16" ng-if="$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm0 rm8 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onNextLora()">
                            {{ ::'SITES_CREATE_MOBILE_WELCOME_NOT_BUTTON' | translate }}
                        </md-button>

                        <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm8 rm0 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onNextPhone()">
                            {{ ::'SITES_CREATE_MOBILE_WELCOME_YES_BUTTON' | translate }}
                        </md-button>


                    </div>
                </div>
            `
        })
})();
