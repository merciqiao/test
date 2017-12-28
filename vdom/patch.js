// 修改节点属性, 用PROPS表示
// 修改节点文本内容, 用TEXT表示
// 替换原有节点, 用REPLACE表示
// 调整子节点，包括移动、删除等，用REORDER表示

var REPLACE=0;
var REORDER=1;
var PROPS=2;
var TEXT=3;

function patch(){

}
patch.REPLACE=REPLACE;
patch.REORDER=REORDER;
patch.PROPS=PROPS;
patch.TEXT=Text;
