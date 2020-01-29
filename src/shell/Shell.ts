import { IShellService, IShellProvider } from './IShellService';
import { TimeZones } from '../common/LocationZones';

interface IIqsShellBindings {
    [key: string]: any;
}

const IqsShellBindings: IIqsShellBindings = {}

class IqsShellChanges implements ng.IOnChangesObject, IIqsShellBindings {
    [key: string]: ng.IChangesObject<any>;
}

class IqsShellController  implements ng.IController {          
    public identity: any;
    public $reset: boolean = false;
    public $loading: boolean = false;
    public language: string;

    constructor(
        $rootScope: ng.IRootScopeService,
        $timeout,
        private pipAuxPanel: pip.layouts.IAuxPanelService,
        private $state: ng.ui.IStateService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsShell: IShellService
    ) {
        "ngInject";

        $rootScope.$on(pip.services.LanguageChangedEvent, () => {
            this.language = this.pipTranslate.language;
            this.$reset = true;
            $timeout(() => {
                this.$reset = false;
            }, 0);
        });

        this.language = this.pipTranslate.language;

        this.addZones();

        $rootScope.$on('showLoading', () => {
            this.$loading = true;
            $timeout(() => {
                this.$loading = true;
            }, 0);
        });     

        $rootScope.$on('hideLoading', () => {
            this.$loading = false;
            $timeout(() => {
                this.$loading = false;
            }, 0);
        });              
    }

    public $onInit() {}

    private addZones() {
        let zonesFilter: string[] = TimeZones.zones;
        let filteredZone: string[] = [];

        _.each(TimeZones.allZones, (s: string) => {
            let index: number = _.findIndex(zonesFilter, (f: string) => { 
                return s.indexOf(f) == 0;
            });

            if (index > -1) {
                filteredZone.push(s);
            }
        });
        moment.tz.add(filteredZone);        
    }

    public get add(): string {
        return this.iqsShell.addOrganizations || 'organizations';
    }

    public get panel(): string {
        return this.iqsShell.panel;
    }

    public showMain(): boolean {

        let find: boolean = true;
        if (this.$state.current.name == "") return false;
        this.iqsShell.hideMain().forEach(element => {
            if (element == this.$state.current.name) { find = false; return; }
        });
        return find
    }

    public showBar(): boolean {
        let find: boolean = true;
        if (this.$state.current.name == "") return false;
        this.iqsShell.hideBar.forEach(element => {
            if (element == this.$state.current.name) { find = false; return; }
        });
        return find
    }

    public showNav(): boolean {
        let find: boolean = true;
        if (this.$state.current.name == "") return false;
        this.iqsShell.hideNav.forEach(element => {
            if (element == this.$state.current.name) { find = false; return; }
        });
        return find
    }

    public showAux(): boolean {
        let find: boolean = true;
        if (this.$state.current.name == "") return false;
        this.iqsShell.hideAux.forEach(element => {
            if (element == this.$state.current.name) { find = false; return; }
        });
        return find
    }

    public isOpenAux(): boolean {
        return this.pipAuxPanel.isOpen();
    }

}

(() => {
    angular
        .module('iqsClientShell', [
            'pipNav',
            'pipEntry',
            'pipPageReset',
            'iqsNavHeaderOrganization',
            'iqsNavOrganizations',
            'iqsNavExpand',
            'iqsShell.Templates'
        ])
        .component('iqsClientShell', {
            bindings: IqsShellBindings,
            templateUrl: 'shell/Shell.html',
            controller: IqsShellController,
            controllerAs: 'shell'
        })

})();
