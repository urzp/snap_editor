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