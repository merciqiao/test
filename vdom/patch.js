// 修改节点属性, 用PROPS表示(新增和修改)
// 修改节点文本内容, 用TEXT表示
// 替换原有节点, 用REPLACE表示
// 调整子节点，包括移动、删除等，用REORDER表示

var REPLACE=0;
var REORDER=1;
var PROPS=2;
var TEXT=3;

function patch(node,patches){
    var walker={
        index:0
    };

}
patch.REPLACE=REPLACE;
patch.REORDER=REORDER;
patch.PROPS=PROPS;
patch.TEXT=Text;
//深度优先遍历dom结构
function dfsWalk(node,walker,patches){
    var currentPatches=patches[walker.index];
    var len=node.childNodes?node.childNodes.length:0;
    for(var i=0;i<len;i++){
        var child=node.childNodes[i];
        walker.index++;
        dfsWalk(child,walker,patches);
    }
    //如果当前节点存在差异
    if(currentPatches){
        applyPathces(node,currentPatches);
    }
}
function applyPathces(node,currentPatches){
    util.each(currentPatches,function(currentPatch){
        switch(currentPatch.type){
            case REPLACE:
                var newNode=(typeof currentPatch.node==='String')?document.createTextNode(currentPatch.node):
                currentPatch.node.render();
                break;
            case REORDER:
                renderChildren(node,currentPatch.moves);
                break;
            case PROPS:
                setProps(node,currentPatch.props);
                break;
            case TEXT:
                if(node.textContent){
                    node.textContent=currentPatch.textContent;
                }
                else{
                    node.nodeValue=currentPatch.content;
                }
                break;
            default:
                throw new Error('Unknow patch type'+currentPatch.type);
        }
    });
}

function renderChildren(node,moves){
    var staticNodeList=util.toArray(node.childNodes);
    var maps={};
    util.each(staticNodeList,function(node){
        if(node.nodeType===1){
            var key=node.getAttribute('key');
            if(key){
                maps[key]=node;
            }
        }
    });
}
function setProps(node,props){
    for(var key in props){
        if(props[key]===void 999){
            node.removeAttribute(key);
        }else{
            var value=props[key];
            util.setAttr(node,key,value);
        }
    }
}
