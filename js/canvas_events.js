canvas.events = function(){

    $( "#svg" ).click(function(event){  
    	canvas.stop_move = false
        if (canvas.pointer.selecting){
        	finish_select()
        } 
        
    })

    $( "#svg" ).dblclick(function(){
        if (canvas.next_point > 0 ){canvas.complite_path()}
    })   
    
    $("#svg").mousemove(function(event){

        if ( check_draw_event() || canvas.pointer.selecting ) {
            if(event.shiftKey){canvas.draw_end(true)
            }else{ canvas.draw_end(false)}
        } 
    })
    
    $("#svg").mousedown(function( event ){
        print_pos_mose()
        if( check_use_frame() ){ tool.select('pointer') }     
        if (check_tool_not_pointer() ){ 

            if (canvas.next_point != null){
                canvas.next_point ++
                canvas.draw_end(false)
            }else{
                canvas.draw(tool.type)  
            }
               
        }else{ 
            var target_id = event.target.getAttribute("id")
            if  (target_id == "svg"){
                canvas.pointer.selecting = true;
                canvas.draw(tool.type) // drawing selecting frame
            }else{
                canvas.select( target_id )
            }    
            
            //console.log("drag")
            //canvas.get_grap_pos()
            //canvas.current_el.drag(canvas.drag_el)
        }        
    }) 

    $(document).keydown(function(e) {
        console.log(e.keyCode)
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
        if ( e.keyCode == KEY_ESC ){
        	tool.select('pointer')
        	canvas.unselect()
        }
        if (  e.keyCode == KEY_DEL ){
            tool.select('pointer')
            canvas.delete()
        }
        if ( e.keyCode == KEY_SHIFT ){
        	event.stopPropagation();
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

   finish_select = function(){
	canvas.pointer.selecting = false;
	canvas.delete()
   }

}





