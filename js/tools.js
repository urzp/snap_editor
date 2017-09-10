tool = {}

tool.init = function(){
    this.select("pointer")
    this.buttons_events()
}

tool.buttons_events = function(){
    $(".pointer").click(function(){ tool.select('pointer') })   
    $(".line").click(function(){ tool.select('line') })
    $(".path").click(function(){ tool.select('path') })
    $(".triangle").click(function(){ tool.select('triangle') })
    $(".rec").click(function(){ tool.select('rectangle') }) 
    $(".circle").click(function(){ tool.select('circle') })
    $(".ellipse").click(function(){ tool.select('ellipse') }) 
    $(".arc").click(function(){ tool.select('arc') })    

    $(".delete_point").click(function(){ dw_frame.delelete_point() }) 
    $(".complite_path").click(function(){ dw_frame.complite_path() }) 
       
}

tool.select = function(name){
    this.type = name
    this.css_buttons(name)
    switch (name){
        case 'pointer':
        this.css_pointer(true)
        break
        case 'line':
        this.css_pointer(false)
        break
        case 'path':
        this.css_pointer(false)
        break
        case 'triangle':
        this.css_pointer(false)
        break
        case 'rectangle':
        this.css_pointer(false)
        break
        case 'circle':
        this.css_pointer(false)
        break
        case 'ellipse':
        this.css_pointer(false)
        break
        case 'arc':
        this.css_pointer(false)
        break
    }
}

tool.css_pointer  = function (on){
    if (on) {
        $("svg").css("cursor","default")  
        $(".figure").css("cursor", "move") 
    }else{
        $("svg").css("cursor","crosshair")
        $(".figure").css("cursor", "crosshair")
    } 
}
 
tool.css_buttons = function(name){
    $(".pointer").removeClass("active") 
    $(".line").removeClass("active")
    $(".path").removeClass("active")
    $(".triangle").removeClass("active")
    $(".rec").removeClass("active")  
    $(".circle").removeClass("active") 
    $(".ellipse").removeClass("active") 
    $(".arc").removeClass("active") 

    switch (name){
        case 'pointer':
        $(".pointer").addClass("active") 
        break
        case 'line':
        $(".line").addClass("active") 
        break
        case 'path':
        $(".path").addClass("active") 
        break
        case 'triangle':
        $(".triangle").addClass("active") 
        break
        case 'rectangle':
        $(".rec").addClass("active") 
        break
        case 'circle':
        $(".circle").addClass("active") 
        break
        case 'ellipse':
        $(".ellipse").addClass("active") 
        break
        case 'arc':
        $(".arc").addClass("active") 
        break
    }
}
