define(function (require) {
  // get the kibana/table_vis module, and make sure that it requires the "kibana" module if it
  // didn't already
  var module = require('ui/modules').get('kibana/table_vis', ['kibana']);

  // add a controller to tha module, which will transform the esResponse into a
  // tabular format that we can pass to the table directive
  module.controller('KbnTableVisController', function ($route, $scope, Private, config) {
    var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));

    $scope.$watch('esResponse', function (resp, oldResp) {
      var tableGroups = $scope.tableGroups = null;
      var hasSomeRows = $scope.hasSomeRows = null;

      if (resp) {
        var vis = $scope.vis;
        var params = vis.params;

        tableGroups = tabifyAggResponse(vis, resp, {
          partialRows: params.showPartialRows,
          minimalColumns: vis.isHierarchical() && !params.showMeticsAtAllLevels,
          asAggConfigResults: true,
          enableFilters: !$route.current.params.embed || config.get('embed:enableFilters')
        });

        hasSomeRows = tableGroups.tables.some(function haveRows(table) {
          if (table.tables) return table.tables.some(haveRows);
          return table.rows.length > 0;
        });
      }

      $scope.hasSomeRows = hasSomeRows;
      if (hasSomeRows) {
        $scope.tableGroups = tableGroups;
      }

    });
  });

});
