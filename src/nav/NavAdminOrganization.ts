
interface IHavAdminOrganizationBindings {
    [key: string]: any;
}

const HavAdminOrganizationBindings: IHavAdminOrganizationBindings = {}

class HavAdminOrganizationChanges implements ng.IOnChangesObject, IHavAdminOrganizationBindings {
    [key: string]: ng.IChangesObject<any>;
}

class HavAdminOrganizationController {
    public state: string = 'links';
    constructor() {
        "ngInject";
    }

    public $onDestroy() {

    }

    public onExpand(): void {

    }

    public onClick(id: string) {

    }

}

(() => {
    angular
        .module('iqsNavAdminOrganization', [
        ])
        .component('iqsNavAdminOrganization', {
            bindings: HavAdminOrganizationBindings,
            templateUrl: 'nav/NavAdminOrganization.html',
            controller: HavAdminOrganizationController,
            controllerAs: 'nav'
        })

})();
