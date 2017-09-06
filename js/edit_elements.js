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
            case  "edits_begin":
            new_point = canvas.canculate_rel_point(begin, element)
            element.attr({
                x1: new_point.x,  
                y1: new_point.y 
            })
            break
            case "edits_end":
            new_point = canvas.canculate_rel_point(end, element)
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
        var r_xmin = parseInt( get_distanse(end_xy,m_xy)  / 2 )

        var box = element.getBBox()

        switch( move_node.attr("id") ){
            case  "edits_spetial_1":
                mose = get_xy()
                var c_se = get_center_line(m_xy, end_xy )

                if ( mose.y >= m_xy.y - r_xmin){
                    r_xy.y = parseInt( get_distanse(c_se , mose) )
                    r_xy.x = r_xmin
                };
                if (mose.y < m_xy.y - r_xmin){ 
                    r_xy.y = parseInt( get_distanse(m_xy,mose)/( 2*( end_xy.y - mose.y ) / get_distanse(end_xy,mose) ) ) // R = AB/2Sin(a)
                    r_xy.x = r_xy.y
                };

                console.log("rx " + r_xy.x + " ry " + r_xy.y + " r_xmin " + r_xmin)

                var d = canvas.arc_set_params(null, r_xy, null, null, null, null, element.attr("d"))
                element.attr({d:d})

            break
            case  "edits_begin":
                var rx = get_distanse( begin, end_xy)/2
                var ry = rx
                var rxy = {x:rx,y:ry}
                var d = canvas.arc_set_params(begin, rxy, null, null, null, null, element.attr("d"))
                element.attr({d:d})
            break
            case  "edits_end":
                var rx = get_distanse( m_xy, end)/2
                var ry = rx
                var rxy = {x:rx,y:ry}
                var d = canvas.arc_set_params(null, rxy, null, null, null, end, element.attr("d"))
                element.attr({d:d})
            break
            case  "edits_spetial_2":
                var r = canvas.canculate_distanse(cxy , sp1)
                var ang = parseInt(deg( Math.asin((sp1.x - cxy.x)/r) ) )
                var d = canvas.arc_set_params(null, null, ang, null, null, null, element.attr("d"))
                element.attr({d:d})
            break

        }

    }
    dw_frame.draw(element);
}