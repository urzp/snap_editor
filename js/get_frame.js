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

        box.beg_x = matrix.e + x1*matrix.a - y1*matrix.b;
        box.beg_y = matrix.f + y1*matrix.a + x1*matrix.b;

        box.end_x = matrix.e + x2*matrix.a - y2*matrix.b;
        box.end_y = matrix.f + y2*matrix.a + x2*matrix.b;

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

        var beg_xy = arc_params.m_xy
        var r_xy = arc_params.r_xy
        var end_xy = arc_params.end_xy
        var x_rotation = arc_params.x_rotation
        var large_arc = arc_params.large_arc
        var sweep = arc_params.sweep
        var se = get_distanse(beg_xy,end_xy) 
        var cos_angle = ( end_xy.x - beg_xy.x )/ se
        var sin_angle = ( end_xy.y - beg_xy.y )/ se
        var sp1_y, sp1_x
        
        beg_xy = canvas.with_matrix(beg_xy, element)
        end_xy = canvas.with_matrix(end_xy, element)

        box.beg_x = beg_xy.x
        box.beg_y = beg_xy.y

        box.end_x =  end_xy.x
        box.end_y =  end_xy.y
        
        if (r_xy.x > get_distanse(beg_xy,end_xy) / 2 ){ 
            sp1_y = get_center_line(beg_xy,end_xy).y - get_h( parseInt( r_xy.x ), parseInt( se ) )*cos_angle
            sp1_x = get_center_line(beg_xy,end_xy).x + get_h( parseInt( r_xy.x ), parseInt( se ) )*sin_angle
        } else {
            sp1_y = get_center_line(beg_xy,end_xy).y - r_xy.y*cos_angle 
            sp1_x = get_center_line(beg_xy,end_xy).x + r_xy.y*sin_angle

        }

        box.sp1_x = sp1_x;
        box.sp1_y = sp1_y; 

    }

    if (element.type == "polygon"){
        var p = element.attr("points")
        var points = canvas.triangle_get_params(p)
        points.p1 = canvas.with_matrix(points.p1, element)
        points.p2 = canvas.with_matrix(points.p2, element)
        points.p3 = canvas.with_matrix(points.p3, element)
        var centr = canvas.get_center_small_circle(points.p1, points.p2, points.p3)

        box.beg_x = points.p1.x
        box.beg_y = points.p1.y

        box.end_x =  points.p2.x
        box.end_y =  points.p2.y

        box.sp1_x = points.p3.x;
        box.sp1_y = points.p3.y; 

        // box.x5 = centr.x//( points.p1.x + points.p2.x + points.p3.x )/3//centr.x;
        // box.y5 = centr.y//( points.p1.y + points.p2.y + points.p3.y )/3//centr.y; 
    }
    this.box = box;
    return box;
}