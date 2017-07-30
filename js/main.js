behavior = {}
behavior.draw = true
behavior.type = "line"


 

$(document).ready(function(){

    snap = Snap("#svg");
    
    

    
    $( "#svg" ).click(function(event){    
       behavior.draw = false     
       active_figure.drag(drag_el) 
    })
    
    
    
    $("#svg").mousemove(function(event){
        if ((event.which == 1)&&(behavior.draw == true)) {
            draw_end(active_figure)
            get_xy()
        } 
    })
    

    
        
    $("#svg").mousedown(function( event ){
        if (behavior.draw == true){
            if (behavior.type == 'line'){
                active_figure = draw_line()
                element
            }
            if (behavior.type == 'circle'){active_figure = draw_circle()} 
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