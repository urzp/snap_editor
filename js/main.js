tool = {}

tool.init = function(){
    this.pointer(on)
    this.type = "pointer"
    
}

tool.css_pointer  = function (on){
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
            tool.type = "pointer"
        }
        
        if (tool.type != "pointer"){
            active_figure = canvas.draw(tool.type)     
        }else{
            var id_selected = event.target.getAttribute("id")    
             active_figure =canvas.select(id_selected)
             if (active_figure != null) { active_figure.drag(canvas.drag_el) }
        }

             
    }) 
        
   
    $(".pointer").click(function(){
        tool.type = "pointer"
        tool.css_pointer(true)   
    })
    
    $(".line").click(function(){
        tool.type = "line"
        tool.css_pointer(false)
    })

    $(".circle").click(function(){
        tool.type = "circle"
        tool.css_pointer(false)
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