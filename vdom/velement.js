
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

}

//辅助类 util
var util={};
util.isArray=function(list){
    return util.type(list)==='Array';
}
util.isString=function(list){
    return util.type(list)==='String';
}

util.type=function(obj){
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g,'');
}

