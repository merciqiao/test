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

util.setAttr=function(node,key,value){
    switch(key){
        case 'style':
            node.style.cssText=value;
            break;
        case 'value':
            var tagName=node.tagName||'';
            tagName=tagName.toLowerCase();
            if(tagName==='input'||tagName==='textarea'){
                node.value=value;
            }
            else{
                node.setAttribute(key,value);
            }
            break;
        default:
            node.setAttribute(key,value);
            break;
        
    }
}


