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
    patchWalk(node,walker,patches);
}
patch.REPLACE=REPLACE;//替换原有节点
patch.REORDER=REORDER;
patch.PROPS=PROPS;//修改属性节点;新增,删除,修改值
patch.TEXT=TEXT;
//深度优先遍历dom结构
function patchWalk(node,walker,patches){
    var currentPatches=patches[walker.index];
    var len=node.childNodes?node.childNodes.length:0;
    for(var i=0;i<len;i++){
        var child=node.childNodes[i];
        walker.index++;
        patchWalk(child,walker,patches);
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
    
    util.each(moves,function(move){
        var index=move.index;
        if(move.type===0){
            if(staticNodeList[index]===node.childNodes[index]){
                node.removeChild(node.childNodes[index]);
            }
            staticNodeList.splice(index,1);
        }
        else{
            var insertNode=maps[move.item.key]?
            maps[move.item.key]:(typeof move.item==='object')?
            move.item.render():document.createTextNode(move.item);
            staticNodeList.splice(index,0,insertNode);
            node.insertBefore(insertNode,node.childNodes[index]||null);
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
