const MOUSE_LEFT = 1

$(document).ready(function(){
    tool.init()
    snap = Snap("#svg");
    
    $( "#svg" ).click(function(event){    
    })


    $( "#svg" ).dblclick(function(){
    })
    
    
    $("#svg").mousemove(function(event){
        if ((event.which == MOUSE_LEFT)&&(tool.type != "pointer")) {
            canvas.draw_end()
            get_xy()
        } 
    })
        
    $("#svg").mousedown(function( event ){
        if( event.target.getAttribute("class") == "frame_node" ){
            tool.select('pointer')
        }     
        if (tool.type != "pointer"){
            canvas.draw(tool.type)     
        }else{
            var id_selected = event.target.getAttribute("id")    
            canvas.select(id_selected)
            canvas.get_grap_pos()
            if (canvas.current_el != null) { canvas.current_el.drag(canvas.drag_el) }
        }        
    }) 
  
})

