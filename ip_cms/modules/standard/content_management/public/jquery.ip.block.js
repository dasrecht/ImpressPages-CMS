/**
 * @package ImpressPages
 * @copyright Copyright (C) 2011 ImpressPages LTD.
 * @license GNU/GPL, see ip_license.html
 */


(function($) {

    var methods = {
        init : function(options) {


            return this.each(function() {
                
                var $this = $(this);
                
                var data = $this.data('ipBlock');
            
                // If the plugin hasn't been initialized yet
                if ( ! data ) {
                    $this.sortable({
                        connectWith: '.ipBlock',
                        revert: true,
                        dropOnEmpty: true,
                        forcePlaceholderSize: true,
                        handle: '.ipWidgetControls .ipWidgetMove',

                        //this event is fired twice by both blocks, when element is moved from one block to another.
                        update: function(event, ui) { 
                    		if(!$(ui.item).data('ipWidget')) {
                    			//some other object is dragged in. Do nothing.
                    			return;
                    		}
                    		
                    		//item is dragged out of the block. This action will be handled by the reciever using "receive"
                    		if ($(ui.item).parent().data('ipBlock').name != $this.data('ipBlock').name) { 
                    			return;
                    		}
                    	
                    		var instanceId = $(ui.item).data('ipWidget').instanceId;
                    		var position = $(ui.item).index();
                    		
                            var data = Object();
                            data.g = 'standard';
                            data.m = 'content_management';
                            data.a = 'moveWidget';
                            data.instanceId = instanceId;
                            data.position = position;
                            data.blockName = $this.data('ipBlock').name;
                            data.revisionId = $this.data('ipBlock').revisionId;
                        
                            $.ajax({
                                type : 'POST',
                                url : ipBaseUrl,
                                data : data,
                                context : $this,
                                success : methods._moveWidgetResponse,
                                dataType : 'json'
                            });	                     		
                    		
                    	},
                        
                        receive: function(event, ui) {

                            
                            $element = $(ui.item);

                            //if received element is WidgetButton (insert new widget)
                            if ($element && $element.is('.ipWidgetButton')) {
                            	
                            	
                            	
                                $duplicatedDragItem =  $('.ipBlock .ipWidgetButtonSelector');
                                $position = $duplicatedDragItem.index();
                                var newWidgetName = $element.data('ipWidgetButton').name;
                                
                                $duplicatedDragItem.remove();
                                
                                $block = $(event.target);
                                
                                $block.ipBlock('_createWidget', newWidgetName, $position);
                            }                            
                            
                        }
                    });        
                    $this.data('ipBlock', {
                        name : $this.attr('id').substr(8),
                        revisionId : options.revisionId,
                        widgetControls1Html : options.widgetControls1Html,
                        widgetControls2Html : options.widgetControls2Html,
                        contenManagementObject : options.contentManagementObject
                    }); 
                    
                    
                    var widgetOptions = new Object;
                    widgetOptions.widgetControls1Html = options.widgetControls1Html;
                    widgetOptions.widgetControls2Html = options.widgetControls2Html;
                    $this.find('.ipWidget').ipWidget(widgetOptions);
                    $this.find('.ipWidget').prepend($this.data('ipBlock').widgetControls1Html);
                    $this.find('.ipWidgetManagement').append($this.data('ipBlock').widgetControls2Html);
                    
                    
                    $this.delegate('.ipWidget .ipWidgetDelete', 'click', function(event){$(this).trigger('deleteClick.ipBlock');});
                    
                    $this.delegate('.ipWidget', 'deleteClick.ipBlock', function(event){$(this).trigger('deleteWidget.ipBlock', $(this).data('ipWidget').instanceId);});                    
                    
                    $this.bind('deleteWidget.ipBlock', function(event, widgetId){$(this).ipBlock('deleteWidget', widgetId);});

                    $this.bind('reinitRequired.ipWidget', function(event){$(this).ipBlock('reinit');});
                    
                }                
            });
        },
        
        reinit : function () {
            return this.each(function() {       
              //$this = $(this); // don't do $this = $(this); Somehow this operation equals to ipContentManagement = $(this); and raises problems later;
                var widgetOptions = new Object;
                widgetOptions.widgetControls1Html = $(this).data('ipBlock').widgetControls1Html;
                widgetOptions.widgetControls2Html = $(this).data('ipBlock').widgetControls2Html;
                $(this).find('.ipWidget').ipWidget(widgetOptions);
                $(this).find('.ipWidget').prepend($(this).data('ipBlock').widgetControls1Html);
                $(this).find('.ipWidgetManagement').append($(this).data('ipBlock').widgetControls2Html);
                
                               
                
            });
        },
        
        _moveWidgetResponse : function (response) {
        	//todo show error on error response
        },
        
        pageSaveStart : function () {
            return this.each(function() {
            	//$this = $(this); // don't do $this = $(this); Somehow this operation equals to ipContentManagement = $(this); and raises problems later;
//            	var saveJob = new ipSaveJob('Title', 10);
//            	$(this).trigger('addSaveJob.ipContentManagement', ['block_' + $(this).data('ipBlock').name, saveJob]);
//                var saveJob2 = new ipSaveJob('Title2', 5);
//                $(this).trigger('addSaveJob.ipContentManagement', ['ablock_' + $(this).data('ipBlock').name, saveJob2]);
//                
            	
            });
        },
        

        

        destroy : function() {
            // TODO
        },
        
        _showError : function (errorMessage) {
            alert(errorMessage);    
            
        },
        
        deleteWidget : function(instanceId){
            return this.each(function() {
   	
	        	$this = $(this);
	        	
	            data = Object();
	            data.g = 'standard';
	            data.m = 'content_management';
	            data.a = 'deleteWidget';
	            data.instanceId = instanceId;	            
	        
	            $.ajax({
	                type : 'POST',
	                url : ipBaseUrl,
	                data : data,
	                context : $this,
	                success : methods._deleteResponse,
	                dataType : 'json'
	            });
            });
        },
        
        _deleteResponse : function(response){
        	$this.find('#ipWidget_' + response.widgetId).remove();
        },
                
        
        _createWidget : function (widgetName, position) {

            return this.each(function() {
                        	
	            var $this = $(this);
	
	            data = Object();
	            data.g = 'standard';
	            data.m = 'content_management';
	            data.a = 'createWidget';
	            data.widgetName = widgetName;
	            data.position = position;
	            data.blockName = $this.data('ipBlock').name;
	            data.zoneName = $this.data('ipBlock').zoneName;
	            data.pageId = $this.data('ipBlock').pageId;
	            data.revisionId = $this.data('ipBlock').revisionId;
	        
	            $.ajax({
	                type : 'POST',
	                url : ipBaseUrl,
	                data : data,
	                context : $this,
	                success : methods._createWidgetResponse,
	                dataType : 'json'
	            });        
	            
            });

        },       

        _createWidgetResponse : function(response) {
            $this = $(this);
            if (response.status == 'error') {
                $.fn.ipBlock('_showError', response.errorMessage);
            }
            
            if (response.status == 'success') {           
            	if (response.position == 0) {
	                $(this).prepend(response.widgetManagementHtml);
            	} else {
	                $secondChild = $(this).find('.ipWidget:nth-child(' + response.position + ')');
	                $(response.widgetManagementHtml).insertAfter($secondChild);
            	}
            	
            	$this.ipBlock('reinit');


            }
        }

        
    };
    
    

    $.fn.ipBlock = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ipWidgetButton');
        }


    };
    
   

})(jQuery);