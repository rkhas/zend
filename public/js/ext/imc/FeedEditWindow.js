Ext.define('FeedEditWindow', {

    extend: 'Ext.Window',
    
    constructor: function() {
        // header
        this.poleEditId_news = new Ext.form.TextField({
            id : 'pole_edit_id_news',
            name : 'id_news',
            inputType : 'hidden',
//            emptyText : '0',
            store : new Ext.data.ArrayStore({fields: ['id_news']})
        });
        // header
        this.poleEditHeader = new Ext.form.TextField({
            id : 'pole_edit_header',
            name : 'header',
            fieldLabel : 'Заголовок',
            height : 26,
            width: 450,
            emptyText : 'Название новости',
            store : new Ext.data.ArrayStore({fields: ['header']})
        });
        // anons
        this.poleEditAnons = new Ext.form.TextArea({
            id : 'pole_edit_anons',
            name : 'anons',
            fieldLabel : 'Анонс',
            height : 80,
            width: 450,
            emptyText : 'Краткое содержание новости',
            store : new Ext.data.ArrayStore({fields: ['anons']})
        });
        // context
        this.poleEditContext = new Ext.form.TextArea({
            id : 'pole_edit_context',
            name : 'context',
            fieldLabel : 'Текст новости',
            height : 130,
            width: 450,
            emptyText : 'Основной новостной текст',
            store : new Ext.data.ArrayStore({fields: ['context']})
        });
        // posted
        this.poleEditPosted = new Ext.form.Checkbox({
            id : 'pole_edit_posted', 
            name: 'posted', 
            boxLabel : 'опубликовать',
            inputValue: true
        });
        
        this.form = new Ext.FormPanel({
            labelAlign:'top',
            items:[this.poleEditId_news, this.poleEditHeader, this.poleEditAnons, this.poleEditContext, this.poleEditPosted],
            border: false,
            bodyStyle:'background:transparent;padding:10px;'
        });

        this.callParent([{
            title: 'Редактировать новость',
            iconCls: 'feed-icon',
            id: 'update-feed-win',
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
                handler: this.onFeedUpdate,
                scope: this
            },{
                text: 'Отмена',
                handler: this.hide.createDelegate(this, [])
            }],

            items: this.form
        }]);

        this.addEvents({add:true});
    },

    show : function(data){
        // очищаем поля от шлака
        if(this.rendered){
            this.poleEditHeader.setValue('');
            this.poleEditAnons.setValue('');
            this.poleEditContext.setValue('');
            this.poleEditPosted.setValue(false);
        }
        
        // заполняем форму
        this.form.getForm().loadRecord(data);
        FeedEditWindow.superclass.show.apply(this, arguments);
    },

    // сохранение
    onFeedUpdate: function() {
        this.el.mask('Сохранение данных...', 'x-mask-loading');
        var param = {
            id_news : this.poleEditId_news.getValue(),
            header  : this.poleEditHeader.getValue(),
            anons   : this.poleEditAnons.getValue(),
            context : this.poleEditContext.getValue(),
            posted  : this.poleEditPosted.getValue()
        };
        Ext.Ajax.request({
            url: '/news/update/',
            params : param,
            success: this.validateFeed,
//            failure: this.markInvalid,
            scope  : this,
            header : param['header'],
            anons  : param['header'],
            context: param['context']
        });
    },

    validateFeed : function(response, options){
        var header = options.header;
        var anons = options.header;
        var context = options.header;

        try{
            var answer = response.responseText;
            answer = Ext.decode(answer);
            if(answer){
                this.el.unmask();
                this.hide();
                
                return this.fireEvent('validfeed', {
                    header  : header,
                    anons   : anons,
                    context : context
                });
            }
        }catch(e){
            // обработка
        }
    },
    
});