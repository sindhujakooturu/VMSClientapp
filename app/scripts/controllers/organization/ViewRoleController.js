(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewRoleController: function(scope, routeParams, resourceFactory,PermissionService) {
      scope.permissions = [];
      scope.groupings = [];
      scope.PermissionService = PermissionService;
      
      resourceFactory.rolePermissionResource.get({roleId:routeParams.id}, function(data) {
        scope.role = data;

        var currentGrouping = "";
        var tempPermissionUIData = [];
        for (var i in data.permissionUsageData) {
          if (data.permissionUsageData[i].grouping != currentGrouping)
          {
            currentGrouping = data.permissionUsageData[i].grouping;
            scope.groupings.push(currentGrouping);
            var newEntry = { permissions: [] };
            tempPermissionUIData[currentGrouping] = newEntry;
          }
          var temp = { code:data.permissionUsageData[i].code, data:data.permissionUsageData[i].selected};
          tempPermissionUIData[currentGrouping].permissions.push(temp);
        }

        scope.showPermissions = function (grouping) {
          if (scope.previousGrouping) {
            tempPermissionUIData[scope.previousGrouping] = scope.permissions;
          }
          scope.permissions = tempPermissionUIData[grouping];
          scope.previousGrouping = grouping;
        };
        //by default show special permissions
        scope.showPermissions('special');

        scope.permissionName = function (name) {
          name = name || "";
          //replace '_' with ' '
          name = name.replace(/_/g, " ");
          //for reorts replace read with view
          if (scope.previousGrouping == 'report') {name = name.replace(/READ/g, "View");}
          return name;
        };

        scope.formatName = function (string) {
          if (string.indexOf('portfolio_') > -1) {
            string = string.replace("portfolio_", "");
          }
          if (string.indexOf('transaction_') > -1) {
            var temp = string.split("_");
            string = temp[1]+" "+temp[0].charAt(0).toUpperCase() + temp[0].slice(1)+"s";
          }
          string = string.charAt(0).toUpperCase() + string.slice(1);
          return string;
        };
      });
    }
  });
  mifosX.ng.application.controller('ViewRoleController', ['$scope', '$routeParams', 'ResourceFactory','PermissionService', mifosX.controllers.ViewRoleController]).run(function($log) {
    $log.info("ViewRoleController initialized"); 
  });
}(mifosX.controllers || {}));
