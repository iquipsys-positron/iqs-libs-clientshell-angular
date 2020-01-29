import { IShellOrganizationViewModel } from '../organizations/IOrganizationViewModel';
import { IOrganizationService } from '../organization_service/IOrganizationService';
interface IHavHeaderOrganizationBindings {
    [key: string]: any;
    state: any;
}

const HavHeaderOrganizationBindings: IHavHeaderOrganizationBindings = {
    state: '=iqsState'
}

class HavHeaderOrganizationChanges implements ng.IOnChangesObject, IHavHeaderOrganizationBindings {
    [key: string]: ng.IChangesObject<any>;

    state: ng.IChangesObject<string>;
}

class HavHeaderOrganizationController implements ng.IController {     
    public state: string;
    constructor(
        private $state: ng.ui.IStateService,
        private iqsOrganization: IOrganizationService,
        public pipMedia: pip.layouts.IMediaService,
        public pipIdentity: pip.services.IIdentityService,
        private iqsOrganizationsViewModel: IShellOrganizationViewModel,
        private pipNavService: pip.nav.INavService
    ) {
        "ngInject";

    }

    public $onInit() {}

    public get organization() {
        // if (this.iqsOrganization.orgId) {
        //     return this.iqsOrganizationsViewModel.getOrganizationById(this.iqsOrganization.orgId);
        // } return null;
        return this.iqsOrganization.organization || {};
    }

    public onSelect() {
         this.state = this.state == 'organizations' ? 'links' : 'organizations';
        /*if (this.expanded) {
            this.pipNavService.sidenav.part('links', false);
            this.pipNavService.sidenav.part('organizations', true);
        } else {
            this.pipNavService.sidenav.part('links', true);
            this.pipNavService.sidenav.part('organizations', false);
        }*/
    }
}

(() => {
    angular
        .module('iqsNavHeaderOrganization', [
            'iqsShellOrganizations',
            'iqsShellOrganizationData',
            'iqsOrganizationsViewModel'
        ])
        .component('iqsNavHeaderOrganization', {
            bindings: HavHeaderOrganizationBindings,
            templateUrl: 'nav/NavHeaderOrganization.html',
            controller: HavHeaderOrganizationController,
            controllerAs: 'nav'
        })

})();
