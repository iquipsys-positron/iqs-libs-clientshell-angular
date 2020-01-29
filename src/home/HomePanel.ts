import { HomePage, HomePageItem } from './HomePage';

interface IIqsHomeBindings {
    [key: string]: any;

    pages: any,
    defaultIcon: any,
    defaultColor: any
}

const IqsHomeBindings: IIqsHomeBindings = {
    pages: "<iqsPages",
    defaultIcon: "<?iqsDefaultIcon",
    defaultColor: "<?iqsDefaultColor"
}

class IqsHomeChanges implements ng.IOnChangesObject, IIqsHomeBindings {
    [key: string]: ng.IChangesObject<any>;

    pages: ng.IChangesObject<HomePage[]>;
    defaultIcon: ng.IChangesObject<string>;
    defaultColor: ng.IChangesObject<string>;
}

class IqsHomeController  implements ng.IController {          
    public pages: HomePage[];
    public defaultIcon: string = null;
    public defaultColor: string = null;

    constructor(
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService
    ) {
        "ngInject";

    }
    
    public $onInit() {}

    public gotoDetails(item: HomePageItem) {
        if (item.Disabled) return;
        
        this.$state.go(item.State, item.Params);
    }

}

(() => {
    angular
        .module('iqsHomePanel', [
            'iqsShell.Templates'
        ])
        .component('iqsHomePanel', {
            bindings: IqsHomeBindings,
            templateUrl: 'home/HomePanel.html',
            controller: IqsHomeController,
            controllerAs: '$ctrl'
        })

})();
