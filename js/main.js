behavior = {}

behavior.type = "circle"

behavior.css_pointer  = function (on){
    if (on) {
        $("svg").css("cursor","default")  
        $(".figure").css("cursor", "move") 
        $(".pointer").addClass("active")
    }else{
        $("svg").css("cursor","crosshair")
        $(".figure").css("cursor", "crosshair")
        $(".pointer").removeClass("active") 
    } 
}
 

$(document).ready(function(){

    snap = Snap("#svg");
    
    

    
    $( "#svg" ).click(function(event){    
       //behavior.draw = false     
       //active_figure.drag(canvas.drag_el) 
    })
    
    
    
    $("#svg").mousemove(function(event){
        if ((event.which == 1)&&(behavior.type != "pointer")) {
            canvas.draw_end()
            get_xy()
        } 
    })
    
    

    
        
    $("#svg").mousedown(function( event ){
        if( event.target.getAttribute("class") == "frame_node" ){
            behavior.type = "pointer"
        }
        
        if (behavior.type != "pointer"){
            active_figure = canvas.draw(behavior.type)     
        }else{
            var id_selected = event.target.getAttribute("id")    
             active_figure =canvas.select(id_selected)
             if (active_figure != null) { active_figure.drag(canvas.drag_el) }
        }

             
    }) 
        
   
    $(".pointer").click(function(){
        behavior.type = "pointer"
        behavior.css_pointer(true)   
    })
    
    $(".line").click(function(){
        behavior.type = "line"
        behavior.css_pointer(false)
    })

    $(".circle").click(function(){
        behavior.type = "circle"
        behavior.css_pointer(false)
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