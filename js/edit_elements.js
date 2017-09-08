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

    if (element.attr("type") == "line"){

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

    if (element.attr("type") == "path"){
        var id  = (move_node.attr("id").split('path_nodes_'))[1]
        var d = element.attr("d");
        var points = canvas.path_get_params(d)
        points[id] = canvas.canculate_rel_point(get_xy(), element)
        var d = canvas.path_set_params(points)
        element.attr({
            d: d
        })
        //console.log(id)
    }
    if (element.attr("type") == "rect"){

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
    if (element.attr("type") == "circle"){
        var r =Math.abs( cxy.x - move_node.attr("cx") );
        element.attr({
            r: r
        }); 
    };
    if (element.attr("type") == "ellipse"){
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
    if (element.attr("type") == "arc"){
        var arc_params = canvas.arc_get_params(element.attr("d"))
        var beg_xy = arc_params.m_xy
        var r_xy = arc_params.r_xy
        var end_xy = arc_params.end_xy
        var x_rotation = arc_params.x_rotation
        var large_arc = arc_params.large_arc
        var sweep = arc_params.sweep
        var r_xmin = parseInt( get_distanse(end_xy,beg_xy)  / 2 )

        var box = element.getBBox()

        switch( move_node.attr("id") ){
            case  "edits_spetial_1":
                mose = canvas.canculate_rel_point(get_xy(),element)
                var st_end_cent = get_center_line(beg_xy, end_xy )
                var mose_st_end_cent = get_distanse(st_end_cent, mose)   
                var ang = get_angle_line(beg_xy, end_xy).ang_deg

                if ( mose_st_end_cent <= r_xmin){
                    r_xy.y = parseInt( mose_st_end_cent )
                    r_xy.x = r_xmin
                };
                if (mose_st_end_cent >  r_xmin){ 
                    r_xy.y = get_radius_circ(beg_xy, end_xy, mose)
                    r_xy.x = r_xy.y
                };
                var d = canvas.arc_set_params(null, r_xy, ang, null, null, null, element.attr("d"))
                element.attr({d:d})

            break
            case  "edits_begin":
                begin = canvas.canculate_rel_point(begin, element)
                var rx = get_distanse( begin, end_xy)/2
                var ry = rx
                var rxy = {x:rx,y:ry}
                var d = canvas.arc_set_params(begin, rxy, null, null, null, null, element.attr("d"))
                element.attr({d:d})
            break
            case  "edits_end":
                end = canvas.canculate_rel_point(end, element)
                var rx = get_distanse( beg_xy, end)/2
                var ry = rx
                var rxy = {x:rx,y:ry}
                var d = canvas.arc_set_params(null, rxy, null, null, null, end, element.attr("d"))
                element.attr({d:d})
            break

        }

    }
    if (element.attr("type") == "triangle"){
        switch( move_node.attr("id") ){
            case  "edits_begin":
                begin = canvas.canculate_rel_point(begin, element)
                var p = element.attr("points")
                var points = canvas.triangle_get_params(p)
                var centr_el = canvas.get_center_small_circle(points.p1,points.p2,points.p3)
                p = canvas.triangle_set_params(begin, null, null, p)
                element.attr({
                    points: p,
                centr_x: centr_el.x,
                centr_y: centr_el.y
                });
            break
            case  "edits_end":
                end = canvas.canculate_rel_point(end, element)
                var p = element.attr("points")
                var points = canvas.triangle_get_params(p)
                var centr_el = canvas.get_center_small_circle(points.p1,points.p2,points.p3)
                p = canvas.triangle_set_params(null, end, null, p)
                element.attr({
                    points: p,
                    centr_x: centr_el.x,
                    centr_y: centr_el.y
                });
            break
            case  "edits_spetial_1":
                sp1 = canvas.canculate_rel_point(sp1, element)
                var p = element.attr("points")
                var points = canvas.triangle_get_params(p)
                var centr_el = canvas.get_center_small_circle(points.p1,points.p2,points.p3)
                p = canvas.triangle_set_params(null, null, sp1, p)
                element.attr({
                    points: p,
                    centr_x: centr_el.x,
                    centr_y: centr_el.y
                });
            break
/*            case "node_rotate":
                var p = element.attr("points")
                var points = canvas.triangle_get_params(p)
                var cent = {x: parseInt(element.attr("centr_x")), y: parseInt(element.attr("centr_y"))}
                console.log(cent)
                var mose =get_xy()
                var ang = mose.x - cent.x
                points.p1 = get_rotate(points.p1, cent, ang )
                points.p2 = get_rotate(points.p2, cent, ang )
                points.p3 = get_rotate(points.p3, cent, ang )

                marker = snap.circle(points.p1.x, points.p1.y,4); 
                marker.attr({
                fill:"none",
                stroke:"#F00",
                strokeWidth: '2'});  

                marker = snap.circle(points.p2.x, points.p2.y,4); 
                marker.attr({
                fill:"none",
                stroke:"#0F0",
                strokeWidth: '2'});  

                marker = snap.circle(points.p3.x, points.p3.y,4); 
                marker.attr({
                fill:"none",
                stroke:"#00F",
                strokeWidth: '2'});  

                p = canvas.triangle_set_params(points.p1, points.p2, points.p3, p)
                element.attr({
                    points: p
                });
            break   */
        }
    }
    dw_frame.draw(element);
}