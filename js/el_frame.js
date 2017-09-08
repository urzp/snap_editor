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
       stroke: "#30839b",
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
    if (dw_frame.inited == false){dw_frame.init()};
    this.current_el = element;
    var box = this.get_frame(element);

    if ( box.x1 || box.x2 ||  box.x3 || box.x4 ) { 
        this.nodes.left_top.attr({cx:box.x1,cy:box.y1, r:4 });   
        this.nodes.right_top.attr({cx:box.x2,cy:box.y2, r:4 });
        this.nodes.right_bottom.attr({cx:box.x3,cy:box.y3, r:4 });
        this.nodes.left_bottom.attr({cx:box.x4,cy:box.y4, r:4 }); 

        this.edges.top.attr({ x1:box.x1, y1:box.y1, x2:box.x2, y2:box.y2});
        this.edges.right.attr({ x1:box.x2, y1:box.y2, x2:box.x3, y2:box.y3 });
        this.edges.bottom.attr({ x1:box.x3, y1:box.y3, x2:box.x4, y2:box.y4 });
        this.edges.left.attr({ x1:box.x4, y1:box.y4, x2:box.x1, y2:box.y1 });
    }

    if ( box.x5 ) this.nodes.rotate.attr({cx:box.x5,cy:box.y5, r:6}); 
    if ( box.beg_x ) { this.edits.begin.attr({cx:box.beg_x,cy:box.beg_y, r:4 });}
    if ( box.end_x ) { this.edits.end.attr({cx:box.end_x,cy:box.end_y, r:4 });  } 
    if ( box.sp1_x ) { this.edits.spetial_1.attr({cx:box.sp1_x,cy:box.sp1_y, r:4 });  }
    
    this.move_forvard();   
};




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




