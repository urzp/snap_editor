dw_frame ={
    nodes:{},
    attr_nodes:{     
        fill:"#FFF",
        stroke:"#30839b",
        strokeWidth: '2'
    },
    edges:{},
    attr_edges:{
       stroke: "#30839b",
       strokeWidth: '1', 
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
    $.each(this.nodes,function(index,val){
        val.attr(dw_frame.attr_nodes)
        val.attr({id: "node_"+index, class:"frame_node"})
        val.drag(dw_frame.moveFunc)
    })
    
    
    this.inited = true;
}

dw_frame.draw =  function(element){
    dw_frame.current_el = element
    if (dw_frame.inited == false){dw_frame.init()}
    var box = element.getBBox();
    this.box = box;
    this.nodes.left_top.attr({cx:box.x,cy:box.y, r:4 })   
    this.nodes.right_top.attr({cx:box.x+box.w,cy:box.y, r:4 })
    this.nodes.right_bottom.attr({cx:box.x+box.w,cy:box.y+box.h, r:4 })
    this.nodes.left_bottom.attr({cx:box.x,cy:box.y+box.h, r:4 }) 
    
    this.edges.top.attr({ x1:box.x, y1:box.y, x2:box.x+box.w, y2:box.y})
    this.edges.right.attr({ x1:box.x+box.w, y1:box.y, x2:box.x+box.w, y2:box.y+box.h })
    this.edges.bottom.attr({ x1:box.x+box.w, y1:box.y+box.h, x2:box.x, y2:box.y+box.h })
    this.edges.left.attr({ x1:box.x, y1:box.y+box.h, x2:box.x, y2:box.y })
       
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
    if (element.type == "line"){
        switch( move_node.attr("id") ){
            case  "node_left_top":
                element.attr({
                    x1: this.nodes.left_top.attr("cx"),
                    y1: this.nodes.left_top.attr("cy")
                })
                break
            case "node_right_bottom":
                element.attr({
                    x2: this.nodes.right_bottom.attr("cx"),
                    y2: this.nodes.right_bottom.attr("cy")
                })
                break
            case "node_left_bottom":
                element.attr({
                    x1: this.nodes.left_bottom.attr("cx"),
                    y1: this.nodes.left_bottom.attr("cy")
                })
                break
            case "node_right_top":
                element.attr({
                    x2: this.nodes.right_top.attr("cx"),
                    y2: this.nodes.right_top.attr("cy")
                })
        }        
   }
    if (element.type == "circle"){
        var r =Math.abs( element.attr("cx") - move_node.attr("cx") )
        //var ry =Math.abs( element.attr("cy") - move_node.attr("cy") )
        //if (rx>ry){var r = rx}else{var r = ry }
        element.attr({
            r: r
        })
       
    }
  
    dw_frame.draw(element)
}


