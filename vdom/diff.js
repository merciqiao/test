function diff(oldTree,newTree){
    var index=0;
    var patches={};
    dfsWalk(oldTree,newTree,index,patches);
    return patches;
}
function dfsWalk(oldNode,newNode,index,patches){
    var currentPatch=[];
    if(newNode===null){
        //todo依赖listdiff算法进行标记为删除
    }
    else if(util.isString(oldNode)&&util.isString(newNode)){
        //如果是文本节点,且有更新
        if(oldNode!==newNode){
            currentPatch.push({
                type:patch.TEXT,
                content:newNode
            });
        }
    }
    else if(oldNode.tagName===newNode.tagName&&oldNode.key===newNode.key){
        //节点类型相同,比较节点的属性是否相同
        //新增和属性值更新的
        var propsPatches=diffProps(oldNode,newNode);
        if(propsPatches){
            currentPatch.push({
                type:patch.PROPS,
                props:propsPatches
            });
        }
        diffChildren(oldNode.children,newNode.children,index,patches,currentPatch);
    }
    else{
        currentPatch.push({type:patch.REPLACE,node:newNode});
    }
    if(currentPatch.length){
        patches[index]=currentPatch;
    }
}
function diffProps(oldNode,newNode){
    var count=0;
    var oldProps=oldNode.props;
    var newProps=newNode.props;
    var key,value;
    var propsPatches={};
    //找出key相同,value不同的属性
    for(key in oldProps){
        value=oldProps[key];
        if(newProps[key]!=value){
            count++;
            propsPatches[key]=newProps[key];
        }
    }
    //找出新增的属性
    for(key in newProps){
        value=newProps[key];
        if(!oldProps.hasOwnProperty(key)){
            count++;
            propsPatches[key]=newProps[key];
        }
    }
    if(count===0){
        return null;
    }
    return propsPatches;
}
function diffChildren(oldChildren,newChildren,index,patches,currentPatch){
    var diffs=listDiff(oldChildren,newChildren,'key');
    newChildren=diffs.children;
    if(diffs.moves.length){
        var reorderPatch={
            type:patch.REORDER,
            moves:diffs.moves
        };
        currentPatch.push(reorderPatch);
    }

    var leftNode=null;
    var currentNodeIndex=index;
    util.each(oldChildren,function(child,i){
        var newChild=newChildren[i];
        currentNodeIndex=(leftNode&&leftNode.count)?
        currentNodeIndex+leftNode.count+1:currentNodeIndex+1;
        dfsWalk(child,newChild,currentNodeIndex,patches);
        leftNode=child;
    });

}
function listDiff(oldList,newList,key){
    var oldMap=makeKeyIndexAndFree(oldList,key);
    var newMap=makeKeyIndexAndFree(newList,key);

    var newFree=newMap.free;
    var oldKeyIndex=oldMap.keyIndex;
    var newKeyIndex=newMap.keyIndex;

    var moves=[];

    var children=[];
    var i=0;
    var item;
    var itemKey;
    var freeIndex=0;
    //遍历old子节点集合,取new子节点集合
    while(i < oldList.length){
        item=oldList[i];
        itemKey=getItemKey(item,key);
        if(itemKey){
            if(!newKeyIndex.hasOwnProperty(itemKey)){
                children.push(null);
            }
            else{
                var newItemIndex=newKeyIndex[itemKey];
                children.push(newList[newItemIndex]);
            }
        }
        else{
            var freeItem=newFree[freeIndex++];
            children.push(freeItem||null);
        }
        i++;
    }
    //取到的对应old子节点集合的new子节点集合
    var simulateList=children.slice(0);
    i=0;
    //遍历对应的new子节点集合
    while(i < simulateList.length){
        if(simulateList[i]===null){
            remove(i);
            removeSimulate(i);
        }
        else{
            i++;
        }
    }
    var j=i=0;
    while(i<newList.length){
        item=newList[i];
        itemKey=getItemKey(item,key);
        var simulateItem=simulateList[i];
        var simulateItemKey=getItemKey(simulateItem,key);
        if(simulateItem){
            if(itemKey===simulateItemKey){
                j++;
            }
            else{
                if(!oldKeyIndex.hasOwnProperty()){
                    insert(i,item);
                }
                else{
                    var nextItemKey=getItemKey(simulateList[j+1],key);
                    if(nextItemKey===itemKey){
                        remove(i);
                        removeSimulate(j);
                        j++;
                    }
                    else{
                        insert(i,item);
                    }
                }
            }
        }
        else{
            insert(i,item);
        }
        i++;
    }

    function remove(index){
        var move={index:index,type:0};
        moves.push(move);
    }
    function insert(index,item){
        var move={index:index,item:item,type:1};
        moves.push(move);
    }
    function removeSimulate(index){
        simulateList.splice(index,1);
    }
    return {
        moves:moves,
        children:children
    }
}
/**
 * Convert list to key-item keyIndex object.
 * @param {Array} list 
 * @param {String|Function} key 
 */
function makeKeyIndexAndFree(list,key){
    var keyIndex={};
    var free=[];
    for(var i=0;i<list.length;i++){
        var item=list[i];
        var itemKey=getItemKey(item,key);
        if(itemKey){
            keyIndex[itemKey]=1
        }
        else{
            free.push(item);
        }
    }
    return {
        keyIndex:keyIndex,
        free:free
    }
}
function getItemKey(item,key){
    if(!item||!key){
        return void 999;
    }
    return typeof key==='string'?item[key]:key(item);
}

