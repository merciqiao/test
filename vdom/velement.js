
//虚拟dom
var VElement=function(tagName,props,children){
    //??
    if(!(this instanceof VElement)){
        return 
    }
    //可以只传递tagName和children参数
    //explain:只传两个参数时,props传的即使children
    if(util.isArray(props)){
        children=props;
        props={};
    }

    //设置虚拟dom的相关属性
    this.tagName=tagName;
    this.props=props||{};
    this.children=children||[];
    //??
    this.key=props?props.key:void 999;
    var count=0;
    this.children.forEach(function(child,i){
        if(child instanceof VElement){
            count+=child.count;
        }
        else{
            //??转字符串
            children[i]=''+child;
        }
        count++;
    });
    this.count=count;
}

VElement.prototype.render=function(){
    var el=document.createElement(this.tagName);
    var props=this.props;
    for(var propName in props){
        var propValue=props[propName];
        util.setAttr(el,propName,propValue);
    }
    this.children.forEach(function(child){
        var childEl=(child instanceof VElement)?child.render():document.createTextNode(child);
        el.appendChild(childEl);
    });
    return el;
}




