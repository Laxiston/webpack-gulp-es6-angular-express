import 'gridstack/dist/gridstack.css';
import 'gridstack/dist/gridstack.all';

import './workspace.css';

import WorkspaceTemplate from './workspace.template.html';

class WorkspaceController {

  constructor($element, $compile, $scope, panelsManager) {
    'ngInject';
    this.$element = $element;
    this.$compile = $compile;
    this.$scope = $scope;
    this.panelsManager = panelsManager;
    this.availablePanelsNames = [];
    this.panelNameToId = {};
    _.each(panelsManager.getPanelsList(), panelId => {
      var panel = panelsManager.getPanel(panelId);
      this.availablePanelsNames.push(panel.name);
      var panelNameWoSpaces = panel.name.replace(/ /g, "");
      this.panelNameToId[panelNameWoSpaces] = panelId;
    });
  }

  $postLink() {

    var options = {
      cellHeight: 200,
      verticalMargin: 10,
      float: true
    };

    var grid = $('.grid-stack').gridstack(options);

    var gridApi = grid.data('gridstack');

    grid.on('resizestop', (event, ui) => {
      var element = event.target;
      setTimeout(() => {
        this.resizeGridItemContent(element);
      }, 10);
    });

    this.getPanelName = function(panelId) {
      return this.panelsManager.getPanelName(panelId).name;
    };

    this.addPanel = (panelName) => {
      var panelContent = $(
        '<div class="grid-stack-item" data-gs-width="4" data-gs-height="2">\
        <div class="grid-stack-item-content">\
        <panel data-name="' + panelName + '"/>\
        </div>\
        </div>'
      );
      grid.append(panelContent);
      var gridItem = gridApi.makeWidget(panelContent)[0];
      this.$compile($(gridItem).contents())(this.$scope.$new(true, this.$scope));

      $('.grid-stack-item-content').css("overflow", "hidden");

      setTimeout(() => {
        this.resizeGridItemContent(gridItem);
      }, 500);

    };

    this.addSelectedPanel = function() {
      var panelNameWoSpaces = $('.panel-button').text().replace(/ /g, "");
      this.addPanel(this.panelNameToId[panelNameWoSpaces]);
    };

    this.isFullScreenMode = false;

    this.resizeGridItemContent = function(gridItem) {
      var newHeight = $(gridItem).height();
      var boxHeader = $(gridItem).find('.box-header');
      var boxBody = $(gridItem).find('.box-body');
      boxBody.height(newHeight - 3.1 * boxHeader.height());
    };

    var fullscreenPanel = function(domElement) {
      this.fullscreenElt = domElement;
      if (this.isFullScreenMode === true) {
        // exit fullscreen
        this.isFullScreenMode = false;

        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        return;
      }

      this.isFullScreenMode = true;
      if (domElement.requestFullscreen) {
        domElement.requestFullscreen();
      } else if (domElement.msRequestFullscreen) {
        domElement.msRequestFullscreen();
      } else if (domElement.mozRequestFullScreen) {
        domElement.mozRequestFullScreen();
      } else if (domElement.webkitRequestFullscreen) {
        domElement.webkitRequestFullscreen();
      }
    };

    var exitHandler = function() {
      var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen; // This will return true or false depending on if it's full screen or not.
      this.isFullScreenMode = isFullScreen;
      this.resizeGridItemContent(this.fullscreenElt);
    };

    $('body').on('click', '.panel-fullscreen', function(e) {
      e.preventDefault();
      var box = $(this).closest(".grid-stack-item");
      fullscreenPanel(box.get(0));
    });

    $('body').on('click', '.panel-remove', function(e) {
      e.preventDefault();
      var box = $(this).closest(".grid-stack-item");
      gridApi.removeWidget(box);
    });

    if (document.addEventListener) {
      document.addEventListener('webkitfullscreenchange', exitHandler, false);
      document.addEventListener('mozfullscreenchange', exitHandler, false);
      document.addEventListener('fullscreenchange', exitHandler, false);
      document.addEventListener('MSFullscreenChange', exitHandler, false);
    }
  }
}

var WorkspaceComponent = {
  controller: WorkspaceController,
  template: WorkspaceTemplate,
  bindings: {
    datasetId: '@'
  }
};

export default WorkspaceComponent;
