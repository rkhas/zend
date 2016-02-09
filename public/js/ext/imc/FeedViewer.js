FeedViewer = {};

Ext.onReady(function(){
    Ext.QuickTips.init();

    Ext.state.Manager.setProvider(new Ext.state.SessionProvider({state: Ext.appState}));

    // шаблон
    var tpl = Ext.Template.from('preview-tpl', {
        compiled:true,
        getBody : function(v, all){
            return Ext.util.Format.stripScripts(v || all.context);
        },
        getPosted : function(i, j) {
            return (i || j.posted)==true ? "опубликован" : "не опубликован";
        },
        getDate : function(i, j) {
            var date = new Date((i || j.add_date)*1000);
            return date.dateFormat("d.m.Y H:i:s");
        }
    });
    
    FeedViewer.getTemplate = function(){
        return tpl;
    };

    var feeds = new FeedPanel();
    var mainPanel = new MainPanel();

    feeds.on('feedselect', function(feed){
        mainPanel.loadFeed(feed);
    });
    
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[
            new Ext.BoxComponent({ // raw element
                region:'north',
                el: 'header',
                height:32
            }),
            feeds,
            mainPanel
         ]
    });

    feeds.addFeed({
        url:'/news/list/',
        text: 'Новости',
        action : 'list'
    }, false, true); 
    
    Ext.get('header').on('click', function() {
        viewport.focus();
    });
    
    feeds.focus();
});

// This is a custom event handler passed to preview panels so link open in a new windw TODO!!!
//FeedViewer.LinkInterceptor = {
//    render: function(p){
//        p.body.on({
//            'mousedown': function(e, t){ // try to intercept the easy way
//                t.target = '_blank';
//            },
//            'click': function(e, t){ // if they tab + enter a link, need to do it old fashioned way
//                if(String(t.target).toLowerCase() != '_blank'){
//                    e.stopEvent();
//                    window.open(t.href);
//                }
//            },
//            delegate:'a'
//        });
//    }
//};