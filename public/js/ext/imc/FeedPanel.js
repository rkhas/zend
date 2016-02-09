Ext.define('FeedPanel', {
    
    extend: 'Ext.tree.TreePanel',

    xtype: 'appfeedpanel',

    constructor: function() {
        this.callParent([{
            id:'feed-tree',
            region:'west',
            title:'Меню',
            split:true,
            width: 225,
            minSize: 175,
            maxSize: 400,
            collapsible: true,
            margins:'0 0 5 5',
            cmargins:'0 5 5 5',
            rootVisible:false,
            lines:false,
            autoScroll:true,
            root: new Ext.tree.TreeNode('Новости'),
            collapseFirst:true
        }]);

        this.feeds = this.root.appendChild(
            new Ext.tree.TreeNode({
                text:'Список',
                cls:'feeds-node',
                expanded:true
            })
        );

        this.getSelectionModel().on({
            'beforeselect' : function(sm, node){
                return node.isLeaf();
            },
            'selectionchange' : function(sm, node){
                if(node){
                    this.fireEvent('feedselect', node.attributes);
                }
            },
            scope:this
        });

        this.addEvents({feedselect:true});

        this.on('contextmenu', this.onContextMenu, this);
    },
    
    // пр кнопка - методы
    onContextMenu : function(node, e){
        if(!this.menu){ // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                id:'feeds-ctx',
                items: [{
                    iconCls:'add-feed',
                    text:'Добавить новость',
                    handler: this.showWindow,
                    scope: this
                }/*,{
                    iconCls : 'reload-feed',
                    text : 'Обновить',
                    scope : this,
                    handler:function(){
                        
                    }
                }*/]
            });
            this.menu.on('hide', this.onContextHide, this);
        }
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
        if(node.isLeaf()){
            this.ctxNode = node;
            this.ctxNode.ui.addClass('x-node-ctx');
            this.menu.showAt(e.getXY());
        }
    },

    onContextHide : function(){
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
    },

    showWindow : function(btn){
        if(!this.win){
            this.win = new FeedWindow();
            this.win.on('validfeed', this.addFeed, this);
        }
        this.win.show(btn);
    },

    selectFeed: function(url){
        this.getNodeById(url).select();
    },

    removeFeed: function(url){
        var node = this.getNodeById(url);
        if(node){
            node.unselect();
            Ext.fly(node.ui.elNode).ghost('l', {
                callback: node.remove, scope: node, duration: .4
            });
        }
    },

    /**
     * @param attrs
     * @param inactive
     * @param preventAnim
     * */
    addFeed : function(attrs, inactive, preventAnim){
        var exists = this.getNodeById(attrs.action);
        if(exists){
            if(!inactive){
                exists.select();
                exists.ui.highlight();
            }
            return;
        }
        
        Ext.apply(attrs, {
            iconCls: 'feed-icon',
            leaf:true,
            cls:'feed',
            id: attrs.id_news
        });
        
        var node = new Ext.tree.TreeNode(attrs);
        this.feeds.appendChild(node);
        if(!inactive){
            if(!preventAnim){
                Ext.fly(node.ui.elNode).slideIn('l', {
                    callback: node.select, scope: node, duration: .4
                });
            }else{
                node.select();
            }
        }
        return node;
    },

    // prevent the default context menu when you miss the node
    afterRender : function(){
        FeedPanel.superclass.afterRender.call(this);
        this.el.on('contextmenu', function(e){
            e.preventDefault();
        });
    }
});