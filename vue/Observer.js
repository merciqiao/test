/**
 * 对象属性观察者
 */
function observe(data){
    if(!data||typeof data!=='object'){
        return;
    }
    Object.keys(data).forEach(function(value){
        var propertyName=value;
        var propertyValue=data[value];
        Object.defineProperties(data,propertyName,{
            get:function(){
                return propertyValue;
            },
            set:function(newValue){
                console.log('监听到属性值变化,'+propertyValue+'-->'+newValue);
            }
        });
    });
}
