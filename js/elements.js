
canvas = {
    elements:[],
    current_el:{},
    count:0
}



function get_xy(){
    var x_el = parseInt(  $( "#svg" ).offset().left )
    var y_el = parseInt(  $( "#svg" ).offset().top )
    var x = event.pageX - x_el
    var y = event.pageY - y_el
    return {x: x, y: y}
}

canvas.draw = function(type){
    var element = null
    this.count++
    if (type == 'line'){
       element = snap.line(get_xy().x, get_xy().y, get_xy().x, get_xy().y);   
        element.attr({
            stroke: "#000",
            strokeWidth: '2', 
            id: this.count
        })

    }
    if (type == 'circle'){
       element = snap.circle(get_xy().x, get_xy().y,4); 
        element.attr({
            fill:"#FFF",
            stroke:"#000",
            strokeWidth: '2',
            id: this.count
        })      
    }    
    
    this.elements.push(element)
    this.current_el = element
    return element;  
}

canvas.draw_end = function(){ 
        var element = this.current_el
        if (element.type == "line"){
            element.attr({
                x2: get_xy().x,
                y2: get_xy().y
           })      
        }
        if (element.type == "circle"){
          var cx = parseInt(active_figure.attr("cx")) 
          var cy = parseInt(active_figure.attr("cy")) 
          var x = get_xy().x
          var y = get_xy().y
          if (cx>x){var rx = cx - x}else{var rx = x - cx }
          if (cy>y){var ry = cy - y}else{var ry = y - cy }
          var r = Math.sqrt(Math.pow(rx,2)+Math.pow(ry,2))
          element.attr({
              r:r
          })
        }
        
       dw_frame.draw(element); 
}

canvas.drag_el = function(dx, dy, posx, posy){
    var posx = posx - parseInt(  $( "#svg" ).offset().left )
    var posy = posy - parseInt(  $( "#svg" ).offset().top )
    if (active_figure.type == "line"){ 
        var x1 = parseInt( active_figure.attr('x1') )
        var x2 = parseInt( active_figure.attr('x2') )
        var y1 = parseInt( active_figure.attr('y1') )
        var y2 = parseInt( active_figure.attr('y2') )
        var cx = parseInt( (x2 - x1)/2 )
        var cy = parseInt( (y2 - y1)/2 )
        x1 = x1+(posx-x1-cx) 
        y1 = y1+(posy - y1 - cy) 
        x2 = x2+(posx -x2 + cx) 
        y2 = y2+(posy - y2 + cy)   
        console.log("x1="+x1+" x2="+x2)     
        active_figure.attr({ x1: x1, x2: x2, y1:y1, y2:y2 }) 
    }
    if (active_figure.type == "circle"){ 
        active_figure.attr({ cx: posx, cy:posy }) 
    }

    dw_frame.draw(active_figure); 

}

canvas.select = function(id){
    var found = this.elements.find(function(element){
        if (element.attr("id") == id){return element}
    })
    if (found != null) {
        this.current_el = found
        dw_frame.draw(found);
        return found     
    }else{
        return null
    }

}


