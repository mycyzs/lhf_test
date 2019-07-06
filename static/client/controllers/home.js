controllers.controller("home", ["$scope", "loading", "$modal", "confirmModal", "sysService", "errorModal", "msgModal", function ($scope, loading, $modal, confirmModal, sysService, errorModal, msgModal) {

    $scope.args = {
        biz_id: 2,
        ip:''
    };

    //内容显示页数和数量
    $scope.PagingData = [];
    $scope.totalSerItems = 0;

    $scope.pagingOptions = {
        pageSizes: [10, 50, 100],
        pageSize: "10",
        currentPage: 1
    };



    $scope.userList = []
    $scope.inits = function () {
        loading.open();
        sysService.search_init({}, $scope.args, function (res) {
            loading.close();
            $scope.userList = res.data
        })
    };
    $scope.inits();

    $scope.templateOption = {
        data: "userList",
        multiple: false,
    };





    $scope.select_biz = function(){
        $scope.search_sys_info();
    }



    $scope.setPagingData = function (data, pageSize, page) {
        $scope.PagingData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.totalSerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.getPagedDataAsync = function (pageSize, page) {
        $scope.setPagingData($scope.hostList ? $scope.hostList : [], pageSize, page);
    };

    //查询系统表
    $scope.search_sys_info = function () {
        loading.open();
        sysService.search_sys_info({}, $scope.args, function (res) {
            loading.close();
            if (res.result) {
                $scope.hostList = res.data;
                $scope.pagingOptions.currentPage = 1;
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
            } else {
                errorModal.open(res.msg);
            }
        })
    };
    $scope.search_sys_info();


    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    }, true);


    $scope.add_sys = function () {
        var modalInstance = $modal.open({
            templateUrl: static_url + 'client/views/addsys.html',
            windowClass: 'dialog_custom',
            controller: 'addSys',
            backdrop: 'static'
        });
        modalInstance.result.then(function (res) {
            $scope.hostList.unshift(res);
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        })
    };

    $scope.modify_sys = function (row) {
        var modalInstance = $modal.open({
            templateUrl: static_url + 'client/views/addsys.html',
            windowClass: 'dialog_custom',
            controller: 'modifySys',
            backdrop: 'static',
            resolve: {
                objectItem: function () {
                    return row.entity;
                }
            }
        });
        modalInstance.result.then(function (res) {
            row.entity.sys_name = res.sys_name;
            row.entity.sys_code = res.sys_code;
            row.entity.owners = res.owners;
            row.entity.first_owner = res.first_owner;
            row.entity.is_control = res.is_control;
        })
    };


    $scope.delete_sys = function (row) {
        //根据id删除系统
        $scope.args.need_ip = row.entity.bk_host_innerip;
        $scope.args.bk_cloud_id = row.entity.bk_cloud_id;
        $scope.args.host_id = row.entity.id;
        $scope.args.bk_os_name = row.entity.bk_os_name;
        $scope.args.bk_host_name = row.entity.bk_host_name;
        $scope.args.area = row.entity.area;
        $scope.args.aaa = row.entity.aaa;
        confirmModal.open({
            text: "是否查询系统资源使用情况？",
            confirmClick: function () {
                loading.open();
                sysService.delete_sys({}, $scope.args, function (res) {
                    loading.close();
                    if (res.result) {
                        //$scope.hostList.splice(row.rowIndex,1)
                        msgModal.open("success", "查询成功")
                        $scope.hostList[row.rowIndex] = res.data
                        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                    }
                    else {
                        errorModal.open(res.message);
                    }
                })
            }
        });

    };


    $scope.need_poll = function (row) {
        //根据id删除系统
        $scope.args.need_ip = row.entity.bk_host_innerip;
        $scope.args.bk_cloud_id = row.entity.bk_cloud_id;
        $scope.args.host_id = row.entity.id;
        $scope.args.bk_os_name = row.entity.bk_os_name;
        $scope.args.bk_host_name = row.entity.bk_host_name;
        $scope.args.area = row.entity.area;
        $scope.args.aaa = row.entity.aaa;
        $scope.args.Mem = row.entity.Mem;
        $scope.args.Disk = row.entity.Disk;
        $scope.args.CPU = row.entity.CPU;
        confirmModal.open({
            text: "是否加入周期？",
            confirmClick: function () {
                loading.open();
                sysService.need_poll({}, $scope.args, function (res) {
                    loading.close();
                    if (res.result) {
                        $scope.hostList[row.rowIndex] = res.data
                        msgModal.open("success", "加入周期成功")
                        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                    }
                    else {
                        msgModal.open("error", "主机已经加入周期")
                    }
                })
            }
        });

    };

    $scope.delete_poll = function (row) {
        //根据id删除系统
        $scope.args.need_ip = row.entity.bk_host_innerip;
        $scope.args.bk_cloud_id = row.entity.bk_cloud_id;
        $scope.args.host_id = row.entity.id;
        $scope.args.bk_os_name = row.entity.bk_os_name;
        $scope.args.bk_host_name = row.entity.bk_host_name;
        $scope.args.area = row.entity.area;
        $scope.args.aaa = row.entity.aaa;
        $scope.args.Mem = row.entity.Mem;
        $scope.args.Disk = row.entity.Disk;
        $scope.args.CPU = row.entity.CPU;
        confirmModal.open({
            text: "是否加入周期？",
            confirmClick: function () {
                loading.open();
                sysService.delete_poll({}, $scope.args, function (res) {
                    loading.close();
                    if (res.result) {
                        $scope.hostList[row.rowIndex] = res.data
                        msgModal.open("success", "加入周期成功")
                        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                    }
                    else {
                        msgModal.open("error", "主机已经加入周期")
                    }
                })
            }
        });

    };


    // 文件导入 、导出相关

     // 导入cvs文件
        $scope.uploadCsv = function () {
            CWApp.uploadCsv("uploadFile", callBack);
        };
        var callBack = function () {
            var content = fr.result;
            content = content.replace(new RegExp("\"", "gm"), "");
            var temp_list = [];
            var content_list = content.substring(0, content.lastIndexOf("\n")).split("\n");
            var column_len = content_list[0].split(",").length;
            var up_cvs = function (data) {
                loading.open();
                // 导入的后台方法
                templateService.up_cvs({}, data, function (res) {
                    loading.close();
                    if (res.result) {
                        alert2.open('上传成功!!', 'success');
                        $scope.search();
                    }
                    else {
                        alert2.open(res.message,'error');
                    }
                })
            }
            for (var i = 1; i < content_list.length; i++) {
                var device_obj = {};
                var columns = content_list[i].replace("\r", "").split(",");
                var a = columns.slice(0,8);
                var b = columns.slice(8);
                var device_obj = {
                    name: a[0],
                    back_img: a[1],
                    adapter_type: a[2],
                    config: a[3],
                    width: a[4],
                    height: a[5],
                    cover: a[6]+','+a[7],
                    control_inst: b.join()
                };
                temp_list.push(device_obj)
            }
            $scope.csvList = temp_list;
            // 开始请求后台方法
            up_cvs($scope.csvList)
        };

        // 导出文件
    // window.open('screen/down_load?template_id=' + $scope.prod.temp_id);




    $scope.gridOption = {
        data: "PagingData",
        enablePaging: true,
        enableColumnResize: true,
        showFooter: true,
        pagingOptions: $scope.pagingOptions,
        totalServerItems: 'totalSerItems',
        columnDefs: [
            {field: "bk_host_innerip", displayName: "内网ip", width: 160},
            {field: "bk_os_name", displayName: "系统名", width: 140},
            {field: "bk_host_name", displayName: "主机名", width: 180},
            {field: "Mem", displayName: "Mem(%)", width: 160},
            {field: "Disk", displayName: "Disk(%)", width: 160},
            {field: "CPU", displayName: "CPU(%)", width: 180},
            {
                displayName: "操作",
                cellTemplate: '<div style="width:100%;padding-top:5px;text-align: center">' +

                '<span style="cursor: pointer" class="btn btn-xs btn-danger" ng-click="delete_sys(row)">查询</span>' +
                '<span ng-if="row.entity.aaa == \'false\'" style="cursor: pointer" class="btn btn-xs btn-danger" ng-click="need_poll(row)">周期</span>' +
                '<span ng-if="row.entity.aaa == \'true\'" style="cursor: pointer" class="btn btn-xs btn-danger" ng-click="delete_poll(row)">移除</span>' +
                '</div>'
            }
        ]
    };

}]);