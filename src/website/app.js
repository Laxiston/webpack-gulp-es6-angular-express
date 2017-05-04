import 'admin-lte/dist/css/AdminLTE.css';
import 'admin-lte/dist/css/skins/_all-skins.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap_dropdowns_enhancement/dist/css/dropdowns-enhancement.css';
import 'common/googleFonts';
import './app.css';

import components from './components/components';
import services from './services/services';
import panels from './panels/panels';

import uiRouter from '@uirouter/angularjs';

import AppTemplate from './app.html';

class AppController {

  constructor() {
    this.datasets = [{
      name: 'Cars',
      url: 'cars',
      icon: 'car'
    }, {
      name: 'Cameras',
      url: 'cameras',
      icon: 'camera'
    }];
  }

}

const app = angular.module('app', [services.name, components.module.name, panels.module.name, uiRouter])
  .component('app', {
    template: AppTemplate,
    controller: AppController
  })
  .config(($stateProvider, $urlRouterProvider) => {
    'ngInject';
    $urlRouterProvider.otherwise('/cars');
    $stateProvider.state({
        name: 'cars',
        url: '/cars',
        template: '<workspace data-dataset-id="cars"/>'
      })
      .state({
        name: 'cameras',
        url: '/cameras',
        template: '<workspace data-dataset-id="cameras"/>'
      });
  });

export default app;
