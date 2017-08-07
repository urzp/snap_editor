

$(document).ready(function(){
    tool.init()
    snap = Snap("#svg");
    
    

    
    $( "#svg" ).click(function(event){    
       //tool.draw = false     
       //active_figure.drag(canvas.drag_el) 
    })
    
    
    
    $("#svg").mousemove(function(event){
        if ((event.which == 1)&&(tool.type != "pointer")) {
            canvas.draw_end()
            get_xy()
        } 
    })
    
    

    
        
    $("#svg").mousedown(function( event ){
        if( event.target.getAttribute("class") == "frame_node" ){
            tool.select('pointer')
        }     
        if (tool.type != "pointer"){
            active_figure = canvas.draw(tool.type)     
        }else{
            var id_selected = event.target.getAttribute("id")    
             active_figure =canvas.select(id_selected)
             if (active_figure != null) { active_figure.drag(canvas.drag_el) }
        }        
    }) 
        
   
    $(".pointer").click(function(){ tool.select('pointer') })   
    $(".line").click(function(){ tool.select('line') })
    $(".circle").click(function(){ tool.select('circle') })

    
    
    $( "#svg" ).dblclick(function(){
        
        //draw_frame(active_figure)
    })


    
})




/*


    
    $( "#svg" ).click(function(event){    
             
    })
    
    
    
    $("#svg").mousemove(function(event){
        if (event.which == 1) {
            draw_end(active_figure)
        }else{
            remove_frame(active_figure)
        }    
    })
    

        
    $("#svg").mousedown(function( event ){
        
        active_figure = draw_line();  
        
    }) 
        
   
    

    
    $( "#svg" ).dblclick(function(){
        
        draw_frame(active_figure)
    })
    
  */ 


    //drw_box.remove()
    //line.transform("r90 200 150")
    //line.data('name',"first_line")