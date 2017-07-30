behavior = {}
behavior.draw = true
behavior.type = "circle"


 

$(document).ready(function(){

    snap = Snap("#svg");
    
    

    
    $( "#svg" ).click(function(event){    
       behavior.draw = false     
       active_figure.drag(canvas.drag_el) 
    })
    
    
    
    $("#svg").mousemove(function(event){
        if ((event.which == 1)&&(behavior.draw == true)) {
            canvas.draw_end()
            get_xy()
        } 
    })
    

    
        
    $("#svg").mousedown(function( event ){
        if (behavior.draw == true){
            active_figure = canvas.draw(behavior.type)     
        }
         
        
    }) 
        
   
    

    
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