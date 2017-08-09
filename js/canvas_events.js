canvas.events = function(){

    $( "#svg" ).click(function(event){    
    })

    $( "#svg" ).dblclick(function(){
    })   
    
    $("#svg").mousemove(function(event){
        if ( check_draw_event() ) { canvas.draw_end() } 
    })
        
    $("#svg").mousedown(function( event ){
        if( check_use_frame() ){ tool.select('pointer') }     
        if (check_tool_not_pointer() ){ 
            canvas.draw(tool.type)     
        }else{      
            canvas.select( event.target.getAttribute("id"))
            canvas.get_grap_pos()
            canvas.current_el.drag(canvas.drag_el)
        }        
    }) 

    $(document).keydown(function(e) {
        if ( e.keyCode == KEY_UP ){
        	canvas.move(UP)
        }
        if ( e.keyCode == KEY_DOWN ){
        	canvas.move(DOWN)
        }
        if ( e.keyCode == KEY_LEFT ){
        	canvas.move(LEFT)
        }
        if ( e.keyCode == KEY_RIGHT ){
        	canvas.move(RIGHT)
        }
    })

    check_use_frame = function(){
	   if( event.target.getAttribute("class") == "frame_node"  ){
	    return true
	   }else{
	    return false
	   }
	} 

	check_draw_event =function(){
	    if( (event.which == MOUSE_LEFT)&&(tool.type != "pointer") ){
	        return true
	   }else{
	        return false
	   }
	}

	check_tool_not_pointer = function(){
	    if( tool.type != "pointer" ){
	        return true
	   }else{
	        return false
	   }

	}

}