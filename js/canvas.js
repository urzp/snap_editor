
canvas = {
    elements:[],
    current_el:{},
    count:0

}

canvas.init = function(){
    snap = Snap("#svg");
    this.events()
}

function get_xy(){
    var x_el = parseInt(  $( "#svg" ).offset().left )
    var y_el = parseInt(  $( "#svg" ).offset().top )
    var x = event.pageX - x_el
    var y = event.pageY - y_el
    return {x: x, y: y}
}

canvas.dragable = function(element){

         dragMove = function(dx, dy, ev, x, y) {
                
                var transform = origTransform + (origTransform ? "T" : "t") + [dx, dy]

                element.attr({
                    transform: transform
                });

                dw_frame.draw(canvas.current_el)     
        }

        beforeMove = function(){
            origTransform = element.transform().local
        }

        element.drag(dragMove, beforeMove) 


}

canvas.draw = function(type){
    var element = null
    this.count++
    var cursor = get_xy()
    if (type == 'line'){
       element = snap.line(cursor.x, cursor.y, cursor.x, cursor.y);   
        element.attr({
            angle: 0,
            stroke: "#000",
            strokeWidth: '2',
            x_start: cursor.x,
            y_start: cursor.y,
            transform: "matrix(1 0 0 1 0 0)"
        })

        



    }
    if (type == 'rectangle'){
       element = snap.rect(cursor.x, cursor.y, 10, 10); 
        element.attr({
            fill:"none",
            angle: 0,
            stroke:"#000",
            strokeWidth: '2', 
            x_start: cursor.x,
            y_start: cursor.y,
        })    

        

    } 
    if (type == 'circle'){
       element = snap.circle(cursor.x, cursor.y,4); 
        element.attr({
            fill:"none",
            angle: 0,
            stroke:"#000",
            strokeWidth: '2',
            x_start: cursor.x,
            y_start: cursor.y, 
        })      
    }    
    
    element.attr({id: this.count, class: "figure"})
    this.elements.push(element)
    this.current_el = element
    this.dragable(element)
    return element;  
}

canvas.draw_end = function(shift){ 
        var element = this.current_el
        var cursor = get_xy()
        if (element.type == "line"){
            var x =cursor.x
            var y =cursor.y
            var x1 = parseInt( element.attr("x1") )
            var y1 = parseInt( element.attr("y1") )
            if (shift){
                if (Math.abs(x - x1) > Math.abs(y - y1)){
                   y = y1
                }else{
                    x = x1
                }
            }
            element.attr({
                x2: x,
                y2: y
            }) 
        }
        if (element.type == "rect"){
            var x_start = parseInt( canvas.current_el.attr('x_start') )
            var y_start = parseInt( canvas.current_el.attr('y_start') )
            var width =  Math.abs(cursor.x - x_start)
            var height = Math.abs( cursor.y - y_start)
            if (shift){
                if (height > width) {width = height} else {height = width}
            }
            if (cursor.x < x_start) { element.attr({x:cursor.x}) }
            if (cursor.y < y_start) { element.attr({y:cursor.y}) }
            element.attr({
                width: width ,
                height: height
            }) 
        }
        if (element.type == "circle"){
          var cx = parseInt(this.current_el.attr("cx")) 
          var cy = parseInt(this.current_el.attr("cy")) 
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
       get_xy(); 
}

canvas.draw_from_center = function(posx, posy){
        if (canvas.current_el.type == "line"){ 
            var x1 = parseInt( canvas.current_el.attr('x1') )
            var x2 = parseInt( canvas.current_el.attr('x2') )
            var y1 = parseInt( canvas.current_el.attr('y1') )
            var y2 = parseInt( canvas.current_el.attr('y2') )
            var cx = parseInt( (x2 - x1)/2  )
            var cy = parseInt( (y2 - y1)/2  )
            x1 = x1+(posx - x1 - cx) - canvas.catch_el_pos.x
            y1 = y1+(posy - y1 - cy) - canvas.catch_el_pos.y
            x2 = x2+(posx - x2 + cx)  - canvas.catch_el_pos.x
            y2 = y2+(posy  - y2 + cy) - canvas.catch_el_pos.y 
            canvas.current_el.attr({ x1: x1, x2: x2, y1:y1, y2:y2 }) 
        }
        if (canvas.current_el.type == "rect"){ 
            var x = posx - canvas.catch_el_pos.x
            var y = posy - canvas.catch_el_pos.y
            canvas.current_el.attr({x: x, y:y})
        }
        if (canvas.current_el.type == "circle"){ 
            var rel_cur_x = posx - canvas.catch_el_pos.x
            var rel_cur_y = posy - canvas.catch_el_pos.y
            canvas.current_el.attr({ cx: rel_cur_x, cy:rel_cur_y }) 
        }
        dw_frame.draw(canvas.current_el); 
}

canvas.drag_el = function(dx, dy){
    if(canvas.current_el != null){
        
        transform="translate("+dx+","+dy+")"
        canvas.current_el.attr({transform:transform})
        dw_frame.draw(canvas.current_el)     
    }
}

canvas.move = function(derection){
    if(this.current_el != null){
       this.catch_el_pos = {x:0, y:0} 
       canvas.get_center(canvas.current_el)
       var cx = this.current_el_center.x + parseInt(  $( "#svg" ).offset().left )
       var cy = this.current_el_center.y + parseInt(  $( "#svg" ).offset().top )
       if(derection == LEFT) { cx--}
       if(derection == RIGHT){ cx++}
       if(derection == UP)   { cy--}
       if(derection == DOWN) { cy++}
       canvas.drag_el(null, null, cx, cy)
    }
}

canvas.rotate = function(element , dx ){
    var cxy = canvas.get_center(element)
    var ang = dx - cxy.x 
    var transform = origTransform + (origTransform ? "r" : "r") + ang
    element.attr({transform: transform })
}

canvas.select = function(id){
    var found = this.elements.find(function(element){
        if (element.attr("id") == id){return element}
    })
    if (found != null) {
        this.current_el = found
        found.before(this.last_element()) 
        dw_frame.draw(found);
        return found     
    }else{
        return null
    }
}

canvas.unselect = function(){
   this.current_el = null
   dw_frame.remove() 
}

canvas.get_grap_pos = function(){
    if (canvas.current_el){
        var cursor = get_xy()
        this.get_center(canvas.current_el)
        var rel_cur_x = cursor.x - canvas.current_el_center.x 
        var rel_cur_y = cursor.y - canvas.current_el_center.y
        this.catch_el_pos = {x:rel_cur_x, y:rel_cur_y }
        return this.catch_el_pos
    }
}

canvas.get_center = function(element){
    if(element){
        var cx, cy
        if (element.type == "line"){
            var x1 = parseInt( element.attr('x1') )
            var x2 = parseInt( element.attr('x2') )
            var y1 = parseInt( element.attr('y1') )
            var y2 = parseInt( element.attr('y2') )
            cx = parseInt( (x2 - x1)/2 + x1 )
            cy = parseInt( (y2 - y1)/2 + y1)
        }
        if (element.type == "rect"){
            cx = parseInt( element.attr('x') )
            cy = parseInt( element.attr('y') )
        }
        if (canvas.current_el.type == "circle"){
            cx = parseInt( canvas.current_el.attr("cx") )
            cy = parseInt( canvas.current_el.attr("cy") )
        } 
        //cx = cx + parseInt( element.matrix.e )
        //cy = cy + parseInt( element.matrix.f )
        //console.log(element.matrix.e)

        var box = element.getBBox()

        this.current_el_center = {x:box.cx, y:box.cy }
        return this.current_el_center 
    }
}

canvas.last_element = function(){
    var count_el = parseInt( snap.node.childElementCount )
    for(var i = count_el -1; i>1; i--){
        var last_el = snap.node.children[i]
        
        if (last_el.attributes.class.value == "figure"){
          var last_el_id = last_el.attributes.id.value  
          var index = parseInt( last_el_id ) -1
          i = 0
          return this.elements[index]
        }
    }  
    
}

canvas.canculate_rel_point = function(point,element){
    var matrix = element.matrix
    var cxy = this.get_center(element)
    var mdx = cxy.x + (matrix.e-cxy.x)*matrix.a + (matrix.f - cxy.y)*matrix.b 
    var mdy = cxy.y + (matrix.f-cxy.y)*matrix.a - (matrix.e - cxy.x)*matrix.b 
    var new_x = cxy.x + (point.x - cxy.x)*matrix.a + (point.y - cxy.y)*matrix.b - mdx
    var new_y = cxy.y + (point.y - cxy.y)*matrix.a - (point.x - cxy.x)*matrix.b - mdy
    return {x:new_x, y:new_y}
}


canvas.matrix_data = function(){
    var cxy = this.get_center(this.current_el)
    var matrix =this.current_el.matrix
    
    var x1rot = parseInt( dw_frame.nodes.left_top.attr("cx") )
    var y1rot = parseInt( dw_frame.nodes.left_top.attr("cy") )

    var mdx = parseInt( cxy.x + (matrix.e-cxy.x)*matrix.a + (matrix.f - cxy.y)*matrix.b )
    var mdy = parseInt( cxy.y + (matrix.f-cxy.y)*matrix.a - (matrix.e - cxy.x)*matrix.b )

    var nx = parseInt( cxy.x + (x1rot-cxy.x)*matrix.a + (y1rot - cxy.y)*matrix.b ) 
    var ny = parseInt( cxy.y + (y1rot - cxy.y)*matrix.a - (x1rot-cxy.x)*matrix.b )

    console.log("angle "+ this.current_el.attr("angle")) 
    console.log("x1 "+ this.current_el.attr("x1") + "  x1rot " + x1rot + " nx "+ nx + " mdx " + mdx) 
    console.log("y1 "+ this.current_el.attr("y1") + "  y1rot " + y1rot + " ny "+ ny + " mdy " + mdy) 
    console.log("matrix")
    console.log("a:" + deg(Math.acos(matrix.a)) +" "+ matrix.a )
    console.log("b:" + deg(Math.asin(matrix.b)) +" "+ matrix.b )
    console.log("c:" + deg(Math.asin(matrix.c)) +" "+ matrix.c )
    console.log("d:" + deg(Math.acos(matrix.d)) +" "+ matrix.d )
    console.log("e:" + matrix.e )
    console.log("f:" + matrix.f )
}



deg = function(angle){
    return angle * (180 / Math.PI);
}