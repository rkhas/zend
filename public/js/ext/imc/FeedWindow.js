Ext.define('FeedWindow', {

    extend: 'Ext.Window',
    
    constructor: function() {
        // header
        this.poleHeader = new Ext.form.TextField({
            id : 'pole_header',
            name : 'header',
            fieldLabel : 'Заголовок',
            height : 26,
            width: 450,
            emptyText : 'Название новости',
            store : new Ext.data.ArrayStore({fields: ['header']})
        });
        // anons
        this.poleAnons = new Ext.form.TextArea({
            id : 'pole_anons',
            name : 'anons',
            fieldLabel : 'Анонс',
            height : 80,
            width: 450,
            emptyText : 'Краткое содержание новости',
            store : new Ext.data.ArrayStore({fields: ['anons']})
        });
        // context
        this.poleContext = new Ext.form.TextArea({
            id : 'pole_context',
            name : 'context',
            fieldLabel : 'Текст новости',
            height : 130,
            width: 450,
            emptyText : 'Основной новостной текст',
            store : new Ext.data.ArrayStore({fields: ['context']})
        });
        // posted
        this.polePosted = new Ext.form.Checkbox({
            id : 'pole_posted', 
            name: 'posted', 
            boxLabel : 'опубликовать',
            inputValue: true
        });
        
        this.form = new Ext.FormPanel({
            labelAlign:'top',
            items:[this.poleHeader, this.poleAnons, this.poleContext, this.polePosted],
            border: false,
            bodyStyle:'background:transparent;padding:10px;'
        });

        this.callParent([{
            title: 'Добавить новость',
            iconCls: 'feed-icon',
            id: 'add-feed-win',
            autoHeight: true,
            width: 500,
            resizable: false,
            plain:true,
            modal: true,
            y: 100,
            autoScroll: true,
            closeAction: 'hide',

            buttons:[{
                text: 'Сохранить',
                handler: this.onFeedAdd,
                scope: this
            },{
                text: 'Отмена',
                handler: this.hide.createDelegate(this, [])
            }],

            items: this.form
        }]);

        this.addEvents({add:true});
    },

    show : function(){
        // очищаем поля
        if(this.rendered){
            this.poleHeader.setValue('');
            this.poleAnons.setValue('');
            this.poleContext.setValue('');
            this.polePosted.setValue(false);
        }
        
        FeedWindow.superclass.show.apply(this, arguments);
    },

    // сохранение
    onFeedAdd: function() {
        this.el.mask('Сохранение данных...', 'x-mask-loading');
        var param = {
            header  : this.poleHeader.getValue(),
            anons   : this.poleAnons.getValue(),
            context : this.poleContext.getValue(),
            posted  : this.polePosted.getValue()
        };
        Ext.Ajax.request({
            url: '/news/add/',
            params: param,
            success: this.validateFeed,
            failure: this.markInvalid,
            scope: this,
            header : param['header']
        });
    },

    markInvalid : function(){
        this.el.unmask();
        this.hide();
        
        Ext.Msg.show({
           title:'Ошибка',
           msg: 'Прозошла неизвестная ошибка',
           buttons: Ext.Msg.OK,
           animEl: 'elId',
           icon: Ext.MessageBox.ERROR
        });
        
//        return false;
        // было бы не плохо сделать вывод ошибок
//        this.header.markInvalid('Что то пошло не так.');
//        this.el.unmask();
    },

    validateFeed : function(response, options){
        var dq = Ext.DomQuery;
        var header = options.header;

        try{
            var answer = response.responseText;
            answer = Ext.decode(answer);
            if(answer.data){
                var anons = answer.data.anons;
                var context = answer.data.context;
                
                this.el.unmask();
                this.hide();
                
                return this.fireEvent('validfeed', {
                    header: header,
                    anons: anons,
                    context: context
                });
            }
        }catch(e){
        }
        
        this.markInvalid();
    }
});