dw_frame ={
    nodes:{},
    attr_nodes:{     
        fill:"#FFF",
        stroke:"#30839b",
        strokeWidth: '2',
        class:"frame_node"
    },
    edges:{},
    attr_edges:{
       stroke: "#30839b",
       strokeWidth: '1', 
       class:"frame_node",
       'stroke-dasharray': '5,5' 
    },
    inited: false,
    current_el: null,
    box: {}
}

dw_frame.init = function(){
    this.edges.top = snap.line();
    this.edges.right = snap.line();
    this.edges.bottom = snap.line();
    this.edges.left = snap.line();
    $.each(this.edges,function(index,val){
        val.attr(dw_frame.attr_edges) 
    })
    
    this.nodes.left_top = snap.circle();
    this.nodes.right_top = snap.circle();
    this.nodes.right_bottom = snap.circle();
    this.nodes.left_bottom = snap.circle();
    this.nodes.rotate = snap.circle();

    $.each(this.nodes,function(index,val){
        val.attr(dw_frame.attr_nodes)
        val.attr({id: "node_"+index})
        val.drag(dw_frame.moveFunc, dw_frame.beforeMove )
    })
    
    
    this.inited = true;
}

dw_frame.draw =  function(element){
    this.current_el = element
    if (dw_frame.inited == false){dw_frame.init()}
    this.get_frame(element)
    var box = this.get_frame(element)
    var box1 =  element.getBBox()


    this.nodes.left_top.attr({cx:box.x1,cy:box.y1, r:4 })   
    this.nodes.right_top.attr({cx:box.x2,cy:box.y2, r:4 })
    this.nodes.right_bottom.attr({cx:box.x3,cy:box.y3, r:4 })
    this.nodes.left_bottom.attr({cx:box.x4,cy:box.y4, r:4 }) 
    this.nodes.rotate.attr({cx:box.x5,cy:box.y5, r:6}) 

    
    this.edges.top.attr({ x1:box.x1, y1:box.y1, x2:box.x2, y2:box.y2})
    this.edges.right.attr({ x1:box.x2, y1:box.y2, x2:box.x3, y2:box.y3 })
    this.edges.bottom.attr({ x1:box.x3, y1:box.y3, x2:box.x4, y2:box.y4 })
    this.edges.left.attr({ x1:box.x4, y1:box.y4, x2:box.x1, y2:box.y1 })
    
      
    this.move_forvard()   
}

dw_frame.get_frame = function(element){
    var box ={} 
    var cxy = canvas.get_center(element)
    var matrix = element.matrix
    var box1 =  element.getBBox()

    if (element.type == "line"){ 

        var x1 = parseInt(element.attr("x1")) 
        var y1 = parseInt(element.attr("y1")) 
        var x2 = parseInt(element.attr("x2")) 
        var y2 = parseInt(element.attr("y2")) 
        var h = y2 - y1 

        box.x1 = matrix.e + x1*matrix.a - y1*matrix.b
        box.y1 = matrix.f + y1*matrix.a + x1*matrix.b

        box.x3 = matrix.e + x2*matrix.a - y2*matrix.b
        box.y3 = matrix.f + y2*matrix.a + x2*matrix.b

        box.x2 = box.x3 + h*matrix.b
        box.y2 = box.y3 - h*matrix.a

        box.x4 = box.x1 - h*matrix.b
        box.y4 = box.y1 + h*matrix.a

        box.x5 = cxy.x
        box.y5 = cxy.y 

    }
    if (element.type == "rect"){

        var x = parseInt(element.attr("x")) 
        var y = parseInt(element.attr("y")) 
        var w = parseInt(element.attr("width")) 
        var h = parseInt(element.attr("height")) 

        box.x1 = matrix.e + x*matrix.a - y*matrix.b
        box.y1 = matrix.f + y*matrix.a + x*matrix.b

        box.x2 = box.x1 + w*matrix.a
        box.y2 = box.y1 + w*matrix.b 

        box.x3 = box.x2 - h*matrix.b
        box.y3 = box.y2 + h*matrix.a

        box.x4 = box.x1 - h*matrix.b
        box.y4 = box.y1 + h*matrix.a       

        box.x5 = cxy.x
        box.y5 = cxy.y 

    }
    if (element.type == "circle"){

        box.x1 = box1.x
        box.y1 = box1.y

        box.x2 = box1.x2
        box.y2 = box1.y

        box.x3 = box1.x2
        box.y3 = box1.y2

        box.x4 = box1.x
        box.y4 = box1.y2    

        box.x5 = cxy.x
        box.y5 = cxy.y 

    }
    this.box = box
    return box
}


dw_frame.move_forvard = function(){
    var last_el = canvas.last_element()
    $.each(this.nodes,function(index,val){
        last_el.after(val)
    })
    $.each(this.edges,function(index,val){
        last_el.after(val)
    })
}

dw_frame.beforeMove = function(){
    origTransform = dw_frame.current_el.transform().local
}

dw_frame.moveFunc = function (dx, dy, posx, posy) {
    posx = posx - parseInt(  $( "#svg" ).offset().left )
    posy = posy - parseInt(  $( "#svg" ).offset().top )
    this.attr( { cx: posx , cy: posy } ); 
    dw_frame.trasform_el(this)
};

dw_frame.remove = function(){
    this.current_el = null;
    $.each(this.edges,function(index,val){
        val.remove()
    })
    $.each(this.nodes,function(index,val){
        val.remove()
    })
    this.inited = false;
}

dw_frame.trasform_el = function(move_node){

    var element = this.current_el
    var matrix = element.matrix
    var cxy = canvas.get_center(element)

    var left_top = { x: parseInt(this.nodes.left_top.attr("cx")),
                     y: parseInt(this.nodes.left_top.attr("cy")) }
    var right_top = { x: parseInt(this.nodes.right_top.attr("cx")),
                      y: parseInt(this.nodes.right_top.attr("cy")) } 
    var right_bottom = { x: parseInt(this.nodes.right_bottom.attr("cx")),
                         y: parseInt(this.nodes.right_bottom.attr("cy")) }
    var left_bottom = { x: parseInt(this.nodes.left_bottom.attr("cx")),
                      y: parseInt(this.nodes.left_bottom.attr("cy")) } 
    var rotate = { x: parseInt(this.nodes.rotate.attr("cx")),
                      y: parseInt(this.nodes.rotate.attr("cy")) }     


    if (element.type == "line"){
        
        var new_point
        var x1 = parseInt(element.attr("x1")) 
        var y1 = parseInt(element.attr("y1")) 
        var x2 = parseInt(element.attr("x2")) 
        var y2 = parseInt(element.attr("y2")) 

        switch( move_node.attr("id") ){
            case  "node_left_top":
                new_point = canvas.canculate_rel_point(left_top, element)
                 element.attr({
                    x1: new_point.x,  
                    y1: new_point.y 
                })
                break
            case "node_right_bottom":
                new_point = canvas.canculate_rel_point(right_bottom, element)
                element.attr({
                    x2: new_point.x,
                    y2: new_point.y 
                })
                break
            case "node_left_bottom":
                new_point = canvas.canculate_rel_point(left_bottom, element)
                element.attr({
                    x1: new_point.x,
                    y1: new_point.y
                })
                break
            case "node_right_top":
                new_point = canvas.canculate_rel_point(right_top, element)
                element.attr({
                    x2: new_point.x,
                    y2: new_point.y
                })
                break 
            case "node_rotate":
                canvas.rotate(element, rotate.x)
            break    
        }        
   }
   if (element.type == "rect"){

        var x = parseInt(element.attr("x")) 
        var y = parseInt(element.attr("y")) 
        var w = parseInt(element.attr("width")) 
        var h = parseInt(element.attr("height")) 

        switch( move_node.attr("id") ){
            case  "node_left_top":
                
                var point_rel = canvas.canculate_rel_point(left_top, element)
                var width = w  + (x - point_rel.x)
                var height = h + (y - point_rel.y)
                if ((width>0)&(height>0)){
                    element.attr({
                        width: width,
                        height: height,
                        x: point_rel.x,
                        y: point_rel.y
                    })
                }
               
                break
            case "node_right_bottom":
                var point_rel = canvas.canculate_rel_point(right_bottom, element)
                var width = point_rel.x - x
                var height =  point_rel.y - y
                if ((width>0)&(height>0)){
                    element.attr({
                        width: width,
                        height: height,
                    })
                }
                break
            case "node_left_bottom":
                var point_rel = canvas.canculate_rel_point(left_bottom, element)
                var width = w + ( x - point_rel.x )
                var height =  point_rel.y - y
                if ((width>0)&(height>0)){
                    element.attr({
                        width: width,
                        height: height,
                        x: point_rel.x,
                    })
                }
                break
            case "node_right_top":
                var point_rel = canvas.canculate_rel_point(right_top, element)
                var width = point_rel.x - x
                var height = h + (y - point_rel.y)
                if ((width>0)&(height>0)){
                element.attr({
                    width: width,
                    height: height,
                    y: point_rel.y
                })
                }
                break
            case "node_rotate":
                canvas.rotate(element, rotate.x)
                break    

        }  
   }
    if (element.type == "circle"){

        var cxy = canvas.get_center(element)
        var r =Math.abs( cxy.x - move_node.attr("cx") )
        element.attr({
            r: r
        }) 
   
    }
  
     dw_frame.draw(element)
}


dw_frame.coordinats = function(){
    var left_top = { x: parseInt(this.nodes.left_top.attr("cx")),
                     y: parseInt(this.nodes.left_top.attr("cy")) }
    var right_top = { x: parseInt(this.nodes.right_top.attr("cx")),
                      y: parseInt(this.nodes.right_top.attr("cy")) } 
    var right_bottom = { x: parseInt(this.nodes.right_bottom.attr("cx")),
                         y: parseInt(this.nodes.right_bottom.attr("cy")) }
    var left_bottom = { x: parseInt(this.nodes.left_bottom.attr("cx")),
                      y: parseInt(this.nodes.left_bottom.attr("cy")) } 
    var rotate = { x: parseInt(this.nodes.rotate.attr("cx")),
                      y: parseInt(this.nodes.rotate.attr("cy")) }   

    console.log( "left_top " + "x: " + left_top.x + " y: " + left_top.y)
    console.log( "right_top " + "x: " + right_top.x + " y: " + right_top.y)
    console.log( "right_bottom " + "x: " + right_bottom.x + " y: " + right_bottom.y)
    console.log( "left_bottom " + "x: " + left_bottom.x + " y: " + left_bottom.y)
}