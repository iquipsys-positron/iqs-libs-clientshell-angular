

interface IHavExpandBindings {
    [key: string]: any;
}

const HavExpandBindings: IHavExpandBindings = {
    
}

class HavExpandChanges implements ng.IOnChangesObject, IHavExpandBindings {
    [key: string]: ng.IChangesObject<any>;

    
}

class HavExpandController {
    private pipSideNavElement;
    private cleanupSideNavStateChanged: Function;
    public isCollapsed;
    public expanded: boolean;
    public expandedButton: boolean;
    constructor(
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRepeatScope,
        private $element,
        private pipIdentity: pip.services.IIdentityService,
        private pipNavService: pip.nav.INavService,

        private pipSideNav: pip.nav.ISideNavService
    ) {
        "ngInject";
        
        this.pipSideNavElement = $element.parents('pip-sidenav');

        this.onStateChanged(null, this.pipSideNav.state);
        this.cleanupSideNavStateChanged = this.$rootScope.$on('pipSideNavStateChanged', ($event: ng.IAngularEvent, state) => { //navState
            this.onStateChanged($event, state)
        });

    }

    public $onDestroy() {
        if (angular.isFunction(this.cleanupSideNavStateChanged)) {
            this.cleanupSideNavStateChanged();
        }
    }
 

    public onExpand(): void {
        if (!this.isCollapsed) { return }

        this.expanded = !this.expanded;

        if (this.expanded) {
            this.pipSideNavElement.removeClass('pip-sticky-nav-small');
        } else {
            this.pipSideNavElement.addClass('pip-sticky-nav-small');
        }
        this.pipSideNav.state.isExpanded = this.expanded;
        this.$rootScope.$emit('pipNavExpanded', this.expanded);
    }


    private onStateChanged(event: ng.IAngularEvent, state): void {
        // SS> You shall not set it into the menu state. Instead it shall be controlled by the state of Sidenav
        if (!state) return;

        this.isCollapsed = state.expand;
        this.expanded = state.isExpanded;
        this.expandedButton = state.expandedButton;

        //this.sideNavState = state;
    }


}

(() => {
    angular
        .module('iqsNavExpand', [
        ])
        .component('iqsNavExpand', {
            bindings: HavExpandBindings,
            templateUrl: 'nav/NavExpand.html',
            controller: HavExpandController,
            controllerAs: 'nav'
        })

})();
