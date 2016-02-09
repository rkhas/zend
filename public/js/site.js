Ext.define('Case', {
    extend: 'Ext.grid.Panel',

    xtype: 'case-grid',
    height:400,
    width:400,
    
    onReady: function () {
      var grid = Ext.create('Ext.grid.Panel', {
          width: 600,
          height: 400,
          title: 'Diagnosen',
          
          store:  Ext.create('Ext.data.Store', {
              autoLoad: true,
              autoSync: true,
              model: 'Case',
              proxy: {
                  type: 'rest',
                  url: '/news/list/',
                  format: 'json',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  reader: {
                      type: 'json',
                      rootProperty: 'data'
                  },
                  writer: {
                      type: 'json'
                  },
                  api: {
                      create:   '/news/add/',
                      read:     '/news/list/',
                      update:   '/news/edit/',
                      destroy:  '/news/delete/',
                      detail :  '/news/detail/'
                  }
              }
          }),

          columns: [{
              text: 'test',
              width: 300,
              sortable: true,
              dataIndex: 'name'
          }],
          dockedItems: [{
              xtype: 'toolbar'
          }]
      });
      
        this.insert(grid);
        
        this.doLayout();
        //parent
        this.callParent(arguments);
    }
});