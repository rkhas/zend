Ext.define('FeedGrid', {
    extend: 'Ext.grid.GridPanel',
    
    xtype: 'appfeedgrid',
    
    constructor: function(config) {
        Ext.apply(this, config);
        
        // загружаем данные
        this.store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: '/news/list/'
            }),
            reader: new Ext.data.JsonReader({
                root: 'rows',
                totalProperty: 'results',
                id: 'id_news'
            }, ['id_news', 'header', 'anons', 'add_date', 'context', 'posted']
        )});
        
        // SORT
        this.store.setDefaultSort('add_date', "DESC");

        this.columns = [{
            header: "id_news",
            dataIndex: 'id_news',
            width: 100,
            hidden: true
        },{
            id: 'header',
            header: "Заголовок",
            dataIndex: 'header',
            sortable:true,
            width: 120,
            renderer: this.formatTitle
        },{
            id : 'anons', 
            header: "Анонс",
            dataIndex: 'anons',
            width: 400
        },{
            id: 'add_date',
            header: "Дата добавления",
            dataIndex: 'add_date',
            width: 150,
            renderer:  this.formatDate,
            sortable:true
        },{
            header: "Опубликован",
            dataIndex: 'posted',
            width: 100,
            hidden: true
        },{
            header: "Основной текст",
            dataIndex: 'context',
            width: 100,
            hidden: true
        }];

        this.callParent([{
            region: 'center',
            id: 'topic-grid',
            loadMask: {msg:'Загрузка...'},

            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            }),

            viewConfig: {
                forceFit      : true,
                enableRowBody : true,
                showPreview   : true,
                getRowClass   : this.applyRowClass
            }
        }]);

        this.on('rowcontextmenu', this.onContextClick, this);
    },

    onContextClick : function(grid, index, e){
        if(!this.menu){
            this.menu = new Ext.menu.Menu({
                id:'grid-ctx',
                items: [
                {
                    text: "Редактировать",
                    scope: this,
                    handler : function() {
                        grid.editNode(grid, index);
                    }
                },{
                    text: "Удалить",
                    scope: this,
                    handler : function() {
                        Ext.MessageBox.show({
                          msg   : "Вы собираетесь удалить новость. Продолжить?",
                          buttons: Ext.Msg.OKCANCEL,
                          icon: Ext.MessageBox.WARNING,
                          fn: function(btn) {
                              if (btn == "ok") {
                                  grid.deleteNode(grid, index);
                              }
                           }
                      });
                    }
                },{
                    iconCls: 'refresh-icon',
                    text:'Обновить',
                    scope:this,
                    handler: function(){
                        this.ctxRow = null;
                        this.store.reload();
                    }
                },'-',{
                    text: 'Открыть в отдельной вкладке',
                    iconCls: 'show-tab',
                    scope:this,
                    handler: function(){
                        this.viewer.openTab(this.ctxRecord);
                    }
                }]
            });
            this.menu.on('hide', this.onContextHide, this);
        }
        e.stopEvent();
        if(this.ctxRow){
            Ext.fly(this.ctxRow).removeClass('x-node-ctx');
            this.ctxRow = null;
        }
        this.ctxRow = this.view.getRow(index);
        this.ctxRecord = this.store.getAt(index);
        Ext.fly(this.ctxRow).addClass('x-node-ctx');
        this.menu.showAt(e.getXY());
    },

    onContextHide : function(){
        if(this.ctxRow){
            Ext.fly(this.ctxRow).removeClass('x-node-ctx');
            this.ctxRow = null;
        }
    },

    loadFeed : function(url) {
        this.store.baseParams = {
            feed: url
        };
        this.store.load();
    },

    togglePreview : function(show){
        this.view.showPreview = show;
        this.view.refresh();
    },

    // within this function "this" is actually the GridView
    applyRowClass: function(record, rowIndex, p, ds) {
        if (this.showPreview) {
            var xf = Ext.util.Format;
            p.body = '<p>' + xf.ellipsis(xf.stripTags(record.data.posted==true ? "опубликован" : "не опубликован"), 200) + '</p>';
            return 'x-grid3-row-expanded';
        }
        
        return 'x-grid3-row-collapsed';
    },

    formatDate : function(datetime) {
        var date = new Date(datetime*1000);
        return date.dateFormat("d.m.Y H:i:s");
    },

    formatTitle: function(value, p, record) {
        return String.format(
                '<div class="topic"><b>{0}</b>', // <span class="header">{3}</span></div>
                value, record.data.header, record.id, (record.data.posted==true ? "опубликован" : "не опубликован")
                );
    },
    
    deleteNode : function(grid, index) {
        var param = {
            id_news  : grid.ctxRecord.data.id_news
        };
        Ext.Ajax.request({
            url: '/news/delete',
            params: param,
            success: function(response, options){
                var data = Ext.decode(response.responseText);
                if (data.succ == true) {
                    var node = grid.getStore().getAt(index);
                    grid.store.remove(node);
                    Ext.Msg.show({
//                       title:'Удаление',
                       msg: 'Запись удалена',
                       buttons: Ext.Msg.OK,
                       animEl: 'elId',
                       icon: Ext.MessageBox.INFO
                    });
                    
                    grid.ctxRow = null;
                    grid.reload();
                }
            },
            failure: function(response, options){
                var data = Ext.decode(response.responseText);
                Ext.Msg.show({
                   title:'Ошибка',
                   msg: data.desc!='' ? data.desc : 'Прозошла неизвестная ошибка',
                   buttons: Ext.Msg.OK,
                   animEl: 'elId',
                   icon: Ext.MessageBox.ERROR
                });
            },
            scope: this,
            header : param['header']
        });
    },
    
    editNode : function(grid, index){
        if(!this.winUp){
            this.winUp = new FeedEditWindow();
            this.winUp.on('validfeed', this.addFeed, this);
        }
        
        this.winUp.show(grid.ctxRecord);
    }
});