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
   edits:{},
    attr_edits:{
        fill:"#FFF",
       stroke: "#C7AA29",
       strokeWidth: '2', 
       class:"frame_node"
   },
   inited: false,
   current_el: null,
   box: {}
};

dw_frame.init = function(){
    this.edges.top = snap.line();
    this.edges.right = snap.line();
    this.edges.bottom = snap.line();
    this.edges.left = snap.line();
    $.each(this.edges,function(index,val){
        val.attr(dw_frame.attr_edges); 
    })
    
    this.nodes.left_top = snap.circle();
    this.nodes.right_top = snap.circle();
    this.nodes.right_bottom = snap.circle();
    this.nodes.left_bottom = snap.circle();
    this.nodes.rotate = snap.circle();


    $.each(this.nodes,function(index,val){
        val.attr(dw_frame.attr_nodes);
        val.attr({id: "node_"+index});
        val.drag(dw_frame.moveFunc, dw_frame.beforeMove );
    });

    this.edits.begin = snap.circle();
    this.edits.end = snap.circle();
    this.edits.spetial_1 = snap.circle();

    $.each(this.edits,function(index,val){
        val.attr(dw_frame.attr_edits);
        val.attr({id: "edits_"+index});
        val.drag(dw_frame.moveFunc, dw_frame.beforeMove );
    });
    
    this.inited = true;
};

dw_frame.draw =  function(element){
    this.current_el = element;
    if (dw_frame.inited == false){dw_frame.init()};
    this.get_frame(element);
    var box = this.get_frame(element);
    var box1 =  element.getBBox();


    this.nodes.left_top.attr({cx:box.x1,cy:box.y1, r:4 });   
    this.nodes.right_top.attr({cx:box.x2,cy:box.y2, r:4 });
    this.nodes.right_bottom.attr({cx:box.x3,cy:box.y3, r:4 });
    this.nodes.left_bottom.attr({cx:box.x4,cy:box.y4, r:4 }); 
    if ( box.x5 ) this.nodes.rotate.attr({cx:box.x5,cy:box.y5, r:6}); 

    
    this.edges.top.attr({ x1:box.x1, y1:box.y1, x2:box.x2, y2:box.y2});
    this.edges.right.attr({ x1:box.x2, y1:box.y2, x2:box.x3, y2:box.y3 });
    this.edges.bottom.attr({ x1:box.x3, y1:box.y3, x2:box.x4, y2:box.y4 });
    this.edges.left.attr({ x1:box.x4, y1:box.y4, x2:box.x1, y2:box.y1 });

    if ( box.beg_x ) { this.edits.begin.attr({cx:box.beg_x,cy:box.beg_y, r:4 });}
    if ( box.end_x ) { this.edits.end.attr({cx:box.end_x,cy:box.end_y, r:4 });  } 
    if ( box.sp1_x ) { this.edits.spetial_1.attr({cx:box.sp1_x,cy:box.sp1_y, r:4 });  }
    
    this.move_forvard();   
};

dw_frame.get_frame = function(element){
    var box ={}; 
    var cxy = canvas.get_center(element);
    var matrix = element.matrix;
    var box1 =  element.getBBox();

    if (element.type == "line"){ 

        var x1 = parseInt(element.attr("x1")); 
        var y1 = parseInt(element.attr("y1")); 
        var x2 = parseInt(element.attr("x2")); 
        var y2 = parseInt(element.attr("y2"));
        var h = y2 - y1; 

        box.x1 = matrix.e + x1*matrix.a - y1*matrix.b;
        box.y1 = matrix.f + y1*matrix.a + x1*matrix.b;

        box.x3 = matrix.e + x2*matrix.a - y2*matrix.b;
        box.y3 = matrix.f + y2*matrix.a + x2*matrix.b;

        box.x2 = box.x3 + h*matrix.b;
        box.y2 = box.y3 - h*matrix.a;

        box.x4 = box.x1 - h*matrix.b;
        box.y4 = box.y1 + h*matrix.a;

        box.x5 = cxy.x;
        box.y5 = cxy.y; 

    }
    if (element.type == "rect"){

        var x = parseInt(element.attr("x")); 
        var y = parseInt(element.attr("y")); 
        var w = parseInt(element.attr("width")); 
        var h = parseInt(element.attr("height")); 

        box.x1 = matrix.e + x*matrix.a - y*matrix.b;
        box.y1 = matrix.f + y*matrix.a + x*matrix.b;

        box.x2 = box.x1 + w*matrix.a;
        box.y2 = box.y1 + w*matrix.b; 

        box.x3 = box.x2 - h*matrix.b;
        box.y3 = box.y2 + h*matrix.a;

        box.x4 = box.x1 - h*matrix.b;
        box.y4 = box.y1 + h*matrix.a;      

        box.x5 = cxy.x;
        box.y5 = cxy.y; 

    }
    if (element.type == "circle"){

        box.x1 = box1.x;
        box.y1 = box1.y;

        box.x2 = box1.x2;
        box.y2 = box1.y;

        box.x3 = box1.x2;
        box.y3 = box1.y2;

        box.x4 = box1.x;
        box.y4 = box1.y2;    

        box.x5 = cxy.x;
        box.y5 = cxy.y; 

    }
    if (element.type == "ellipse"){
        var x =  parseInt(element.attr("cx"));
        var y =  parseInt(element.attr("cy"));
        var rx = parseInt(element.attr("rx")); 
        var ry = parseInt(element.attr("ry")); 
        var x1 = parseInt(x - rx)
        var y1 = parseInt(y - ry)
        var x2 = parseInt(x + rx)
        var y2 = parseInt(y - ry)
        var x3 = parseInt(x + rx)
        var y3 = parseInt(y + ry)
        var x4 = parseInt(x - rx)
        var y4 = parseInt(y + ry)

        box.x1 = matrix.e + x1*matrix.a - y1*matrix.b;
        box.y1 = matrix.f + y1*matrix.a + x1*matrix.b;

        box.x2 = matrix.e + x2*matrix.a - y2*matrix.b;
        box.y2 = matrix.f + y2*matrix.a + x2*matrix.b;

        box.x3 = matrix.e + x3*matrix.a - y3*matrix.b;
        box.y3 = matrix.f + y3*matrix.a + x3*matrix.b;

        box.x4 = matrix.e + x4*matrix.a - y4*matrix.b;
        box.y4 = matrix.f + y4*matrix.a + x4*matrix.b;    

        box.x5 = cxy.x;
        box.y5 = cxy.y; 

    }
    if (element.type == "path"){
        var bbox = element.getBBox()
        var arc_params = canvas.arc_get_params(element.attr("d"))

        var m_xy = arc_params.m_xy
        var r_xy = arc_params.r_xy
        var end_xy = arc_params.end_xy
        var x_rotation = arc_params.x_rotation
        var large_arc = arc_params.large_arc
        var sweep = arc_params.sweep
        var sp1_x = cxy.x  + ( box1.x2 - cxy.x + 15 )*Math.sin(rad(x_rotation)) 
        var sp1_y = cxy.y - (cxy.y - box1.y + 15 )*Math.cos(rad(x_rotation)) 
    
        box.x1 = box1.x;
        box.y1 = box1.y;

        box.x2 = box1.x2;
        box.y2 = box1.y;

        box.x3 = box1.x2;
        box.y3 = box1.y2;

        box.x4 = box1.x;
        box.y4 = box1.y2; 

        box.x5 = cxy.x;
        box.y5 = cxy.y; 

        box.beg_x = matrix.e + m_xy.x*matrix.a - m_xy.y*matrix.b
        box.beg_y = matrix.f + m_xy.y*matrix.a + m_xy.x*matrix.b;

        box.end_x =  matrix.e + end_xy.x*matrix.a - end_xy.y*matrix.b
        box.end_y =  matrix.f + end_xy.y*matrix.a + end_xy.x*matrix.b;

        box.sp1_x = sp1_x;
        box.sp1_y = sp1_y; 

    }
    this.box = box;
    return box;
}


dw_frame.move_forvard = function(){
    var last_el = canvas.last_element();
    $.each(this.nodes,function(index,val){
        last_el.after(val);
    });
    $.each(this.edges,function(index,val){
        last_el.after(val);
    });
    $.each(this.edits,function(index,val){
        last_el.after(val);
    });
};

dw_frame.beforeMove = function(){
    origTransform = dw_frame.current_el.transform().local;
};

dw_frame.moveFunc = function (dx, dy, posx, posy) {
    posx = posx - parseInt(  $( "#svg" ).offset().left );
    posy = posy - parseInt(  $( "#svg" ).offset().top  );
    this.attr( { cx: posx , cy: posy } ); 
    dw_frame.trasform_el(this);
};

dw_frame.remove = function(){
    this.current_el = null;
    $.each(this.edges,function(index,val){
        val.remove();
    })
    $.each(this.nodes,function(index,val){
        val.remove();
    })
    $.each(this.edits,function(index,val){
        val.remove();
    })
    this.inited = false;
}

dw_frame.trasform_el = function(move_node){

    var element = this.current_el;
    var matrix = element.matrix;
    var cxy = canvas.get_center(element);

    var left_top = { 
        x: parseInt(this.nodes.left_top.attr("cx")),
        y: parseInt(this.nodes.left_top.attr("cy")) 
    };
    var right_top = { 
        x: parseInt(this.nodes.right_top.attr("cx")),
        y: parseInt(this.nodes.right_top.attr("cy")) 
    };
    var right_bottom = { 
        x: parseInt(this.nodes.right_bottom.attr("cx")),
        y: parseInt(this.nodes.right_bottom.attr("cy"))
    };
    var left_bottom = { 
        x: parseInt(this.nodes.left_bottom.attr("cx")),
        y: parseInt(this.nodes.left_bottom.attr("cy")) 
    };
    var rotate = { 
        x: parseInt(this.nodes.rotate.attr("cx")),
        y: parseInt(this.nodes.rotate.attr("cy"))
    }; 
    var begin = {
        x: parseInt(this.edits.begin.attr("cx")),
        y: parseInt(this.edits.begin.attr("cy"))
    }   
    var end = {
        x: parseInt(this.edits.end.attr("cx")),
        y: parseInt(this.edits.end.attr("cy"))
    }  
    var sp1 = {
        x: parseInt(this.edits.spetial_1.attr("cx")),
        y: parseInt(this.edits.spetial_1.attr("cy"))
    }

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

        var x = parseInt(element.attr("x")); 
        var y = parseInt(element.attr("y")); 
        var w = parseInt(element.attr("width")); 
        var h = parseInt(element.attr("height")); 

        switch( move_node.attr("id") ){
            case  "node_left_top":
            var point_rel = canvas.canculate_rel_point(left_top, element);
            var width = w  + (x - point_rel.x);
            var height = h + (y - point_rel.y);
            if ((width>0)&(height>0)){
                element.attr({
                    width: width,
                    height: height,
                    x: point_rel.x,
                    y: point_rel.y
                });
            };
            break
            case "node_right_bottom":
            var point_rel = canvas.canculate_rel_point(right_bottom, element);
            var width = point_rel.x - x;
            var height =  point_rel.y - y;
            if ((width>0)&(height>0)){
                element.attr({
                    width: width,
                    height: height,
                });
            };
            break
            case "node_left_bottom":
            var point_rel = canvas.canculate_rel_point(left_bottom, element);
            var width = w + ( x - point_rel.x );
            var height =  point_rel.y - y;
            if ((width>0)&(height>0)){
                element.attr({
                    width: width,
                    height: height,
                    x: point_rel.x,
                });
            };
            break
            case "node_right_top":
            var point_rel = canvas.canculate_rel_point(right_top, element);
            var width = point_rel.x - x;
            var height = h + (y - point_rel.y);
            if ((width>0)&(height>0)){
                element.attr({
                    width: width,
                    height: height,
                    y: point_rel.y
                });
            };
            break
            case "node_rotate":
            canvas.rotate(element, rotate.x);
            break    

        }; 
    };
    if (element.type == "circle"){
        var r =Math.abs( cxy.x - move_node.attr("cx") );
        element.attr({
            r: r
        }); 
    };
    if (element.type == "ellipse"){
        var x =  parseInt(element.attr("cx"));
        var y =  parseInt(element.attr("cy"));
        switch( move_node.attr("id") ){
            case  "node_left_top":
            var new_point = canvas.canculate_rel_point(left_top, element)
            var rx = Math.abs(x - new_point.x);
            var ry = Math.abs(y - new_point.y);
            element.attr({
                rx: rx,  
                ry: ry 
            })
            break
             case  "node_right_bottom":
            var new_point = canvas.canculate_rel_point(right_bottom, element)
            var rx = Math.abs(x - new_point.x);
            var ry = Math.abs(y - new_point.y);
            element.attr({
                rx: rx,  
                ry: ry 
            })
            break
            case  "node_left_bottom":
            var new_point = canvas.canculate_rel_point(left_bottom, element)
            var rx = Math.abs(x - new_point.x);
            var ry = Math.abs(y - new_point.y);
            element.attr({
                rx: rx,  
                ry: ry 
            })
            break
            case  "node_right_top":
            var new_point = canvas.canculate_rel_point(right_top, element)
            var rx = Math.abs(x - new_point.x);
            var ry = Math.abs(y - new_point.y);
            element.attr({
                rx: rx,  
                ry: ry 
            })
            break
            case "node_rotate":
            canvas.rotate(element, rotate.x);
            break    
        };

    };
    if (element.type == "path"){
        var arc_params = canvas.arc_get_params(element.attr("d"))
        var m_xy = arc_params.m_xy
        var r_xy = arc_params.r_xy
        var end_xy = arc_params.end_xy
        var x_rotation = arc_params.x_rotation
        var large_arc = arc_params.large_arc
        var sweep = arc_params.sweep
        var box = element.getBBox()

        switch( move_node.attr("id") ){
            case  "node_left_top":

                r_xy.x = Math.abs(cxy.x - left_top.x)
                r_xy.y = Math.abs(cxy.y - left_top.y)

                //console.log(r_xy)

                var d = canvas.arc_set_params(null, r_xy, null, null, null, null, element.attr("d"))
                element.attr({d:d})

            break
            case  "edits_begin":
                var d = canvas.arc_set_params(begin, null, null, null, null, null, element.attr("d"))
                element.attr({d:d})
            break
            case  "edits_end":
                var d = canvas.arc_set_params(null, null, null, null, null, end, element.attr("d"))
                element.attr({d:d})
            break
            case  "edits_spetial_1":
                var r = canvas.canculate_distanse(cxy , sp1)
                var ang = parseInt(deg( Math.asin((sp1.x - cxy.x)/r) ) )
                var d = canvas.arc_set_params(null, null, ang, null, null, null, element.attr("d"))
                element.attr({d:d})
            break

        }

    }
    dw_frame.draw(element);
}


dw_frame.coordinats = function(){
    var left_top = { x: parseInt(this.nodes.left_top.attr("cx")),
    y: parseInt(this.nodes.left_top.attr("cy")) };
    var right_top = { x: parseInt(this.nodes.right_top.attr("cx")),
    y: parseInt(this.nodes.right_top.attr("cy")) }; 
    var right_bottom = { x: parseInt(this.nodes.right_bottom.attr("cx")),
    y: parseInt(this.nodes.right_bottom.attr("cy")) };
    var left_bottom = { x: parseInt(this.nodes.left_bottom.attr("cx")),
    y: parseInt(this.nodes.left_bottom.attr("cy")) }; 
    var rotate = { x: parseInt(this.nodes.rotate.attr("cx")),
    y: parseInt(this.nodes.rotate.attr("cy")) };   

    console.log( "left_top " + "x: " + left_top.x + " y: " + left_top.y);
    console.log( "right_top " + "x: " + right_top.x + " y: " + right_top.y);
    console.log( "right_bottom " + "x: " + right_bottom.x + " y: " + right_bottom.y);
    console.log( "left_bottom " + "x: " + left_bottom.x + " y: " + left_bottom.y);
};