import { IShellOrganizationViewModel } from '../organizations/IOrganizationViewModel';
import { IOrganizationService } from '../organization_service/IOrganizationService';
import { Organization } from '../organizations/Organization';
import { IRolesDataService } from '../roles/IRolesDataService';

interface IHavOrganizationsBindings {
    [key: string]: any;

    state: any;
    add: any;
}

const HavOrganizationsBindings: IHavOrganizationsBindings = {
    state: '=iqsState',
    add: '<?iqsAdd'
}

class HavOrganizationsChanges implements ng.IOnChangesObject, IHavOrganizationsBindings {
    [key: string]: ng.IChangesObject<any>;

    state: ng.IChangesObject<string>;
    add: ng.IChangesObject<string>;
}

class HavOrganizationsController {
    private pipSideNavElement;
    private cleanupSideNavStateChanged: Function;
    public isCollapsed;
    public expanded: boolean;
    public expandedButton: boolean;
    public state: string;
    private add: string = 'organizations.home';

    private filteredOrganizations: Organization[];

    constructor(
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRepeatScope,
        private $element,
        private $timeout: ng.ITimeoutService,
        private pipIdentity: pip.services.IIdentityService,
        private pipNavService: pip.nav.INavService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsOrganization: IOrganizationService,
        private pipSideNav: pip.nav.ISideNavService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsOrganizationsViewModel: IShellOrganizationViewModel,
        private iqsShellRolesData: IRolesDataService,
        private pipRest: pip.rest.IRestService,
        private pipConfirmationDialog: pip.dialogs.IConfirmationDialogService,
        private pipInformationDialog: pip.dialogs.IInformationDialogService
    ) {
        "ngInject";

        this.pipSideNavElement = $element.parents('pip-sidenav');

        this.onStateChanged(null, this.pipSideNav.state);
        this.cleanupSideNavStateChanged = this.$rootScope.$on('pipSideNavStateChanged', ($event: ng.IAngularEvent, state) => { //navState
            this.onStateChanged($event, state)
        });

        this.fillOrganizations(); this.fillOrganizations();
    }

    private fillOrganizations() {
        let s: Organization[] = [];

        _.each(this.pipIdentity.identity.user.organizations, (item: Organization) => {
            let index: number = _.findIndex(this.iqsOrganizationsViewModel.organizations, (organization: Organization) => {
                return item.id == organization.id && item.id != this.iqsOrganization.orgId
            });
            if (index > -1) {
                s.push(this.iqsOrganizationsViewModel.organizations[index]);
            }
        });
        this.filteredOrganizations = s;
    }

    public $onDestroy() {
        if (angular.isFunction(this.cleanupSideNavStateChanged)) {
            this.cleanupSideNavStateChanged();
        }
    }

    public get organizations() {
        // return _.filter(this.pipIdentity.identity.user.organizations, (item: Organization) => {
        //     return item.id != this.iqsOrganization.orgId
        // });
        _.debounce(
            () => {
                this.fillOrganizations();
            }, 1000, {
                'leading': true,
                'trailing': false
            });

        return this.filteredOrganizations;
    }

    public get canAddOrganization(): boolean {
        return this.iqsOrganization.canAddOrganization;
    }

    public get canRemoveOrganization(): boolean {
        return this.iqsOrganization.canRemoveOrganization;
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
    }

    public onClick(id: string) {
        this.iqsOrganization.organization = this.iqsOrganizationsViewModel.getOrganizationById(id);
        this.state = 'links';
        this.pipSideNav.close();
        this.fillOrganizations();
    }

    public closeClick() {
        this.state = 'links';
    }

    private checkDemo(params: string): boolean {
        if (!this.iqsOrganization.isDemo) return true;

        let message = params == 'add_organization' ? 'DEMO_LIMIT_ADD_ORGANIZATION_INFORMATION_DIALOG_MESSAGE' : 'DEMO_LIMIT_REMOVE_ORGANIZATION_INFORMATION_DIALOG_MESSAGE';
        this.pipInformationDialog.show(
            {
                event: null,
                title: this.pipTranslate.translate('DEMO_LIMIT_INFORMATION_DIALOG_TITLE'),
                message: this.pipTranslate.translate(message)
            },
            () => {

            });

        return false;
    }

    public addClick() {
        if (!this.checkDemo('add_organization')) return;
        this.$state.go(this.add, { toState: this.$state.current.name, toParams: this.$state.params });
    }

    public deleteClick() {
        if (!this.checkDemo('remove_organization')) return;
        let configParams: pip.dialogs.ConfirmationDialogParams = {}, roles: string[], localRoles;
        configParams.title = this.pipTranslate.translate('ORGANIZATIONS_DISCONNECT_CONFIRMATION_TITLE') + ' "' + this.iqsOrganization.organization.name + '"?'; // + this.collection[this.selectedIndex()].name + '?';
        configParams.ok = 'ORGANIZATIONS_DISCONNECT_BUTTON';
        configParams.cancel = 'CANCEL';

        this.pipConfirmationDialog.show(configParams, () => {
            this.$rootScope.$broadcast('showLoading');
            this.iqsOrganizationsViewModel.removeOrganization(this.iqsOrganization.orgId, (data) => {
                this.pipRest.getResource('restoreSessions').call(
                    {
                        session_id: this.pipIdentity.identity.id
                    },
                    (data: pip.entry.SessionData) => {
                        this.pipIdentity.identity = data;
                        this.fillOrganizations();
                        this.$state.go('loading');
                        this.$rootScope.$broadcast('hideLoading');
                    },
                    (error: any) => {
                        this.$rootScope.$broadcast('hideLoading');
                    });
            },
                (error: any) => {
                    this.$rootScope.$broadcast('hideLoading');
                });
        });
    }

}

(() => {

    function configOrganizations(pipTranslateProvider) {

        pipTranslateProvider.translations('en', {
            ADD_ORGANIZATION: 'Add organization',
            CLOSE_ORGANIZATIONS: 'Cancel',
            REMOVE_ORGANIZATION: 'Remove organization',
            ORGANIZATIONS_DISCONNECT_BUTTON: 'Disconnect',
            ORGANIZATIONS_DISCONNECT_CONFIRMATION_TITLE: 'Disconnect from organization',
            DEMO_LIMIT_INFORMATION_DIALOG_TITLE: 'Information',
            DEMO_LIMIT_ADD_ORGANIZATION_INFORMATION_DIALOG_MESSAGE: 'Demo user can not create organizations. Register to be able to create and manage work organizations.',
            DEMO_LIMIT_REMOVE_ORGANIZATION_INFORMATION_DIALOG_MESSAGE: 'Demo user can not manage organizations. Register to be able to create and manage work organizations.',
        });

        pipTranslateProvider.translations('ru', {
            ADD_ORGANIZATION: 'Добавить площадку',
            REMOVE_ORGANIZATION: 'Убрать площадку',
            CLOSE_ORGANIZATIONS: 'Отмена',
            ORGANIZATIONS_DISCONNECT_BUTTON: 'Убрать',
            ORGANIZATIONS_DISCONNECT_CONFIRMATION_TITLE: 'Убрать площадку',
            DEMO_LIMIT_INFORMATION_DIALOG_TITLE: 'Информация',
            DEMO_LIMIT_ADD_ORGANIZATION_INFORMATION_DIALOG_MESSAGE: 'Демо пользователь не может создавать свои рабочие площадки. Зарегистрируйтесь для получения возможности создавать рабочие площадки и управлять ими.',
            DEMO_LIMIT_REMOVE_ORGANIZATION_INFORMATION_DIALOG_MESSAGE: 'Демо пользователь не может управлять рабочими площадками. Зарегистрируйтесь для получения возможности создавать рабочие площадки и управлять ими.',
        });
    }

    angular
        .module('iqsNavOrganizations', [
            'iqsShellOrganizations',
            'iqsShellOrganizationData',
            'iqsOrganizationsViewModel',
            'iqsShellRoles',
            'iqsShellRolesData'
        ])
        .config(configOrganizations)
        .component('iqsNavOrganizations', {
            bindings: HavOrganizationsBindings,
            templateUrl: 'nav/NavOrganizations.html',
            controller: HavOrganizationsController,
            controllerAs: 'nav'
        })

})();
